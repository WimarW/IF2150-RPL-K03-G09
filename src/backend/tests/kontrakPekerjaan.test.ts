import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import prisma from '../src/database/prisma';
import {
  AUTO_CANCEL_TIMEOUT_MS,
  KontrakError,
  KontrakPekerjaan,
  STATUS_KETERSEDIAAN,
  STATUS_PEKERJAAN,
} from '../src/models/KontrakPekerjaan';
import { Pengguna } from '../src/models/Pengguna';
import { KontrakPekerjaanController } from '../src/controllers/KontrakPekerjaanController';
import { KomunikasiController } from '../src/controllers/KomunikasiController';
import {
  NotifikasiController,
  RealtimeEmitter,
} from '../src/controllers/NotifikasiController';
import { cancelExpiredContracts } from '../src/workers/autoCancelKontrakWorker';
import {
  authenticateJWT,
  authorizeRoles,
} from '../src/middlewares/auth.middleware';

interface MockPemberiJasaRow {
  idPemberiJasa: string;
  namaToko: string;
  statusKetersediaan: string;
  version: number;
}

interface MockKontrakRow {
  idKontrakPekerjaan: string;
  idPelanggan: string;
  idPemberiJasa: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan: string;
  hasRating: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}

interface MockNotifikasiRow {
  idNotifikasi: string;
  idPenerima: string;
  isiNotifikasi: string;
  waktuNotifikasi: Date;
  statusBaca: boolean;
}

interface MockKomunikasiRow {
  idChat: string;
  idPengguna: string;
  idPenerima: string;
  isiPesan: string;
  waktuTerkirim: Date;
  isChatTerbaca: boolean;
  statusChat: string;
  durasiChat: number;
}

const mockDb = {
  pemberiJasa: new Map<string, MockPemberiJasaRow>(),
  kontrakPekerjaan: new Map<string, MockKontrakRow>(),
  notifikasi: [] as MockNotifikasiRow[],
  komunikasi: [] as MockKomunikasiRow[],
};

