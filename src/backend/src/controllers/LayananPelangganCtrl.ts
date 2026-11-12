import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { PenggunaController } from './PenggunaController';

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
}
