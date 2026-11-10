import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../database/prisma';
import { TiketLaporan, toTiketDto } from '../models/TiketLaporan';
import { LayananPelanggan } from '../models/LayananPelanggan';
import { Komunikasi } from '../models/Komunikasi';
import { Notifikasi } from '../models/Notifikasi';

export const JENIS_TIKET = ['Laporan Pembayaran', 'Kendala Aplikasi', 'Perilaku Pengguna', 'Lainnya'];

/** C24 TiketLaporanController — UC08 (Melaporkan Masalah) */
export class TiketLaporanController {
  /** ALGO-053 */
  public static validasiFormTiket(jenisTiket?: unknown, keteranganTiket?: unknown): boolean {
    return (
      typeof jenisTiket === 'string' &&
      typeof keteranganTiket === 'string' &&
      JENIS_TIKET.includes(jenisTiket.trim()) &&
      keteranganTiket.trim().length > 0
    );
  }

  /** ALGO-013 + ALGO-054 + ALGO-019 + ALGO-055 : POST /api/tickets */
  public static async buatTiket(req: Request, res: Response): Promise<void> {
    try {
      const { jenisTiket, keteranganTiket } = req.body ?? {};
      if (!TiketLaporanController.validasiFormTiket(jenisTiket, keteranganTiket)) {
        res.status(400).json({ success: false, message: 'Jenis permasalahan dan penjelasan wajib diisi dengan benar.' });
        return;
      }

      const tiket = await prisma.$transaction(async (tx) => {
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
        if (idCs) {
          await LayananPelanggan.tambahBeban(tx, idCs);
          // ALGO-055 teruskanKeNotifikasi
          await Notifikasi.buat(idCs, `Hey! Ada satu tiket laporan baru! (#${idTiket})`, tx);
        }
        return TiketLaporan.getDetailTiket(idTiket, tx);
      });

      res.status(201).json({ success: true, message: 'Tiket telah tersubmit.', data: { tiket: toTiketDto(tiket!) } });
    } catch (e) {
      console.error('[TiketLaporanController.buatTiket]', e);
      res.status(500).json({ success: false, message: 'Tiket gagal disubmit.' });
    }
  }

  /** GET /api/tickets/mine */
  public static async tiketSaya(req: Request, res: Response): Promise<void> {
    const rows = await TiketLaporan.daftarPelapor(req.user!.idPengguna);
    res.json({ success: true, data: rows.map(toTiketDto) });
  }

  /** GET /api/tickets/:id — pelapor tiket atau petugas CS */
  public static async detailTiket(req: Request, res: Response): Promise<void> {
    const t = await TiketLaporan.getDetailTiket(String(req.params.id));
    if (!t) { res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' }); return; }
    const u = req.user!;
    if (u.role !== Role.LAYANAN_PELANGGAN && t.idPengguna !== u.idPengguna) {
      res.status(403).json({ success: false, message: 'Akses ditolak.' });
      return;
    }
    res.json({ success: true, data: { tiket: toTiketDto(t), pesan: await Komunikasi.getChatHistory(t.idTiket) } });
  }

  /** POST /api/tickets/:id/messages — pelapor membalas di ruang mediasi */
  public static async kirimPesanPelapor(req: Request, res: Response): Promise<void> {
    try {
      const t = await TiketLaporan.getDetailTiket(String(req.params.id));
      if (!t || t.idPengguna !== req.user!.idPengguna) {
        res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
        return;
      }
      const isi = String(req.body?.text ?? '').trim();
      if (!isi) { res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong.' }); return; }
      if (t.statusTiket === 'Selesai') { res.status(409).json({ success: false, message: 'Tiket sudah ditutup.' }); return; }
      if (!t.idLayananPelanggan) {
        res.status(409).json({ success: false, message: 'Tiket belum ditangani petugas. Mohon tunggu balasan CS.' });
        return;
      }
      await prisma.$transaction(async (tx) => {
        await Komunikasi.simpanPesan(
          { idTiket: t.idTiket, idPengirim: t.idPengguna, idPenerima: t.idLayananPelanggan!, isiPesan: isi, lampiranUrl: req.file?.filename },
          tx
        );
        await Notifikasi.buat(t.idLayananPelanggan!, `Pesan baru di tiket #${t.idTiket}`, tx);
      });
      res.status(201).json({ success: true, message: 'Terkirim.' });
    } catch (e) {
      console.error('[TiketLaporanController.kirimPesanPelapor]', e);
      res.status(500).json({ success: false, message: 'Gagal mengirim pesan.' });
    }
  }

  public static async daftarNotifikasi(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: await Notifikasi.daftar(req.user!.idPengguna) });
  }

  public static async bacaNotifikasi(req: Request, res: Response): Promise<void> {
    await Notifikasi.tandaiTerbaca(String(req.params.id), req.user!.idPengguna);
    res.json({ success: true, message: 'OK' });
  }
}
