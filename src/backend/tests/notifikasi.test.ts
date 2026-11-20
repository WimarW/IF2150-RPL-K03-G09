import type { Request, Response } from 'express';
import { Notifikasi, type NotifikasiRecord } from '../src/models/Notifikasi';
import {
  ExpoPushGateway,
  HttpAppError,
  NotifikasiController,
  type PushGateway,
  type RealtimeEmitter,
} from '../src/controllers/NotifikasiController';

const mockNotifications: NotifikasiRecord[] = [];

jest.mock('../src/database/prisma', () => {
  const delegates = {
    notifikasi: {
      create: jest.fn(async ({ data }: any) => {
        const record: NotifikasiRecord = {
          idNotifikasi: data.idNotifikasi,
          idPenerima: data.idPenerima,
          isiNotifikasi: data.isiNotifikasi,
          waktuNotifikasi:
            data.waktuNotifikasi instanceof Date
              ? data.waktuNotifikasi
              : new Date(data.waktuNotifikasi),
          statusBaca: Boolean(data.statusBaca),
        };
        mockNotifications.push(record);
        return { ...record };
      }),
      findUnique: jest.fn(async ({ where }: any) => {
        const found = mockNotifications.find((n) => n.idNotifikasi === where?.idNotifikasi);
        return found ? { ...found } : null;
      }),
      findFirst: jest.fn(async ({ where }: any) => {
        const rows = mockNotifications
          .filter((n) => (where?.idPenerima ? n.idPenerima === where.idPenerima : true))
          .sort((a, b) => b.waktuNotifikasi.getTime() - a.waktuNotifikasi.getTime());
        return rows[0] ? { ...rows[0] } : null;
      }),
      findMany: jest.fn(async ({ where, take, cursor, skip }: any = {}) => {
        let rows = mockNotifications
          .filter((n) => (where?.idPenerima ? n.idPenerima === where.idPenerima : true))
          .sort((a, b) => {
            const diff = b.waktuNotifikasi.getTime() - a.waktuNotifikasi.getTime();
            return diff !== 0 ? diff : b.idNotifikasi.localeCompare(a.idNotifikasi);
          });

        if (cursor?.idNotifikasi) {
          const idx = rows.findIndex((r) => r.idNotifikasi === cursor.idNotifikasi);
          if (idx >= 0) {
            rows = rows.slice(idx + (skip ?? 0));
          }
        }
        if (typeof take === 'number') {
          rows = rows.slice(0, take);
        }
        return rows.map((r) => ({ ...r }));
      }),
      count: jest.fn(async ({ where }: any = {}) => {
        return mockNotifications.filter((n) => {
          if (where?.idPenerima && n.idPenerima !== where.idPenerima) return false;
          if (typeof where?.statusBaca === 'boolean' && n.statusBaca !== where.statusBaca) {
            return false;
          }
          return true;
        }).length;
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const target = mockNotifications.find((n) => n.idNotifikasi === where?.idNotifikasi);
        if (!target) throw new Error('Notifikasi tidak ditemukan');
        if (typeof data?.statusBaca === 'boolean') {
          target.statusBaca = data.statusBaca;
        }
        return { ...target };
      }),
      updateMany: jest.fn(async ({ where, data }: any) => {
        let count = 0;
        for (const row of mockNotifications) {
          if (where?.idPenerima && row.idPenerima !== where.idPenerima) continue;
          if (typeof where?.statusBaca === 'boolean' && row.statusBaca !== where.statusBaca) {
            continue;
          }
          if (typeof data?.statusBaca === 'boolean') {
            row.statusBaca = data.statusBaca;
          }
          count += 1;
        }
        return { count };
      }),
    },
  };

  return {
    __esModule: true,
    default: delegates,
    prisma: delegates,
  };
});

function createMockReqRes(options: {
  user?: { idPengguna: string };
  query?: Record<string, string>;
  params?: Record<string, string>;
} = {}) {
  const req = {
    user: options.user,
    query: options.query ?? {},
    params: options.params ?? {},
  } as unknown as Request;

  let statusCode = 200;
  let body: any = null;
  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      body = payload;
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => body,
  } as unknown as Response & { getStatus: () => number; getJson: () => any };

  return { req, res };
}

