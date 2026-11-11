import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import prisma from '../src/database/prisma';
import { calculateHaversineDistance } from '../src/utils/haversine';
import { KategoriJasa, KategoriJasaInput, KategoriJasaRecord } from '../src/models/KategoriJasa';
import { PemberiJasa, PemberiJasaDetail, SearchServiceFilter } from '../src/models/PemberiJasa';
import { KategoriJasaController } from '../src/controllers/KategoriJasaController';
import { PemberiJasaController } from '../src/controllers/PemberiJasaController';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const KAT_CLEAN_ID = '550e8400-e29b-41d4-a716-446655440001';
const KAT_AC_ID = '550e8400-e29b-41d4-a716-446655440002';
const KAT_PIPE_ID = '550e8400-e29b-41d4-a716-446655440003';

const PJ_AHMAD_ID = '222e8400-e29b-41d4-a716-446655440001';
const PJ_SITI_ID = '222e8400-e29b-41d4-a716-446655440002';
const PJ_DEDI_ID = '222e8400-e29b-41d4-a716-446655440003';

/**
 * Helper pembuat mock Express Request & Response
 */
function createMockReqRes(options: {
  params?: Record<string, string>;
  query?: Record<string, any>;
  body?: Record<string, any>;
}) {
  const req = {
    params: options.params ?? {},
    query: options.query ?? {},
    body: options.body ?? {},
  } as unknown as Request;

  const resObj: { statusCode: number; body: any } = {
    statusCode: 200,
    body: null,
  };

  const res = {
    status(code: number) {
      resObj.statusCode = code;
      return this;
    },
    json(payload: any) {
      resObj.body = payload;
      return this;
    },
  } as unknown as Response;

  return { req, res, resObj };
}

/**
 * In-Memory Mock untuk KategoriJasa (C13) dengan UUID
 */
class MockKategoriJasa extends KategoriJasa {
  public store: KategoriJasaRecord[] = [
    {
      idKategoriJasa: KAT_AC_ID,
      jenisJasa: 'Perbaikan Elektronik & AC',
      deskripsiJasa: 'Servis cuci AC dan perbaikan elektronik rumah tangga',
      tarif: 120000,
      jamKerja: '09:00 - 20:00',
      daerahKerja: 'Seluruh Kota Bandung',
    },
    {
      idKategoriJasa: KAT_CLEAN_ID,
      jenisJasa: 'Jasa Kebersihan Rumah',
      deskripsiJasa: 'Bersih-bersih rumah dan kos menyeluruh',
      tarif: 75000,
      jamKerja: '08:00 - 17:00',
      daerahKerja: 'Coblong, Dago',
    },
    {
      idKategoriJasa: KAT_PIPE_ID,
      jenisJasa: 'Tukang Ledeng & Pipa',
      deskripsiJasa: 'Perbaikan pipa bocor dan saluran air mampet',
      tarif: 95000,
      jamKerja: '07:00 - 18:00',
      daerahKerja: 'Buah Batu',
    },
  ];

  public override async saveKategoriJasa(dataJasa: KategoriJasaInput): Promise<KategoriJasaRecord> {
    const record: KategoriJasaRecord = {
      idKategoriJasa: dataJasa.idKategoriJasa || randomUUID(),
      jenisJasa: dataJasa.jenisJasa.trim(),
      deskripsiJasa: dataJasa.deskripsiJasa.trim(),
      tarif: Number(dataJasa.tarif),
      jamKerja: dataJasa.jamKerja.trim(),
      daerahKerja: dataJasa.daerahKerja.trim(),
    };
    this.idKategoriJasa = record.idKategoriJasa;
    this.setTarif(record.tarif);
    this.setJamKerja(record.jamKerja);
    this.setDaerahKerja(record.daerahKerja);
    this.store.push(record);
    return record;
  }

  public override async getAllKategori(): Promise<KategoriJasaRecord[]> {
    return [...this.store].sort((a, b) => a.jenisJasa.localeCompare(b.jenisJasa));
  }

  public override async getKategoriById(idKategoriJasa: string): Promise<KategoriJasaRecord | null> {
    return this.store.find((item) => item.idKategoriJasa === idKategoriJasa) ?? null;
  }
}

/**
 * In-Memory Mock untuk PemberiJasa (C04) dengan UUID
 */