function setupMockPrisma(): void {
  mockDb.pemberiJasa.clear();
  mockDb.kontrakPekerjaan.clear();
  mockDb.notifikasi = [];
  mockDb.komunikasi = [];

  mockDb.pemberiJasa.set('provider-1', {
    idPemberiJasa: 'provider-1',
    namaToko: 'Jahit Keliling Pak Budi',
    statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
    version: 1,
  });

  const mockDelegates = {
    pemberiJasa: {
      findUnique: async ({ where }: any) => {
        const row = mockDb.pemberiJasa.get(where.idPemberiJasa);
        return row ? { ...row } : null;
      },
      update: async ({ where, data }: any) => {
        const row = mockDb.pemberiJasa.get(where.idPemberiJasa);
        if (!row) throw new Error('Provider not found');
        if (data.statusKetersediaan !== undefined) {
          row.statusKetersediaan = data.statusKetersediaan;
        }
        if (data.version?.increment) {
          row.version += data.version.increment;
        } else if (typeof data.version === 'number') {
          row.version = data.version;
        }
        return { ...row };
      },
      updateMany: async ({ where, data }: any) => {
        const row = mockDb.pemberiJasa.get(where.idPemberiJasa);
        if (!row) return { count: 0 };
        if (where.version !== undefined && row.version !== where.version) {
          return { count: 0 };
        }
        if (
          where.statusKetersediaan !== undefined &&
          row.statusKetersediaan !== where.statusKetersediaan
        ) {
          return { count: 0 };
        }
        if (data.statusKetersediaan !== undefined) {
          row.statusKetersediaan = data.statusKetersediaan;
        }
        if (data.version?.increment) {
          row.version += data.version.increment;
        }
        return { count: 1 };
      },
    },
    kontrakPekerjaan: {
      create: async ({ data }: any) => {
        const row: MockKontrakRow = {
          idKontrakPekerjaan: data.idKontrakPekerjaan,
          idPelanggan: data.idPelanggan,
          idPemberiJasa: data.idPemberiJasa,
          detailPekerjaan: data.detailPekerjaan,
          persetujuanHarga: data.persetujuanHarga,
          statusPekerjaan: data.statusPekerjaan,
          hasRating: Boolean(data.hasRating),
          createdAt: data.createdAt ?? new Date(),
          expiresAt: data.expiresAt ?? null,
        };
        mockDb.kontrakPekerjaan.set(row.idKontrakPekerjaan, row);
        return { ...row };
      },
      findUnique: async ({ where }: any) => {
        const row = mockDb.kontrakPekerjaan.get(where.idKontrakPekerjaan);
        return row ? { ...row } : null;
      },
      findFirst: async ({ where }: any) => {
        for (const row of Array.from(mockDb.kontrakPekerjaan.values())) {
          if (where.idPemberiJasa && row.idPemberiJasa !== where.idPemberiJasa) {
            continue;
          }
          if (
            where.idKontrakPekerjaan?.not &&
            row.idKontrakPekerjaan === where.idKontrakPekerjaan.not
          ) {
            continue;
          }
          if (
            where.statusPekerjaan?.in &&
            !where.statusPekerjaan.in.includes(row.statusPekerjaan)
          ) {
            continue;
          }
          return { ...row };
        }
        return null;
      },
      findMany: async ({ where }: any) => {
        const results: MockKontrakRow[] = [];
        for (const row of Array.from(mockDb.kontrakPekerjaan.values())) {
          if (
            where?.statusPekerjaan &&
            row.statusPekerjaan !== where.statusPekerjaan
          ) {
            continue;
          }
          if (where?.OR) {
            const matchedOr = where.OR.some((cond: any) => {
              if (cond.idPelanggan) {
                return row.idPelanggan === cond.idPelanggan;
              }
              if (cond.idPemberiJasa) {
                return row.idPemberiJasa === cond.idPemberiJasa;
              }
              if (cond.expiresAt?.lte) {
                return (
                  row.expiresAt !== null &&
                  row.expiresAt.getTime() <= cond.expiresAt.lte.getTime()
                );
              }
              if (cond.expiresAt === null && cond.createdAt?.lte) {
                return (
                  row.expiresAt === null &&
                  row.createdAt.getTime() <= cond.createdAt.lte.getTime()
                );
              }
              return false;
            });
            if (!matchedOr) continue;
          }
          results.push({ ...row });
        }
        return results;
      },
      count: async ({ where }: any) => {
        let count = 0;
        for (const row of Array.from(mockDb.kontrakPekerjaan.values())) {
          if (where.idPemberiJasa && row.idPemberiJasa !== where.idPemberiJasa) {
            continue;
          }
          if (
            where.idKontrakPekerjaan?.not &&
            row.idKontrakPekerjaan === where.idKontrakPekerjaan.not
          ) {
            continue;
          }
          if (
            where.statusPekerjaan?.in &&
            !where.statusPekerjaan.in.includes(row.statusPekerjaan)
          ) {
            continue;
          }
          count++;
        }
        return count;
      },
      update: async ({ where, data }: any) => {
        const row = mockDb.kontrakPekerjaan.get(where.idKontrakPekerjaan);
        if (!row) throw new Error('Contract not found');
        Object.assign(row, data);
        return { ...row };
      },
      updateMany: async ({ where, data }: any) => {
        const row = mockDb.kontrakPekerjaan.get(where.idKontrakPekerjaan);
        if (!row) return { count: 0 };
        if (typeof where.statusPekerjaan === 'string') {
          if (row.statusPekerjaan !== where.statusPekerjaan) return { count: 0 };
        } else if (where.statusPekerjaan?.in) {
          if (!where.statusPekerjaan.in.includes(row.statusPekerjaan)) {
            return { count: 0 };
          }
        }
        Object.assign(row, data);
        return { count: 1 };
      },
    },
    notifikasi: {
      create: async ({ data }: any) => {
        const notif: MockNotifikasiRow = {
          idNotifikasi: data.idNotifikasi,
          idPenerima: data.idPenerima,
          isiNotifikasi: data.isiNotifikasi,
          waktuNotifikasi: data.waktuNotifikasi ?? new Date(),
          statusBaca: Boolean(data.statusBaca ?? false),
        };
        mockDb.notifikasi.push(notif);
        return notif;
      },
    },
    komunikasi: {
      create: async ({ data }: any) => {
        const chat: MockKomunikasiRow = {
          idChat: data.idChat,
          idPengguna: data.idPengguna,
          idPenerima: data.idPenerima,
          isiPesan: data.isiPesan,
          waktuTerkirim: data.waktuTerkirim ?? new Date(),
          isChatTerbaca: Boolean(data.isChatTerbaca ?? false),
          statusChat: data.statusChat ?? 'SENT',
          durasiChat: data.durasiChat ?? 0,
        };
        mockDb.komunikasi.push(chat);
        return chat;
      },
      findMany: async ({ where }: any) => {
        return mockDb.komunikasi.filter((msg) => {
          if (where?.OR) {
            return where.OR.some(
              (cond: any) =>
                msg.idPengguna === cond.idPengguna &&
                msg.idPenerima === cond.idPenerima
            );
          }
          return true;
        });
      },
    },
    $transaction: async (fn: any) => {
      if (typeof fn === 'function') {
        return fn(mockDelegates);
      }
      return Promise.all(fn);
    },
  };

  Object.assign(prisma, mockDelegates);
}

