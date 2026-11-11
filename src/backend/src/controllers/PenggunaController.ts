import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { Pengguna } from '../models/Pengguna';
import { JwtUserPayload } from '../middlewares/auth.middleware';

const DUMMY_BCRYPT_HASH ='$2b$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ012345';
const RFC5322_EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const PHONE_NUMBER_REGEX = /^[0-9]{10,15}$/;

export interface RegistrationInputPayload {
    namaPengguna?: string;
    username?: string;
    password?: string;
    email?: string;
    nomorTelpon?: string;
    nomorTelepon?: string;
    avatarUrl?: string;
}

export interface ValidationResult {
    valid: boolean;
    message?: string;
    sanitizedData?: {
        namaPengguna: string;
        username: string;
        password: string;
        email: string;
        nomorTelepon: string;
        avatarUrl?: string | null;
    };
}

export class PenggunaController {
    protected static readonly BCRYPT_SALT_ROUNDS = 10;

    protected static getJwtSecret(): string {
        return (
        process.env.JWT_SECRET || 'dev_fallback_secret_cariuang_2026_ChangeInProd'
        );
    }

    protected static getJwtExpiresIn(): string {
        return process.env.JWT_EXPIRES_IN || '24h';
    }

    public static validasiInfoRegistrasi(payload: RegistrationInputPayload): ValidationResult {
        const namaPengguna = (payload.namaPengguna ?? '').trim();
        const username = (payload.username ?? '').trim();
        const password = (payload.password ?? '').trim();
        const email = (payload.email ?? '').trim().toLowerCase();
        const nomorTelepon = (payload.nomorTelpon ?? payload.nomorTelepon ?? '').trim();
        const avatarUrl = payload.avatarUrl ? payload.avatarUrl.trim() : null;

        if (!namaPengguna) {
        return { valid: false, message: 'Field namaPengguna tidak boleh kosong.' };
        }
        if (!username) {
        return { valid: false, message: 'Field username tidak boleh kosong.' };
        }
        if (!password) {
        return { valid: false, message: 'Field password tidak boleh kosong.' };
        }
        if (!email) {
        return { valid: false, message: 'Field email tidak boleh kosong.' };
        }
        if (!nomorTelepon) {
        return { valid: false, message: 'Field nomorTelpon tidak boleh kosong.' };
        }

        if (password.length < 8) {
        return {
            valid: false,
            message: 'Password harus memiliki panjang minimal 8 karakter.',
        };
        }

        if (!RFC5322_EMAIL_REGEX.test(email)) {
        return {
            valid: false,
            message: 'Format alamat email tidak valid.',
        };
        }

        if (!PHONE_NUMBER_REGEX.test(nomorTelepon)) {
        return {
            valid: false,
            message:
            'Nomor telepon tidak valid. Harus berupa angka murni dengan panjang 10 hingga 15 digit.',
        };
        }

        return {
        valid: true,
        sanitizedData: {
            namaPengguna,
            username,
            password,
            email,
            nomorTelepon,
            avatarUrl,
        },
        };
    }

  /**
   * Validasi Pembaruan Profil (KNF07) untuk endpoint PUT /api/users/profile
   */
    public static validasiUpdateProfil(payload: {
        namaPengguna?: string;
        nomorTelpon?: string;
        nomorTelepon?: string;
        email?: string;
        avatarUrl?: string | null;
    }): {
        valid: boolean;
        message?: string;
        sanitized?: {
        namaPengguna: string;
        nomorTelepon: string;
        email: string;
        avatarUrl?: string | null;
        };
    } 
    {
    const namaPengguna = (payload.namaPengguna ?? '').trim();
    const email = (payload.email ?? '').trim().toLowerCase();
    const nomorTelepon = (payload.nomorTelpon ?? payload.nomorTelepon ?? '').trim();

    if (!namaPengguna) {
        return { valid: false, message: 'Field namaPengguna tidak boleh kosong.' };
    }
    if (!email) {
        return { valid: false, message: 'Field email tidak boleh kosong.' };
    }
    if (!nomorTelepon) {
        return { valid: false, message: 'Field nomorTelpon tidak boleh kosong.' };
    }

    if (!RFC5322_EMAIL_REGEX.test(email)) {
        return { valid: false, message: 'Format alamat email tidak valid.' };
    }

    if (!PHONE_NUMBER_REGEX.test(nomorTelepon)) {
        return {
            valid: false,
            message:
            'Nomor telepon tidak valid. Harus berupa angka murni dengan panjang 10 hingga 15 digit.',
        };
    }

    return {
        valid: true,
        sanitized: {
            namaPengguna,
            nomorTelepon,
            email,
            ...(payload.avatarUrl !== undefined ? { avatarUrl: payload.avatarUrl } : {}),
        },
    };
  }

    public static async cekInfoLogin( usernameOrEmail: string,password: string): Promise<{
        authenticated: boolean;
        token?: string;
        user?: Record<string, unknown>;
    }> {
        const userRecord = await Pengguna.findByUsernameOrEmail(usernameOrEmail);

        if (!userRecord) {
        await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
        return { authenticated: false };
        }

        const isPasswordMatch = await bcrypt.compare(password, userRecord.password);
        if (!isPasswordMatch) {
        return { authenticated: false };
        }

        // Resolusi role pengguna
        let resolvedRole: Role = userRecord.role;
        if (userRecord.layananPelanggan) {
           resolvedRole = Role.LAYANAN_PELANGGAN;
        } else if (userRecord.pemberiJasa) {
            resolvedRole = Role.PEMBERI_JASA;
        }

        const jwtPayload: JwtUserPayload = {
            idPengguna: userRecord.idPengguna,
            username: userRecord.username,
            role: resolvedRole,
        };

        const token = jwt.sign(jwtPayload, PenggunaController.getJwtSecret(), {
        expiresIn: PenggunaController.getJwtExpiresIn() as jwt.SignOptions['expiresIn'],
        });
        const { password: _, ...safeUser } = userRecord;
        return {
            authenticated: true,
            token,
            user: {
                ...safeUser,
                nomorTelepon: safeUser.nomorTelpon,
                role: resolvedRole,
            },
        };
    }

