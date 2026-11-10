import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { PenggunaController } from './PenggunaController';
import prisma from '../database/prisma';
import { TiketLaporan, toTiketDto, statusDb } from '../models/TiketLaporan';
import { LayananPelanggan } from '../models/LayananPelanggan';
import { Komunikasi } from '../models/Komunikasi';
import { Notifikasi } from '../models/Notifikasi';

export class LayananPelangganCtrl extends PenggunaController {

    public static async loginLayananPelanggan(req: Request,res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;
            const identifier = (username ?? email ?? '').trim();
            const rawPassword = typeof password === 'string' ? password : '';

            if (!identifier || !rawPassword) {
                res.status(400).json({
                success: false,
                message: 'Username/email dan password wajib diisi.',
                });
                return;
            }

            const authResult = await LayananPelangganCtrl.cekInfoLogin(
                identifier,
                rawPassword
            );

            if (
                !authResult.authenticated ||
                !authResult.user ||
                authResult.user.role !== Role.LAYANAN_PELANGGAN
            ) {
                res.status(401).json({
                success: false,
                message: 'Kredensial Layanan Pelanggan tidak valid atau tidak memiliki akses.',
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Login Layanan Pelanggan berhasil.',
                data: {
                token: authResult.token,
                user: authResult.user,
                },
            });
        } catch (error) {
            console.error(
                '[LayananPelangganCtrl.loginLayananPelanggan] Error:',
                error
            );
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan internal saat memproses login Layanan Pelanggan.',
            });
        }
    }

    // ===== UC09: Layanan Pelanggan merespon laporan (C12) =====

    /** GET /api/cs/stats — Beranda CS (UI-17) */
    public static async statistik(req: Request, res: Response): Promise<void> {
        res.json({ success: true, data: await TiketLaporan.statistik(req.user!.idPengguna) });
    }

    /** ALGO-020 requestTiketLaporan — GET /api/cs/tickets?status=Tiket Baru|Diproses|Selesai */
    public static async daftarTiket(req: Request, res: Response): Promise<void> {
        const label = typeof req.query.status === 'string' ? req.query.status : undefined;
        const status = statusDb(label);
        if (label && label !== 'Semua' && !status) {
            res.status(400).json({ success: false, message: 'Status tidak valid.' });
            return;
        }
        const rows = await TiketLaporan.daftarCs(req.user!.idPengguna, status);
        res.json({ success: true, data: rows.map(toTiketDto) });
    }

    /** ALGO-021 teruskanBalasan/balasTiket — balasan pertama: Open -> Diproses */
    public static async balasTiket(req: Request, res: Response): Promise<void> {
        const idCs = req.user!.idPengguna;
        const isi = String(req.body?.text ?? '').trim();
        if (!isi) { res.status(400).json({ success: false, message: 'Balasan tidak boleh kosong.' }); return; }
        try {
            const hasil = await prisma.$transaction(async (tx) => {
                await tx.$queryRaw`SELECT id_tiket FROM tiket_laporan WHERE id_tiket = ${String(req.params.id)} FOR UPDATE`;
                const t = await TiketLaporan.getDetailTiket(String(req.params.id), tx);
                if (!t) return { code: 404, message: 'Tiket tidak ditemukan.' };
                if (t.statusTiket === 'Selesai') return { code: 409, message: 'Tiket sudah ditutup.' };
                if (t.idLayananPelanggan && t.idLayananPelanggan !== idCs) return { code: 403, message: 'Tiket ditangani CS lain.' };
                if (!t.idLayananPelanggan) {
                    await TiketLaporan.klaim(tx, t.idTiket, idCs);
                    await LayananPelanggan.tambahBeban(tx, idCs);
                }
                await Komunikasi.simpanPesan(
                    { idTiket: t.idTiket, idPengirim: idCs, idPenerima: t.idPengguna, isiPesan: isi, lampiranUrl: req.file?.filename },
                    tx
                );
                if (t.statusTiket === 'Open') await TiketLaporan.updateStatusTiket(tx, t.idTiket, 'Diproses');
                await Notifikasi.buat(t.idPengguna, `CS membalas tiket #${t.idTiket}`, tx);
                return { code: 201, message: 'Balasan terkirim.' };
            });
            res.status(hasil.code).json({ success: hasil.code < 300, message: hasil.message });
        } catch (e) {
            console.error('[LayananPelangganCtrl.balasTiket]', e);
            res.status(500).json({ success: false, message: 'Gagal mengirim balasan.' });
        }
    }

    /** tutupTiket — status Selesai + kanal mediasi ditutup (KNF26) */
    public static async tutupTiket(req: Request, res: Response): Promise<void> {
        const idCs = req.user!.idPengguna;
        try {
            const hasil = await prisma.$transaction(async (tx) => {
                await tx.$queryRaw`SELECT id_tiket FROM tiket_laporan WHERE id_tiket = ${String(req.params.id)} FOR UPDATE`;
                const t = await TiketLaporan.getDetailTiket(String(req.params.id), tx);
                if (!t) return { code: 404, message: 'Tiket tidak ditemukan.' };
                if (t.statusTiket === 'Selesai') return { code: 409, message: 'Tiket sudah ditutup.' };
                if (t.idLayananPelanggan && t.idLayananPelanggan !== idCs) return { code: 403, message: 'Tiket ditangani CS lain.' };
                await TiketLaporan.updateStatusTiket(tx, t.idTiket, 'Selesai');
                if (t.idLayananPelanggan) await LayananPelanggan.kurangiBeban(tx, t.idLayananPelanggan);
                await Notifikasi.buat(t.idPengguna, `Tiket #${t.idTiket} telah diselesaikan`, tx);
                return { code: 200, message: 'Tiket ditutup.' };
            });
            res.status(hasil.code).json({ success: hasil.code < 300, message: hasil.message });
        } catch (e) {
            console.error('[LayananPelangganCtrl.tutupTiket]', e);
            res.status(500).json({ success: false, message: 'Gagal menutup tiket.' });
        }
    }
}