function createMockReqRes(options: {
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}) {
  const req = {
    headers: options.headers ?? {},
    body: options.body ?? {},
    params: options.params ?? {},
    query: options.query ?? {},
  } as unknown as Request;

  let statusCode = 200;
  let jsonBody: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: any) {
      jsonBody = payload;
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => jsonBody,
  } as unknown as Response & { getStatus: () => number; getJson: () => any };

  return { req, res };
}

const JWT_SECRET =
  process.env.JWT_SECRET || 'dev_fallback_secret_cariuang_2026_ChangeInProd';

describe('KontrakPekerjaan & KontrakPekerjaanController (UC05, UC06, UC07)', () => {
  const controller = new KontrakPekerjaanController();

  beforeEach(() => {
    setupMockPrisma();
  });

  it('ALGO-037 (saveKontrak Q-017 & Q-018), ALGO-038 (newKontrak), ALGO-039 (makeKontrak), ALGO-040 (fetchKontrakPekerjaan Q-019), dan KNF18', async () => {
    const kontrak = new KontrakPekerjaan();
    kontrak.newKontrak({
      idPelanggan: 'cust-1',
      idPemberiJasa: 'provider-1',
      detailPekerjaan: 'Jahit celana bahan dan permak kemeja',
      persetujuanHarga: 75000,
    });

    expect(kontrak.getStatusPekerjaan()).toBe(STATUS_PEKERJAAN.MENUNGGU);
    expect(kontrak.getExpiresAt()).toBeInstanceOf(Date);

    const created = kontrak.makeKontrak();
    expect(created).toBe(true);
    const id = kontrak.getIdKontrakPekerjaan()!;
    expect(id).toBeTruthy();

    // ALGO-037 (Q-017): INSERT kontrak baru
    const savedNew = await kontrak.saveKontrak();
    expect(savedNew).toBe(true);

    // ALGO-040 (Q-019): fetchKontrakPekerjaan
    const fetched = await KontrakPekerjaan.fetchKontrakPekerjaan(id);
    expect(fetched).not.toBeNull();
    expect(fetched!.getPersetujuanHarga()).toBe(75000);

    // ALGO-036 (Q-016) & ALGO-037 (Q-018): UPDATE kontrak yang sudah ada
    const statusUpdated = await fetched!.statusUpdate(
      'statusPekerjaan',
      STATUS_PEKERJAAN.ON_PROGRESS
    );
    expect(statusUpdated).toBe(true);
    expect(fetched!.getStatusPekerjaan()).toBe(STATUS_PEKERJAAN.ON_PROGRESS);

    const savedExisting = await fetched!.saveKontrak();
    expect(savedExisting).toBe(true);

    // KNF18: Tolak input kosong, harga negatif, atau injeksi berbahaya
    expect(KontrakPekerjaan.validateKontrakInput('', 50000).valid).toBe(false);
    expect(
      KontrakPekerjaan.validateKontrakInput('Perbaikan pipa', -10000).valid
    ).toBe(false);
    expect(
      KontrakPekerjaan.validateKontrakInput(
        'Test; DROP TABLE kontrak_pekerjaan',
        50000
      ).valid
    ).toBe(false);
  });

  it('UC05, ALGO-043 (kirimInput), KNF04 & KNF19: Pelanggan membuat kontrak -> status Menunggu & Optimistic Lock penyedia jasa', async () => {
    const kontrak = await controller.kirimInput(
      'Servis resleting jaket kulit',
      85000,
      'cust-1',
      'provider-1',
      1
    );

    const detail = kontrak.getDetailPekerjaan();
    expect(detail.statusPekerjaan).toBe(STATUS_PEKERJAAN.MENUNGGU);
    expect(detail.persetujuanHarga).toBe(85000);
    expect(detail.expiresAt).toBeTruthy();

    const provider = mockDb.pemberiJasa.get('provider-1')!;
    expect(provider.statusKetersediaan).toBe(STATUS_KETERSEDIAAN.ON_PROGRESS);
    expect(provider.version).toBe(2);

    expect(mockDb.notifikasi).toHaveLength(1);
    expect(mockDb.notifikasi[0].idPenerima).toBe('provider-1');

    // KNF04: Pelanggan ke-2 mencoba memesan penyedia jasa yang sama secara bersamaan -> ditolak (409 Conflict)
    await expect(
      controller.kirimInput('Permak jas', 120000, 'cust-2', 'provider-1', 1)
    ).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it('Penyedia menerima kontrak (Optimistic Locking KNF04 & KNF19) -> On Progress -> Selesai (UC06, KNF20) -> Konfirmasi Pelanggan (UC07, ALGO-042, KNF21, KNF22) -> Done', async () => {
    const kontrak = await controller.kirimInput(
      'Sol sepatu kulit 2 pasang',
      100000,
      'cust-1',
      'provider-1'
    );
    const idKontrak = kontrak.getIdKontrakPekerjaan()!;

    // Uji Optimistic Locking gagal jika version tidak sesuai (version lama = 1 padahal sekarang 2)
    await expect(
      controller.konfirmasiPersetujuanPenyedia(idKontrak, 'provider-1', true, 1)
    ).rejects.toMatchObject({
      code: 'OPTIMISTIC_LOCK_CONFLICT',
      statusCode: 409,
    });

    // Penyedia menerima dengan version yang valid (version = 2) -> status menjadi 'On Progress'
    const accepted = await controller.konfirmasiPersetujuanPenyedia(
      idKontrak,
      'provider-1',
      true,
      2
    );
    expect(accepted.getStatusPekerjaan()).toBe(STATUS_PEKERJAAN.ON_PROGRESS);
    expect(mockDb.pemberiJasa.get('provider-1')!.version).toBe(3);

    // UC06: Penyedia menyelesaikan pekerjaan -> status menjadi 'Menunggu Konfirmasi Pelanggan' + kirim notifikasi (KNF20)
    const finished = await controller.selesaikanPekerjaan(
      idKontrak,
      'provider-1'
    );
    expect(finished.getStatusPekerjaan()).toBe(
      STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN
    );

    // UC07 & ALGO-042 & C01 Pengguna.konfirmasiPekerjaan: Pelanggan mengonfirmasi penyelesaian & pembayaran -> status 'Done' & buka kunci penyedia
    const confirmed = await controller.konfirmasiPekerjaan(idKontrak, 'cust-1');
    expect(confirmed).toBe(true);

    const finalKontrak = await controller.getKontrakPekerjaan(idKontrak);
    expect(finalKontrak?.getStatusPekerjaan()).toBe(STATUS_PEKERJAAN.DONE);

    // Kunci ketersediaan penyedia jasa terbuka kembali ('Available')
    const providerAfterDone = mockDb.pemberiJasa.get('provider-1')!;
    expect(providerAfterDone.statusKetersediaan).toBe(
      STATUS_KETERSEDIAAN.AVAILABLE
    );
  });

  it('KF07 & KNF11: Auto-cancel 30 menit membatalkan kontrak Menunggu yang kedaluwarsa dan membuka kunci penyedia jasa', async () => {
    const kontrak = await controller.kirimInput(
      'Perbaikan engsel pintu kayu',
      150000,
      'cust-1',
      'provider-1'
    );
    const idKontrak = kontrak.getIdKontrakPekerjaan()!;

    expect(mockDb.pemberiJasa.get('provider-1')!.statusKetersediaan).toBe(
      STATUS_KETERSEDIAAN.ON_PROGRESS
    );

    // Simulasikan waktu berjalan 31 menit ke depan (> 30 menit)
    const futureTime = new Date(Date.now() + AUTO_CANCEL_TIMEOUT_MS + 60_000);
    const result = await cancelExpiredContracts(futureTime);

    expect(result.cancelledCount).toBe(1);
    expect(result.cancelledIds).toEqual([idKontrak]);

    const expiredKontrak = await controller.getKontrakPekerjaan(idKontrak);
    expect(expiredKontrak?.getStatusPekerjaan()).toBe(
      STATUS_PEKERJAAN.DIBATALKAN
    );

    // Kunci penyedia jasa telah dilepaskan kembali menjadi 'Available'
    expect(mockDb.pemberiJasa.get('provider-1')!.statusKetersediaan).toBe(
      STATUS_KETERSEDIAAN.AVAILABLE
    );
  });

  it('KNF22: Validasi state transition menolak perubahan status yang tidak sah & mendukung Pengguna.konfirmasiPekerjaan()', async () => {
    const kontrak = await controller.kirimInput(
      'Bersih taman rumah',
      90000,
      'cust-1',
      'provider-1'
    );
    const idKontrak = kontrak.getIdKontrakPekerjaan()!;

    const pelanggan = new Pengguna({ idPengguna: 'cust-1' });
    const prematureConfirm = await pelanggan.konfirmasiPekerjaan(idKontrak);
    expect(prematureConfirm).toBe(false);

    // Penyedia menolak kontrak -> status 'Ditolak' & kunci penyedia jasa dilepas
    const rejected = await controller.konfirmasiPersetujuanPenyedia(
      idKontrak,
      'provider-1',
      false
    );
    expect(rejected.getStatusPekerjaan()).toBe(STATUS_PEKERJAAN.DITOLAK);
    expect(mockDb.pemberiJasa.get('provider-1')!.statusKetersediaan).toBe(
      STATUS_KETERSEDIAAN.AVAILABLE
    );
  });

  it('REST API Handlers + JWT Auth Middleware (auth.middleware.ts): alur lengkap dari pembuatan kontrak hingga selesai', async () => {
    const pelangganToken = jwt.sign(
      {
        idPengguna: 'cust-1',
        username: 'pelanggan1',
        role: Role.PELANGGAN,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    const providerToken = jwt.sign(
      {
        idPengguna: 'provider-1',
        username: 'pakbudi',
        role: Role.PEMBERI_JASA,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 1. Tanpa token -> 401 Unauthorized
    const unauth = createMockReqRes({});
    let nextCalled = false;
    authenticateJWT(unauth.req, unauth.res, () => {
      nextCalled = true;
    });
    expect(nextCalled).toBe(false);
    expect(unauth.res.getStatus()).toBe(401);

    // 2. Pelanggan membuat kontrak -> 201 Created (status: 'Menunggu')
    const createCall = createMockReqRes({
      headers: { authorization: `Bearer ${pelangganToken}` },
      body: {
        idPemberiJasa: 'provider-1',
        detailPekerjaan: 'Cuci AC 1 PK ruang tamu',
        persetujuanHarga: 125000,
        expectedVersion: 1,
      },
    });
    authenticateJWT(createCall.req, createCall.res, () => {});
    authorizeRoles(Role.PELANGGAN)(createCall.req, createCall.res, () => {});
    await controller.handleKirimInput(createCall.req, createCall.res);

    expect(createCall.res.getStatus()).toBe(201);
    const createdJson = createCall.res.getJson();
    expect(createdJson.data.statusPekerjaan).toBe(STATUS_PEKERJAAN.MENUNGGU);
    const kontrakId = createdJson.data.idKontrakPekerjaan;

    // 3. Penyedia jasa menyetujui kontrak -> 200 OK (status: 'On Progress')
    const acceptCall = createMockReqRes({
      headers: { authorization: `Bearer ${providerToken}` },
      params: { id: kontrakId },
      body: { disetujui: true, expectedVersion: 2 },
    });
    authenticateJWT(acceptCall.req, acceptCall.res, () => {});
    authorizeRoles(Role.PEMBERI_JASA)(acceptCall.req, acceptCall.res, () => {});
    await controller.handleKonfirmasiPersetujuan(
      acceptCall.req,
      acceptCall.res
    );

    expect(acceptCall.res.getStatus()).toBe(200);
    expect(acceptCall.res.getJson().data.statusPekerjaan).toBe(
      STATUS_PEKERJAAN.ON_PROGRESS
    );

    // 4. Penyedia jasa menyelesaikan pekerjaan -> 200 OK (status: 'Menunggu Konfirmasi Pelanggan')
    const finishCall = createMockReqRes({
      headers: { authorization: `Bearer ${providerToken}` },
      params: { id: kontrakId },
    });
    authenticateJWT(finishCall.req, finishCall.res, () => {});
    await controller.handleSelesaikanPekerjaan(finishCall.req, finishCall.res);

    expect(finishCall.res.getStatus()).toBe(200);
    expect(finishCall.res.getJson().data.statusPekerjaan).toBe(
      STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN
    );

    // 5. Pelanggan mengonfirmasi selesai & pembayaran -> 200 OK (status: 'Done')
    const confirmCall = createMockReqRes({
      headers: { authorization: `Bearer ${pelangganToken}` },
      params: { id: kontrakId },
    });
    authenticateJWT(confirmCall.req, confirmCall.res, () => {});
    await controller.handleKonfirmasiPekerjaan(
      confirmCall.req,
      confirmCall.res
    );

    expect(confirmCall.res.getStatus()).toBe(200);
    expect(confirmCall.res.getJson().data.statusPekerjaan).toBe(
      STATUS_PEKERJAAN.DONE
    );
  });

  it('Integrasi dengan NotifikasiController (C30), KomunikasiController (C21), dan Socket.IO RealtimeEmitter', async () => {
    const emittedEvents: Array<{
      idPengguna: string;
      event: string;
      payload: any;
    }> = [];

    const mockEmitter: RealtimeEmitter = {
      emitToUser(idPengguna: string, event: string, payload: unknown) {
        emittedEvents.push({ idPengguna, event, payload });
      },
    };

    const notifikasiController = new NotifikasiController(
      undefined,
      undefined,
      mockEmitter
    );
    const komunikasiController = new KomunikasiController(
      undefined,
      notifikasiController,
      mockEmitter
    );
    const integratedController = new KontrakPekerjaanController(
      notifikasiController,
      komunikasiController,
      mockEmitter
    );

    const pelangganToken = jwt.sign(
      {
        idPengguna: 'cust-1',
        username: 'pelanggan1',
        role: Role.PELANGGAN,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Buat kontrak dari ruang chat dengan kirimKeChat = true
    const createCall = createMockReqRes({
      headers: { authorization: `Bearer ${pelangganToken}` },
      body: {
        idPemberiJasa: 'provider-1',
        detailPekerjaan: 'Pasang bracket TV 50 inch',
        persetujuanHarga: 150000,
        expectedVersion: 1,
        kirimKeChat: true,
      },
    });
    authenticateJWT(createCall.req, createCall.res, () => {});
    await integratedController.handleKirimInput(createCall.req, createCall.res);

    expect(createCall.res.getStatus()).toBe(201);

    // Notifikasi dibuat melalui NotifikasiController dengan statusBaca boolean (false) dan prefix NOTIF-
    expect(mockDb.notifikasi.length).toBeGreaterThanOrEqual(1);
    expect(mockDb.notifikasi[0].idNotifikasi).toMatch(/^NOTIF-/);
    expect(mockDb.notifikasi[0].statusBaca).toBe(false);

    // Pesan kontrak juga tercatat di Komunikasi (sistem chat)
    expect(mockDb.komunikasi).toHaveLength(1);
    expect(mockDb.komunikasi[0].idChat).toMatch(/^CHAT-/);
    expect(mockDb.komunikasi[0].isiPesan).toContain('Pasang bracket TV 50 inch');

    // Socket.IO RealtimeEmitter memancarkan notification:new, kontrak:new, dan chat:new
    const eventNames = emittedEvents.map((e) => e.event);
    expect(eventNames).toContain('notification:new');
    expect(eventNames).toContain('kontrak:new');
    expect(eventNames).toContain('chat:new');

    // Endpoint GET /api/kontrak/chat/:idLawanBicara mengembalikan kontrakAktif + riwayatChat
    const chatRoomCall = createMockReqRes({
      headers: { authorization: `Bearer ${pelangganToken}` },
      params: { idLawanBicara: 'provider-1' },
    });
    authenticateJWT(chatRoomCall.req, chatRoomCall.res, () => {});
    await integratedController.handleGetKontrakByChatPartner(
      chatRoomCall.req,
      chatRoomCall.res
    );

    expect(chatRoomCall.res.getStatus()).toBe(200);
    const roomData = chatRoomCall.res.getJson().data;
    expect(roomData.kontrakAktif).toBeTruthy();
    expect(roomData.kontrakAktif.detailPekerjaan).toBe(
      'Pasang bracket TV 50 inch'
    );
    expect(roomData.riwayatChat).toHaveLength(1);
  });
});
