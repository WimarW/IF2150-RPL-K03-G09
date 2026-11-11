import { randomUUID } from 'crypto';
import prisma from '../database/prisma';
import {
  NotifikasiController,
  RealtimeEmitter,
} from '../controllers/NotifikasiController';

export const STATUS_PEKERJAAN = {
  MENUNGGU: 'Menunggu',
  ON_PROGRESS: 'On Progress',
  MENUNGGU_KONFIRMASI_PELANGGAN: 'Menunggu Konfirmasi Pelanggan',
  DONE: 'Done',
  DITOLAK: 'Ditolak',
  DIBATALKAN: 'Dibatalkan',
} as const;

export type StatusPekerjaanType =
  (typeof STATUS_PEKERJAAN)[keyof typeof STATUS_PEKERJAAN];

export const STATUS_KETERSEDIAAN = {
  AVAILABLE: 'Available',
  ON_PROGRESS: 'On Progress',
} as const;

export type StatusKetersediaanType =
  (typeof STATUS_KETERSEDIAAN)[keyof typeof STATUS_KETERSEDIAAN];

/** Batas waktu respons konfirmasi penyedia jasa: 30 menit (KF07, KNF11) */
export const AUTO_CANCEL_TIMEOUT_MS = 30 * 60 * 1000;

export interface NewKontrakInput {
  idPelanggan?: string;
  idPemberiJasa?: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan?: string;
  expiresAt?: Date | null;
}

export interface KontrakPekerjaanDetail {
  idKontrakPekerjaan: string | null;
  idPelanggan: string;
  idPemberiJasa: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan: string;
  hasRating: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}

/**
 * Antarmuka pengirim notifikasi yang terhubung dengan NotifikasiController (C30)
 * (`buatNotifikasi(idPenerima, isiNotifikasi)` - ALGO-067, Q-027, ALGO-068, ALGO-069).
 */
export interface KontrakNotifikasiSender {
  buatNotifikasi(idPenerima: string, isiNotifikasi: string): Promise<unknown>;
  setRealtimeEmitter?(emitter: RealtimeEmitter): void;
}

const sharedNotifikasiController = new NotifikasiController();

export const defaultKontrakNotifikasiSender: KontrakNotifikasiSender = {
  async buatNotifikasi(idPenerima: string, isiNotifikasi: string) {
    if (!idPenerima || !isiNotifikasi) {
      return null;
    }
    return sharedNotifikasiController.buatNotifikasi(idPenerima, isiNotifikasi);
  },
  setRealtimeEmitter(emitter: RealtimeEmitter) {
    sharedNotifikasiController.setRealtimeEmitter(emitter);
  },
};

export class KontrakError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 400, code = 'KONTRAK_ERROR') {
    super(message);
    this.name = 'KontrakError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Kelas DPPL C16 - KontrakPekerjaan
 * Merepresentasikan data kesepakatan kerja antara Pelanggan dan Pemberi Jasa
 * (UC05, UC06, UC07 | KF02, KF07, KF10, KF11, KF12, KF13 | KNF04, KNF11, KNF18, KNF19, KNF21, KNF22).
 */
export class KontrakPekerjaan {
  private idKontrakPekerjaan: string | null = null;
  private idPelanggan: string = '';
  private idPemberiJasa: string = '';
  private detailPekerjaan: string = '';
  private persetujuanHarga: number = -1;
  private statusPekerjaan: string = STATUS_PEKERJAAN.MENUNGGU;
  private hasRating: boolean = false;
  private createdAt: Date = new Date();
  private expiresAt: Date | null = null;
  private isPersisted: boolean = false;

  /** Aturan transisi status pekerjaan yang valid (KNF22) */
  private static readonly VALID_TRANSITIONS: Record<string, string[]> = {
    inisialisasi: [STATUS_PEKERJAAN.MENUNGGU, STATUS_PEKERJAAN.ON_PROGRESS],
    [STATUS_PEKERJAAN.MENUNGGU]: [
      STATUS_PEKERJAAN.ON_PROGRESS,
      STATUS_PEKERJAAN.DITOLAK,
      STATUS_PEKERJAAN.DIBATALKAN,
    ],
    [STATUS_PEKERJAAN.ON_PROGRESS]: [
      STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
      STATUS_PEKERJAAN.DONE,
    ],
    [STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN]: [STATUS_PEKERJAAN.DONE],
    'Menunggu Konfirmasi': [STATUS_PEKERJAAN.DONE],
    [STATUS_PEKERJAAN.DONE]: [],
    [STATUS_PEKERJAAN.DITOLAK]: [],
    [STATUS_PEKERJAAN.DIBATALKAN]: [],
  };

