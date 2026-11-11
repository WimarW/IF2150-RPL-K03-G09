import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PenggunaController } from './PenggunaController';
import { Pengguna } from '../models/Pengguna';
import { Pelanggan } from '../models/Pelanggan';

export class PelangganController extends PenggunaController {

    public static async registrasiPelanggan(req: Request,res: Response): Promise<void> {
        try {
            const validation = PelangganController.validasiInfoRegistrasi(req.body);
            if (!validation.valid || !validation.sanitizedData) {
                res.status(400).json({
                success: false,
                message: validation.message,
                });
                return;
            }

            const {namaPengguna,username,password,email,nomorTelepon,avatarUrl,} = validation.sanitizedData;
            const { usernameExists, emailExists } =
            await Pengguna.cekDuplikasiKredensial(username, email);
            if (usernameExists || emailExists) {
                res.status(400).json({
                success: false,
                message: usernameExists
                    ? 'Username sudah terdaftar. Silakan gunakan username lain.'
                    : 'Email sudah terdaftar. Silakan gunakan alamat email lain.',
                });
                return;
            }

            const passwordHash = await bcrypt.hash(
                password,
                PelangganController.BCRYPT_SALT_ROUNDS
            );

            const pelangganBaru = Pelanggan.makePelanggan({namaPengguna,username,email,nomorTelepon,passwordHash,avatarUrl,});
            const savedPelanggan = await pelangganBaru.simpanKeDb();
            res.status(201).json({
                success: true,
                message: 'Registrasi pelanggan berhasil.',
                data: savedPelanggan.toResponse(),
            });
            return;
        } catch (error) {
            console.error('[PelangganController.registrasiPelanggan] Error:', error);
            res.status(500).json({success: false,message: 'Terjadi kesalahan internal saat memproses registrasi pelanggan.',});
        }

    }
}