    public static async login(req: Request, res: Response): Promise<void> {
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

            const authResult = await PenggunaController.cekInfoLogin(identifier, rawPassword);

            if (!authResult.authenticated) {
                res.status(401).json({
                    success: false,
                    message: 'Username/email atau password salah.',
                });
                return;
            }

        res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            data: {
            token: authResult.token,
            user: authResult.user,
            },
        });
        } catch (error) {
        console.error('[PenggunaController.login] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan internal pada server saat memproses login.',
        });
        }
  }

  /**
   * Handler HTTP GET /api/users/profile
   */
  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const idPengguna = req.user?.idPengguna;
      if (!idPengguna) {
        res.status(401).json({
          success: false,
          message: 'Pengguna tidak terautentikasi.',
        });
        return;
      }

      const profile = await Pengguna.findProfileById(idPengguna);
      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Data profil pengguna tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          idPengguna: profile.idPengguna,
          namaPengguna: profile.namaPengguna,
          username: profile.username,
          email: profile.email,
          nomorTelpon: profile.nomorTelpon,
          nomorTelepon: profile.nomorTelpon,
          role: profile.role,
          avatarUrl: profile.avatarUrl,
          akumulasiRating: profile.akumulasiRating,
          riwayatRating: profile.riwayatRating,
          ...(profile.pemberiJasa
            ? {
                pemberiJasa: {
                  idPemberiJasa: profile.pemberiJasa.idPemberiJasa,
                  namaToko: profile.pemberiJasa.namaToko,
                  idKategoriJasa: profile.pemberiJasa.idKategoriJasa,
                  jenisJasa: profile.pemberiJasa.jenisJasa,
                  latitude: profile.pemberiJasa.latitude,
                  longitude: profile.pemberiJasa.longitude,
                  statusKetersediaan: profile.pemberiJasa.statusKetersediaan,
                  isOnline: profile.pemberiJasa.isOnline,
                  version: profile.pemberiJasa.version,
                  kategoriJasa: profile.pemberiJasa.kategoriJasa,
                },
              }
            : {}),
          ...(profile.layananPelanggan
            ? {
                layananPelanggan: {
                  idLayananPelanggan: profile.layananPelanggan.idLayananPelanggan,
                  status: profile.layananPelanggan.status,
                  jumlahTiketDipegang: profile.layananPelanggan.jumlahTiketDipegang,
                },
              }
            : {}),
        },
      });
    } catch (error) {
      console.error('[PenggunaController.getProfile] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal saat mengambil profil pengguna.',
      });
    }
  }

  /**
   * Handler HTTP PUT /api/users/profile
   */
    public static async updateProfile(req: Request, res: Response): Promise<void> {
        try {
        const idPengguna = req.user?.idPengguna;
        if (!idPengguna) {
            res.status(401).json({
            success: false,
            message: 'Pengguna tidak terautentikasi.',
            });
            return;
        }

        const validation = PenggunaController.validasiUpdateProfil(req.body);
        if (!validation.valid || !validation.sanitized) {
            res.status(400).json({
            success: false,
            message: validation.message,
            });
            return;
        }

        const existingRecord = await Pengguna.findProfileById(idPengguna);
        if (!existingRecord) {
            res.status(404).json({
            success: false,
            message: 'Pengguna tidak ditemukan.',
            });
            return;
        }

        // Cek apakah email baru sudah digunakan oleh akun lain
        const duplicationCheck = await Pengguna.cekDuplikasiKredensial(
            existingRecord.username,
            validation.sanitized.email,
            idPengguna
        );

        if (duplicationCheck.emailExists) {
            res.status(400).json({
            success: false,
            message: 'Email sudah digunakan oleh akun lain.',
            });
            return;
        }

        const penggunaInstance = new Pengguna({
            idPengguna: existingRecord.idPengguna,
            username: existingRecord.username,
            email: existingRecord.email,
            namaPengguna: existingRecord.namaPengguna,
            nomorTelepon: existingRecord.nomorTelpon,
            passwordHash: '',
            role: existingRecord.role,
            avatarUrl: existingRecord.avatarUrl,
            akumulasiRating: existingRecord.akumulasiRating,
            riwayatRating: existingRecord.riwayatRating,
        });

        penggunaInstance.setNama(validation.sanitized.namaPengguna);
        penggunaInstance.setNomor(validation.sanitized.nomorTelepon);
        penggunaInstance.setEmail(validation.sanitized.email);
        if (validation.sanitized.avatarUrl !== undefined) {
            penggunaInstance.setAvatarUrl(validation.sanitized.avatarUrl);
        }

        const updatedProfile = await penggunaInstance.updateProfilKeDb();

        res.status(200).json({
            success: true,
            message: 'Profil berhasil diperbarui.',
            data: {
            ...updatedProfile,
            nomorTelepon: updatedProfile.nomorTelpon,
            },
        });
        } catch (error) {
        console.error('[PenggunaController.updateProfile] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan internal saat memperbarui profil pengguna.',
        });
        }
    }
}