  constructor(initialData?: Partial<KontrakPekerjaanDetail>, isPersisted = false) {
    if (initialData) {
      this.idKontrakPekerjaan = initialData.idKontrakPekerjaan ?? null;
      this.idPelanggan = initialData.idPelanggan ?? '';
      this.idPemberiJasa = initialData.idPemberiJasa ?? '';
      this.detailPekerjaan = initialData.detailPekerjaan ?? '';
      this.persetujuanHarga =
        initialData.persetujuanHarga !== undefined
          ? initialData.persetujuanHarga
          : -1;
      this.statusPekerjaan =
        initialData.statusPekerjaan ?? STATUS_PEKERJAAN.MENUNGGU;
      this.hasRating = initialData.hasRating ?? false;
      this.createdAt = initialData.createdAt ?? new Date();
      this.expiresAt = initialData.expiresAt ?? null;
    }
    this.isPersisted = isPersisted;
  }

  public getIdKontrakPekerjaan(): string | null {
    return this.idKontrakPekerjaan;
  }

  public setIdKontrakPekerjaan(id: string | null): void {
    this.idKontrakPekerjaan = id;
  }

  public getIdPelanggan(): string {
    return this.idPelanggan;
  }

  public setIdPelanggan(idPelanggan: string): void {
    this.idPelanggan = idPelanggan;
  }

  public getIdPemberiJasa(): string {
    return this.idPemberiJasa;
  }

  public setIdPemberiJasa(idPemberiJasa: string): void {
    this.idPemberiJasa = idPemberiJasa;
  }

  public getStatusPekerjaan(): string {
    return this.statusPekerjaan;
  }

  public getPersetujuanHarga(): number {
    return this.persetujuanHarga;
  }

