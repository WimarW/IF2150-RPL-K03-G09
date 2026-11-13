import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';
import { prisma } from '../database/prisma';
import { Pengguna, PenggunaProps } from './Pengguna';

export interface PemberiJasaDetail {
  idPemberiJasa: string;
  namaPengguna: string;
  namaToko: string;
  nomorTelpon: string;
  email: string;
  role?: string;
  avatarUrl: string | null;
  akumulasiRating: number;
  idKategoriJasa: string | null;
  jenisJasa: string | null;
  deskripsiJasa: string | null;
  tarif: number | null;
  jamKerja: string | null;
  daerahKerja: string | null;
  latitude: number | null;
  longitude: number | null;
  statusKetersediaan: string;
  isOnline: boolean;
  jarakKm?: number | null;
}

export interface SearchServiceFilter {
  keyword?: string;
  idKategoriJasa?: string;
}

export interface PemberiJasaProps extends PenggunaProps {
  idPemberiJasa?: string;
  namaToko?: string;
  idKategoriJasa?: string | null;
  jenisJasa?: string | null;
  deskripsiJasa?: string | null;
  tarif?: number | null;
  jamKerja?: string | null;
  daerahKerja?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  statusKetersediaan?: string;
  isOnline?: boolean;
  jarakKm?: number | null;
}

export interface CreatePemberiJasaInput {
  namaPengguna: string;
  username: string;
  email: string;
  nomorTelepon: string;
  passwordHash: string;
  idKategoriJasa?: string | null;
  jenisJasa: string;
  namaToko?: string;
  deskripsiJasa?: string | null;
  tarif?: number | null;
  jamKerja?: string | null;
  daerahKerja?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  statusKetersediaan?: string;
  isOnline?: boolean;
  avatarUrl?: string | null;
}

export class PemberiJasa extends Pengguna {
  private idPemberiJasa: string = '';
  public idKategoriJasa: string | null = null;
  public jenisJasa: string | null = null;
  private namaToko: string = '';
  private deskripsiJasa: string | null = null;
  private tarif: number | null = null;
  private jamKerja: string | null = null;
  private daerahKerja: string | null = null;
  private latitude: number | null = null;
  private longitude: number | null = null;
  private statusKetersediaan: string = 'Available';
  private isOnline: boolean = true;
  private jarakKm: number | null = null;
  private dataPemberiJasa: PemberiJasaDetail | null = null;

  // Constructor overloading: Mendukung pemanggilan model OOP (HEAD) maupun service instantiation (develop)
  constructor();
  constructor(props: PemberiJasaProps);
  constructor(idPemberiJasa?: string, idKategoriJasa?: string, jenisJasa?: string);
  constructor(
    propsOrId?: PemberiJasaProps | string,
    idKategoriJasa?: string,
    jenisJasa?: string
  ) {
    if (typeof propsOrId === 'object' && propsOrId !== null) {
      const resolvedId = propsOrId.idPemberiJasa || propsOrId.idPengguna || '';
      super({
        ...propsOrId,
        idPengguna: resolvedId,
        role: Role.PEMBERI_JASA,
        avatarUrl: propsOrId.avatarUrl ?? null,
        akumulasiRating: propsOrId.akumulasiRating ?? 0.0,
        riwayatRating: propsOrId.riwayatRating ?? [],
      });
      this.idPemberiJasa = resolvedId;
      this.namaToko = propsOrId.namaToko ?? '';
      this.idKategoriJasa = propsOrId.idKategoriJasa ?? null;
      this.jenisJasa = propsOrId.jenisJasa ?? null;
      this.deskripsiJasa = propsOrId.deskripsiJasa ?? null;
      this.tarif = propsOrId.tarif ?? null;
      this.jamKerja = propsOrId.jamKerja ?? null;
      this.daerahKerja = propsOrId.daerahKerja ?? null;
      this.latitude = propsOrId.latitude ?? null;
      this.longitude = propsOrId.longitude ?? null;
      this.statusKetersediaan = propsOrId.statusKetersediaan ?? 'Available';
      this.isOnline = propsOrId.isOnline ?? true;
      this.jarakKm = propsOrId.jarakKm ?? null;
    } else {
      const id = typeof propsOrId === 'string' ? propsOrId : '';
      super({
        idPengguna: id,
        nomorTelepon: '',
        email: '',
        namaPengguna: '',
        username: '',
        passwordHash: '',
        role: Role.PEMBERI_JASA,
        avatarUrl: null,
        akumulasiRating: 0.0,
        riwayatRating: [],
      });
      this.idPemberiJasa = id;
      this.idKategoriJasa = idKategoriJasa ?? null;
      this.jenisJasa = jenisJasa ?? null;
      this.namaToko = '';
      this.deskripsiJasa = null;
      this.tarif = null;
      this.jamKerja = null;
      this.daerahKerja = null;
      this.latitude = null;
      this.longitude = null;
      this.statusKetersediaan = 'Available';
      this.isOnline = true;
      this.jarakKm = null;
    }
  }

