import { Request, Response } from 'express';
import { RatingController } from '../src/controllers/RatingController';
import { Rating } from '../src/models/Rating';
import prisma from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const ratings: any[] = [];
  const users = new Map<string, any>([
    [
      'user-pelanggan-1',
      {
        idPengguna: 'user-pelanggan-1',
        namaPengguna: 'Pelanggan Test',
        akumulasiRating: 0.0,
        riwayatRating: [],
      },
    ],
    [
      'user-mitra-1',
      {
        idPengguna: 'user-mitra-1',
        namaPengguna: 'Mitra Test',
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
      },
    ],
  ]);

  return {
    __esModule: true,
    default: {
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
          ratings.push(data);
          return data;
        }),
        findMany: jest.fn(async ({ where }: { where: any }) => {
          return ratings.filter((r) => r.idPenggunaPenerima === where.idPenggunaPenerima);
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
        findUnique: jest.fn(async ({ where }: { where: any }) => {
          return users.get(where.idPengguna) ?? null;
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
      $transaction: jest.fn(async (callback: any) => {
        return callback({
          rating: {
            create: async ({ data }: { data: any }) => {
              ratings.push(data);
              return data;
            },
          },
          kontrakPekerjaan: {
            update: async ({ where, data }: { where: any; data: any }) => {
              const item = contracts.get(where.idKontrakPekerjaan);
              if (item) Object.assign(item, data);
              return item;
            },
          },
          pengguna: {
            findUnique: async ({ where }: { where: any }) => {
              return users.get(where.idPengguna) ?? null;
            },
            update: async ({ where, data }: { where: any; data: any }) => {
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
            },
          },
        });
      }),
    },
    prisma: {
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
          ratings.push(data);
          return data;
        }),
        findMany: jest.fn(async ({ where }: { where: any }) => {
          return ratings.filter((r) => r.idPenggunaPenerima === where.idPenggunaPenerima);
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
        findUnique: jest.fn(async ({ where }: { where: any }) => {
          return users.get(where.idPengguna) ?? null;
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
      $transaction: jest.fn(async (callback: any) => {
        return callback({
          rating: {
            create: async ({ data }: { data: any }) => {
              ratings.push(data);
              return data;
            },
          },
          kontrakPekerjaan: {
            update: async ({ where, data }: { where: any; data: any }) => {
              const item = contracts.get(where.idKontrakPekerjaan);
              if (item) Object.assign(item, data);
              return item;
            },
          },
          pengguna: {
            findUnique: async ({ where }: { where: any }) => {
              return users.get(where.idPengguna) ?? null;
            },
            update: async ({ where, data }: { where: any; data: any }) => {
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
            },
          },
        });
      }),
    },
  };
});

describe('Rating System Unit Tests', () => {
  describe('RatingController.validateRatingValue', () => {
    it('returns true for valid parameters', () => {
      const isValid = RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', 5);
      expect(isValid).toBe(true);
    });

    it('returns false if rating value is out of bounds', () => {
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', 0)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', 6)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', NaN)).toBe(false);
    });

    it('returns false if any required ID is missing or empty', () => {
      expect(RatingController.validateRatingValue('', 'penerima-1', 'kontrak-1', 5)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', '   ', 'kontrak-1', 5)).toBe(false);
      expect(RatingController.validateRatingValue('pemberi-1', 'penerima-1', '', 5)).toBe(false);
    });
  });

  describe('Rating.makeRating sanitization', () => {
    it('safely handles non-string ulasan without crashing', () => {
      // @ts-expect-error test invalid ulasan type
      const rating = Rating.makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 4, 12345, ['cepat']);
      expect(rating.getUlasan()).toBeNull();
      expect(rating.getRatingValue()).toBe(4);
    });

    it('safely filters invalid non-string items in tags', () => {
      // @ts-expect-error test mixed tags
      const rating = Rating.makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 5, 'Bagus', ['tepat waktu', 99, null]);
      expect(rating.getTags()).toEqual(['tepat waktu']);
    });

    it('sets nilaiRating to -1 if out of bounds', () => {
      const rating = Rating.makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 0);
      expect(rating.getRatingValue()).toBe(-1);
    });
  });

  describe('Two-Way Rating Flow (KF19 / UC10)', () => {
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

    it('allows Pelanggan to rate Mitra on completed contract', async () => {
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

    it('allows Mitra to rate Pelanggan on the same contract (Two-Way)', async () => {
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

    it('rejects double rating from the same user for the same contract', async () => {
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

    it('rejects rating if contract status is not Done', async () => {
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
});
