import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { PenggunaController } from '../src/controllers/PenggunaController';
import { PelangganController } from '../src/controllers/PelangganController';
import { PemberiJasaController } from '../src/controllers/PemberiJasaController';
import { LayananPelangganCtrl } from '../src/controllers/LayananPelangganCtrl';

interface MockPenggunaRow {
  idPengguna: string;
  namaPengguna: string;
  username: string;
  password: string;
  email: string;
  nomorTelpon: string;
  role: Role;
  avatarUrl: string | null;
  akumulasiRating: number;
  riwayatRating: number[];
}

interface MockKategoriRow {
  idKategoriJasa: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
}

interface MockPemberiJasaRow {
  idPemberiJasa: string;
  namaToko: string;
  idKategoriJasa: string | null;
  jenisJasa: string | null;
  latitude: number | null;
  longitude: number | null;
  statusKetersediaan: string;
  isOnline: boolean;
  version: number;
}

interface MockLayananPelangganRow {
  idLayananPelanggan: string;
  status: string;
  jumlahTiketDipegang: number;
}

const mockStore = {
  pengguna: new Map<string, MockPenggunaRow>(),
  kategoriJasa: new Map<string, MockKategoriRow>(),
  pemberiJasa: new Map<string, MockPemberiJasaRow>(),
  layananPelanggan: new Map<string, MockLayananPelangganRow>(),
};

jest.mock('../src/database/prisma', () => {
  const buildDelegates = () => {
    const delegates: Record<string, any> = {
      pengguna: {
        findMany: jest.fn(async ({ where, select }: any = {}) => {
          const rows = Array.from(mockStore.pengguna.values()).filter((u) => {
            if (where?.NOT?.idPengguna && u.idPengguna === where.NOT.idPengguna) {
              return false;
            }
            if (where?.OR) {
              return where.OR.some((cond: any) => {
                if (cond.username !== undefined) {
                  return u.username.toLowerCase() === String(cond.username).toLowerCase();
                }
                if (cond.email !== undefined) {
                  return u.email.toLowerCase() === String(cond.email).toLowerCase();
                }
                return false;
              });
            }
            return true;
          });

          if (!select) return rows.map((r) => ({ ...r }));
          return rows.map((r) => {
            const picked: Record<string, unknown> = {};
            for (const key of Object.keys(select)) {
              if (select[key]) {
                picked[key] = (r as unknown as Record<string, unknown>)[key];
              }
            }
            return picked;
          });
        }),
        findFirst: jest.fn(async ({ where, include }: any = {}) => {
          const found = Array.from(mockStore.pengguna.values()).find((u) => {
            if (where?.OR) {
              return where.OR.some((cond: any) => {
                if (cond.username !== undefined) {
                  return u.username === cond.username;
                }
                if (cond.email !== undefined) {
                  return u.email.toLowerCase() === String(cond.email).toLowerCase();
                }
                return false;
              });
            }
            return false;
          });

          if (!found) return null;

          const result: any = { ...found };
          if (include?.pemberiJasa) {
            const pj = mockStore.pemberiJasa.get(found.idPengguna) ?? null;
            if (pj && include.pemberiJasa?.include?.kategoriJasa) {
              const kat = pj.idKategoriJasa
                ? mockStore.kategoriJasa.get(pj.idKategoriJasa) ?? null
                : null;
              result.pemberiJasa = { ...pj, kategoriJasa: kat };
            } else {
              result.pemberiJasa = pj ? { ...pj } : null;
            }
          }
          if (include?.layananPelanggan) {
            const cs = mockStore.layananPelanggan.get(found.idPengguna) ?? null;
            result.layananPelanggan = cs ? { ...cs } : null;
          }
          return result;
        }),
        findUnique: jest.fn(async ({ where }: any) => {
          const found = mockStore.pengguna.get(where.idPengguna);
          return found ? { ...found } : null;
        }),
        create: jest.fn(async ({ data }: any) => {
          const row: MockPenggunaRow = {
            idPengguna: data.idPengguna,
            namaPengguna: data.namaPengguna,
            username: data.username,
            password: data.password,
            email: data.email,
            nomorTelpon: data.nomorTelpon,
            role: data.role ?? Role.PELANGGAN,
            avatarUrl: data.avatarUrl ?? null,
            akumulasiRating: data.akumulasiRating ?? 0.0,
            riwayatRating: data.riwayatRating ?? [],
          };
          mockStore.pengguna.set(row.idPengguna, row);
          return { ...row };
        }),
      },
      kategoriJasa: {
        findUnique: jest.fn(async ({ where }: any) => {
          const kat = mockStore.kategoriJasa.get(where.idKategoriJasa);
          return kat ? { ...kat } : null;
        }),
        create: jest.fn(async ({ data }: any) => {
          const row: MockKategoriRow = {
            idKategoriJasa: data.idKategoriJasa,
            jenisJasa: data.jenisJasa,
            deskripsiJasa: data.deskripsiJasa,
            tarif: data.tarif,
            jamKerja: data.jamKerja,
            daerahKerja: data.daerahKerja,
          };
          mockStore.kategoriJasa.set(row.idKategoriJasa, row);
          return { ...row };
        }),
      },
      pemberiJasa: {
        create: jest.fn(async ({ data }: any) => {
          const row: MockPemberiJasaRow = {
            idPemberiJasa: data.idPemberiJasa,
            namaToko: data.namaToko ?? '',
            idKategoriJasa: data.idKategoriJasa ?? null,
            jenisJasa: data.jenisJasa ?? null,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            statusKetersediaan: data.statusKetersediaan ?? 'Available',
            isOnline: data.isOnline ?? true,
            version: data.version ?? 1,
          };
          mockStore.pemberiJasa.set(row.idPemberiJasa, row);
          return { ...row };
        }),
      },
      $transaction: jest.fn(async (callback: any): Promise<any> => {
        return callback(delegates);
      }),
    };
    return delegates;
  };

  const mockPrisma = buildDelegates();
  return {
    __esModule: true,
    default: mockPrisma,
    prisma: mockPrisma,
  };
});

