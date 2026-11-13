import { randomUUID } from 'crypto';
import prisma from '../database/prisma';

export interface KategoriJasaInput {
  idKategoriJasa?: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
}

export interface KategoriJasaRecord {
  idKategoriJasa: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
}

export class KategoriJasa {
  public idKategoriJasa: string = '';
  private jenisJasa: string = '';
  private deskripsiJasa: string = '';
  private tarif: number = 0;
  private jamKerja: string = '';
  private daerahKerja: string = '';
  private dataKategoriJasa: KategoriJasaRecord | KategoriJasaRecord[] | null = null;

  constructor(data?: Partial<KategoriJasaInput>) {
    if (data) {
      this.idKategoriJasa = data.idKategoriJasa ?? '';
      this.jenisJasa = data.jenisJasa ?? '';
      this.deskripsiJasa = data.deskripsiJasa ?? '';
      this.tarif = data.tarif ?? 0;
      this.jamKerja = data.jamKerja ?? '';
      this.daerahKerja = data.daerahKerja ?? '';
    }
  }

  public getIDKategoriJasa(): string {
    return this.idKategoriJasa;
  }


  public getJenisJasa(): string {
    return this.jenisJasa;
  }


  public getDeskripsiJasa(): string {
    return this.deskripsiJasa;
  }

  public getTarif(): number {
    return this.tarif;
  }

  public getJamKerja(): string {
    return this.jamKerja;
  }

  public getDaerahKerja(): string {
    return this.daerahKerja;
  }

  public setTarif(tarifBaru: number): void {
    this.tarif = tarifBaru;
  }

  public setJamKerja(jamKerjaBaru: string): void {
    this.jamKerja = jamKerjaBaru;
  }

  public setDaerahKerja(daerahKerjaBaru: string): void {
    this.daerahKerja = daerahKerjaBaru;
  }

  public async saveKategoriJasa(dataJasa: KategoriJasaInput): Promise<KategoriJasaRecord> {
    this.idKategoriJasa = dataJasa.idKategoriJasa || randomUUID();
    this.jenisJasa = dataJasa.jenisJasa.trim();
    this.deskripsiJasa = dataJasa.deskripsiJasa.trim();
    this.tarif = Number(dataJasa.tarif);
    this.jamKerja = dataJasa.jamKerja.trim();
    this.daerahKerja = dataJasa.daerahKerja.trim();

    const saved = await prisma.kategoriJasa.create({
      data: {
        idKategoriJasa: this.idKategoriJasa,
        jenisJasa: this.jenisJasa,
        deskripsiJasa: this.deskripsiJasa,
        tarif: this.tarif,
        jamKerja: this.jamKerja,
        daerahKerja: this.daerahKerja,
      },
    });

    this.dataKategoriJasa = saved;
    return saved;
  }

  /**
   * ALGO-031 & Q-015: Mengambil seluruh daftar kategori jasa terurut alfabetis
   * Query: SELECT id_kategori_jasa, jenis_jasa, deskripsi_jasa, tarif, jam_kerja, daerah_kerja
   *        FROM kategori_jasa ORDER BY jenis_jasa ASC;
   */
  public async getAllKategori(): Promise<KategoriJasaRecord[]> {
    const rows = await prisma.kategoriJasa.findMany({
      orderBy: {
        jenisJasa: 'asc',
      },
    });

    this.dataKategoriJasa = rows;
    return rows;
  }

  /**
   * Mengambil detail kategori jasa berdasarkan ID Kategori Jasa
   */
  public async getKategoriById(idKategoriJasa: string): Promise<KategoriJasaRecord | null> {
    const row = await prisma.kategoriJasa.findUnique({
      where: {
        idKategoriJasa,
      },
    });

    this.dataKategoriJasa = row;
    return row;
  }
}

export default KategoriJasa;