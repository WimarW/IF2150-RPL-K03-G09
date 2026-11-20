import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { RatingController } from '../src/controllers/RatingController';
import { Rating } from '../src/models/Rating';
import { Pengguna } from '../src/models/Pengguna';
import prisma from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const ratings: any[] = [];
  const users = new Map<string, any>([
    [
      'user-pelanggan-1',
      {
        idPengguna: 'user-pelanggan-1',
        namaPengguna: 'Pelanggan Test',
        username: 'pelanggantest',
        role: Role.PELANGGAN,
        avatarUrl: null,
        akumulasiRating: 0.0,
        riwayatRating: [],
      },
    ],
    [
      'user-mitra-1',
      {
        idPengguna: 'user-mitra-1',
        namaPengguna: 'Mitra Test',
        username: 'mitratest',
        role: Role.PEMBERI_JASA,
        avatarUrl: null,
        akumulasiRating: 0.0,
        riwayatRating: [],
      },
    ],
    [
      'user-mitra-multi',
      {
        idPengguna: 'user-mitra-multi',
        namaPengguna: 'Mitra Multi Rating',
        username: 'mitramulti',
        role: Role.PEMBERI_JASA,
        avatarUrl: 'https://cdn.example.com/avatar-mitra.png',
        akumulasiRating: 0.0,
        riwayatRating: [],
      },
    ],
  ]);

  const contracts = new Map<string, any>([
    [
      'contract-done-1',
      {
        idKontrakPekerjaan: 'contract-done-1',
        idPelanggan: 'user-pelanggan-1',
        idPemberiJasa: 'user-mitra-1',
        statusPekerjaan: 'Done',
        hasRating: false,
        detailPekerjaan: 'Reparasi AC',
        persetujuanHarga: 120000,
        createdAt: new Date('2026-11-10T08:00:00Z'),
      },
    ],
    [
      'contract-pending-1',
      {
        idKontrakPekerjaan: 'contract-pending-1',
        idPelanggan: 'user-pelanggan-1',
        idPemberiJasa: 'user-mitra-1',
        statusPekerjaan: 'On Progress',
        hasRating: false,
        detailPekerjaan: 'Reparasi Pipa',
        persetujuanHarga: 90000,
        createdAt: new Date('2026-11-11T08:00:00Z'),
      },
    ],
    [
      'contract-simpan-1',
      {
        idKontrakPekerjaan: 'contract-simpan-1',
        idPelanggan: 'user-pelanggan-1',
        idPemberiJasa: 'user-mitra-multi',
        statusPekerjaan: 'Done',
        hasRating: false,
        detailPekerjaan: 'Instalasi Listrik',
        persetujuanHarga: 150000,
        createdAt: new Date('2026-11-12T08:00:00Z'),
      },
    ],
  ]);

  const pickFields = (row: any, select?: Record<string, boolean>) => {
    if (!row) return null;
    if (!select) return { ...row };
    const picked: Record<string, unknown> = {};
    for (const key of Object.keys(select)) {
      if (select[key]) {
        picked[key] = row[key];
      }
    }
    return picked;
  };

  const mockDelegates: Record<string, any> = {
    rating: {
      findFirst: jest.fn(async ({ where }: { where: any }) => {
        return (
          ratings.find(
            (r) =>
              r.idKontrakPekerjaan === where.idKontrakPekerjaan &&
              r.idPenggunaPemberi === where.idPenggunaPemberi
          ) ?? null
        );
      }),
      create: jest.fn(async ({ data }: { data: any }) => {
        const created = {
          ...data,
          tanggalRating: data.tanggalRating ?? new Date(),
        };
        ratings.push(created);
        return created;
      }),
      findMany: jest.fn(async ({ where, include, orderBy }: any) => {
        let filtered = ratings.filter(
          (r) => r.idPenggunaPenerima === where.idPenggunaPenerima
        );

        if (orderBy?.tanggalRating === 'desc') {
          filtered = [...filtered].sort(
            (a, b) =>
              new Date(b.tanggalRating).getTime() - new Date(a.tanggalRating).getTime()
          );
        }

        return filtered.map((r) => {
          const item: any = { ...r };
          if (include?.pemberi) {
            const pemberiRow = users.get(r.idPenggunaPemberi) ?? null;
            item.pemberi = pickFields(pemberiRow, include.pemberi.select);
          }
          if (include?.kontrak) {
            const kontrakRow = contracts.get(r.idKontrakPekerjaan) ?? null;
            item.kontrak = pickFields(kontrakRow, include.kontrak.select);
          }
          return item;
        });
      }),
    },
    kontrakPekerjaan: {
      findUnique: jest.fn(async ({ where }: { where: any }) => {
        return contracts.get(where.idKontrakPekerjaan) ?? null;
      }),
      update: jest.fn(async ({ where, data }: { where: any; data: any }) => {
        const item = contracts.get(where.idKontrakPekerjaan);
        if (item) {
          Object.assign(item, data);
        }
        return item;
      }),
    },
    pengguna: {
      findUnique: jest.fn(async ({ where, select }: any) => {
        const user = users.get(where.idPengguna) ?? null;
        return pickFields(user, select);
      }),
      update: jest.fn(async ({ where, data }: { where: any; data: any }) => {
        const item = users.get(where.idPengguna);
        if (item) {
          if (data.riwayatRating?.set) {
            item.riwayatRating = data.riwayatRating.set;
          }
          if (data.akumulasiRating !== undefined) {
            item.akumulasiRating = data.akumulasiRating;
          }
        }
        return item;
      }),
    },
    $transaction: jest.fn(async (callback: any): Promise<any> => {
      return callback(mockDelegates);
    }),
  };

  return {
    __esModule: true,
    default: mockDelegates,
    prisma: mockDelegates,
  };
});

