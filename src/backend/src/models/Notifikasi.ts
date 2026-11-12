import crypto from 'crypto';
import prisma from '../database/prisma';

export interface NotifikasiRecord {
  idNotifikasi: string;
  idPenerima: string;
  isiNotifikasi: string;
  waktuNotifikasi: Date;
  statusBaca: boolean;
}

export interface PaginatedNotifikasiResult {
  items: NotifikasiRecord[];
  unreadCount: number;
  nextCursor: string | null;
}

/**
 * C28 - Kelas Model Notifikasi
 * Mengelola seluruh akses data notifikasi murni menggunakan Prisma ORM.
 * Tidak mengandung aturan bisnis.
 */
export class Notifikasi {
  private idNotifikasi: string;
  private idPenerima: string;
  private isiNotifikasi: string;
  private waktuNotifikasi: Date;
  private statusBaca: boolean;

  /**
   * C28 · Constructor
   * Menginisialisasi objek Notifikasi baru dengan statusBaca = false (belum terbaca).
   */
  constructor(
    idPenerima: string = '',
    isiNotifikasi: string = '',
    idNotifikasi?: string,
    waktuNotifikasi?: Date,
    statusBaca: boolean = false
  ) {
    this.idNotifikasi = idNotifikasi ?? `NOTIF-${crypto.randomUUID()}`;
    this.idPenerima = idPenerima;
    this.isiNotifikasi = isiNotifikasi;
    this.waktuNotifikasi = waktuNotifikasi ?? new Date();
    this.statusBaca = statusBaca;
  }

  /**
   * C28 · Q-027
   * Menyimpan entitas Notifikasi baru ke database menggunakan `prisma.notifikasi.create`
   * (5 atribut terpetakan ke 5 kolom snake_case sesuai Keputusan Desain #1 & #2).
   */
  public async simpanNotifikasi(): Promise<NotifikasiRecord> {
    return prisma.notifikasi.create({
      data: {
        idNotifikasi: this.idNotifikasi,
        idPenerima: this.idPenerima,
        isiNotifikasi: this.isiNotifikasi,
        waktuNotifikasi: this.waktuNotifikasi,
        statusBaca: this.statusBaca,
      },
    });
  }

  /**
   * C28 · ALGO-065
   * Mengembalikan atribut isiNotifikasi.
   */
  public getIsiNotifikasi(): string {
    return this.isiNotifikasi;
  }

  /**
   * C28 · ALGO-066 · Q-026
   * Menandai satu notifikasi sebagai terbaca (`statusBaca: true`) menggunakan `prisma.notifikasi.update`.
   */
  public async tandaiTerbaca(idNotifikasiTarget?: string): Promise<NotifikasiRecord> {
    const targetId = idNotifikasiTarget ?? this.idNotifikasi;
    const updated = await prisma.notifikasi.update({
      where: { idNotifikasi: targetId },
      data: { statusBaca: true },
    });
    if (targetId === this.idNotifikasi) {
      this.statusBaca = true;
    }
    return updated;
  }

  /**
   * C28 · getLastMessage
   * Mengambil satu notifikasi terakhir milik pengguna menggunakan `prisma.notifikasi.findFirst`
   * dengan urutan `waktuNotifikasi: 'desc'`.
   */
  public async getLastMessage(idPenerimaTarget?: string): Promise<NotifikasiRecord | null> {
    const targetPenerima = idPenerimaTarget ?? this.idPenerima;
    return prisma.notifikasi.findFirst({
      where: { idPenerima: targetPenerima },
      orderBy: { waktuNotifikasi: 'desc' },
    });
  }

  // Tambahan non-DPPL: Getter atribut internal untuk controller & emit real-time
  public getIdNotifikasi(): string {
    return this.idNotifikasi;
  }

  public getIdPenerima(): string {
    return this.idPenerima;
  }

  public getWaktuNotifikasi(): Date {
    return this.waktuNotifikasi;
  }

  public getStatusBaca(): boolean {
    return this.statusBaca;
  }

  // Tambahan non-DPPL: Mengambil satu notifikasi berdasarkan ID via Prisma findUnique
  public async findById(idNotifikasi: string): Promise<NotifikasiRecord | null> {
    return prisma.notifikasi.findUnique({
      where: { idNotifikasi },
    });
  }

  // Tambahan non-DPPL: Mengambil daftar notifikasi berpaginasi cursor + unreadCount via Prisma findMany & count
  public async findPaginatedByUser(
    idPenerima: string,
    limit: number = 20,
    cursor?: string
  ): Promise<PaginatedNotifikasiResult> {
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const [rows, unreadCount] = await Promise.all([
      prisma.notifikasi.findMany({
        where: { idPenerima },
        orderBy: [{ waktuNotifikasi: 'desc' }, { idNotifikasi: 'desc' }],
        take: safeLimit + 1,
        ...(cursor
          ? {
              cursor: { idNotifikasi: cursor },
              skip: 1,
            }
          : {}),
      }),
      prisma.notifikasi.count({
        where: {
          idPenerima,
          statusBaca: false,
        },
      }),
    ]);

    let nextCursor: string | null = null;
    if (rows.length > safeLimit) {
      rows.pop();
      const lastItem = rows[rows.length - 1];
      nextCursor = lastItem ? lastItem.idNotifikasi : null;
    }

    return {
      items: rows,
      unreadCount,
      nextCursor,
    };
  }

  // Tambahan non-DPPL: Menandai seluruh notifikasi pengguna sebagai terbaca via Prisma updateMany
  public async markAllAsReadByUser(idPenerima: string): Promise<number> {
    const result = await prisma.notifikasi.updateMany({
      where: {
        idPenerima,
        statusBaca: false,
      },
      data: {
        statusBaca: true,
      },
    });
    return result.count;
  }
}