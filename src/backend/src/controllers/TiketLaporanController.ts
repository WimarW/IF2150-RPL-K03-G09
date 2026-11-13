import fs from 'fs';
import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../database/prisma';
import { TiketLaporan, toTiketDto } from '../models/TiketLaporan';
import { LayananPelanggan } from '../models/LayananPelanggan';
import { NotifikasiController } from './NotifikasiController';

export const JENIS_TIKET = ['Laporan Pembayaran', 'Kendala Aplikasi', 'Perilaku Pengguna', 'Lainnya'];

export function cleanupUploadedFile(file?: Express.Multer.File): void {
  if (file?.path) {
    fs.unlink(file.path, () => {});
  }
}

/** Kirim notifikasi lewat NotifikasiController (tersimpan + realtime Socket.IO). Gagal kirim tidak membatalkan aksi utama. */
export async function kirimNotifikasiAman(
  notifikasi: NotifikasiController | undefined,
  idPenerima: string,
  isi: string
): Promise<void> {
  if (!notifikasi) return;
  try {
    await notifikasi.buatNotifikasi(idPenerima, isi);
  } catch (e) {
    console.error('[notifikasi tiket]', e);
  }
}

/**
 * C24 - TiketLaporanController
 * UC08 Melaporkan Masalah (KF14-KF16)
 */
export class TiketLaporanController {
  constructor(private readonly notifikasi?: NotifikasiController) {}

  /** ALGO-053 validasiFormTiket */
  public static validasiFormTiket(jenisTiket?: unknown, keteranganTiket?: unknown): boolean {
    return (
      typeof jenisTiket === 'string' &&
      typeof keteranganTiket === 'string' &&
      JENIS_TIKET.includes(jenisTiket.trim()) &&
      keteranganTiket.trim().length > 0
    );
  }

  /** ALGO-013 + ALGO-054 + ALGO-019 + ALGO-055 : POST /api/tickets */
  public buatTiketHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jenisTiket, keteranganTiket } = req.body ?? {};
      if (!TiketLaporanController.validasiFormTiket(jenisTiket, keteranganTiket)) {
        cleanupUploadedFile(req.file);
        res.status(400).json({ success: false, message: 'Jenis permasalahan dan penjelasan wajib diisi dengan benar.' });
        return;
      }

      const { tiket, idCs } = await prisma.$transaction(async (tx) => {
        const idTiket = await TiketLaporan.generateId(tx);
        const idCs = await LayananPelanggan.cariLayananKosong(tx); // ALGO-019 / Q-013
        await TiketLaporan.simpan(tx, {
          idTiket,
          idPengguna: req.user!.idPengguna,
          jenisTiket: jenisTiket.trim(),
          keteranganTiket: keteranganTiket.trim(),
          buktiFotoUrl: req.file?.filename ?? null,
          idLayananPelanggan: idCs,
        });
        if (idCs) await LayananPelanggan.tambahBeban(tx, idCs);
        return { tiket: await TiketLaporan.getDetailTiket(idTiket, tx), idCs };
      });

      // ALGO-055 teruskanKeNotifikasi -> CS yang ditugaskan (KNF25)
      if (idCs) {
        await kirimNotifikasiAman(this.notifikasi, idCs, `Hey! Ada satu tiket laporan baru! (#${tiket!.idTiket})`);
      }

      res.status(201).json({ success: true, message: 'Tiket telah tersubmit.', data: { tiket: toTiketDto(tiket!) } });
    } catch (e) {
      cleanupUploadedFile(req.file);
      console.error('[TiketLaporanController.buatTiket]', e);
      res.status(500).json({ success: false, message: 'Tiket gagal disubmit.' });
    }
  };

  /** GET /api/tickets/mine */
  public tiketSayaHandler = async (req: Request, res: Response): Promise<void> => {
    const rows = await TiketLaporan.daftarPelapor(req.user!.idPengguna);
    res.json({ success: true, data: rows.map(toTiketDto) });
  };

  /** GET /api/tickets/:id - pelapor tiket atau petugas CS */
  public detailTiketHandler = async (req: Request, res: Response): Promise<void> => {
    const t = await TiketLaporan.getDetailTiket(String(req.params.id));
    if (!t) { res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' }); return; }
    const u = req.user!;
    if (u.role !== Role.LAYANAN_PELANGGAN && t.idPengguna !== u.idPengguna) {
      res.status(403).json({ success: false, message: 'Akses ditolak.' });
      return;
    }
    if (
      u.role === Role.LAYANAN_PELANGGAN &&
      t.idLayananPelanggan &&
      t.idLayananPelanggan !== u.idPengguna
    ) {
      res.status(403).json({ success: false, message: 'Tiket ditangani CS lain.' });
      return;
    }
    res.json({ success: true, data: { tiket: toTiketDto(t), pesan: await TiketLaporan.getPesan(t.idTiket) } });
  };

  /** POST /api/tickets/:id/messages - pelapor membalas di ruang mediasi */
  public kirimPesanPelaporHandler = async (req: Request, res: Response): Promise<void> => {
    const idTiket = String(req.params.id);
    const isi = String(req.body?.text ?? '').trim();
    if (!isi && !req.file) {
      cleanupUploadedFile(req.file);
      res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong.' });
      return;
    }
    try {
      const hasil = await prisma.$transaction(async (tx) => {
        await TiketLaporan.kunci(tx, idTiket);
        const t = await TiketLaporan.getDetailTiket(idTiket, tx);
        if (!t) return { code: 404, message: 'Tiket tidak ditemukan.' };
        if (t.idPengguna !== req.user!.idPengguna) return { code: 403, message: 'Akses ditolak.' };
        if (t.statusTiket === 'Selesai') return { code: 409, message: 'Tiket sudah ditutup.' };
        if (!t.idLayananPelanggan) {
          return { code: 409, message: 'Tiket belum ditangani petugas. Mohon tunggu balasan CS.' };
        }
        await TiketLaporan.tambahPesan(tx, {
          idTiket: t.idTiket,
          idPengirim: t.idPengguna,
          idPenerima: t.idLayananPelanggan,
          isiPesan: isi,
          lampiranUrl: req.file?.filename,
        });
        return { code: 201, message: 'Terkirim.', idCs: t.idLayananPelanggan, idTiket: t.idTiket };
      });
      if (hasil.code >= 400) {
        cleanupUploadedFile(req.file);
      } else if (hasil.idCs) {
        await kirimNotifikasiAman(this.notifikasi, hasil.idCs, `Pesan baru di tiket #${hasil.idTiket}`);
      }
      res.status(hasil.code).json({ success: hasil.code < 300, message: hasil.message });
    } catch (e) {
      cleanupUploadedFile(req.file);
      console.error('[TiketLaporanController.kirimPesanPelapor]', e);
      res.status(500).json({ success: false, message: 'Gagal mengirim pesan.' });
    }
  };
}