  // ==================== GETTERS & SETTERS ====================
  public getIDPemberiJasa(): string {
    return this.idPemberiJasa || this.idPengguna;
  }

  public setIDPemberiJasa(idPemberiJasa: string): void {
    this.idPemberiJasa = idPemberiJasa;
    this.idPengguna = idPemberiJasa;
  }

  public getIDKategoriJasa(): string {
    return this.idKategoriJasa ?? '';
  }

  public setIDKategoriJasa(idKategoriJasa: string | null): void {
    this.idKategoriJasa = idKategoriJasa;
  }

  public getIdKategoriJasa(): string | null {
    return this.idKategoriJasa || null;
  }

  public getJenisJasa(): string | null {
    return this.jenisJasa || null;
  }

  public setJenisJasa(jenisJasa: string | null): void {
    this.jenisJasa = jenisJasa;
  }

  public getNamaToko(): string {
    return this.namaToko;
  }

  public setNamaToko(namaToko: string): void {
    this.namaToko = namaToko;
  }

  public getDeskripsiJasa(): string | null {
    return this.deskripsiJasa;
  }

  public getTarif(): number | null {
    return this.tarif;
  }

  public getJamKerja(): string | null {
    return this.jamKerja;
  }

  public getDaerahKerja(): string | null {
    return this.daerahKerja;
  }

  public getLatitude(): number | null {
    return this.latitude;
  }

  public setLatitude(latitude: number | null): void {
    this.latitude = latitude;
  }

  public getLongitude(): number | null {
    return this.longitude;
  }

  public setLongitude(longitude: number | null): void {
    this.longitude = longitude;
  }

  public getStatusKetersediaan(): string {
    return this.statusKetersediaan;
  }

