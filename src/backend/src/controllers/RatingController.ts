
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';
import { Rating } from '../models/Rating';
import { PenggunaController } from './PenggunaController';

export interface CreateRatingBody {
    idPenggunaPenerima?: string;
    idKontrakPekerjaan?: string;
    nilaiRating?: number;
    ulasan?: string;
    tags?: string[];
}

export interface UserRatingParams {
    id: string;
}

export class RatingController {
    public static validateRatingValue(
        idPenggunaPemberi: string | undefined | null,
        idPenggunaPenerima: string | undefined | null,
        idKontrakPekerjaan: string | undefined | null,
        nilaiRating: number | undefined | null
    ): boolean {
        if (
        typeof idPenggunaPemberi !== 'string' ||
        idPenggunaPemberi.trim().length === 0 ||
        typeof idPenggunaPenerima !== 'string' ||
        idPenggunaPenerima.trim().length === 0 ||
        typeof idKontrakPekerjaan !== 'string' ||
        idKontrakPekerjaan.trim().length === 0
        ) {
            return false;
        }

        if (
        typeof nilaiRating !== 'number' ||
        Number.isNaN(nilaiRating) ||
        !Number.isFinite(nilaiRating)
        ) {
            return false;
        }

        if (nilaiRating < 1 || nilaiRating > 5) {
            return false;
        }
        return true;
    }

    public static async createRating(
        req: Request<Record<string, string>, unknown, CreateRatingBody>,
        res: Response
    ): Promise<void> {
        try {
            const idPenggunaPemberi = req.user?.idPengguna;

            if (!idPenggunaPemberi) {
                res.status(401).json({
                    success: false,
                    message: 'Pengguna belum terautentikasi.',
                });
                return;
            }

            const { idPenggunaPenerima, idKontrakPekerjaan, nilaiRating, ulasan, tags } = req.body;

            if (!idKontrakPekerjaan || typeof idKontrakPekerjaan !== 'string' || idKontrakPekerjaan.trim().length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'ID kontrak pekerjaan wajib disertakan dan harus berupa string.',
                });
                return;
            }

            const cleanIdPemberi = idPenggunaPemberi.trim();
            const cleanIdKontrak = idKontrakPekerjaan.trim();

            if (
                typeof nilaiRating !== 'number' ||
                Number.isNaN(nilaiRating) ||
                !Number.isFinite(nilaiRating) ||
                nilaiRating < 1 ||
                nilaiRating > 5
            ) {
                res.status(400).json({
                    success: false,
                    message: 'Nilai rating tidak valid. Nilai harus berupa angka pada rentang 1 hingga 5.',
                });
                return;
            }

