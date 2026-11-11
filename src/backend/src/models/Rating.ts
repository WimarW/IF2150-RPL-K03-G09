// backend/src/models/Rating.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export type RatingWithRelations = Prisma.RatingGetPayload<{
  include: {
    pemberi: {
      select: {
        idPengguna: true;
        namaPengguna: true;
        username: true;
        avatarUrl: true;
        role: true;
      };
    };
    kontrak: {
      select: {
        idKontrakPekerjaan: true;
        detailPekerjaan: true;
        persetujuanHarga: true;
        statusPekerjaan: true;
        createdAt: true;
      };
    };
  };
}>;

export interface RatingPlainObject {
  idRating: string;
  idPenggunaPemberi: string;
  idPenggunaPenerima: string;
  idKontrakPekerjaan: string;
  nilaiRating: number;
  ulasan: string | null;
  tags: string[];
  tanggalRating: Date;
}

/**
 * Kelas Model C25 - Rating
 * Traceability: UC10, KF19, KF20, KNF27, KNF28
 */
export class Rating {
  private idRating: string;
  private idPenggunaPemberi: string;
  private idPenggunaPenerima: string;
  private idKontrakPekerjaan: string;
  private nilaiRating: number;
  private tanggalRating: Date;
  private ulasan: string | null;
  private tags: string[];

  constructor(
    idRating: string,
    idPenggunaPemberi: string,
    idPenggunaPenerima: string,
    idKontrakPekerjaan: string,
    nilaiRating: number,
    tanggalRating: Date = new Date(),
    ulasan: string | null = null,
    tags: string[] = []
  ) {
    this.idRating = idRating;
    this.idPenggunaPemberi = idPenggunaPemberi;
    this.idPenggunaPenerima = idPenggunaPenerima;
    this.idKontrakPekerjaan = idKontrakPekerjaan;
    this.nilaiRating = nilaiRating;
    this.tanggalRating = tanggalRating;
    this.ulasan = ulasan;
    this.tags = tags;
  }

  public getIdRating(): string {
    return this.idRating;
  }

  public getIdPemberi(): string {
    return this.idPenggunaPemberi;
  }

  public getIdPenerima(): string {
    return this.idPenggunaPenerima;
  }

  public getIdKontrakPekerjaan(): string {
    return this.idKontrakPekerjaan;
  }

  public getRatingValue(): number {
    return this.nilaiRating;
  }

  public getTanggalRating(): Date {
    return this.tanggalRating;
  }

  public getUlasan(): string | null {
    return this.ulasan;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public toJSON(): RatingPlainObject {
    return {
      idRating: this.idRating,
      idPenggunaPemberi: this.idPenggunaPemberi,
      idPenggunaPenerima: this.idPenggunaPenerima,
      idKontrakPekerjaan: this.idKontrakPekerjaan,
      nilaiRating: this.nilaiRating,
      ulasan: this.ulasan,
      tags: this.tags,
      tanggalRating: this.tanggalRating,
    };
  }

  public static makeRating(
    idRating: string,
    idPemberi: string,
    idPenerima: string,
    idKontrak: string,
    nilaiRating: number,
    ulasan: string | null = null,
    tags: string[] = []
  ): Rating {
    const isValidScore =
      typeof nilaiRating === 'number' &&
      !Number.isNaN(nilaiRating) &&
      Number.isFinite(nilaiRating) &&
      nilaiRating >= 1 &&
      nilaiRating <= 5;

    const validatedScore = isValidScore ? Number(nilaiRating.toFixed(2)) : -1;

    return new Rating(
      idRating.trim(),
      idPemberi.trim(),
      idPenerima.trim(),
      idKontrak.trim(),
      validatedScore,
      new Date(),
      ulasan ? ulasan.trim() : null,
      Array.isArray(tags) ? tags : []
    );
  }

  public async simpanKeDb(): Promise<void> {
    if (this.nilaiRating === -1) {
      throw new Error('Nilai rating tidak valid untuk disimpan ke database.');
    }

    await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const createdRating = await tx.rating.create({
          data: {
            idRating: this.idRating,
            idPenggunaPemberi: this.idPenggunaPemberi,
            idPenggunaPenerima: this.idPenggunaPenerima,
            idKontrakPekerjaan: this.idKontrakPekerjaan,
            nilaiRating: this.nilaiRating,
            ulasan: this.ulasan,
            tags: this.tags,
            tanggalRating: this.tanggalRating,
          },
        });

        this.tanggalRating = createdRating.tanggalRating;

        await tx.kontrakPekerjaan.update({
          where: {
            idKontrakPekerjaan: this.idKontrakPekerjaan,
          },
          data: {
            hasRating: true,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  }

  public async updateRatingPengguna(): Promise<void> {
    if (this.nilaiRating === -1) {
      throw new Error('Nilai rating tidak valid untuk memperbarui akumulasi rating pengguna.');
    }

    await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const penggunaPenerima = await tx.pengguna.findUnique({
          where: {
            idPengguna: this.idPenggunaPenerima,
          },
          select: {
            riwayatRating: true,
          },
        });

        if (!penggunaPenerima) {
          throw new Error('Pengguna penerima rating tidak ditemukan.');
        }

        const riwayatBaru: number[] = [...penggunaPenerima.riwayatRating, this.nilaiRating];
        const totalSkor: number = riwayatBaru.reduce((acc, curr) => acc + curr, 0);
        const rataRataBaru: number = Number((totalSkor / riwayatBaru.length).toFixed(2));

        await tx.pengguna.update({
          where: {
            idPengguna: this.idPenggunaPenerima,
          },
          data: {
            riwayatRating: {
              set: riwayatBaru,
            },
            akumulasiRating: rataRataBaru,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  }

  public static async getRatingsByUserId(userId: string): Promise<RatingWithRelations[]> {
    return prisma.rating.findMany({
      where: {
        idPenggunaPenerima: userId,
      },
      include: {
        pemberi: {
          select: {
            idPengguna: true,
            namaPengguna: true,
            username: true,
            avatarUrl: true,
            role: true,
          },
        },
        kontrak: {
          select: {
            idKontrakPekerjaan: true,
            detailPekerjaan: true,
            persetujuanHarga: true,
            statusPekerjaan: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        tanggalRating: 'desc',
      },
    });
  }
}