  public getHasRating(): boolean {
    return this.hasRating;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getExpiresAt(): Date | null {
    return this.expiresAt;
  }

  /**
   * Mengembalikan rincian pekerjaan dan kesepakatan harga pada kontrak (Tabel 5.11.1)
   */
  public getDetailPekerjaan(): KontrakPekerjaanDetail {
    return {
      idKontrakPekerjaan: this.idKontrakPekerjaan,
      idPelanggan: this.idPelanggan,
      idPemberiJasa: this.idPemberiJasa,
      detailPekerjaan: this.detailPekerjaan,
      persetujuanHarga: this.persetujuanHarga,
      statusPekerjaan: this.statusPekerjaan,
      hasRating: this.hasRating,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
    };
  }

  /**
   * Validasi transisi state kontrak pekerjaan (KNF22)
   */
  public static isValidStateTransition(
    currentStatus: string,
    nextStatus: string
  ): boolean {
    const allowed = KontrakPekerjaan.VALID_TRANSITIONS[currentStatus];
    if (!allowed) {
      return false;
    }
    return allowed.includes(nextStatus);
  }

  /**
   * Validasi & sanitasi input kesepakatan pelanggan pada sisi server (KNF18)
   */
  public static validateKontrakInput(
    detailPekerjaan: unknown,
    persetujuanHarga: unknown
  ): { valid: boolean; message?: string; sanitizedDetail?: string; harga?: number } {
    if (typeof detailPekerjaan !== 'string' || detailPekerjaan.trim().length === 0) {
      return {
        valid: false,
        message: 'Detail pekerjaan wajib diisi dan berupa teks yang valid',
      };
    }

    const trimmedDetail = detailPekerjaan.trim();
    if (trimmedDetail.length > 2000) {
      return {
        valid: false,
        message: 'Detail pekerjaan tidak boleh melebihi 2000 karakter',
      };
    }

    const dangerousPattern =
      /(<script\b[^>]*>[\s\S]*?<\/script>|;\s*(DROP|DELETE|TRUNCATE|ALTER)\s+TABLE\b|--\s*$)/i;
    if (dangerousPattern.test(trimmedDetail)) {
      return {
        valid: false,
        message: 'Input detail pekerjaan mengandung karakter atau pola yang tidak diizinkan',
      };
    }

    const parsedHarga =
      typeof persetujuanHarga === 'number'
        ? persetujuanHarga
        : typeof persetujuanHarga === 'string' && /^\d+$/.test(persetujuanHarga.trim())
        ? Number(persetujuanHarga.trim())
        : NaN;

    if (!Number.isFinite(parsedHarga) || !Number.isInteger(parsedHarga) || parsedHarga <= 0) {
      return {
        valid: false,
        message: 'Persetujuan harga harus berupa bilangan bulat positif (> 0)',
      };
    }

    return {
      valid: true,
      sanitizedDetail: trimmedDetail,
      harga: parsedHarga,
    };
  }

  /**
   * ALGO-038: newKontrak(dataKontrak)
   * Menginisialisasi atribut objek kontrak baru dari data masukan controller.
   * Status awal diset 'Menunggu' (menunggu konfirmasi penyedia jasa) dengan batas waktu 30 menit (KF07, KNF11).
   */
  public newKontrak(dataKontrak: NewKontrakInput | [string, number]): void {
    const now = new Date();
    this.createdAt = now;
    this.expiresAt = new Date(now.getTime() + AUTO_CANCEL_TIMEOUT_MS);
    this.statusPekerjaan = STATUS_PEKERJAAN.MENUNGGU;
    this.isPersisted = false;

    if (Array.isArray(dataKontrak)) {
      const [detailPekerjaan, persetujuanHarga] = dataKontrak;
      this.detailPekerjaan =
        typeof detailPekerjaan === 'string' ? detailPekerjaan.trim() : '';
      this.persetujuanHarga = Number(persetujuanHarga);
      return;
    }

    this.detailPekerjaan =
      typeof dataKontrak.detailPekerjaan === 'string'
        ? dataKontrak.detailPekerjaan.trim()
        : '';
    this.persetujuanHarga = Number(dataKontrak.persetujuanHarga);

    if (dataKontrak.idPelanggan) {
      this.idPelanggan = dataKontrak.idPelanggan;
    }
    if (dataKontrak.idPemberiJasa) {
      this.idPemberiJasa = dataKontrak.idPemberiJasa;
    }
    if (dataKontrak.statusPekerjaan) {
      this.statusPekerjaan = dataKontrak.statusPekerjaan;
    }
    if (dataKontrak.expiresAt !== undefined) {
      this.expiresAt = dataKontrak.expiresAt;
    }
  }

  /**
   * ALGO-039: makeKontrak()
   * Memvalidasi detail pekerjaan dan harga lalu membangkitkan ID unik kontrak pekerjaan.
   */
  public makeKontrak(): boolean {
    const isDetailValid =
      typeof this.detailPekerjaan === 'string' &&
      this.detailPekerjaan.trim().length > 0;
    const isHargaValid =
      typeof this.persetujuanHarga === 'number' &&
      Number.isInteger(this.persetujuanHarga) &&
      this.persetujuanHarga >= 0;

    if (isDetailValid && isHargaValid) {
      this.idKontrakPekerjaan = randomUUID();
      return true;
    }
    return false;
  }

  /**
   * ALGO-036 & Q-016: statusUpdate(jenisStatus, nilaiStatus)
   * Memperbarui status pekerjaan yang sedang dikontrak di memori maupun di database.
   */
  public async statusUpdate(
    jenisStatusOrNilai: string,
    nilaiStatus?: string
  ): Promise<boolean> {
    const statusBaru =
      nilaiStatus !== undefined ? nilaiStatus : jenisStatusOrNilai;

    if (!statusBaru || typeof statusBaru !== 'string') {
      return false;
    }

    if (this.isPersisted && this.statusPekerjaan !== statusBaru) {
      if (!KontrakPekerjaan.isValidStateTransition(this.statusPekerjaan, statusBaru)) {
        return false;
      }
    }

    const previousStatus = this.statusPekerjaan;
    this.statusPekerjaan = statusBaru;

    if (this.idKontrakPekerjaan !== null && this.isPersisted) {
      try {
        await prisma.kontrakPekerjaan.update({
          where: { idKontrakPekerjaan: this.idKontrakPekerjaan },
          data: { statusPekerjaan: this.statusPekerjaan },
        });
        return true;
      } catch {
        this.statusPekerjaan = previousStatus;
        return false;
      }
    }

    return true;
  }

  /**
   * ALGO-037, Q-017, Q-018: saveKontrak()
   * Menyimpan data kontrak pekerjaan baru (Q-017) atau memperbarui kontrak yang sudah ada di database (Q-018).
   */
  public async saveKontrak(): Promise<boolean> {
    try {
      if (!this.isPersisted) {
        if (!this.idKontrakPekerjaan) {
          this.idKontrakPekerjaan = randomUUID();
        }
        if (!this.expiresAt && this.statusPekerjaan === STATUS_PEKERJAAN.MENUNGGU) {
          this.expiresAt = new Date(this.createdAt.getTime() + AUTO_CANCEL_TIMEOUT_MS);
        }

        const created = await prisma.kontrakPekerjaan.create({
          data: {
            idKontrakPekerjaan: this.idKontrakPekerjaan,
            idPelanggan: this.idPelanggan,
            idPemberiJasa: this.idPemberiJasa,
            detailPekerjaan: this.detailPekerjaan,
            persetujuanHarga: this.persetujuanHarga,
            statusPekerjaan: this.statusPekerjaan,
            hasRating: this.hasRating,
            createdAt: this.createdAt,
            expiresAt: this.expiresAt,
          },
        });

        this.idKontrakPekerjaan = created.idKontrakPekerjaan;
        this.createdAt = created.createdAt;
        this.expiresAt = created.expiresAt;
        this.isPersisted = true;
        return true;
      } else {
        if (!this.idKontrakPekerjaan) {
          return false;
        }

        await prisma.kontrakPekerjaan.update({
          where: { idKontrakPekerjaan: this.idKontrakPekerjaan },
          data: {
            statusPekerjaan: this.statusPekerjaan,
            detailPekerjaan: this.detailPekerjaan,
            persetujuanHarga: this.persetujuanHarga,
            hasRating: this.hasRating,
            expiresAt: this.expiresAt,
          },
        });
        return true;
      }
    } catch {
      return false;
    }
  }

  /**
   * Menyimpan kontrak baru sekaligus mengunci PemberiJasa dengan Optimistic Locking (KNF04, KNF19, Q-017)
   */
  public async saveNewKontrakWithOptimisticLock(
    expectedVersion?: number
  ): Promise<{ kontrak: KontrakPekerjaan; lockedVersion: number }> {
    if (!this.idPelanggan || !this.idPemberiJasa) {
      throw new KontrakError(
        'idPelanggan dan idPemberiJasa wajib diisi untuk membuat kontrak',
        400,
        'INVALID_PARTIES'
      );
    }

    if (this.idPelanggan === this.idPemberiJasa) {
      throw new KontrakError(
        'Pelanggan tidak dapat membuat kontrak dengan dirinya sendiri',
        400,
        'SELF_CONTRACT_FORBIDDEN'
      );
    }

    if (!this.idKontrakPekerjaan) {
      const made = this.makeKontrak();
      if (!made) {
        throw new KontrakError(
          'Data kontrak tidak valid: gagal membangkitkan ID kontrak',
          400,
          'INVALID_KONTRAK_DATA'
        );
      }
    }

    const now = new Date();
    this.createdAt = now;
    this.expiresAt = new Date(now.getTime() + AUTO_CANCEL_TIMEOUT_MS);

    return prisma.$transaction(async (tx) => {
      const pemberiJasa = await tx.pemberiJasa.findUnique({
        where: { idPemberiJasa: this.idPemberiJasa },
      });

      if (!pemberiJasa) {
        throw new KontrakError(
          'Penyedia jasa tidak ditemukan',
          404,
          'PROVIDER_NOT_FOUND'
        );
      }

      if (pemberiJasa.statusKetersediaan !== STATUS_KETERSEDIAAN.AVAILABLE) {
        throw new KontrakError(
          'Penyedia jasa sedang tidak tersedia atau sedang menangani pesanan lain',
          409,
          'PROVIDER_UNAVAILABLE'
        );
      }

      const targetVersion =
        expectedVersion !== undefined ? expectedVersion : pemberiJasa.version;

      if (pemberiJasa.version !== targetVersion) {
        throw new KontrakError(
          'Konflik Optimistic Locking: versi data penyedia jasa telah berubah oleh transaksi lain',
          409,
          'OPTIMISTIC_LOCK_CONFLICT'
        );
      }

      const lockResult = await tx.pemberiJasa.updateMany({
        where: {
          idPemberiJasa: this.idPemberiJasa,
          version: targetVersion,
          statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
        },
        data: {
          statusKetersediaan: STATUS_KETERSEDIAAN.ON_PROGRESS,
          version: { increment: 1 },
        },
      });

      if (lockResult.count === 0) {
        throw new KontrakError(
          'Konflik Optimistic Locking: penyedia jasa baru saja dikunci oleh pelanggan lain',
          409,
          'OPTIMISTIC_LOCK_CONFLICT'
        );
      }

      const created = await tx.kontrakPekerjaan.create({
        data: {
          idKontrakPekerjaan: this.idKontrakPekerjaan!,
          idPelanggan: this.idPelanggan,
          idPemberiJasa: this.idPemberiJasa,
          detailPekerjaan: this.detailPekerjaan,
          persetujuanHarga: this.persetujuanHarga,
          statusPekerjaan: this.statusPekerjaan,
          hasRating: this.hasRating,
          createdAt: this.createdAt,
          expiresAt: this.expiresAt,
        },
      });

      this.idKontrakPekerjaan = created.idKontrakPekerjaan;
      this.createdAt = created.createdAt;
      this.expiresAt = created.expiresAt;
      this.isPersisted = true;

      return {
        kontrak: this,
        lockedVersion: targetVersion + 1,
      };
    });
  }

  /**
   * Penyedia jasa menyetujui kontrak dengan Optimistic Locking (KNF04, KNF19, Q-016 / Q-018)
   */
  public async acceptKontrakWithOptimisticLock(
    expectedVersion?: number
  ): Promise<{ kontrak: KontrakPekerjaan; newVersion: number }> {
    if (!this.idKontrakPekerjaan) {
      throw new KontrakError('ID kontrak tidak valid', 400, 'INVALID_ID');
    }

    if (
      !KontrakPekerjaan.isValidStateTransition(
        this.statusPekerjaan,
        STATUS_PEKERJAAN.ON_PROGRESS
      )
    ) {
      throw new KontrakError(
        `Transisi status tidak valid dari '${this.statusPekerjaan}' ke '${STATUS_PEKERJAAN.ON_PROGRESS}'`,
        400,
        'INVALID_STATE_TRANSITION'
      );
    }

    const now = new Date();
    if (this.expiresAt && this.expiresAt.getTime() <= now.getTime()) {
      throw new KontrakError(
        'Kontrak telah melewati batas waktu konfirmasi 30 menit',
        410,
        'CONTRACT_EXPIRED'
      );
    }

    return prisma.$transaction(async (tx) => {
      const pemberiJasa = await tx.pemberiJasa.findUnique({
        where: { idPemberiJasa: this.idPemberiJasa },
      });

      if (!pemberiJasa) {
        throw new KontrakError(
          'Penyedia jasa tidak ditemukan',
          404,
          'PROVIDER_NOT_FOUND'
        );
      }

      const targetVersion =
        expectedVersion !== undefined ? expectedVersion : pemberiJasa.version;

      if (pemberiJasa.version !== targetVersion) {
        throw new KontrakError(
          'Konflik Optimistic Locking: versi data penyedia jasa tidak sesuai',
          409,
          'OPTIMISTIC_LOCK_CONFLICT'
        );
      }

      const activeOtherContract = await tx.kontrakPekerjaan.findFirst({
        where: {
          idPemberiJasa: this.idPemberiJasa,
          idKontrakPekerjaan: { not: this.idKontrakPekerjaan! },
          statusPekerjaan: {
            in: [
              STATUS_PEKERJAAN.ON_PROGRESS,
              STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
            ],
          },
        },
      });

      if (activeOtherContract) {
        throw new KontrakError(
          'Penyedia jasa sedang mengerjakan kontrak pekerjaan lain yang masih aktif',
          409,
          'PROVIDER_ALREADY_ON_PROGRESS'
        );
      }

      const lockResult = await tx.pemberiJasa.updateMany({
        where: {
          idPemberiJasa: this.idPemberiJasa,
          version: targetVersion,
        },
        data: {
          statusKetersediaan: STATUS_KETERSEDIAAN.ON_PROGRESS,
          version: { increment: 1 },
        },
      });

      if (lockResult.count === 0) {
        throw new KontrakError(
          'Konflik Optimistic Locking: gagal mengunci penyedia jasa karena perubahan versi konkuren',
          409,
          'OPTIMISTIC_LOCK_CONFLICT'
        );
      }

      const updateResult = await tx.kontrakPekerjaan.updateMany({
        where: {
          idKontrakPekerjaan: this.idKontrakPekerjaan!,
          statusPekerjaan: STATUS_PEKERJAAN.MENUNGGU,
        },
        data: {
          statusPekerjaan: STATUS_PEKERJAAN.ON_PROGRESS,
        },
      });

      if (updateResult.count === 0) {
        throw new KontrakError(
          'Status kontrak telah berubah dan tidak dapat disetujui lagi',
          409,
          'CONTRACT_STATE_CHANGED'
        );
      }

      this.statusPekerjaan = STATUS_PEKERJAAN.ON_PROGRESS;
      this.isPersisted = true;

      return {
        kontrak: this,
        newVersion: targetVersion + 1,
      };
    });
  }

  /**
   * Penyedia jasa menolak kontrak dan membuka kunci ketersediaan
   */
  public async rejectKontrakAndUnlock(): Promise<KontrakPekerjaan> {
    if (!this.idKontrakPekerjaan) {
      throw new KontrakError('ID kontrak tidak valid', 400, 'INVALID_ID');
    }

    if (
      !KontrakPekerjaan.isValidStateTransition(
        this.statusPekerjaan,
        STATUS_PEKERJAAN.DITOLAK
      )
    ) {
      throw new KontrakError(
        `Transisi status tidak valid dari '${this.statusPekerjaan}' ke '${STATUS_PEKERJAAN.DITOLAK}'`,
        400,
        'INVALID_STATE_TRANSITION'
      );
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.kontrakPekerjaan.updateMany({
        where: {
          idKontrakPekerjaan: this.idKontrakPekerjaan!,
          statusPekerjaan: STATUS_PEKERJAAN.MENUNGGU,
        },
        data: {
          statusPekerjaan: STATUS_PEKERJAAN.DITOLAK,
        },
      });

      if (updated.count === 0) {
        throw new KontrakError(
          'Kontrak sudah tidak dalam status Menunggu',
          409,
          'CONTRACT_STATE_CHANGED'
        );
      }

      const otherActive = await tx.kontrakPekerjaan.count({
        where: {
          idPemberiJasa: this.idPemberiJasa,
          idKontrakPekerjaan: { not: this.idKontrakPekerjaan! },
          statusPekerjaan: {
            in: [
              STATUS_PEKERJAAN.MENUNGGU,
              STATUS_PEKERJAAN.ON_PROGRESS,
              STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
            ],
          },
        },
      });

      if (otherActive === 0) {
        await tx.pemberiJasa.update({
          where: { idPemberiJasa: this.idPemberiJasa },
          data: {
            statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
            version: { increment: 1 },
          },
        });
      }
    });

    this.statusPekerjaan = STATUS_PEKERJAAN.DITOLAK;
    return this;
  }