describe('Sistem Notifikasi [C28, C30 | KF06, KF18 | ALGO-065 s.d. ALGO-069]', () => {
  beforeEach(() => {
    mockNotifications.length = 0;
    jest.clearAllMocks();
  });

  it('[C30-UT01] buatNotifikasi menyimpan notifikasi (statusBaca=false), memancarkan Socket.IO notification:new, dan memanggil PushGateway', async () => {
    const pushGateway: PushGateway = {
      sendPush: jest.fn(async () => undefined),
    };
    const realtimeEmitter: RealtimeEmitter = {
      emitToUser: jest.fn(),
    };

    const controller = new NotifikasiController(new Notifikasi(), pushGateway);
    controller.setRealtimeEmitter(realtimeEmitter);

    const saved = await controller.buatNotifikasi('user-1', 'Pesanan baru masuk!');

    expect(saved.idNotifikasi).toMatch(/^NOTIF-/);
    expect(saved.idPenerima).toBe('user-1');
    expect(saved.isiNotifikasi).toBe('Pesanan baru masuk!');
    expect(saved.statusBaca).toBe(false);

    expect(realtimeEmitter.emitToUser).toHaveBeenCalledWith(
      'user-1',
      'notification:new',
      expect.objectContaining({
        idNotifikasi: saved.idNotifikasi,
        isiNotifikasi: 'Pesanan baru masuk!',
      })
    );
    expect(pushGateway.sendPush).toHaveBeenCalledWith('user-1', 'Pesanan baru masuk!');

    // Verifikasi default ExpoPushGateway dan getLastMessage
    const defaultGateway = new ExpoPushGateway();
    await expect(defaultGateway.sendPush('user-1', 'Ping')).resolves.toBeUndefined();

    const model = new Notifikasi('user-1');
    const last = await model.getLastMessage();
    expect(last?.idNotifikasi).toBe(saved.idNotifikasi);
  });

  it('[C30-UT02] buatNotifikasi menolak idPenerima atau isiNotifikasi kosong dengan HttpAppError 400', async () => {
    const controller = new NotifikasiController();

    await expect(controller.buatNotifikasi('', 'Pesan valid')).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_RECIPIENT',
    });

    await expect(controller.buatNotifikasi('user-1', '   ')).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_NOTIFICATION_CONTENT',
    });
  });

  it('[C30-UT03] getNotifikasiPengguna (paginasi + cursor), tandaiSatuNotifikasiTerbaca (200/403/404), dan tandaiSemuaNotifikasiTerbaca', async () => {
    const controller = new NotifikasiController();
    const n1 = await controller.buatNotifikasi('user-1', 'Notif 1');
    const n2 = await controller.buatNotifikasi('user-1', 'Notif 2');
    const n3 = await controller.buatNotifikasi('user-1', 'Notif 3');
    await controller.buatNotifikasi('user-2', 'Notif User Lain');

    // Paginasi limit 2 -> harus ada nextCursor dan unreadCount = 3
    const page1 = await controller.getNotifikasiPengguna('user-1', 2);
    expect(page1.items).toHaveLength(2);
    expect(page1.unreadCount).toBe(3);
    expect(page1.nextCursor).toBeTruthy();

    const page2 = await controller.getNotifikasiPengguna('user-1', 2, page1.nextCursor!);
    expect(page2.items).toHaveLength(1);
    expect(page2.nextCursor).toBeNull();

    // tandaiSatuNotifikasiTerbaca -> 404 tidak ditemukan
    await expect(
      controller.tandaiSatuNotifikasiTerbaca('NOTIF-MISSING', 'user-1')
    ).rejects.toBeInstanceOf(HttpAppError);

    // tandaiSatuNotifikasiTerbaca -> 403 bukan pemilik
    await expect(
      controller.tandaiSatuNotifikasiTerbaca(n1.idNotifikasi, 'user-2')
    ).rejects.toMatchObject({ statusCode: 403, code: 'FORBIDDEN' });

    // tandaiSatuNotifikasiTerbaca -> 200 sukses
    const markedOne = await controller.tandaiSatuNotifikasiTerbaca(n1.idNotifikasi, 'user-1');
    expect(markedOne.statusBaca).toBe(true);

    // tandaiSemuaNotifikasiTerbaca -> menandai sisa 2 notifikasi milik user-1 saja
    const markedAll = await controller.tandaiSemuaNotifikasiTerbaca('user-1');
    expect(markedAll.updatedCount).toBe(2);

    // Notifikasi user-2 tetap belum terbaca
    const user2Notifs = await controller.getNotifikasiPengguna('user-2', 10);
    expect(user2Notifs.unreadCount).toBe(1);
    expect(n2.idNotifikasi).toBeTruthy();
    expect(n3.idNotifikasi).toBeTruthy();
  });

  it('[C30] HTTP Handlers (GET /notifications, PATCH /read-all, PATCH /:id/read) menangani 401, 400, 403, 404, 200, dan 500', async () => {
    const controller = new NotifikasiController();
    const saved = await controller.buatNotifikasi('user-1', 'Halo notifikasi');

    // GET /notifications -> 401, 400 invalid limit, 200 ok
    const getUnauth = createMockReqRes();
    await controller.getNotificationsHandler(getUnauth.req, getUnauth.res);
    expect(getUnauth.res.getStatus()).toBe(401);

    const getBadLimit = createMockReqRes({
      user: { idPengguna: 'user-1' },
      query: { limit: '0' },
    });
    await controller.getNotificationsHandler(getBadLimit.req, getBadLimit.res);
    expect(getBadLimit.res.getStatus()).toBe(400);

    const getOk = createMockReqRes({
      user: { idPengguna: 'user-1' },
      query: { limit: '10' },
    });
    await controller.getNotificationsHandler(getOk.req, getOk.res);
    expect(getOk.res.getStatus()).toBe(200);
    expect(getOk.res.getJson().items).toHaveLength(1);

    // PATCH /:id/read -> 401, 403, 404, 200
    const oneUnauth = createMockReqRes({ params: { id: saved.idNotifikasi } });
    await controller.markOneNotificationReadHandler(oneUnauth.req, oneUnauth.res);
    expect(oneUnauth.res.getStatus()).toBe(401);

    const oneForbidden = createMockReqRes({
      user: { idPengguna: 'user-2' },
      params: { id: saved.idNotifikasi },
    });
    await controller.markOneNotificationReadHandler(oneForbidden.req, oneForbidden.res);
    expect(oneForbidden.res.getStatus()).toBe(403);

    const oneNotFound = createMockReqRes({
      user: { idPengguna: 'user-1' },
      params: { id: 'NOTIF-NONE' },
    });
    await controller.markOneNotificationReadHandler(oneNotFound.req, oneNotFound.res);
    expect(oneNotFound.res.getStatus()).toBe(404);

    const oneOk = createMockReqRes({
      user: { idPengguna: 'user-1' },
      params: { id: saved.idNotifikasi },
    });
    await controller.markOneNotificationReadHandler(oneOk.req, oneOk.res);
    expect(oneOk.res.getStatus()).toBe(200);
    expect(oneOk.res.getJson().statusBaca).toBe(true);

    // PATCH /read-all -> 401 & 200
    const allUnauth = createMockReqRes();
    await controller.markAllNotificationsReadHandler(allUnauth.req, allUnauth.res);
    expect(allUnauth.res.getStatus()).toBe(401);

    const allOk = createMockReqRes({ user: { idPengguna: 'user-1' } });
    await controller.markAllNotificationsReadHandler(allOk.req, allOk.res);
    expect(allOk.res.getStatus()).toBe(200);

    // 500 unexpected error branch
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(controller, 'getNotifikasiPengguna').mockRejectedValueOnce(new Error('DB down'));
    const getErr = createMockReqRes({ user: { idPengguna: 'user-1' } });
    await controller.getNotificationsHandler(getErr.req, getErr.res);
    expect(getErr.res.getStatus()).toBe(500);
    errSpy.mockRestore();
  });
});
