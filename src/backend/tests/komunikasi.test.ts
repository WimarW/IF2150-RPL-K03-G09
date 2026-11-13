import type { Request, Response } from 'express';
import {
  Komunikasi,
  type KomunikasiRecord,
} from '../src/models/Komunikasi';
import { KomunikasiController } from '../src/controllers/KomunikasiController';
import type {
  NotifikasiController,
  RealtimeEmitter,
} from '../src/controllers/NotifikasiController';

interface MockPenggunaRow {
  idPengguna: string;
  namaPengguna: string;
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

const mockUsers = new Map<string, MockPenggunaRow>();
const mockMessages: MockKomunikasiRow[] = [];

const matchesSimpleFilter = (
  row: MockKomunikasiRow,
  filter: Record<string, unknown>
): boolean => {
  if (filter.OR && Array.isArray(filter.OR)) {
    return filter.OR.some((branch) =>
      matchesSimpleFilter(row, branch as Record<string, unknown>)
    );
  }

  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined) continue;
    if ((row as unknown as Record<string, unknown>)[key] !== value) {
      return false;
    }
  }

  return true;
};

jest.mock('../src/database/prisma', () => {
  const delegates: Record<string, any> = {
    pengguna: {
      findUnique: jest.fn(async (args: any) => {
        const idPengguna = args?.where?.idPengguna;
        if (typeof idPengguna !== 'string') return null;
        const user = mockUsers.get(idPengguna);
        if (!user) return null;

        if (args?.select) {
          const selected: Record<string, unknown> = {};
          for (const [field, enabled] of Object.entries(args.select)) {
            if (enabled) {
              selected[field] = (user as unknown as Record<string, unknown>)[field];
            }
          }
          return selected;
        }

        return { ...user };
      }),
    },
    komunikasi: {
      create: jest.fn(async (args: any) => {
        const data = args.data;
        const row: MockKomunikasiRow = {
          idChat: data.idChat,
          idPengguna: data.idPengguna,
          idPenerima: data.idPenerima,
          isiPesan: data.isiPesan,
          waktuTerkirim:
            data.waktuTerkirim instanceof Date
              ? data.waktuTerkirim
              : new Date(data.waktuTerkirim),
          isChatTerbaca: Boolean(data.isChatTerbaca),
          statusChat: data.statusChat ?? 'SENT',
          durasiChat: typeof data.durasiChat === 'number' ? data.durasiChat : 0,
        };
        mockMessages.push(row);
        return { ...row };
      }),
      findUnique: jest.fn(async (args: any) => {
        const idChat = args?.where?.idChat;
        const found = mockMessages.find((item) => item.idChat === idChat);
        return found ? { ...found } : null;
      }),
      findMany: jest.fn(async (args: any = {}) => {
        let rows = mockMessages.filter((row) =>
          args.where ? matchesSimpleFilter(row, args.where) : true
        );

        if (args.orderBy?.waktuTerkirim) {
          const dir = args.orderBy.waktuTerkirim === 'desc' ? -1 : 1;
          rows = [...rows].sort(
            (a, b) =>
              (a.waktuTerkirim.getTime() - b.waktuTerkirim.getTime()) * dir
          );
        }

        if (Array.isArray(args.distinct) && args.distinct.length > 0) {
          const seen = new Set<string>();
          rows = rows.filter((row) => {
            const key = (args.distinct as string[])
              .map((field) => String((row as unknown as Record<string, unknown>)[field]))
              .join('::');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }

        return rows.map((row) => {
          const record: Record<string, unknown> = { ...row };
          if (args.include?.pengirim) {
            const sender = mockUsers.get(row.idPengguna);
            record.pengirim = sender ? { ...sender } : null;
          }
          if (args.include?.penerima) {
            const recipient = mockUsers.get(row.idPenerima);
            record.penerima = recipient ? { ...recipient } : null;
          }
          return record;
        });
      }),
      groupBy: jest.fn(async (args: any = {}) => {
        const filtered = mockMessages.filter((row) =>
          args.where ? matchesSimpleFilter(row, args.where) : true
        );
        const counts = new Map<string, number>();

        for (const row of filtered) {
          counts.set(row.idPengguna, (counts.get(row.idPengguna) ?? 0) + 1);
        }

        return Array.from(counts.entries()).map(([idPengguna, count]) => ({
          idPengguna,
          _count: { idChat: count },
        }));
      }),
      updateMany: jest.fn(async (args: any) => {
        const where = args?.where ?? {};
        const data = args?.data ?? {};
        let count = 0;

        for (const row of mockMessages) {
          if (matchesSimpleFilter(row, where)) {
            if (typeof data.isChatTerbaca === 'boolean') {
              row.isChatTerbaca = data.isChatTerbaca;
            }
            count += 1;
          }
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

interface MockRes {
  statusCode: number;
  body: any;
  status: jest.Mock;
  json: jest.Mock;
}

const createMockReq = (options: {
  user?: { idPengguna: string; role?: string };
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}): Request => {
  const normalizedHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(options.headers ?? {})) {
    normalizedHeaders[k.toLowerCase()] = v;
  }

  return {
    user: options.user,
    body: options.body ?? {},
    params: options.params ?? {},
    query: options.query ?? {},
    headers: normalizedHeaders,
    header: (name: string) => normalizedHeaders[name.toLowerCase()],
  } as unknown as Request;
};

const createMockRes = (): MockRes & Response => {
  const res: MockRes = {
    statusCode: 200,
    body: undefined as unknown,
    status: jest.fn(),
    json: jest.fn(),
  };

  res.status.mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });

  res.json.mockImplementation((payload: unknown) => {
    res.body = payload;
    return res;
  });

  return res as unknown as MockRes & Response;
};

describe('[KF09] Unit Test Model Komunikasi (UC03, UC04 | ALGO-044 s.d. ALGO-048)', () => {
  beforeEach(() => {
    mockUsers.clear();
    mockMessages.length = 0;
    mockUsers.set('pelanggan-01', {
      idPengguna: 'pelanggan-01',
      namaPengguna: 'Budi Pelanggan',
    });
    mockUsers.set('penyedia-01', {
      idPengguna: 'penyedia-01',
      namaPengguna: 'Siti Tukang AC',
    });
    mockUsers.set('penyedia-02', {
      idPengguna: 'penyedia-02',
      namaPengguna: 'Andi Teknisi',
    });
  });

  it('[KF09][ALGO-044][ALGO-046] menginisialisasi entitas Komunikasi beserta ID otomatis dan getter', () => {
    const model = new Komunikasi({
      idPengirim: 'pelanggan-01',
      idPenerima: 'penyedia-01',
      isiPesan: 'Halo, apakah biaya servis AC bisa dinego menjadi 150rb?',
    });

    expect(model.getIDChat()).toMatch(/^CHAT-/);
    const attrs = model.getAtributInternal();
    expect(attrs.idPengguna).toBe('pelanggan-01');
    expect(attrs.idPenerima).toBe('penyedia-01');
    expect(attrs.isiPesan).toBe(
      'Halo, apakah biaya servis AC bisa dinego menjadi 150rb?'
    );
    expect(attrs.isChatTerbaca).toBe(false);
    expect(attrs.statusChat).toBe('SENT');
    expect(attrs.durasiChat).toBe(0);
    expect(attrs.waktuTerkirim).toBeInstanceOf(Date);
  });

  it('[KF09][ALGO-045][ALGO-047] saveChat, simpanPesan, dan getPesan menyimpan serta mengambil pesan dari DB', async () => {
    const model = new Komunikasi({
      idChat: 'CHAT-NEGOSIASI-001',
      idPengirim: 'pelanggan-01',
      idPenerima: 'penyedia-01',
      isiPesan: 'Mohon konfirmasi estimasi biaya kunjungan.',
    });

    const saved = await model.saveChat();
    expect(saved.idChat).toBe('CHAT-NEGOSIASI-001');
    expect(saved.idPengguna).toBe('pelanggan-01');
    expect(saved.idPenerima).toBe('penyedia-01');

    const fetched = await model.getPesan('CHAT-NEGOSIASI-001');
    expect(fetched).not.toBeNull();
    expect(fetched?.isiPesan).toBe('Mohon konfirmasi estimasi biaya kunjungan.');

    const missing = await model.getPesan('CHAT-TIDAK-ADA');
    expect(missing).toBeNull();

    const savedSecond = await model.simpanPesan({
      idChat: 'CHAT-NEGOSIASI-002',
      idPengirim: 'penyedia-01',
      idPenerima: 'pelanggan-01',
      isiPesan: 'Baik pak, harga sepakat 150rb.',
    });
    expect(savedSecond.idChat).toBe('CHAT-NEGOSIASI-002');
    expect(mockMessages).toHaveLength(2);
  });

  it('[KF09][ALGO-048] getChatHistory mengembalikan riwayat dua arah terurut ascending dan terisolasi dari user lain', async () => {
    mockMessages.push(
      {
        idChat: 'CHAT-02',
        idPengguna: 'penyedia-01',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Bisa 160rb termasuk cuci unit.',
        waktuTerkirim: new Date('2026-11-01T10:05:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-01',
        idPengguna: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: 'Harga 150rb bisa kak?',
        waktuTerkirim: new Date('2026-11-01T10:00:00.000Z'),
        isChatTerbaca: true,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-LAIN',
        idPengguna: 'pelanggan-01',
        idPenerima: 'penyedia-02',
        isiPesan: 'Pesan untuk teknisi lain',
        waktuTerkirim: new Date('2026-11-01T10:02:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      }
    );

    const model = new Komunikasi();
    const history = await model.getChatHistory('pelanggan-01', 'penyedia-01');

    expect(history).toHaveLength(2);
    expect(history.map((msg) => msg.idChat)).toEqual(['CHAT-01', 'CHAT-02']);
    expect(history.some((msg) => msg.idChat === 'CHAT-LAIN')).toBe(false);
  });

  it('[KF09] markMessagesAsRead hanya menandai pesan unread dari lawan bicara ke pengguna login', async () => {
    mockMessages.push(
      {
        idChat: 'CHAT-R1',
        idPengguna: 'penyedia-01',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Pesan unread 1',
        waktuTerkirim: new Date('2026-11-01T10:00:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-R2',
        idPengguna: 'penyedia-01',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Pesan unread 2',
        waktuTerkirim: new Date('2026-11-01T10:01:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-R3',
        idPengguna: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: 'Pesan dari pelanggan ke penyedia tetap unread oleh penyedia',
        waktuTerkirim: new Date('2026-11-01T10:02:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      }
    );

    const model = new Komunikasi();
    const updatedCount = await model.markMessagesAsRead(
      'pelanggan-01',
      'penyedia-01'
    );

    expect(updatedCount).toBe(2);
    expect(mockMessages.find((m) => m.idChat === 'CHAT-R1')?.isChatTerbaca).toBe(
      true
    );
    expect(mockMessages.find((m) => m.idChat === 'CHAT-R2')?.isChatTerbaca).toBe(
      true
    );
    expect(mockMessages.find((m) => m.idChat === 'CHAT-R3')?.isChatTerbaca).toBe(
      false
    );
  });

  it('[KF09] getConversationsByUser merangkum percakapan terbaru dan unreadCount akurat per lawan bicara', async () => {
    mockMessages.push(
      {
        idChat: 'CHAT-C1',
        idPengguna: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: 'Halo Bu Siti',
        waktuTerkirim: new Date('2026-11-01T09:00:00.000Z'),
        isChatTerbaca: true,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-C2',
        idPengguna: 'penyedia-01',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Halo, jadi besok jam 9 ya?',
        waktuTerkirim: new Date('2026-11-01T11:30:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-C3',
        idPengguna: 'penyedia-02',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Siap kak',
        waktuTerkirim: new Date('2026-11-01T10:00:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      },
      {
        idChat: 'CHAT-C4',
        idPengguna: 'penyedia-02',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Ongkos transport 20rb',
        waktuTerkirim: new Date('2026-11-01T10:15:00.000Z'),
        isChatTerbaca: false,
        statusChat: 'SENT',
        durasiChat: 0,
      }
    );

    const model = new Komunikasi();
    const conversations = await model.getConversationsByUser('pelanggan-01');

    expect(conversations).toHaveLength(2);
    expect(conversations[0]).toMatchObject({
      idLawanBicara: 'penyedia-01',
      namaLawanBicara: 'Siti Tukang AC',
      isiPesanTerakhir: 'Halo, jadi besok jam 9 ya?',
      unreadCount: 1,
    });
    expect(conversations[1]).toMatchObject({
      idLawanBicara: 'penyedia-02',
      namaLawanBicara: 'Andi Teknisi',
      isiPesanTerakhir: 'Ongkos transport 20rb',
      unreadCount: 2,
    });
  });
});

describe('[KF09] Integration Test KomunikasiController & Chat Handlers (UC03, UC04 | ALGO-049 s.d. ALGO-052)', () => {
  let controller: KomunikasiController;
  let mockRealtimeEmitter: jest.Mocked<RealtimeEmitter>;
  let mockNotifController: jest.Mocked<Pick<NotifikasiController, 'buatNotifikasi' | 'setRealtimeEmitter'>>;

  beforeEach(() => {
    mockUsers.clear();
    mockMessages.length = 0;
    mockUsers.set('pelanggan-01', {
      idPengguna: 'pelanggan-01',
      namaPengguna: 'Budi Pelanggan',
    });
    mockUsers.set('penyedia-01', {
      idPengguna: 'penyedia-01',
      namaPengguna: 'Siti Tukang AC',
    });

    mockRealtimeEmitter = {
      emitToUser: jest.fn(),
    };
    mockNotifController = {
      buatNotifikasi: jest.fn().mockResolvedValue({ idNotifikasi: 'NOTIF-1' }),
      setRealtimeEmitter: jest.fn(),
    };

    controller = new KomunikasiController(
      new Komunikasi(),
      mockNotifController as unknown as NotifikasiController,
      mockRealtimeEmitter
    );
  });

  it('[KF09][ALGO-049] kirimPesan berhasil menyimpan chat, memancarkan Socket.IO chat:new, dan memicu NotifikasiController', async () => {
    const saved = await controller.kirimPesan({
      idPengirim: 'pelanggan-01',
      idPenerima: 'penyedia-01',
      isiPesan: '  Apakah bisa nego harga servis AC?  ',
    });

    expect(saved.idPengguna).toBe('pelanggan-01');
    expect(saved.idPenerima).toBe('penyedia-01');
    expect(saved.isiPesan).toBe('Apakah bisa nego harga servis AC?');
    expect(mockMessages).toHaveLength(1);
    expect(mockRealtimeEmitter.emitToUser).toHaveBeenCalledWith(
      'penyedia-01',
      'chat:new',
      expect.objectContaining({
        idChat: saved.idChat,
        isiPesan: 'Apakah bisa nego harga servis AC?',
      })
    );
    expect(mockNotifController.buatNotifikasi).toHaveBeenCalledWith(
      'penyedia-01',
      'Pesan baru: Apakah bisa nego harga servis AC?'
    );
  });

  it('[KF09][ALGO-049] sendChat tidak menggagalkan pengiriman pesan meski NotifikasiController melempar error', async () => {
    mockNotifController.buatNotifikasi.mockRejectedValueOnce(
      new Error('Notification service down')
    );
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    try {
      const saved = await controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: 'Pesan tetap harus terkirim.',
      });

      expect(saved.isiPesan).toBe('Pesan tetap harus terkirim.');
      expect(mockMessages).toHaveLength(1);
      expect(consoleErrorSpy).toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('[KF09] kirimPesan menolak input tidak valid (pengirim kosong, penerima kosong, self-message, non-string, kosong, >1000 char, penerima 404)', async () => {
    await expect(
      controller.kirimPesan({
        idPengirim: '   ',
        idPenerima: 'penyedia-01',
        isiPesan: 'Halo',
      })
    ).rejects.toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });

    await expect(
      controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: '',
        isiPesan: 'Halo',
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_RECIPIENT' });

    await expect(
      controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: 'pelanggan-01',
        isiPesan: 'Chat ke diri sendiri',
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'SELF_MESSAGE_NOT_ALLOWED',
    });

    await expect(
      controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: 12345 as unknown as string,
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_MESSAGE_TYPE' });

    await expect(
      controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: '    ',
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'EMPTY_MESSAGE' });

    await expect(
      controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: 'penyedia-01',
        isiPesan: 'A'.repeat(1001),
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'MESSAGE_TOO_LONG' });

    await expect(
      controller.kirimPesan({
        idPengirim: 'pelanggan-01',
        idPenerima: 'penyedia-tidak-terdaftar',
        isiPesan: 'Halo',
      })
    ).rejects.toMatchObject({ statusCode: 404, code: 'RECIPIENT_NOT_FOUND' });
  });

  it('[KF09][ALGO-049] sendChatHandler mengembalikan 401 tanpa auth, 403 saat spoofing pengirim, dan 201 saat valid', async () => {
    const resUnauth = createMockRes();
    await controller.sendChatHandler(
      createMockReq({
        body: { idPenerima: 'penyedia-01', isiPesan: 'Halo' },
      }),
      resUnauth
    );
    expect(resUnauth.statusCode).toBe(401);
    expect(resUnauth.body).toEqual({
      error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
    });

    const resSpoof = createMockRes();
    await controller.sendChatHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        body: {
          idPengirim: 'user-palsu',
          idPenerima: 'penyedia-01',
          isiPesan: 'Halo',
        },
      }),
      resSpoof
    );
    expect(resSpoof.statusCode).toBe(403);
    expect(resSpoof.body.error.code).toBe('FORBIDDEN');

    const resCreated = createMockRes();
    await controller.sendChatHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        body: {
          idPenerima: 'penyedia-01',
          isiPesan: 'Deal di 150rb ya kak.',
        },
      }),
      resCreated
    );
    expect(resCreated.statusCode).toBe(201);
    expect((resCreated.body as KomunikasiRecord).idPengguna).toBe('pelanggan-01');
    expect((resCreated.body as KomunikasiRecord).isiPesan).toBe(
      'Deal di 150rb ya kak.'
    );
  });

  it('[KF09][ALGO-050][ALGO-051][ALGO-052] getChatHistoryHandler menangani 401, 403 akses user lain, 400 partner kosong, serta mode startChat dan loadChat', async () => {
    mockMessages.push({
      idChat: 'CHAT-H1',
      idPengguna: 'pelanggan-01',
      idPenerima: 'penyedia-01',
      isiPesan: 'Diskon ongkos pasang bisa?',
      waktuTerkirim: new Date('2026-11-01T12:00:00.000Z'),
      isChatTerbaca: false,
      statusChat: 'SENT',
      durasiChat: 0,
    });

    const resUnauth = createMockRes();
    await controller.getChatHistoryHandler(
      createMockReq({ params: { idLawanBicara: 'penyedia-01' } }),
      resUnauth
    );
    expect(resUnauth.statusCode).toBe(401);

    const resForbiddenQuery = createMockRes();
    await controller.getChatHistoryHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: 'penyedia-01' },
        query: { asUserId: 'user-lain' },
      }),
      resForbiddenQuery
    );
    expect(resForbiddenQuery.statusCode).toBe(403);
    expect(resForbiddenQuery.body.error.code).toBe('FORBIDDEN');

    const resForbiddenHeader = createMockRes();
    await controller.getChatHistoryHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: 'penyedia-01' },
        headers: { 'x-user-id': 'user-lain' },
      }),
      resForbiddenHeader
    );
    expect(resForbiddenHeader.statusCode).toBe(403);

    const resBadPartner = createMockRes();
    await controller.getChatHistoryHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: '   ' },
      }),
      resBadPartner
    );
    expect(resBadPartner.statusCode).toBe(400);
    expect(resBadPartner.body.error.code).toBe('INVALID_PARTNER_ID');

    const startChatSpy = jest.spyOn(controller, 'startChat');
    const loadChatSpy = jest.spyOn(controller, 'loadChat');

    const resLoad = createMockRes();
    await controller.getChatHistoryHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: 'penyedia-01' },
      }),
      resLoad
    );
    expect(resLoad.statusCode).toBe(200);
    expect(loadChatSpy).toHaveBeenCalledWith('pelanggan-01', 'penyedia-01');
    expect((resLoad.body as KomunikasiRecord[])[0].idChat).toBe('CHAT-H1');

    const resStart = createMockRes();
    await controller.getChatHistoryHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: 'penyedia-01' },
        query: { action: 'start' },
      }),
      resStart
    );
    expect(resStart.statusCode).toBe(200);
    expect(startChatSpy).toHaveBeenCalledWith('pelanggan-01', 'penyedia-01');
  });

  it('[KF09] getConversationsHandler dan markChatReadHandler menangani 401, 400, dan 200 dengan akurat', async () => {
    mockMessages.push({
      idChat: 'CHAT-M1',
      idPengguna: 'penyedia-01',
      idPenerima: 'pelanggan-01',
      isiPesan: 'Oke sepakat 150rb.',
      waktuTerkirim: new Date('2026-11-01T13:00:00.000Z'),
      isChatTerbaca: false,
      statusChat: 'SENT',
      durasiChat: 0,
    });

    const resConvUnauth = createMockRes();
    await controller.getConversationsHandler(createMockReq({}), resConvUnauth);
    expect(resConvUnauth.statusCode).toBe(401);

    const resConvOk = createMockRes();
    await controller.getConversationsHandler(
      createMockReq({ user: { idPengguna: 'pelanggan-01' } }),
      resConvOk
    );
    expect(resConvOk.statusCode).toBe(200);
    expect(resConvOk.body).toHaveLength(1);
    expect(resConvOk.body[0].unreadCount).toBe(1);

    const resReadUnauth = createMockRes();
    await controller.markChatReadHandler(
      createMockReq({ params: { idLawanBicara: 'penyedia-01' } }),
      resReadUnauth
    );
    expect(resReadUnauth.statusCode).toBe(401);

    const resReadBadParam = createMockRes();
    await controller.markChatReadHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: '' },
      }),
      resReadBadParam
    );
    expect(resReadBadParam.statusCode).toBe(400);
    expect(resReadBadParam.body.error.code).toBe('INVALID_PARTNER_ID');

    const resReadOk = createMockRes();
    await controller.markChatReadHandler(
      createMockReq({
        user: { idPengguna: 'pelanggan-01' },
        params: { idLawanBicara: 'penyedia-01' },
      }),
      resReadOk
    );
    expect(resReadOk.statusCode).toBe(200);
    expect(resReadOk.body).toEqual({ updatedCount: 1 });
  });
});