class MockPemberiJasa extends PemberiJasa {
  public providers: PemberiJasaDetail[] = [
    {
      idPemberiJasa: PJ_AHMAD_ID,
      namaPengguna: 'Ahmad Teknik',
      namaToko: 'Ahmad Jaya AC',
      nomorTelpon: '081298765431',
      email: 'ahmad@cariuang.id',
      avatarUrl: null,
      akumulasiRating: 4.9,
      idKategoriJasa: KAT_AC_ID,
      jenisJasa: 'Perbaikan Elektronik & AC',
      deskripsiJasa: 'Servis cuci AC dan perbaikan elektronik rumah tangga',
      tarif: 120000,
      jamKerja: '09:00 - 20:00',
      daerahKerja: 'Seluruh Kota Bandung',
      latitude: -6.8915, // ITB Ganesha (terdekat dari user di -6.8900, 107.6100)
      longitude: 107.6107,
      statusKetersediaan: 'Available',
      isOnline: true,
    },
    {
      idPemberiJasa: PJ_SITI_ID,
      namaPengguna: 'Siti Bersih',
      namaToko: 'Kinclong Home Cleaning',
      nomorTelpon: '081298765432',
      email: 'siti@cariuang.id',
      avatarUrl: null,
      akumulasiRating: 4.7,
      idKategoriJasa: KAT_CLEAN_ID,
      jenisJasa: 'Jasa Kebersihan Rumah',
      deskripsiJasa: 'Bersih-bersih rumah dan kos menyeluruh',
      tarif: 75000,
      jamKerja: '08:00 - 17:00',
      daerahKerja: 'Coblong, Dago',
      latitude: -6.8850, // Cisitu (kedua terdekat)
      longitude: 107.6135,
      statusKetersediaan: 'Available',
      isOnline: true,
    },
    {
      idPemberiJasa: PJ_DEDI_ID,
      namaPengguna: 'Kang Dedi Pipa',
      namaToko: 'Dedi Plumbing Bandung',
      nomorTelpon: '081298765433',
      email: 'dedi@cariuang.id',
      avatarUrl: null,
      akumulasiRating: 4.5,
      idKategoriJasa: KAT_PIPE_ID,
      jenisJasa: 'Tukang Ledeng & Pipa',
      deskripsiJasa: 'Perbaikan pipa bocor dan saluran air mampet',
      tarif: 95000,
      jamKerja: '07:00 - 18:00',
      daerahKerja: 'Buah Batu',
      latitude: -6.9430, // Buah Batu (terjauh)
      longitude: 107.6335,
      statusKetersediaan: 'Available',
      isOnline: true,
    },
  ];

  public override async getPemberiJasaByID(idPemberiJasa: string): Promise<PemberiJasaDetail | null> {
    return this.providers.find((p) => p.idPemberiJasa === idPemberiJasa) ?? null;
  }

  public override async getPemberiJasaByKategori(idKategoriJasa: string): Promise<PemberiJasaDetail[]> {
    return this.providers.filter((p) => p.idKategoriJasa === idKategoriJasa);
  }

  public override async savePemberiJasa(
    idPemberiJasa?: string,
    idKategoriJasa?: string,
    extraData?: { namaToko?: string; latitude?: number; longitude?: number }
  ): Promise<PemberiJasaDetail | null> {
    const targetId = idPemberiJasa || this.getIDPemberiJasa();
    const targetKatId = idKategoriJasa || this.getIDKategoriJasa();
    const existing = this.providers.find((p) => p.idPemberiJasa === targetId);
    if (!existing) {
      throw new Error('Pengguna tidak ditemukan');
    }
    existing.idKategoriJasa = targetKatId;
    existing.role = 'PEMBERI_JASA';
    if (extraData?.namaToko !== undefined) existing.namaToko = extraData.namaToko;
    if (extraData?.latitude !== undefined) existing.latitude = extraData.latitude;
    if (extraData?.longitude !== undefined) existing.longitude = extraData.longitude;
    return existing;
  }

  public override async searchPemberiJasa(filter: SearchServiceFilter): Promise<PemberiJasaDetail[]> {
    return this.providers.filter((p) => {
      if (filter.idKategoriJasa && p.idKategoriJasa !== filter.idKategoriJasa) {
        return false;
      }
      if (filter.keyword && filter.keyword.trim() !== '') {
        const q = filter.keyword.trim().toLowerCase();
        const match =
          (p.jenisJasa?.toLowerCase().includes(q) ?? false) ||
          p.namaToko.toLowerCase().includes(q) ||
          p.namaPengguna.toLowerCase().includes(q) ||
          (p.deskripsiJasa?.toLowerCase().includes(q) ?? false) ||
          (p.daerahKerja?.toLowerCase().includes(q) ?? false);
        if (!match) return false;
      }
      return true;
    });
  }
}