            if (ulasan !== undefined && ulasan !== null && typeof ulasan !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Ulasan harus berupa teks (string).',
                });
                return;
            }

            if (
                tags !== undefined &&
                tags !== null &&
                (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string'))
            ) {
                res.status(400).json({
                    success: false,
                    message: 'Tags harus berupa daftar teks (array of string).',
                });
                return;
            }

            const kontrak = await prisma.kontrakPekerjaan.findUnique({
                where: { idKontrakPekerjaan: cleanIdKontrak },
                select: {
                    idKontrakPekerjaan: true,
                    idPelanggan: true,
                    idPemberiJasa: true,
                    statusPekerjaan: true,
                    hasRating: true,
                },
            });

            if (!kontrak) {
                res.status(404).json({
                    success: false,
                    message: 'Kontrak pekerjaan tidak ditemukan.',
                });
                return;
            }

            let cleanIdPenerima = '';
            if (kontrak.idPelanggan === cleanIdPemberi) {
                cleanIdPenerima = kontrak.idPemberiJasa;
            } else if (kontrak.idPemberiJasa === cleanIdPemberi) {
                cleanIdPenerima = kontrak.idPelanggan;
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Pemberi rating harus merupakan pihak yang terlibat dalam kontrak pekerjaan.',
                });
                return;
            }

            if (
                idPenggunaPenerima &&
                typeof idPenggunaPenerima === 'string' &&
                idPenggunaPenerima.trim() !== cleanIdPenerima
            ) {
                res.status(400).json({
                    success: false,
                    message: 'idPenggunaPenerima tidak sesuai dengan mitra kontrak pekerjaan.',
                });
                return;
            }

            if (cleanIdPemberi === cleanIdPenerima) {
                res.status(400).json({
                    success: false,
                    message: 'Pengguna tidak dapat memberikan rating kepada dirinya sendiri.',
                });
                return;
            }

            if (kontrak.statusPekerjaan !== 'Done') {
                res.status(400).json({
                    success: false,
                    message: 'Pekerjaan belum berstatus Done',
                });
                return;
            }

            const existingRating = await Rating.findRatingByKontrakAndPemberi(
                cleanIdKontrak,
                cleanIdPemberi
            );

            if (existingRating) {
                res.status(400).json({
                    success: false,
                    message: 'Anda sudah memberikan rating untuk kontrak pekerjaan ini.',
                });
                return;
            }

            const idRating = randomUUID();
            const rating = Rating.makeRating(
                idRating,
                cleanIdPemberi,
                cleanIdPenerima,
                cleanIdKontrak,
                nilaiRating,
                ulasan ?? null,
                tags ?? []
            );

            if (rating.getRatingValue() === -1) {
                res.status(400).json({
                    success: false,
                    message: 'Nilai rating harus berada dalam rentang 1 sampai 5.',
                });
                return;
            }

            const { penerima: updatedPenerima } =
                await rating.simpanRatingDanUpdatePengguna();

            const penggunaPenerimaTerbaru = await prisma.pengguna.findUnique({
                where: { idPengguna: cleanIdPenerima },
                select: {
                    idPengguna: true,
                    namaPengguna: true,
                },
            });

            res.status(201).json({
                success: true,
                message: 'Rating berhasil disimpan',
                data: {
                    rating: rating.toJSON(),
                    penerima: {
                        idPengguna: cleanIdPenerima,
                        namaPengguna: penggunaPenerimaTerbaru?.namaPengguna ?? '',
                        akumulasiRating: updatedPenerima.akumulasiRating,
                        riwayatRating: updatedPenerima.riwayatRating,
                        akumulasi_rating: updatedPenerima.akumulasiRating,
                        riwayat_rating: updatedPenerima.riwayatRating,
                    },
                },
            });
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    res.status(400).json({
                        success: false,
                        message: 'Anda sudah memberikan rating untuk kontrak pekerjaan ini.',
                    });
                    return;
                }
                if (error.code === 'P2034') {
                    res.status(409).json({
                        success: false,
                        message:
                            'Terjadi konflik konkurensi saat menyimpan rating. Silakan coba beberapa saat lagi.',
                    });
                    return;
                }
            }

            const errorMessage =
                error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan rating.';
            res.status(500).json({ success: false, message: errorMessage });
        }
    }

    public static async getRatingsByUser(
        req: Request<UserRatingParams>,
        res: Response
    ): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || id.trim().length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'ID pengguna wajib disertakan.',
                });
                return;
            }

            const targetUserId = id.trim();

            const pengguna = await prisma.pengguna.findUnique({
                where: { idPengguna: targetUserId },
                select: {
                    idPengguna: true,
                    namaPengguna: true,
                    username: true,
                    role: true,
                    avatarUrl: true,
                    akumulasiRating: true,
                    riwayatRating: true,
                },
            });

            if (!pengguna) {
                res.status(404).json({
                    success: false,
                    message: 'Pengguna tidak ditemukan.',
                });
                return;
            }

            const ratings = await Rating.getRatingsByUserId(targetUserId);

            res.status(200).json({
                success: true,
                message: 'Data riwayat rating pengguna berhasil diambil',
                data: {
                    idPengguna: pengguna.idPengguna,
                    namaPengguna: pengguna.namaPengguna,
                    username: pengguna.username,
                    role: pengguna.role,
                    avatarUrl: pengguna.avatarUrl,
                    akumulasiRating: pengguna.akumulasiRating,
                    riwayatRating: pengguna.riwayatRating,
                    akumulasi_rating: pengguna.akumulasiRating,
                    riwayat_rating: pengguna.riwayatRating,
                    totalRating: pengguna.riwayatRating.length,
                    ratings,
                },
            });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat mengambil riwayat rating pengguna.';
            res.status(500).json({
                success: false,
                message: errorMessage,
            });
        }
    }
}