  /**
   * ALGO-040 & Q-019: fetchKontrakPekerjaan(idKontrakPekerjaan)
   */
  public async fetchKontrakPekerjaan(
    idKontrakPekerjaan: string
  ): Promise<KontrakPekerjaan | null> {
    if (!idKontrakPekerjaan || typeof idKontrakPekerjaan !== 'string') {
      return null;
    }

    const record = await prisma.kontrakPekerjaan.findUnique({
      where: { idKontrakPekerjaan },
    });

    if (!record) {
      return null;
    }

    this.idKontrakPekerjaan = record.idKontrakPekerjaan;
    this.idPelanggan = record.idPelanggan;
    this.idPemberiJasa = record.idPemberiJasa;
    this.detailPekerjaan = record.detailPekerjaan;
    this.persetujuanHarga = record.persetujuanHarga;
    this.statusPekerjaan = record.statusPekerjaan;
    this.hasRating = record.hasRating;
    this.createdAt = record.createdAt;
    this.expiresAt = record.expiresAt;
    this.isPersisted = true;

    return this;
  }

  public static async fetchKontrakPekerjaan(
    idKontrakPekerjaan: string
  ): Promise<KontrakPekerjaan | null> {
    const instance = new KontrakPekerjaan();
    return instance.fetchKontrakPekerjaan(idKontrakPekerjaan);
  }

  public async addRating(): Promise<boolean> {
    if (!this.idKontrakPekerjaan) {
      return false;
    }

    try {
      await prisma.kontrakPekerjaan.update({
        where: { idKontrakPekerjaan: this.idKontrakPekerjaan },
        data: { hasRating: true },
      });
      this.hasRating = true;
      return true;
    } catch {
      return false;
    }
  }
}

export default KontrakPekerjaan;