  public setStatusKetersediaan(statusKetersediaan: string): void {
    this.statusKetersediaan = statusKetersediaan;
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public setIsOnline(isOnline: boolean): void {
    this.isOnline = isOnline;
  }

  public getJarakKm(): number | null {
    return this.jarakKm;
  }

  public setJarakKm(jarakKm: number | null): void {
    this.jarakKm = jarakKm;
  }

  public getDataPemberiJasa(): PemberiJasaDetail | null {
    return this.dataPemberiJasa;
  }

  // ==================== REGISTRATION & PERSISTENCE (HEAD) ====================
  public static makePemberiJasa(input: CreatePemberiJasaInput): PemberiJasa {
    const id = randomUUID();
    return new PemberiJasa({
      idPengguna: id,
      idPemberiJasa: id,
      namaPengguna: input.namaPengguna.trim(),
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      nomorTelepon: input.nomorTelepon.trim(),
      passwordHash: input.passwordHash,
      role: Role.PEMBERI_JASA,
      avatarUrl: input.avatarUrl ?? null,
      akumulasiRating: 0.0,
      riwayatRating: [],
      namaToko: (input.namaToko ?? input.namaPengguna).trim(),
      idKategoriJasa: input.idKategoriJasa ? input.idKategoriJasa.trim() : null,
      jenisJasa: input.jenisJasa ? input.jenisJasa.trim() : null,
      deskripsiJasa: input.deskripsiJasa ?? null,
      tarif: input.tarif ?? null,
      jamKerja: input.jamKerja ?? null,
      daerahKerja: input.daerahKerja ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      statusKetersediaan: input.statusKetersediaan ?? 'Available',
      isOnline: input.isOnline ?? true,
    });
  }

  public async simpanKeDb(): Promise<PemberiJasa> {
    const targetId = this.idPemberiJasa || this.idPengguna || randomUUID();
    this.setIDPemberiJasa(targetId);

    const result = await prisma.$transaction(async (tx) => {
      const penggunaRecord = await tx.pengguna.create({
        data: {
          idPengguna: targetId,
          namaPengguna: this.namaPengguna,
          username: this.username,
          email: this.email,
          nomorTelpon: this.nomorTelepon,
          password: this.passwordHash,
          role: Role.PEMBERI_JASA,
          avatarUrl: this.avatarUrl,
          akumulasiRating: this.akumulasiRating ?? 0.0,
          riwayatRating: this.riwayatRating ?? [],
        },
      });

      let kategoriRecord = null;
      const resolvedIdKategori: string | null = this.idKategoriJasa || null;
      if (resolvedIdKategori) {
        kategoriRecord = await tx.kategoriJasa.findUnique({
          where: { idKategoriJasa: resolvedIdKategori },
        });

        if (!kategoriRecord) {
          kategoriRecord = await tx.kategoriJasa.create({
            data: {
              idKategoriJasa: resolvedIdKategori,
              jenisJasa: this.jenisJasa || 'Umum',
              deskripsiJasa: this.deskripsiJasa ?? `Layanan ${this.jenisJasa || 'Umum'}`,
              tarif: this.tarif ?? 0,
              jamKerja: this.jamKerja ?? '08:00 - 17:00',
              daerahKerja: this.daerahKerja ?? 'Bandung',
            },
          });
        }
      }

      const pemberiJasaRecord = await tx.pemberiJasa.create({
        data: {
          idPemberiJasa: penggunaRecord.idPengguna,
          namaToko: this.namaToko || '',
          idKategoriJasa: resolvedIdKategori,
          jenisJasa: this.jenisJasa || null,
          latitude: this.latitude,
          longitude: this.longitude,
          statusKetersediaan: this.statusKetersediaan,
          isOnline: this.isOnline,
        },
      });

      return { penggunaRecord, pemberiJasaRecord, kategoriRecord };
    });

    return new PemberiJasa({
      idPengguna: result.penggunaRecord.idPengguna,
      idPemberiJasa: result.pemberiJasaRecord.idPemberiJasa,
      namaPengguna: result.penggunaRecord.namaPengguna,
      username: result.penggunaRecord.username,
      email: result.penggunaRecord.email,
      nomorTelepon: result.penggunaRecord.nomorTelpon,
      passwordHash: result.penggunaRecord.password,
      role: result.penggunaRecord.role,
      avatarUrl: result.penggunaRecord.avatarUrl,
      akumulasiRating: result.penggunaRecord.akumulasiRating,
      riwayatRating: result.penggunaRecord.riwayatRating,
      namaToko: result.pemberiJasaRecord.namaToko,
      idKategoriJasa: result.pemberiJasaRecord.idKategoriJasa,
      jenisJasa: result.pemberiJasaRecord.jenisJasa ?? result.kategoriRecord?.jenisJasa ?? null,
      deskripsiJasa: result.kategoriRecord?.deskripsiJasa ?? this.deskripsiJasa,
      tarif: result.kategoriRecord?.tarif ?? this.tarif,
      jamKerja: result.kategoriRecord?.jamKerja ?? this.jamKerja,
      daerahKerja: result.kategoriRecord?.daerahKerja ?? this.daerahKerja,
      latitude: result.pemberiJasaRecord.latitude,
      longitude: result.pemberiJasaRecord.longitude,
      statusKetersediaan: result.pemberiJasaRecord.statusKetersediaan,
      isOnline: result.pemberiJasaRecord.isOnline,
    });
  }

  // ==================== QUERY & SERVICE METHODS (DEVELOP) ====================
  private hydrateFromDetail(detail: PemberiJasaDetail): void {
    this.idPemberiJasa = detail.idPemberiJasa;
    this.idPengguna = detail.idPemberiJasa;
    this.namaPengguna = detail.namaPengguna;
    this.namaToko = detail.namaToko;
    this.nomorTelepon = detail.nomorTelpon;
    this.email = detail.email;
    this.avatarUrl = detail.avatarUrl;
    this.akumulasiRating = detail.akumulasiRating;
    this.idKategoriJasa = detail.idKategoriJasa;
    this.jenisJasa = detail.jenisJasa;
    this.deskripsiJasa = detail.deskripsiJasa;
    this.tarif = detail.tarif;
    this.jamKerja = detail.jamKerja;
    this.daerahKerja = detail.daerahKerja;
    this.latitude = detail.latitude;
    this.longitude = detail.longitude;
    this.statusKetersediaan = detail.statusKetersediaan;
    this.isOnline = detail.isOnline;
    this.jarakKm = detail.jarakKm ?? null;
    this.dataPemberiJasa = detail;
  }

  public async getPemberiJasaByID(idPemberiJasa: string): Promise<PemberiJasaDetail | null> {
    const row = await prisma.pemberiJasa.findUnique({
      where: { idPemberiJasa },
      include: {
        pengguna: true,
        kategoriJasa: true,
      },
    });

    if (!row) {
      this.dataPemberiJasa = null;
      return null;
    }

    const formatted: PemberiJasaDetail = {
      idPemberiJasa: row.idPemberiJasa,
      namaPengguna: row.pengguna.namaPengguna,
      namaToko: row.namaToko,
      nomorTelpon: row.pengguna.nomorTelpon,
      email: row.pengguna.email,
      ...(row.pengguna.role !== undefined ? { role: row.pengguna.role } : {}),
      avatarUrl: row.pengguna.avatarUrl,
      akumulasiRating: row.pengguna.akumulasiRating,
      idKategoriJasa: row.idKategoriJasa,
      jenisJasa: row.jenisJasa ?? row.kategoriJasa?.jenisJasa ?? null,
      deskripsiJasa: row.kategoriJasa?.deskripsiJasa ?? null,
      tarif: row.kategoriJasa?.tarif ?? null,
      jamKerja: row.kategoriJasa?.jamKerja ?? null,
      daerahKerja: row.kategoriJasa?.daerahKerja ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKetersediaan: row.statusKetersediaan,
      isOnline: row.isOnline,
    };

    this.hydrateFromDetail(formatted);
    return formatted;
  }

  public async getPemberiJasaByKategori(idKategoriJasa: string): Promise<PemberiJasaDetail[]> {
    const rows = await prisma.pemberiJasa.findMany({
      where: { idKategoriJasa },
      include: {
        pengguna: true,
        kategoriJasa: true,
      },
    });

    return rows.map((row) => ({
      idPemberiJasa: row.idPemberiJasa,
      namaPengguna: row.pengguna.namaPengguna,
      namaToko: row.namaToko,
      nomorTelpon: row.pengguna.nomorTelpon,
      email: row.pengguna.email,
      ...(row.pengguna.role !== undefined ? { role: row.pengguna.role } : {}),
      avatarUrl: row.pengguna.avatarUrl,
      akumulasiRating: row.pengguna.akumulasiRating,
      idKategoriJasa: row.idKategoriJasa,
      jenisJasa: row.jenisJasa ?? row.kategoriJasa?.jenisJasa ?? null,
      deskripsiJasa: row.kategoriJasa?.deskripsiJasa ?? null,
      tarif: row.kategoriJasa?.tarif ?? null,
      jamKerja: row.kategoriJasa?.jamKerja ?? null,
      daerahKerja: row.kategoriJasa?.daerahKerja ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKetersediaan: row.statusKetersediaan,
      isOnline: row.isOnline,
    }));
  }

  public async savePemberiJasa(
    idPemberiJasa?: string,
    idKategoriJasa?: string,
    extraData?: {
      namaToko?: string;
      latitude?: number | null;
      longitude?: number | null;
      statusKetersediaan?: string;
      isOnline?: boolean;
    }
  ): Promise<PemberiJasaDetail | null> {
    const targetIdPemberiJasa = idPemberiJasa || this.idPemberiJasa || this.idPengguna;
    const targetIdKategoriJasa = idKategoriJasa || this.idKategoriJasa;

    if (!targetIdPemberiJasa || !targetIdKategoriJasa) {
      throw new Error('idPemberiJasa dan idKategoriJasa wajib diisi');
    }

    const kategori = await prisma.kategoriJasa.findUnique({
      where: { idKategoriJasa: targetIdKategoriJasa },
    });

    if (!kategori) {
      throw new Error('Kategori jasa tidak ditemukan');
    }

    const pengguna = await prisma.pengguna.findUnique({
      where: { idPengguna: targetIdPemberiJasa },
    });

    if (!pengguna) {
      throw new Error('Pengguna tidak ditemukan');
    }

    if (pengguna.role === Role.LAYANAN_PELANGGAN) {
      throw new Error('Akun layanan pelanggan tidak dapat didaftarkan sebagai penyedia jasa');
    }

    this.setIDPemberiJasa(targetIdPemberiJasa);
    this.idKategoriJasa = targetIdKategoriJasa;
    this.jenisJasa = kategori.jenisJasa;

    await prisma.$transaction([
      prisma.pemberiJasa.upsert({
        where: { idPemberiJasa: targetIdPemberiJasa },
        update: {
          idKategoriJasa: targetIdKategoriJasa,
          jenisJasa: kategori.jenisJasa,
          ...(extraData?.namaToko !== undefined ? { namaToko: extraData.namaToko } : {}),
          ...(extraData?.latitude !== undefined ? { latitude: extraData.latitude } : {}),
          ...(extraData?.longitude !== undefined ? { longitude: extraData.longitude } : {}),
          ...(extraData?.statusKetersediaan !== undefined
            ? { statusKetersediaan: extraData.statusKetersediaan }
            : {}),
          ...(extraData?.isOnline !== undefined ? { isOnline: extraData.isOnline } : {}),
        },
        create: {
          idPemberiJasa: targetIdPemberiJasa,
          idKategoriJasa: targetIdKategoriJasa,
          jenisJasa: kategori.jenisJasa,
          namaToko: extraData?.namaToko ?? '',
          latitude: extraData?.latitude ?? null,
          longitude: extraData?.longitude ?? null,
        },
      }),
      prisma.pengguna.update({
        where: { idPengguna: targetIdPemberiJasa },
        data: { role: Role.PEMBERI_JASA },
      }),
    ]);

    return this.getPemberiJasaByID(targetIdPemberiJasa);
  }

  public async searchPemberiJasa(filter: SearchServiceFilter): Promise<PemberiJasaDetail[]> {
    const { keyword, idKategoriJasa } = filter;

    const rows = await prisma.pemberiJasa.findMany({
      where: {
        ...(idKategoriJasa ? { idKategoriJasa } : {}),
        ...(keyword && keyword.trim() !== ''
          ? {
              OR: [
                { jenisJasa: { contains: keyword.trim(), mode: 'insensitive' } },
                { namaToko: { contains: keyword.trim(), mode: 'insensitive' } },
                {
                  pengguna: {
                    namaPengguna: { contains: keyword.trim(), mode: 'insensitive' },
                  },
                },
                {
                  kategoriJasa: {
                    OR: [
                      { jenisJasa: { contains: keyword.trim(), mode: 'insensitive' } },
                      { deskripsiJasa: { contains: keyword.trim(), mode: 'insensitive' } },
                      { daerahKerja: { contains: keyword.trim(), mode: 'insensitive' } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        pengguna: true,
        kategoriJasa: true,
      },
    });

    return rows.map((row) => ({
      idPemberiJasa: row.idPemberiJasa,
      namaPengguna: row.pengguna.namaPengguna,
      namaToko: row.namaToko,
      nomorTelpon: row.pengguna.nomorTelpon,
      email: row.pengguna.email,
      ...(row.pengguna.role !== undefined ? { role: row.pengguna.role } : {}),
      avatarUrl: row.pengguna.avatarUrl,
      akumulasiRating: row.pengguna.akumulasiRating,
      idKategoriJasa: row.idKategoriJasa,
      jenisJasa: row.jenisJasa ?? row.kategoriJasa?.jenisJasa ?? null,
      deskripsiJasa: row.kategoriJasa?.deskripsiJasa ?? null,
      tarif: row.kategoriJasa?.tarif ?? null,
      jamKerja: row.kategoriJasa?.jamKerja ?? null,
      daerahKerja: row.kategoriJasa?.daerahKerja ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKetersediaan: row.statusKetersediaan,
      isOnline: row.isOnline,
    }));
  }

  // ==================== DATA SANITIZATION ====================
  public override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      idPemberiJasa: this.idPemberiJasa || this.idPengguna,
      namaToko: this.namaToko,
      idKategoriJasa: this.idKategoriJasa || null,
      jenisJasa: this.jenisJasa || null,
      ...(this.deskripsiJasa !== null ? { deskripsiJasa: this.deskripsiJasa } : {}),
      ...(this.tarif !== null ? { tarif: this.tarif } : {}),
      ...(this.jamKerja !== null ? { jamKerja: this.jamKerja } : {}),
      ...(this.daerahKerja !== null ? { daerahKerja: this.daerahKerja } : {}),
      latitude: this.latitude,
      longitude: this.longitude,
      statusKetersediaan: this.statusKetersediaan,
      isOnline: this.isOnline,
      ...(this.jarakKm !== null ? { jarakKm: this.jarakKm } : {}),
    };
  }
}

export default PemberiJasa;