describe('Issue #5: Backend Pendaftaran Jasa, Katalog Kategori, dan Pencarian Terdekat (Haversine)', () => {
  describe('1. Utility Formula Haversine (KNF05 & KNF06)', () => {
    it('mengembalikan jarak 0 km untuk titik koordinat yang identik', () => {
      expect(calculateHaversineDistance(-6.8915, 107.6107, -6.8915, 107.6107)).toBe(0);
    });

    it('menghitung jarak GPS secara akurat antara ITB Ganesha, Cisitu, dan Buah Batu', () => {
      const dNear = calculateHaversineDistance(-6.8915, 107.6107, -6.8850, 107.6135);
      const dFar = calculateHaversineDistance(-6.8915, 107.6107, -6.9430, 107.6335);

      expect(dNear).toBeGreaterThan(0);
      expect(dNear).toBeLessThan(1.5);
      expect(dFar).toBeGreaterThan(5);
      expect(dNear).toBeLessThan(dFar);
    });
  });

  describe('2. Kelas C13 KategoriJasa & C15 KategoriJasaController', () => {
    it('mengimplementasikan getter dan setter sesuai ALGO-022 s.d. ALGO-029', () => {
      const sampleId = randomUUID();
      const kategori = new KategoriJasa({
        idKategoriJasa: sampleId,
        jenisJasa: 'Servis Komputer',
        deskripsiJasa: 'Instal ulang dan perbaikan laptop',
        tarif: 100000,
        jamKerja: '08:00 - 16:00',
        daerahKerja: 'Bandung',
      });

      expect(kategori.getIDKategoriJasa()).toBe(sampleId);
      expect(kategori.getJenisJasa()).toBe('Servis Komputer');
      expect(kategori.getDeskripsiJasa()).toBe('Instal ulang dan perbaikan laptop');
      expect(kategori.getTarif()).toBe(100000);

      kategori.setTarif(150000);
      kategori.setJamKerja('09:00 - 17:00');
      kategori.setDaerahKerja('Bandung Raya');

      expect(kategori.getTarif()).toBe(150000);
      expect(kategori.getJamKerja()).toBe('09:00 - 17:00');
      expect(kategori.getDaerahKerja()).toBe('Bandung Raya');
    });

    it('[Acceptance Criteria #1] mengembalikan daftar seluruh kategori terurut alfabetis (ALGO-031, Q-015)', async () => {
      const mockKategori = new MockKategoriJasa();
      const kCtrl = new KategoriJasaController(mockKategori, new PemberiJasaController(new MockPemberiJasa()));

      const categories = await kCtrl.fetchAllKategoriJasa();
      expect(categories).toHaveLength(3);
      expect(categories.map((c: KategoriJasaRecord) => c.jenisJasa)).toEqual([
        'Jasa Kebersihan Rumah',
        'Perbaikan Elektronik & AC',
        'Tukang Ledeng & Pipa',
      ]);
      expect(categories[0].idKategoriJasa).toMatch(UUID_REGEX);
    });

    it('[Acceptance Criteria #3] menolak tarif negatif atau field kosong pada validateKategoriJasa (ALGO-033)', () => {
      const kCtrl = new KategoriJasaController(new MockKategoriJasa(), new PemberiJasaController(new MockPemberiJasa()));

      expect(
        kCtrl.validateKategoriJasa({
          jenisJasa: 'Jasa Taman',
          deskripsiJasa: 'Potong rumput',
          tarif: -10000,
          jamKerja: '08:00 - 15:00',
          daerahKerja: 'Bandung',
        })
      ).toBe(false);

      expect(
        kCtrl.validateKategoriJasa({
          jenisJasa: '   ',
          deskripsiJasa: 'Potong rumput',
          tarif: 50000,
          jamKerja: '08:00 - 15:00',
          daerahKerja: 'Bandung',
        })
      ).toBe(false);

      expect(
        kCtrl.validateKategoriJasa({
          jenisJasa: 'Jasa Taman',
          deskripsiJasa: 'Potong rumput dan perapihan taman',
          tarif: 85000,
          jamKerja: '08:00 - 15:00',
          daerahKerja: 'Bandung Utara',
        })
      ).toBe(true);
    });

    it('menyimpan kategori baru dengan UUID otomatis dan memperbarui data PemberiJasa (ALGO-034 & ALGO-035)', async () => {
      const mockKategori = new MockKategoriJasa();
      const mockPemberi = new MockPemberiJasa();
      const pCtrl = new PemberiJasaController(mockPemberi);
      const kCtrl = new KategoriJasaController(mockKategori, pCtrl);

      const submitted = await kCtrl.submitFormKategoriJasa({
        jenisJasa: 'Jasa Angkut Barang',
        deskripsiJasa: 'Pindahan kos dan rumah',
        tarif: 200000,
        jamKerja: '08:00 - 21:00',
        daerahKerja: 'Bandung Raya',
        idPemberiJasa: PJ_AHMAD_ID,
        namaToko: 'Ahmad Express Transport',
      });

      expect(submitted.kategori.idKategoriJasa).toMatch(UUID_REGEX);
      expect(submitted.pemberiJasa?.idKategoriJasa).toBe(submitted.kategori.idKategoriJasa);
      expect(submitted.pemberiJasa?.namaToko).toBe('Ahmad Express Transport');
      expect(kCtrl.confirmDataTersimpan()).toBe(true);
    });
  });

  describe('3. Kelas C04 PemberiJasa & C06 PemberiJasaController (Pencarian & Sorting)', () => {
    it('[Acceptance Criteria #2] mengurutkan hasil pencarian berdasarkan jarak terdekat Haversine (KNF05)', async () => {
      const pCtrl = new PemberiJasaController(new MockPemberiJasa());

      const nearest = await pCtrl.searchServices({
        lat: -6.8900,
        long: 107.6100,
        sortBy: 'nearest',
      });

      expect(nearest).toHaveLength(3);
      expect(nearest[0].idPemberiJasa).toBe(PJ_AHMAD_ID); // Ahmad Teknik (ITB)
      expect(nearest[1].idPemberiJasa).toBe(PJ_SITI_ID); // Siti Bersih (Cisitu)
      expect(nearest[2].idPemberiJasa).toBe(PJ_DEDI_ID); // Kang Dedi (Buah Batu)
      expect(nearest[0].jarakKm!).toBeLessThan(nearest[1].jarakKm!);
      expect(nearest[1].jarakKm!).toBeLessThan(nearest[2].jarakKm!);
    });

    it('mengurutkan berdasarkan Rating Terbaik (DESC) dan Termurah (tarif ASC)', async () => {
      const pCtrl = new PemberiJasaController(new MockPemberiJasa());

      const bestRated = await pCtrl.searchServices({ sortBy: 'rating' });
      expect(bestRated.map((p) => p.idPemberiJasa)).toEqual([PJ_AHMAD_ID, PJ_SITI_ID, PJ_DEDI_ID]);

      const cheapest = await pCtrl.searchServices({ sortBy: 'cheapest' });
      expect(cheapest.map((p) => p.idPemberiJasa)).toEqual([PJ_SITI_ID, PJ_DEDI_ID, PJ_AHMAD_ID]);
    });

    it('mengambil detail profil lengkap PemberiJasa berdasarkan ID (ALGO-002, Q-002)', async () => {
      const pCtrl = new PemberiJasaController(new MockPemberiJasa());
      const detail = await pCtrl.fetchPemberiJasaById(PJ_AHMAD_ID);

      expect(detail).not.toBeNull();
      expect(detail?.namaPengguna).toBe('Ahmad Teknik');
      expect(detail?.tarif).toBe(120000);
      expect(detail?.jamKerja).toBe('09:00 - 20:00');
      expect(detail?.daerahKerja).toBe('Seluruh Kota Bandung');
    });
  });

  describe('4. HTTP Route Handlers Integration (/api/services)', () => {
    const kCtrl = new KategoriJasaController();
    const pCtrl = new PemberiJasaController();

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('GET /api/services/categories mengembalikan 200 beserta daftar kategori terurut alfabetis dengan UUID', async () => {
      jest.spyOn(prisma.kategoriJasa, 'findMany').mockResolvedValue([
        {
          idKategoriJasa: KAT_CLEAN_ID,
          jenisJasa: 'Jasa Kebersihan Rumah',
          deskripsiJasa: 'Bersih-bersih rumah',
          tarif: 75000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Bandung Utara',
        },
        {
          idKategoriJasa: KAT_AC_ID,
          jenisJasa: 'Perbaikan Elektronik & AC',
          deskripsiJasa: 'Servis AC',
          tarif: 120000,
          jamKerja: '09:00 - 20:00',
          daerahKerja: 'Bandung',
        },
      ]);

      const { req, res, resObj } = createMockReqRes({});
      await kCtrl.getAllCategoriesHandler(req, res);

      expect(resObj.statusCode).toBe(200);
      expect(resObj.body.success).toBe(true);
      expect(resObj.body.data).toHaveLength(2);
      expect(resObj.body.data[0].idKategoriJasa).toBe(KAT_CLEAN_ID);
      expect(resObj.body.data[0].jenisJasa).toBe('Jasa Kebersihan Rumah');
    });

    it('POST /api/services/register mengembalikan 400 jika tarif negatif atau field kosong', async () => {
      const { req: reqNeg, res: resNeg, resObj: resObjNeg } = createMockReqRes({
        body: {
          jenisJasa: 'Jasa Kebersihan',
          deskripsiJasa: 'Bersih rumah',
          tarif: -5000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Bandung',
        },
      });
      await kCtrl.createCategoryAndBindServiceHandler(reqNeg, resNeg);
      expect(resObjNeg.statusCode).toBe(400);
      expect(resObjNeg.body.success).toBe(false);

      const { req: reqEmpty, res: resEmpty, resObj: resObjEmpty } = createMockReqRes({
        body: {
          jenisJasa: '',
          deskripsiJasa: 'Bersih rumah',
          tarif: 50000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Bandung',
        },
      });
      await kCtrl.createCategoryAndBindServiceHandler(reqEmpty, resEmpty);
      expect(resObjEmpty.statusCode).toBe(400);
      expect(resObjEmpty.body.success).toBe(false);
    });

    it('GET /api/services/search mengembalikan penyedia jasa terurut terdekat berdasarkan koordinat user', async () => {
      jest.spyOn(prisma.pemberiJasa, 'findMany').mockResolvedValue([
        {
          idPemberiJasa: PJ_DEDI_ID,
          namaToko: 'Plumbing Jauh',
          idKategoriJasa: KAT_PIPE_ID,
          jenisJasa: 'Tukang Ledeng',
          latitude: -6.9430,
          longitude: 107.6335,
          statusKetersediaan: 'Available',
          isOnline: true,
          version: 1,
          pengguna: {
            idPengguna: PJ_DEDI_ID,
            namaPengguna: 'Kang Dedi',
            username: 'dedi',
            password: 'pw',
            email: 'dedi@test.id',
            nomorTelpon: '08111',
            role: 'PEMBERI_JASA',
            avatarUrl: null,
            akumulasiRating: 4.5,
            riwayatRating: [4.5],
          },
          kategoriJasa: {
            idKategoriJasa: KAT_PIPE_ID,
            jenisJasa: 'Tukang Ledeng',
            deskripsiJasa: 'Perbaikan pipa',
            tarif: 95000,
            jamKerja: '07:00 - 18:00',
            daerahKerja: 'Buah Batu',
          },
        },
        {
          idPemberiJasa: PJ_AHMAD_ID,
          namaToko: 'AC Dekat ITB',
          idKategoriJasa: KAT_AC_ID,
          jenisJasa: 'Perbaikan AC',
          latitude: -6.8915,
          longitude: 107.6107,
          statusKetersediaan: 'Available',
          isOnline: true,
          version: 1,
          pengguna: {
            idPengguna: PJ_AHMAD_ID,
            namaPengguna: 'Ahmad Teknik',
            username: 'ahmad',
            password: 'pw',
            email: 'ahmad@test.id',
            nomorTelpon: '08222',
            role: 'PEMBERI_JASA',
            avatarUrl: null,
            akumulasiRating: 4.9,
            riwayatRating: [4.9],
          },
          kategoriJasa: {
            idKategoriJasa: KAT_AC_ID,
            jenisJasa: 'Perbaikan AC',
            deskripsiJasa: 'Servis AC',
            tarif: 120000,
            jamKerja: '09:00 - 20:00',
            daerahKerja: 'Dago',
          },
        },
      ] as any);

      const { req, res, resObj } = createMockReqRes({
        query: { lat: '-6.8900', long: '107.6100', sortBy: 'nearest' },
      });
      await pCtrl.searchServicesHandler(req, res);

      expect(resObj.statusCode).toBe(200);
      expect(resObj.body.success).toBe(true);
      expect(resObj.body.data).toHaveLength(2);
      expect(resObj.body.data[0].idPemberiJasa).toBe(PJ_AHMAD_ID);
      expect(resObj.body.data[1].idPemberiJasa).toBe(PJ_DEDI_ID);
      expect(resObj.body.data[0].jarakKm).toBeLessThan(resObj.body.data[1].jarakKm);
    });
  });

  describe('5. Issue #6: Pendaftaran Penyedia Jasa (UC01)', () => {
    it('POST /api/services/register mengembalikan 201, mengubah role menjadi PEMBERI_JASA, dan menyimpan namaToko', async () => {
      const mockKategori = new MockKategoriJasa();
      const mockPemberi = new MockPemberiJasa();
      const kCtrl = new KategoriJasaController(
        mockKategori,
        new PemberiJasaController(mockPemberi)
      );

      const { req, res, resObj } = createMockReqRes({
        body: {
          idPemberiJasa: PJ_AHMAD_ID,
          namaToko: 'Ahmad Servis Terpadu',
          jenisJasa: 'Servis',
          deskripsiJasa: 'Servis berbagai peralatan elektronik rumah tangga bergaransi.',
          tarif: 85000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Coblong, Dago, Bandung Utara',
        },
      });

      await kCtrl.registerServiceProviderHandler(req, res);

      expect(resObj.statusCode).toBe(201);
      expect(resObj.body.success).toBe(true);
      expect(resObj.body.data.role).toBe('PEMBERI_JASA');
      expect(resObj.body.data.pemberiJasa.namaToko).toBe('Ahmad Servis Terpadu');
      expect(resObj.body.data.pemberiJasa.role).toBe('PEMBERI_JASA');
    });

    it('POST /api/services/register mengembalikan 400 jika namaToko kosong', async () => {
      const kCtrl = new KategoriJasaController(
        new MockKategoriJasa(),
        new PemberiJasaController(new MockPemberiJasa())
      );

      const { req, res, resObj } = createMockReqRes({
        body: {
          idPemberiJasa: PJ_AHMAD_ID,
          namaToko: '   ',
          jenisJasa: 'Servis',
          deskripsiJasa: 'Servis peralatan elektronik rumah tangga.',
          tarif: 85000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Bandung',
        },
      });

      await kCtrl.registerServiceProviderHandler(req, res);

      expect(resObj.statusCode).toBe(400);
      expect(resObj.body.success).toBe(false);
    });

    it('POST /api/services/register mengembalikan 400 jika idPemberiJasa tidak dikirim', async () => {
      const kCtrl = new KategoriJasaController(
        new MockKategoriJasa(),
        new PemberiJasaController(new MockPemberiJasa())
      );

      const { req, res, resObj } = createMockReqRes({
        body: {
          namaToko: 'Toko Servis Baru',
          jenisJasa: 'Servis',
          deskripsiJasa: 'Servis peralatan elektronik rumah tangga.',
          tarif: 85000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Bandung',
        },
      });

      await kCtrl.registerServiceProviderHandler(req, res);

      expect(resObj.statusCode).toBe(400);
      expect(resObj.body.success).toBe(false);
    });

    it('POST /api/services/register mengembalikan 404 jika idPemberiJasa tidak dikenal', async () => {
      const kCtrl = new KategoriJasaController(
        new MockKategoriJasa(),
        new PemberiJasaController(new MockPemberiJasa())
      );

      const { req, res, resObj } = createMockReqRes({
        body: {
          idPemberiJasa: '999e8400-e29b-41d4-a716-446655449999',
          namaToko: 'Toko Tidak Dikenal',
          jenisJasa: 'Servis',
          deskripsiJasa: 'Servis peralatan elektronik rumah tangga.',
          tarif: 85000,
          jamKerja: '08:00 - 17:00',
          daerahKerja: 'Bandung',
        },
      });

      await kCtrl.registerServiceProviderHandler(req, res);

      expect(resObj.statusCode).toBe(404);
      expect(resObj.body.success).toBe(false);
    });
  });
});
