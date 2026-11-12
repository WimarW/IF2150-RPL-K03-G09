
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

    public static async createRating(req: Request<Record<string, string>, unknown, CreateRatingBody>,res: Response): Promise<void> {
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

        const parsedNilaiRating = typeof nilaiRating === 'number' ? nilaiRating : Number(nilaiRating);

        const isValid = RatingController.validateRatingValue(
            idPenggunaPemberi,
            idPenggunaPenerima,
            idKontrakPekerjaan,
            parsedNilaiRating
        );

        if (!isValid || !idPenggunaPenerima || !idKontrakPekerjaan) {
            res.status(400).json({
            success: false,
            message:
                'Input tidak valid. Pastikan seluruh ID terisi dan nilai rating berada pada rentang 1 hingga 5.',
            });
            return;
        }

        const cleanIdPemberi = idPenggunaPemberi.trim();
        const cleanIdPenerima = idPenggunaPenerima.trim();
        const cleanIdKontrak = idKontrakPekerjaan.trim();

        if (cleanIdPemberi === cleanIdPenerima) {
            res.status(400).json({
            success: false,
            message: 'Pengguna tidak dapat memberikan rating kepada dirinya sendiri.',
            });
            return;
        }

        const kontrak = await prisma.kontrakPekerjaan.findUnique({
            where: { idKontrakPekerjaan: cleanIdKontrak },
            include: {
            rating: {
                select: { idRating: true },
            },
            },
        });

        if (!kontrak) {
            res.status(404).json({
            success: false,
            message: 'Kontrak pekerjaan tidak ditemukan.',
            });
            return;
        }

        const isPelangganToMitra =
            kontrak.idPelanggan === cleanIdPemberi && kontrak.idPemberiJasa === cleanIdPenerima;
        const isMitraToPelanggan =
            kontrak.idPemberiJasa === cleanIdPemberi && kontrak.idPelanggan === cleanIdPenerima;

        if (!isPelangganToMitra && !isMitraToPelanggan) {
            res.status(400).json({
            success: false,
            message:
                'Pemberi dan penerima rating harus merupakan pihak yang terlibat dalam kontrak pekerjaan.',
            });
            return;
        }

        const isDone = await PenggunaController.verifikasiStatusPekerjaan(cleanIdKontrak);
        if (!isDone) {
            res.status(400).json({
            success: false,
            message: 'Pekerjaan belum berstatus Done',
            });
            return;
        }

        if (kontrak.hasRating || kontrak.rating !== null) {
            res.status(400).json({
            success: false,
            message: 'Kontrak pekerjaan sudah dinilai',
            });
            return;
        }

        const idRating = randomUUID();
        const rating = Rating.makeRating(
            idRating,
            cleanIdPemberi,
            cleanIdPenerima,
            cleanIdKontrak,
            parsedNilaiRating,
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

        await rating.simpanKeDb();
        await rating.updateRatingPengguna();

        const penggunaPenerimaTerbaru = await prisma.pengguna.findUnique({
            where: { idPengguna: cleanIdPenerima },
            select: {
            idPengguna: true,
            namaPengguna: true,
            akumulasiRating: true,
            riwayatRating: true,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Rating berhasil disimpan',
            data: {
            rating: rating.toJSON(),
            penerima: penggunaPenerimaTerbaru
                ? {
                    idPengguna: penggunaPenerimaTerbaru.idPengguna,
                    namaPengguna: penggunaPenerimaTerbaru.namaPengguna,
                    akumulasi_rating: penggunaPenerimaTerbaru.akumulasiRating,
                    riwayat_rating: penggunaPenerimaTerbaru.riwayatRating,
                }
                : null,},});
        } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002' || error.code === 'P2034') {
                res.status(400).json({success: false,message: 'Kontrak pekerjaan sudah dinilai',});
                return;
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan rating.';
        res.status(500).json({success: false,message: errorMessage,});
        }
    }


    public static async getRatingsByUser(req: Request<UserRatingParams>,res: Response): Promise<void> {
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
