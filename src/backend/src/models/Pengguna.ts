import { Role } from '@prisma/client';
import { prisma } from '../database/prisma';
import {
  KontrakPekerjaan,
  STATUS_KETERSEDIAAN,
  STATUS_PEKERJAAN,
} from './KontrakPekerjaan';

export interface PenggunaProps {
  idPengguna: string;
  nomorTelepon: string;
  email: string;
  namaPengguna: string;
  username: string;
  passwordHash: string;
  role?: Role;
  avatarUrl?: string | null;
  akumulasiRating?: number;
  riwayatRating?: number[];
}

export class Pengguna {
  protected idPengguna: string;
  protected nomorTelepon: string;
  protected email: string;
  protected namaPengguna: string;
  protected username: string;
  protected passwordHash: string;
  protected role: Role;
  protected avatarUrl: string | null;
  protected akumulasiRating: number;
  protected riwayatRating: number[];

  constructor(props?: Partial<PenggunaProps>) {
    this.idPengguna = props?.idPengguna ?? '';
    this.nomorTelepon = props?.nomorTelepon ?? '';
    this.email = props?.email ?? '';
    this.namaPengguna = props?.namaPengguna ?? '';
    this.username = props?.username ?? '';
    this.passwordHash = props?.passwordHash ?? '';
    this.role = props?.role ?? Role.PELANGGAN;
    this.avatarUrl = props?.avatarUrl ?? null;
    this.akumulasiRating = props?.akumulasiRating ?? 0.0;
    this.riwayatRating = props?.riwayatRating ?? [];
  }

  public getId(): string {
    return this.idPengguna;
  }

  public getNomor(): string {
    return this.nomorTelepon;
  }

  public getEmail(): string {
    return this.email;
  }