function createMockReqRes(body: Record<string, unknown> = {}) {
  const req = { body } as unknown as Request;
  let statusCode = 200;
  let jsonPayload: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      jsonPayload = payload;
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => jsonPayload,
  } as unknown as Response & { getStatus: () => number; getJson: () => any };

  return { req, res };
}

const JWT_SECRET =
  process.env.JWT_SECRET || 'dev_fallback_secret_cariuang_2026_ChangeInProd';

describe('Sistem Autentikasi: Registrasi & Login Multi-Role [KF21 | UC11, UC12]', () => {
  beforeEach(() => {
    mockStore.pengguna.clear();
    mockStore.kategoriJasa.clear();
    mockStore.pemberiJasa.clear();
    mockStore.layananPelanggan.clear();
    jest.restoreAllMocks();
  });

  describe('Validasi Info Registrasi Pelanggan [KF21 | ALGO-017]', () => {
    const validBasePayload = {
      namaPengguna: '  Budi Santoso  ',
      username: '  budisantoso  ',
      password: 'Password123',
      email: '  Budi.Santoso@Example.COM  ',
      nomorTelpon: '081234567890',
    };

    it('[KF21 | ALGO-017] meloloskan input valid, men-trim spasi, lowercase email, serta menerima nomorTelpon maupun nomorTelepon', () => {
      const resTelpon = PelangganController.validasiInfoRegistrasi(validBasePayload);
      expect(resTelpon.valid).toBe(true);
      expect(resTelpon.sanitizedData).toEqual({
        namaPengguna: 'Budi Santoso',
        username: 'budisantoso',
        password: 'Password123',
        email: 'budi.santoso@example.com',
        nomorTelepon: '081234567890',
        avatarUrl: null,
      });

      const resTelepon = PelangganController.validasiInfoRegistrasi({
        namaPengguna: 'Siti Aminah',
        username: 'sitiaminah',
        password: 'Password123',
        email: 'siti@example.com',
        nomorTelepon: '085612345678',
      });
      expect(resTelepon.valid).toBe(true);
      expect(resTelepon.sanitizedData?.nomorTelepon).toBe('085612345678');
    });

    it.each([
      ['namaPengguna', { namaPengguna: '   ' }],
      ['username', { username: '' }],
      ['password', { password: '   ' }],
      ['email', { email: '' }],
      ['nomorTelpon', { nomorTelpon: '   ' }],
    ])('[KF21 | ALGO-017] menolak registrasi jika field wajib %s kosong atau hanya spasi', (_field, override) => {
      const result = PelangganController.validasiInfoRegistrasi({
        ...validBasePayload,
        ...override,
      });
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/tidak boleh kosong/i);
    });

    it('[KF21 | ALGO-017] menolak password kurang dari 8 karakter', () => {
      const result = PelangganController.validasiInfoRegistrasi({
        ...validBasePayload,
        password: '1234567',
      });
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/minimal 8 karakter/i);
    });

    it.each(['budi.example.com', 'budi@', '@example.com', 'budi@invalid'])(
      '[KF21 | ALGO-017] menolak format email tidak valid: %s',
      (invalidEmail) => {
        const result = PelangganController.validasiInfoRegistrasi({
          ...validBasePayload,
          email: invalidEmail,
        });
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/email tidak valid/i);
      }
    );

    it.each(['08123abc9012', '+628123456789', '081234567', '0812345678901234'])(
      '[KF21 | ALGO-017] menolak nomor telepon non-angka, < 10 digit, atau > 15 digit: %s',
      (invalidPhone) => {
        const result = PelangganController.validasiInfoRegistrasi({
          ...validBasePayload,
          nomorTelpon: invalidPhone,
        });
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/10 hingga 15 digit/i);
      }
    );
  });

  describe('Validasi Info Registrasi Pemberi Jasa [KF21 | ALGO-012]', () => {
    const validProviderPayload = {
      namaPengguna: 'Ahmad Teknik',
      username: 'ahmadteknik',
      password: 'Password123',
      email: 'Ahmad@Teknik.id',
      nomorTelpon: '081298765432',
      idKategoriJasa: '  kat-ac-01  ',
      jenisJasa: '  Servis AC & Elektronik  ',
      namaToko: '  Bengkel AC Ahmad  ',
      latitude: -6.8915,
      longitude: 107.6107,
    };

    it('[KF21 | ALGO-012] mewarisi aturan validasi dasar ALGO-017 (menolak email/password/telepon invalid)', () => {
      const invalidPass = PemberiJasaController.validasiInfoRegistrasi({
        ...validProviderPayload,
        password: 'short',
      });
      expect(invalidPass.valid).toBe(false);

      const invalidEmail = PemberiJasaController.validasiInfoRegistrasi({
        ...validProviderPayload,
        email: 'not-an-email',
      });
      expect(invalidEmail.valid).toBe(false);

      const invalidPhone = PemberiJasaController.validasiInfoRegistrasi({
        ...validProviderPayload,
        nomorTelpon: '12345',
      });
      expect(invalidPhone.valid).toBe(false);
    });

    it('[KF21 | ALGO-012] menolak jika idKategoriJasa kosong atau hanya spasi', () => {
      const result = PemberiJasaController.validasiInfoRegistrasi({
        ...validProviderPayload,
        idKategoriJasa: '   ',
      });
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/idKategoriJasa/i);
    });

    it('[KF21 | ALGO-012] menolak jika jenisJasa kosong atau hanya spasi', () => {
      const result = PemberiJasaController.validasiInfoRegistrasi({
        ...validProviderPayload,
        jenisJasa: '',
      });
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/jenisJasa/i);
    });

    it('[KF21 | ALGO-012] meloloskan input valid dan mengembalikan sanitizedData beserta providerData lengkap', () => {
      const result = PemberiJasaController.validasiInfoRegistrasi(validProviderPayload);
      expect(result.valid).toBe(true);
      expect(result.sanitizedData).toEqual({
        namaPengguna: 'Ahmad Teknik',
        username: 'ahmadteknik',
        password: 'Password123',
        email: 'ahmad@teknik.id',
        nomorTelepon: '081298765432',
        avatarUrl: null,
      });
      expect(result.providerData).toEqual({
        idKategoriJasa: 'kat-ac-01',
        jenisJasa: 'Servis AC & Elektronik',
        namaToko: 'Bengkel AC Ahmad',
        latitude: -6.8915,
        longitude: 107.6107,
      });
    });
  });

  describe('Integration Test Registrasi Akun [KF21 | UC12 | ALGO-012, ALGO-017]', () => {
    it('[KF21 | UC12] registrasiPelanggan mengembalikan 400 jika validasi input gagal', async () => {
      const { req, res } = createMockReqRes({
        namaPengguna: 'Budi',
        username: 'budi',
        password: '123',
        email: 'salah',
        nomorTelpon: '0812',
      });

      await PelangganController.registrasiPelanggan(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getJson().success).toBe(false);
      expect(mockStore.pengguna.size).toBe(0);
    });

    it('[KF21 | UC12] registrasiPelanggan menyimpan password ter-hash bcrypt, mengembalikan 201 tanpa field password, dan menolak duplikasi username/email (400)', async () => {
      const firstCall = createMockReqRes({
        namaPengguna: 'Budi Pelanggan',
        username: 'budiuser',
        password: 'Password123',
        email: 'budi@mail.com',
        nomorTelpon: '081234567890',
      });

      await PelangganController.registrasiPelanggan(firstCall.req, firstCall.res);

      expect(firstCall.res.getStatus()).toBe(201);
      const createdJson = firstCall.res.getJson();
      expect(createdJson.success).toBe(true);
      expect(createdJson.data.role).toBe(Role.PELANGGAN);
      expect(createdJson.data.password).toBeUndefined();
      expect(createdJson.data.passwordHash).toBeUndefined();

      const savedRow = Array.from(mockStore.pengguna.values())[0];
      expect(savedRow.password).not.toBe('Password123');
      expect(await bcrypt.compare('Password123', savedRow.password)).toBe(true);

      const dupUsername = createMockReqRes({
        namaPengguna: 'Budi Lain',
        username: 'budiuser',
        password: 'Password123',
        email: 'lain@mail.com',
        nomorTelpon: '081234567891',
      });
      await PelangganController.registrasiPelanggan(dupUsername.req, dupUsername.res);
      expect(dupUsername.res.getStatus()).toBe(400);
      expect(dupUsername.res.getJson().message).toMatch(/Username sudah terdaftar/i);

      const dupEmail = createMockReqRes({
        namaPengguna: 'Budi Lain 2',
        username: 'budilain2',
        password: 'Password123',
        email: 'budi@mail.com',
        nomorTelpon: '081234567892',
      });
      await PelangganController.registrasiPelanggan(dupEmail.req, dupEmail.res);
      expect(dupEmail.res.getStatus()).toBe(400);
      expect(dupEmail.res.getJson().message).toMatch(/Email sudah terdaftar/i);
    });

    it('[KF21 | UC12] registrasiPemberiJasa mengembalikan 201 dengan role PEMBERI_JASA, password ter-hash, dan menolak duplikasi (400)', async () => {
      const validCall = createMockReqRes({
        namaPengguna: 'Dedi Tukang',
        username: 'deditukang',
        password: 'Password123',
        email: 'dedi@mail.com',
        nomorTelpon: '081345678901',
        idKategoriJasa: 'kat-pipa-01',
        jenisJasa: 'Perbaikan Pipa',
        namaToko: 'Dedi Pipa Jaya',
        latitude: -6.9,
        longitude: 107.61,
      });

      await PemberiJasaController.registrasiPemberiJasa(validCall.req, validCall.res);

      expect(validCall.res.getStatus()).toBe(201);
      const resData = validCall.res.getJson().data;
      expect(resData.role).toBe(Role.PEMBERI_JASA);
      expect(resData.namaToko).toBe('Dedi Pipa Jaya');
      expect(resData.password).toBeUndefined();
      expect(mockStore.pemberiJasa.size).toBe(1);

      const savedRow = Array.from(mockStore.pengguna.values())[0];
      expect(savedRow.password).not.toBe('Password123');
      expect(await bcrypt.compare('Password123', savedRow.password)).toBe(true);

      const duplicateCall = createMockReqRes({
        namaPengguna: 'Dedi Duplikat',
        username: 'deditukang',
        password: 'Password123',
        email: 'dedi2@mail.com',
        nomorTelpon: '081345678902',
        idKategoriJasa: 'kat-pipa-01',
        jenisJasa: 'Perbaikan Pipa',
      });
      await PemberiJasaController.registrasiPemberiJasa(duplicateCall.req, duplicateCall.res);
      expect(duplicateCall.res.getStatus()).toBe(400);
      expect(duplicateCall.res.getJson().success).toBe(false);
    });
  });

  describe('Pengecekan Info Login & Handler Login Multi-Role [KF21 | UC11 | ALGO-001]', () => {
    let passwordHash: string;

    beforeEach(async () => {
      passwordHash = await bcrypt.hash('SecretPass123', 4);

      mockStore.pengguna.set('user-pelanggan-1', {
        idPengguna: 'user-pelanggan-1',
        namaPengguna: 'Pelanggan Satu',
        username: 'pelanggan1',
        password: passwordHash,
        email: 'pelanggan1@cariuang.id',
        nomorTelpon: '081200000001',
        role: Role.PELANGGAN,
        avatarUrl: null,
        akumulasiRating: 0,
        riwayatRating: [],
      });

      mockStore.pengguna.set('user-mitra-1', {
        idPengguna: 'user-mitra-1',
        namaPengguna: 'Mitra Satu',
        username: 'mitra1',
        password: passwordHash,
        email: 'mitra1@cariuang.id',
        nomorTelpon: '081200000002',
        role: Role.PEMBERI_JASA,
        avatarUrl: null,
        akumulasiRating: 4.8,
        riwayatRating: [5, 4.6],
      });
      mockStore.pemberiJasa.set('user-mitra-1', {
        idPemberiJasa: 'user-mitra-1',
        namaToko: 'Servis Mitra Satu',
        idKategoriJasa: 'kat-1',
        jenisJasa: 'Servis AC',
        latitude: -6.9,
        longitude: 107.6,
        statusKetersediaan: 'Available',
        isOnline: true,
        version: 1,
      });

      mockStore.pengguna.set('user-cs-1', {
        idPengguna: 'user-cs-1',
        namaPengguna: 'CS Satu',
        username: 'cs1',
        password: passwordHash,
        email: 'cs1@cariuang.id',
        nomorTelpon: '081200000003',
        role: Role.LAYANAN_PELANGGAN,
        avatarUrl: null,
        akumulasiRating: 0,
        riwayatRating: [],
      });
      mockStore.layananPelanggan.set('user-cs-1', {
        idLayananPelanggan: 'user-cs-1',
        status: 'Available',
        jumlahTiketDipegang: 0,
      });
    });

    it('[KF21 | ALGO-001] cekInfoLogin tetap menjalankan bcrypt.compare ke dummy hash jika user tidak ditemukan dan mengembalikan authenticated: false', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare');

      const result = await PenggunaController.cekInfoLogin('tidak_ada', 'SecretPass123');

      expect(result).toEqual({ authenticated: false });
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledWith(
        'SecretPass123',
        '$2b$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ012345'
      );
    });

    it('[KF21 | ALGO-001] cekInfoLogin mengembalikan authenticated: false jika password salah', async () => {
      const result = await PenggunaController.cekInfoLogin('pelanggan1', 'WrongPassword');
      expect(result).toEqual({ authenticated: false });
    });

    it('[KF21 | ALGO-001] cekInfoLogin berhasil via username dan email, menghasilkan JWT valid, menyelesaikan role, dan menghapus field password', async () => {
      const resPelanggan = await PenggunaController.cekInfoLogin('pelanggan1', 'SecretPass123');
      expect(resPelanggan.authenticated).toBe(true);
      expect(resPelanggan.token).toBeTruthy();
      expect(resPelanggan.user?.password).toBeUndefined();
      expect(resPelanggan.user?.role).toBe(Role.PELANGGAN);

      const decodedPelanggan = jwt.verify(resPelanggan.token!, JWT_SECRET) as jwt.JwtPayload;
      expect(decodedPelanggan.idPengguna).toBe('user-pelanggan-1');
      expect(decodedPelanggan.role).toBe(Role.PELANGGAN);

      const resMitraByEmail = await PenggunaController.cekInfoLogin(
        'MITRA1@CARIUANG.ID',
        'SecretPass123'
      );
      expect(resMitraByEmail.authenticated).toBe(true);
      expect(resMitraByEmail.user?.role).toBe(Role.PEMBERI_JASA);
      expect(resMitraByEmail.user?.password).toBeUndefined();

      const resCs = await PenggunaController.cekInfoLogin('cs1', 'SecretPass123');
      expect(resCs.authenticated).toBe(true);
      expect(resCs.user?.role).toBe(Role.LAYANAN_PELANGGAN);
    });

    it('[KF21 | UC11 | ALGO-001] PenggunaController.login mengembalikan 400 jika input kosong, 401 jika kredensial salah, dan 200 beserta token jika sukses', async () => {
      const emptyCall = createMockReqRes({ username: '   ', password: '' });
      await PenggunaController.login(emptyCall.req, emptyCall.res);
      expect(emptyCall.res.getStatus()).toBe(400);
      expect(emptyCall.res.getJson().success).toBe(false);

      const wrongCall = createMockReqRes({ username: 'pelanggan1', password: 'SalahPassword' });
      await PenggunaController.login(wrongCall.req, wrongCall.res);
      expect(wrongCall.res.getStatus()).toBe(401);
      expect(wrongCall.res.getJson().success).toBe(false);

      const okCall = createMockReqRes({ email: 'pelanggan1@cariuang.id', password: 'SecretPass123' });
      await PenggunaController.login(okCall.req, okCall.res);
      expect(okCall.res.getStatus()).toBe(200);
      const okBody = okCall.res.getJson();
      expect(okBody.success).toBe(true);
      expect(okBody.data.token).toBeTruthy();
      expect(okBody.data.user.password).toBeUndefined();
      expect(okBody.data.user.role).toBe(Role.PELANGGAN);
    });

    it('[KF21 | UC11 | ALGO-001] LayananPelangganCtrl.loginLayananPelanggan hanya mengizinkan role LAYANAN_PELANGGAN (200) dan menolak PELANGGAN/PEMBERI_JASA (401)', async () => {
      const emptyCs = createMockReqRes({ username: '', password: '' });
      await LayananPelangganCtrl.loginLayananPelanggan(emptyCs.req, emptyCs.res);
      expect(emptyCs.res.getStatus()).toBe(400);

      const pelangganToCs = createMockReqRes({
        username: 'pelanggan1',
        password: 'SecretPass123',
      });
      await LayananPelangganCtrl.loginLayananPelanggan(pelangganToCs.req, pelangganToCs.res);
      expect(pelangganToCs.res.getStatus()).toBe(401);
      expect(pelangganToCs.res.getJson().success).toBe(false);

      const mitraToCs = createMockReqRes({
        username: 'mitra1',
        password: 'SecretPass123',
      });
      await LayananPelangganCtrl.loginLayananPelanggan(mitraToCs.req, mitraToCs.res);
      expect(mitraToCs.res.getStatus()).toBe(401);
      expect(mitraToCs.res.getJson().success).toBe(false);

      const csOk = createMockReqRes({
        username: 'cs1',
        password: 'SecretPass123',
      });
      await LayananPelangganCtrl.loginLayananPelanggan(csOk.req, csOk.res);
      expect(csOk.res.getStatus()).toBe(200);
      const csBody = csOk.res.getJson();
      expect(csBody.success).toBe(true);
      expect(csBody.data.token).toBeTruthy();
      expect(csBody.data.user.role).toBe(Role.LAYANAN_PELANGGAN);
    });
  });
});