function createMockResponse() {
  const res: Partial<Response> = {};
  res.statusCode = 200;
  res.status = jest.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn().mockImplementation((data: any) => {
    (res as any).body = data;
    return res;
  });
  return res as Response & { statusCode: number; body: any };
}

describe('Rating System Unit & Integration Tests [KF19, KF20 | UC10 | ALGO-056 s.d. ALGO-064]', () => {
  describe('RatingController.validateRatingValue [KF19 | ALGO-064]', () => {
    it('[KF19 | ALGO-064] returns true for valid parameters', () => {
      const isValid = RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', 5);
      expect(isValid).toBe(true);
    });

    it('[KF19 | ALGO-064] returns false if rating value is out of bounds', () => {
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', 0)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', 6)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', NaN)).toBe(false);
    });

    it('[KF19 | ALGO-064] returns false if any required ID is missing or empty', () => {
      expect(RatingController.validateRatingValue('', 'penerima-1', 'kontrak-1', 5)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', '   ', 'kontrak-1', 5)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', '', 5)).toBe(false);
    });
  });

  describe('Rating.makeRating & Model Getters [KF19, KF20 | ALGO-057, ALGO-059 s.d. ALGO-063]', () => {
    it('[KF19 | ALGO-057] safely handles non-string ulasan without crashing', () => {
      // @ts-expect-error test invalid ulasan type
      const rating = Rating.makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 4, 12345, ['cepat']);
      expect(rating.getUlasan()).toBeNull();
      expect(rating.getRatingValue()).toBe(4);
    });

    it('[KF19 | ALGO-057] safely filters invalid non-string items in tags', () => {
      // @ts-expect-error test mixed tags
      const rating = Rating.makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 5, 'Bagus', ['tepat waktu', 99, null]);
      expect(rating.getTags()).toEqual(['tepat waktu']);
    });

    it('[KF19 | ALGO-057] sets nilaiRating to -1 if out of bounds', () => {
      const rating = Rating.makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 0);
      expect(rating.getRatingValue()).toBe(-1);
    });

    it('[KF20 | ALGO-059 s.d. ALGO-063] mengembalikan seluruh atribut melalui getter dan toJSON()', () => {
      const rating = Rating.makeRating(
        '  rating-059  ',
        '  pemberi-060  ',
        '  penerima-061  ',
        '  kontrak-062  ',
        4.5,
        '  Pengerjaan rapi  ',
        ['rapi', 'ramah']
      );

      expect(rating.getIdRating()).toBe('rating-059');
      expect(rating.getIdPemberi()).toBe('pemberi-060');
      expect(rating.getIdPenerima()).toBe('penerima-061');
      expect(rating.getIdKontrakPekerjaan()).toBe('kontrak-062');
      expect(rating.getRatingValue()).toBe(4.5);
      expect(rating.getTanggalRating()).toBeInstanceOf(Date);
      expect(rating.getUlasan()).toBe('Pengerjaan rapi');
      expect(rating.getTags()).toEqual(['rapi', 'ramah']);

      expect(rating.toJSON()).toEqual({
        idRating: 'rating-059',
        idPenggunaPemberi: 'pemberi-060',
        idPenggunaPenerima: 'penerima-061',
        idKontrakPekerjaan: 'kontrak-062',
        nilaiRating: 4.5,
        ulasan: 'Pengerjaan rapi',
        tags: ['rapi', 'ramah'],
        tanggalRating: rating.getTanggalRating(),
      });
    });
  });

  describe('Two-Way Rating Flow [KF19, KF20 | UC10 | ALGO-056, ALGO-058]', () => {
    it('[KF19, KF20 | UC10] allows Pelanggan to rate Mitra on completed contract', async () => {
      const req = {
        user: { idPengguna: 'user-pelanggan-1' },
        body: {
          idKontrakPekerjaan: 'contract-done-1',
          nilaiRating: 5,
          ulasan: 'Pelayanan sangat memuaskan!',
          tags: ['ramah', 'cepat'],
        },
      } as unknown as Request<any, any, any>;

      const res = createMockResponse();
      await RatingController.createRating(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.penerima.akumulasiRating).toBe(5);
    });

    it('[KF19, KF20 | UC10] allows Mitra to rate Pelanggan on the same contract (Two-Way)', async () => {
      const req = {
        user: { idPengguna: 'user-mitra-1' },
        body: {
          idKontrakPekerjaan: 'contract-done-1',
          nilaiRating: 4,
          ulasan: 'Pelanggan komunikatif',
          tags: ['ramah'],
        },
      } as unknown as Request<any, any, any>;

      const res = createMockResponse();
      await RatingController.createRating(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.penerima.akumulasiRating).toBe(4);
    });

    it('[KF19 | UC10] rejects double rating from the same user for the same contract', async () => {
      const req = {
        user: { idPengguna: 'user-pelanggan-1' },
        body: {
          idKontrakPekerjaan: 'contract-done-1',
          nilaiRating: 5,
        },
      } as unknown as Request<any, any, any>;

      const res = createMockResponse();
      await RatingController.createRating(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/sudah memberikan rating/i);
    });

    it('[KF19 | UC10] rejects rating if contract status is not Done', async () => {
      const req = {
        user: { idPengguna: 'user-pelanggan-1' },
        body: {
          idKontrakPekerjaan: 'contract-pending-1',
          nilaiRating: 5,
        },
      } as unknown as Request<any, any, any>;

      const res = createMockResponse();
      await RatingController.createRating(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/belum berstatus Done/i);
    });
  });

  describe('Penyimpanan DB & Kalkulasi Rata-Rata Array PostgreSQL [KF20 | ALGO-056, ALGO-058]', () => {
    it('[KF20 | ALGO-056] Rating.simpanKeDb melempar error jika nilaiRating === -1', async () => {
      const invalidRating = Rating.makeRating(
        'rating-invalid-save',
        'user-pelanggan-1',
        'user-mitra-multi',
        'contract-simpan-1',
        6
      );

      expect(invalidRating.getRatingValue()).toBe(-1);
      await expect(invalidRating.simpanKeDb()).rejects.toThrow(/tidak valid/i);
    });

    it('[KF20 | ALGO-056] Rating.simpanKeDb menyimpan entri rating dan memperbarui hasRating = true pada kontrak', async () => {
      const validRating = Rating.makeRating(
        'rating-simpan-1',
        'user-pelanggan-1',
        'user-mitra-multi',
        'contract-simpan-1',
        5,
        'Sangat bagus',
        ['profesional']
      );

      await validRating.simpanKeDb();

      const updatedContract = await prisma.kontrakPekerjaan.findUnique({
        where: { idKontrakPekerjaan: 'contract-simpan-1' },
      });
      expect(updatedContract?.hasRating).toBe(true);
    });

    it('[KF20 | ALGO-058] Rating.updateRatingPengguna mengakumulasi multi-rating pada array riwayatRating dengan pembulatan 2 desimal', async () => {
      const r1 = Rating.makeRating(
        'rating-multi-1',
        'user-pelanggan-1',
        'user-mitra-multi',
        'contract-simpan-1',
        5,
        'Mantap'
      );
      await prisma.rating.create({ data: r1.toJSON() });
      const res1 = await r1.updateRatingPengguna();
      expect(res1.riwayatRating).toEqual([5]);
      expect(res1.akumulasiRating).toBe(5);

      const r2 = Rating.makeRating(
        'rating-multi-2',
        'user-pelanggan-1',
        'user-mitra-multi',
        'contract-simpan-1',
        4,
        'Bagus'
      );
      await prisma.rating.create({ data: r2.toJSON() });
      const res2 = await r2.updateRatingPengguna();
      expect(res2.riwayatRating).toEqual([5, 4]);
      expect(res2.akumulasiRating).toBe(4.5);

      const r3 = Rating.makeRating(
        'rating-multi-3',
        'user-pelanggan-1',
        'user-mitra-multi',
        'contract-simpan-1',
        4,
        'Cukup cepat'
      );
      await prisma.rating.create({ data: r3.toJSON() });
      const res3 = await r3.updateRatingPengguna();
      expect(res3.riwayatRating).toEqual([5, 4, 4]);
      expect(res3.akumulasiRating).toBe(4.33);
    });

    it('[KF20 | ALGO-058] Rating.updateRatingPengguna melempar error jika nilaiRating === -1 atau pengguna penerima tidak ditemukan', async () => {
      const invalidRating = Rating.makeRating(
        'rating-invalid-update',
        'user-pelanggan-1',
        'user-mitra-multi',
        'contract-simpan-1',
        0
      );
      await expect(invalidRating.updateRatingPengguna()).rejects.toThrow(/tidak valid/i);

      const unknownReceiverRating = Rating.makeRating(
        'rating-unknown-user',
        'user-pelanggan-1',
        'user-tidak-ada',
        'contract-simpan-1',
        5
      );
      await expect(unknownReceiverRating.updateRatingPengguna()).rejects.toThrow(
        /tidak ditemukan/i
      );
    });

    it('[KF20 | ALGO-058] Pengguna.addNewRatingRiwayat memperbarui array rating beserta rata-rata 2 desimal dan menolak skor < 1 atau > 5', () => {
      const pengguna = new Pengguna({ idPengguna: 'u-local-1' });

      pengguna.addNewRatingRiwayat(5);
      expect(pengguna.getRiwayatRating()).toEqual([5]);
      expect(pengguna.getAkumulasiRating()).toBe(5);

      pengguna.addNewRatingRiwayat(4);
      expect(pengguna.getRiwayatRating()).toEqual([5, 4]);
      expect(pengguna.getAkumulasiRating()).toBe(4.5);

      pengguna.addNewRatingRiwayat(4);
      expect(pengguna.getRiwayatRating()).toEqual([5, 4, 4]);
      expect(pengguna.getAkumulasiRating()).toBe(4.33);

      expect(() => pengguna.addNewRatingRiwayat(0)).toThrow(/rentang 1 hingga 5/i);
      expect(() => pengguna.addNewRatingRiwayat(6)).toThrow(/rentang 1 hingga 5/i);

      const penggunaBatas = new Pengguna({ idPengguna: 'u-local-batas' });
      penggunaBatas.addNewRatingRiwayat(1);
      penggunaBatas.addNewRatingRiwayat(5);
      expect(penggunaBatas.getRiwayatRating()).toEqual([1, 5]);
      expect(penggunaBatas.getAkumulasiRating()).toBe(3);
    });
  });

  describe('Validasi Negatif & Error Handling RatingController [C27 | KF19, KF20]', () => {
    it('[C27] createRating menolak 401 unauth, 400 payload invalid (kontrak/nilai/ulasan/tags/penerima), 404 kontrak tidak ada, dan 403 bukan peserta kontrak', async () => {
      // 401: tanpa user login
      const reqUnauth = { body: { idKontrakPekerjaan: 'contract-done-1', nilaiRating: 5 } } as unknown as Request;
      const resUnauth = createMockResponse();
      await RatingController.createRating(reqUnauth, resUnauth);
      expect(resUnauth.statusCode).toBe(401);

      // 400: idKontrakPekerjaan kosong
      const reqNoContract = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: { idKontrakPekerjaan: '   ', nilaiRating: 5 },
      } as unknown as Request;
      const resNoContract = createMockResponse();
      await RatingController.createRating(reqNoContract, resNoContract);
      expect(resNoContract.statusCode).toBe(400);

      // 400: nilaiRating di luar 1..5
      const reqBadScore = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: { idKontrakPekerjaan: 'contract-done-1', nilaiRating: 6 },
      } as unknown as Request;
      const resBadScore = createMockResponse();
      await RatingController.createRating(reqBadScore, resBadScore);
      expect(resBadScore.statusCode).toBe(400);

      // 400: ulasan bukan string
      const reqBadUlasan = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: { idKontrakPekerjaan: 'contract-done-1', nilaiRating: 5, ulasan: 12345 },
      } as unknown as Request;
      const resBadUlasan = createMockResponse();
      await RatingController.createRating(reqBadUlasan, resBadUlasan);
      expect(resBadUlasan.statusCode).toBe(400);

      // 400: tags bukan array of string
      const reqBadTags = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: { idKontrakPekerjaan: 'contract-done-1', nilaiRating: 5, tags: [123, true] },
      } as unknown as Request;
      const resBadTags = createMockResponse();
      await RatingController.createRating(reqBadTags, resBadTags);
      expect(resBadTags.statusCode).toBe(400);

      // 404: kontrak tidak ditemukan
      const reqNotFound = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: { idKontrakPekerjaan: 'contract-missing', nilaiRating: 5 },
      } as unknown as Request;
      const resNotFound = createMockResponse();
      await RatingController.createRating(reqNotFound, resNotFound);
      expect(resNotFound.statusCode).toBe(404);

      // 403: bukan pihak dalam kontrak
      const reqForbidden = {
        user: { idPengguna: 'user-mitra-multi', role: Role.PEMBERI_JASA },
        body: { idKontrakPekerjaan: 'contract-done-1', nilaiRating: 5 },
      } as unknown as Request;
      const resForbidden = createMockResponse();
      await RatingController.createRating(reqForbidden, resForbidden);
      expect(resForbidden.statusCode).toBe(403);

      // 400: idPenggunaPenerima tidak cocok dengan mitra kontrak
      const reqMismatch = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: {
          idKontrakPekerjaan: 'contract-done-1',
          idPenggunaPenerima: 'user-mitra-multi',
          nilaiRating: 5,
        },
      } as unknown as Request;
      const resMismatch = createMockResponse();
      await RatingController.createRating(reqMismatch, resMismatch);
      expect(resMismatch.statusCode).toBe(400);
    });

    it('[C27] createRating & getRatingsByUser mengembalikan 500 saat terjadi kesalahan tak terduga pada DB', async () => {
      (prisma.kontrakPekerjaan.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));
      const reqErr = {
        user: { idPengguna: 'user-pelanggan-1', role: Role.PELANGGAN },
        body: { idKontrakPekerjaan: 'contract-done-1', nilaiRating: 5 },
      } as unknown as Request;
      const resErr = createMockResponse();
      await RatingController.createRating(reqErr, resErr);
      expect(resErr.statusCode).toBe(500);

      (prisma.pengguna.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));
      const reqGetErr = { params: { id: 'user-mitra-multi' } } as unknown as Request<{ id: string }>;
      const resGetErr = createMockResponse();
      await RatingController.getRatingsByUser(reqGetErr, resGetErr);
      expect(resGetErr.statusCode).toBe(500);
    });
  });

  describe('Profil Riwayat Rating Pengguna [KF20 | UC10 | RatingController.getRatingsByUser]', () => {
    it('[KF20 | UC10] mengembalikan 400 jika parameter id pengguna kosong atau hanya spasi', async () => {
      const req = { params: { id: '   ' } } as unknown as Request<{ id: string }>;
      const res = createMockResponse();

      await RatingController.getRatingsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body.success).toBe(false);
    });

    it('[KF20 | UC10] mengembalikan 404 jika pengguna tidak ditemukan', async () => {
      const req = { params: { id: 'user-non-existent' } } as unknown as Request<{ id: string }>;
      const res = createMockResponse();

      await RatingController.getRatingsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.body.success).toBe(false);
    });

    it('[KF20 | UC10] mengembalikan 200 beserta akumulasiRating, riwayatRating, totalRating, dan daftar ratings pengguna', async () => {
      const req = { params: { id: 'user-mitra-multi' } } as unknown as Request<{ id: string }>;
      const res = createMockResponse();

      await RatingController.getRatingsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.idPengguna).toBe('user-mitra-multi');
      expect(res.body.data.akumulasiRating).toBe(4.33);
      expect(res.body.data.riwayatRating).toEqual([5, 4, 4]);
      expect(res.body.data.totalRating).toBe(3);
      expect(Array.isArray(res.body.data.ratings)).toBe(true);
      expect(res.body.data.ratings.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data.ratings[0].pemberi.namaPengguna).toBe('Pelanggan Test');
      expect(res.body.data.ratings[0].kontrak.detailPekerjaan).toBe('Instalasi Listrik');
    });
  });
});