  public getNama(): string {
    return this.namaPengguna;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getRole(): Role {
    return this.role;
  }

  public getAkumulasiRating(): number {
    return this.akumulasiRating;
  }

  public getRiwayatRating(): number[] {
    return [...this.riwayatRating];
  }

  public setNomor(nomorBaru: string): void {
    this.nomorTelepon = nomorBaru.trim();
  }

  public setEmail(emailBaru: string): void {
    this.email = emailBaru.trim().toLowerCase();
  }

  public setNama(namaBaru: string): void {
    this.namaPengguna = namaBaru.trim();
  }

  public setAvatarUrl(avatarUrlBaru: string | null): void {
    this.avatarUrl = avatarUrlBaru;
  }

  public addNewRatingRiwayat(nilaiRating: number): void {
    if (nilaiRating < 1 || nilaiRating > 5) {
      throw new Error('Nilai rating harus berada dalam rentang 1 hingga 5.');
    }
    this.riwayatRating.push(nilaiRating);
    const total = this.riwayatRating.reduce((acc, curr) => acc + curr, 0);
    this.akumulasiRating = Number((total / this.riwayatRating.length).toFixed(2));
  }

  /**
   * Operasi C01: konfirmasiPekerjaan(idKontrak: String): Boolean
   * Mengonfirmasi bahwa pekerjaan pada kontrak terkait telah selesai dan pembayaran telah diselesaikan (UC07, KF13),
   * memverifikasi status aktif sebelumnya adalah 'On Progress' atau 'Menunggu Konfirmasi Pelanggan' (KNF22),
   * mengubah status menjadi 'Done' (Q-016), dan membuka kembali kunci ketersediaan penyedia jasa.
   */
  public async konfirmasiPekerjaan(idKontrak: string): Promise<boolean> {
    if (!idKontrak || typeof idKontrak !== 'string') {
      return false;
    }

    const kontrak = await KontrakPekerjaan.fetchKontrakPekerjaan(idKontrak);
    if (!kontrak) {
      return false;
    }

    if (this.idPengguna && kontrak.getIdPelanggan() !== this.idPengguna) {
      return false;
    }

    const currentStatus = kontrak.getStatusPekerjaan();
    if (!KontrakPekerjaan.isValidStateTransition(currentStatus, STATUS_PEKERJAAN.DONE)) {
      return false;
    }

    const idPemberiJasa = kontrak.getIdPemberiJasa();

    try {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.kontrakPekerjaan.updateMany({
          where: {
            idKontrakPekerjaan: idKontrak,
            statusPekerjaan: {
              in: [
                STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
                STATUS_PEKERJAAN.ON_PROGRESS,
                'Menunggu Konfirmasi',
              ],
            },
          },
          data: {
            statusPekerjaan: STATUS_PEKERJAAN.DONE,
          },
        });

        if (updated.count === 0) {
          throw new Error('Status kontrak tidak memenuhi syarat untuk diselesaikan');
        }

        const remainingActive = await tx.kontrakPekerjaan.count({
          where: {
            idPemberiJasa,
            idKontrakPekerjaan: { not: idKontrak },
            statusPekerjaan: {
              in: [
                STATUS_PEKERJAAN.MENUNGGU,
                STATUS_PEKERJAAN.ON_PROGRESS,
                STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
              ],
            },
          },
        });

        if (remainingActive === 0) {
          await tx.pemberiJasa.update({
            where: { idPemberiJasa },
            data: {
              statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
              version: { increment: 1 },
            },
          });
        }
      });

      return true;
    } catch {
      return false;
    }
  }

  public laporkanMasalah(): void {
    // Didelegasikan ke modul TiketLaporan (UC08)
  }

  public static async cekDuplikasiKredensial(
    username: string,
    email: string,
    excludeIdPengguna?: string
  ): Promise<{ usernameExists: boolean; emailExists: boolean }> {
    const existingUsers = await prisma.pengguna.findMany({
      where: {
        OR: [
          { username: username.trim() },
          { email: email.trim().toLowerCase() },
        ],
        ...(excludeIdPengguna ? { NOT: { idPengguna: excludeIdPengguna } } : {}),
      },
      select: {
        username: true,
        email: true,
      },
    });

    const usernameExists = existingUsers.some(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    return { usernameExists, emailExists };
  }

  public static async findByUsernameOrEmail(identifier: string) {
    const cleanIdentifier = identifier.trim();
    return prisma.pengguna.findFirst({
      where: {
        OR: [
          { username: cleanIdentifier },
          { email: cleanIdentifier.toLowerCase() },
        ],
      },
      include: {
        pemberiJasa: {
          include: {
            kategoriJasa: true,
          },
        },
        layananPelanggan: true,
      },
    });
  }

  public static async findProfileById(idPengguna: string) {
    const record = await prisma.pengguna.findUnique({
      where: { idPengguna },
      include: {
        pemberiJasa: {
          include: {
            kategoriJasa: true,
          },
        },
        layananPelanggan: true,
      },
    });

    if (!record) return null;

    const { password: _, ...safeProfile } = record;
    return safeProfile;
  }

  public async updateProfilKeDb() {
    const updated = await prisma.pengguna.update({
      where: { idPengguna: this.idPengguna },
      data: {
        namaPengguna: this.namaPengguna,
        nomorTelpon: this.nomorTelepon,
        email: this.email,
        avatarUrl: this.avatarUrl,
      },
      include: {
        pemberiJasa: {
          include: {
            kategoriJasa: true,
          },
        },
        layananPelanggan: true,
      },
    });

    const { password: _, ...safeUpdated } = updated;
    return safeUpdated;
  }

  public toJSON(): Record<string, unknown> {
    return {
      idPengguna: this.idPengguna,
      username: this.username,
      email: this.email,
      namaPengguna: this.namaPengguna,
      nomorTelpon: this.nomorTelepon,
      nomorTelepon: this.nomorTelepon,
      role: this.role,
      avatarUrl: this.avatarUrl,
      akumulasiRating: this.akumulasiRating,
      riwayatRating: this.riwayatRating,
    };
  }
}

export default Pengguna;
