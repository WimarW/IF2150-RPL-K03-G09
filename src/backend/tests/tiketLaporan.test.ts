import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../src/database/prisma';
import {
  JENIS_TIKET,
  TiketLaporanController,
} from '../src/controllers/TiketLaporanController';
import { LayananPelangganCtrl } from '../src/controllers/LayananPelangganCtrl';
import { NotifikasiController } from '../src/controllers/NotifikasiController';
import { LayananPelanggan } from '../src/models/LayananPelanggan';
import { authorizeRoles } from '../src/middlewares/auth.middleware';

interface MockUserRow {
  idPengguna: string;
  namaPengguna: string;
  role: Role;
}

interface MockCsRow {
  idLayananPelanggan: string;
  status: string;
  jumlahTiketDipegang: number;
}

interface MockTiketRow {
  idTiket: string;
  idPengguna: string;
  idLayananPelanggan: string | null;
  jenisTiket: string;
  keteranganTiket: string;
  buktiFotoUrl: string | null;
  tanggalTiket: Date;
  statusTiket: string;
}

interface MockKomunikasiRow {
  idChat: string;
  idTiket: string | null;
  idPengguna: string;
  idPenerima: string;
  isiPesan: string;
  lampiranUrl: string | null;
  waktuTerkirim: Date;
}

const mockStore = {
  seqCounter: 2040,
  chatCounter: 0,
  users: new Map<string, MockUserRow>(),
  layananPelanggan: new Map<string, MockCsRow>(),
  tiketLaporan: new Map<string, MockTiketRow>(),
  komunikasi: [] as MockKomunikasiRow[],
};

jest.mock('../src/database/prisma', () => {
  const buildDelegates = () => {
    const delegates: Record<string, any> = {
      $queryRaw: jest.fn(async (strings: TemplateStringsArray | string, ..._values: unknown[]) => {
        const sql = Array.isArray(strings) ? strings.join(' ') : String(strings);

        if (sql.includes("nextval('seq_nomor_tiket')")) {
          mockStore.seqCounter += 1;
          return [{ n: BigInt(mockStore.seqCounter) }];
        }

        if (sql.includes('layanan_pelanggan')) {
          const candidates = Array.from(mockStore.layananPelanggan.values())
            .filter((cs) => cs.status === 'Available' || cs.jumlahTiketDipegang < 5)
            .sort((a, b) => {
              if (a.jumlahTiketDipegang !== b.jumlahTiketDipegang) {
                return a.jumlahTiketDipegang - b.jumlahTiketDipegang;
              }
              return a.idLayananPelanggan.localeCompare(b.idLayananPelanggan);
            });

          if (candidates.length === 0) {
            return [];
          }
          return [{ id_layanan_pelanggan: candidates[0].idLayananPelanggan }];
        }

        if (sql.includes('tiket_laporan')) {
          return [];
        }

        return [];
      }),
      tiketLaporan: {
        create: jest.fn(async ({ data }: any) => {
          const row: MockTiketRow = {
            idTiket: data.idTiket,
            idPengguna: data.idPengguna,
            idLayananPelanggan: data.idLayananPelanggan ?? null,
            jenisTiket: data.jenisTiket,
            keteranganTiket: data.keteranganTiket,
            buktiFotoUrl: data.buktiFotoUrl ?? null,
            tanggalTiket: data.tanggalTiket ?? new Date(),
            statusTiket: data.statusTiket ?? 'Open',
          };
          mockStore.tiketLaporan.set(row.idTiket, row);
          return { ...row };
        }),
        findUnique: jest.fn(async ({ where, include }: any) => {
          const row = mockStore.tiketLaporan.get(where.idTiket);
          if (!row) return null;
          const result: any = { ...row };
          if (include?.pelapor) {
            const pelapor = mockStore.users.get(row.idPengguna);
            result.pelapor = pelapor
              ? { namaPengguna: pelapor.namaPengguna, role: pelapor.role }
              : { namaPengguna: 'Unknown', role: Role.PELANGGAN };
          }
          return result;
        }),
        findMany: jest.fn(async ({ where, orderBy, include }: any = {}) => {
          let rows = Array.from(mockStore.tiketLaporan.values()).filter((t) => {
            if (where?.idPengguna && t.idPengguna !== where.idPengguna) {
              return false;
            }
            if (where?.statusTiket && t.statusTiket !== where.statusTiket) {
              return false;
            }
            if (where?.OR) {
              const matched = where.OR.some((cond: any) => {
                if ('idLayananPelanggan' in cond) {
                  return t.idLayananPelanggan === cond.idLayananPelanggan;
                }
                return false;
              });
              if (!matched) return false;
            }
            return true;
          });

          if (orderBy?.tanggalTiket === 'desc') {
            rows = [...rows].sort(
              (a, b) => b.tanggalTiket.getTime() - a.tanggalTiket.getTime()
            );
          }

          return rows.map((row) => {
            const item: any = { ...row };
            if (include?.pelapor) {
              const pelapor = mockStore.users.get(row.idPengguna);
              item.pelapor = pelapor
                ? { namaPengguna: pelapor.namaPengguna, role: pelapor.role }
                : { namaPengguna: 'Unknown', role: Role.PELANGGAN };
            }
            return item;
          });
        }),
        update: jest.fn(async ({ where, data }: any) => {
          const row = mockStore.tiketLaporan.get(where.idTiket);
          if (!row) throw new Error('Tiket tidak ditemukan');
          Object.assign(row, data);
          return { ...row };
        }),
        groupBy: jest.fn(async ({ where }: any) => {
          const rows = Array.from(mockStore.tiketLaporan.values()).filter((t) => {
            if (where?.OR) {
              return where.OR.some(
                (cond: any) =>
                  'idLayananPelanggan' in cond &&
                  t.idLayananPelanggan === cond.idLayananPelanggan
              );
            }
            return true;
          });

          const counts = new Map<string, number>();
          for (const row of rows) {
            counts.set(row.statusTiket, (counts.get(row.statusTiket) ?? 0) + 1);
          }

          return Array.from(counts.entries()).map(([statusTiket, count]) => ({
            statusTiket,
            _count: { _all: count },
          }));
        }),
      },
      layananPelanggan: {
        update: jest.fn(async ({ where, data }: any) => {
          const cs = mockStore.layananPelanggan.get(where.idLayananPelanggan);
          if (!cs) throw new Error('CS tidak ditemukan');
          if (data.jumlahTiketDipegang?.increment) {
            cs.jumlahTiketDipegang += data.jumlahTiketDipegang.increment;
          } else if (typeof data.jumlahTiketDipegang === 'number') {
            cs.jumlahTiketDipegang = data.jumlahTiketDipegang;
          }
          if (data.status !== undefined) {
            cs.status = data.status;
          }
          return { ...cs };
        }),
        updateMany: jest.fn(async ({ where, data }: any) => {
          const cs = mockStore.layananPelanggan.get(where.idLayananPelanggan);
          if (!cs) return { count: 0 };
          if (
            where.jumlahTiketDipegang?.gt !== undefined &&
            !(cs.jumlahTiketDipegang > where.jumlahTiketDipegang.gt)
          ) {
            return { count: 0 };
          }
          if (data.jumlahTiketDipegang?.decrement) {
            cs.jumlahTiketDipegang -= data.jumlahTiketDipegang.decrement;
          }
          return { count: 1 };
        }),
      },
      komunikasi: {
        create: jest.fn(async ({ data }: any) => {
          mockStore.chatCounter += 1;
          const row: MockKomunikasiRow = {
            idChat: `CHAT-TIKET-${mockStore.chatCounter}`,
            idTiket: data.idTiket ?? null,
            idPengguna: data.idPengguna,
            idPenerima: data.idPenerima,
            isiPesan: data.isiPesan,
            lampiranUrl: data.lampiranUrl ?? null,
            waktuTerkirim: new Date(),
          };
          mockStore.komunikasi.push(row);
          return { ...row };
        }),
        findMany: jest.fn(async ({ where, orderBy, include }: any = {}) => {
          let rows = mockStore.komunikasi.filter((m) =>
            where?.idTiket ? m.idTiket === where.idTiket : true
          );
          if (orderBy?.waktuTerkirim === 'asc') {
            rows = [...rows].sort(
              (a, b) => a.waktuTerkirim.getTime() - b.waktuTerkirim.getTime()
            );
          }
          return rows.map((m) => {
            const item: any = { ...m };
            if (include?.pengirim) {
              const sender = mockStore.users.get(m.idPengguna);
              item.pengirim = { role: sender?.role ?? Role.PELANGGAN };
            }
            return item;
          });
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

function createMockReqRes(options: {
  user?: { idPengguna: string; username: string; role: Role };
  body?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  file?: { filename: string };
} = {}) {
  const req = {
    user: options.user,
    body: options.body ?? {},
    params: options.params ?? {},
    query: options.query ?? {},
    file: options.file,
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

function seedDefaultUsersAndCs() {
  mockStore.users.set('pelanggan-1', {
    idPengguna: 'pelanggan-1',
    namaPengguna: 'Budi Pelanggan',
    role: Role.PELANGGAN,
  });
  mockStore.users.set('pelanggan-2', {
    idPengguna: 'pelanggan-2',
    namaPengguna: 'Siti Pelapor Lain',
    role: Role.PELANGGAN,
  });
  mockStore.users.set('mitra-1', {
    idPengguna: 'mitra-1',
    namaPengguna: 'Ahmad Pemberi Jasa',
    role: Role.PEMBERI_JASA,
  });
  mockStore.users.set('cs-1', {
    idPengguna: 'cs-1',
    namaPengguna: 'CS Rina',
    role: Role.LAYANAN_PELANGGAN,
  });
  mockStore.users.set('cs-2', {
    idPengguna: 'cs-2',
    namaPengguna: 'CS Doni',
    role: Role.LAYANAN_PELANGGAN,
  });

  mockStore.layananPelanggan.set('cs-1', {
    idLayananPelanggan: 'cs-1',
    status: 'Available',
    jumlahTiketDipegang: 2,
  });
  mockStore.layananPelanggan.set('cs-2', {
    idLayananPelanggan: 'cs-2',
    status: 'Available',
    jumlahTiketDipegang: 1,
  });
}

describe('Sistem Tiket Laporan & Penugasan Otomatis CS [KF14 s.d. KF18 | UC08, UC09]', () => {
  let mockNotifikasi: NotifikasiController;
  let buatNotifikasiMock: jest.Mock;

  beforeEach(() => {
    mockStore.seqCounter = 2040;
    mockStore.chatCounter = 0;
    mockStore.users.clear();
    mockStore.layananPelanggan.clear();
    mockStore.tiketLaporan.clear();
    mockStore.komunikasi = [];
    seedDefaultUsersAndCs();

    buatNotifikasiMock = jest.fn().mockResolvedValue(null);
    mockNotifikasi = {
      buatNotifikasi: buatNotifikasiMock,
    } as unknown as NotifikasiController;
    LayananPelangganCtrl.setNotifikasiController(mockNotifikasi);
  });

  describe('Validasi Form Tiket [KF14, KF16 | ALGO-053]', () => {
    it.each(JENIS_TIKET)(
      '[KF14, KF16 | ALGO-053] mengembalikan true untuk jenisTiket valid: %s',
      (validJenis) => {
        expect(
          TiketLaporanController.validasiFormTiket(
            validJenis,
            'Pembayaran belum terkonfirmasi oleh sistem'
          )
        ).toBe(true);
      }
    );

    it('[KF14, KF16 | ALGO-053] mengembalikan false jika jenisTiket di luar JENIS_TIKET, kosong, atau bukan string', () => {
      expect(TiketLaporanController.validasiFormTiket('Kategori Asal', 'Deskripsi')).toBe(false);
      expect(TiketLaporanController.validasiFormTiket('   ', 'Deskripsi')).toBe(false);
      expect(TiketLaporanController.validasiFormTiket(123, 'Deskripsi')).toBe(false);
      expect(TiketLaporanController.validasiFormTiket(undefined, 'Deskripsi')).toBe(false);
    });

    it('[KF14, KF16 | ALGO-053] mengembalikan false jika keteranganTiket kosong, hanya spasi, atau bukan string', () => {
      expect(TiketLaporanController.validasiFormTiket('Kendala Aplikasi', '')).toBe(false);
      expect(TiketLaporanController.validasiFormTiket('Kendala Aplikasi', '    ')).toBe(false);
      expect(TiketLaporanController.validasiFormTiket('Kendala Aplikasi', null)).toBe(false);
      expect(TiketLaporanController.validasiFormTiket('Kendala Aplikasi', 999)).toBe(false);
    });
  });

  describe('Pencarian Staf CS Kosong & Manajemen Beban [KF15, KF17 | ALGO-019]', () => {
    it('[KF15, KF17 | ALGO-019] cariLayananKosong memilih CS dengan jumlahTiketDipegang terkecil (Available atau < 5)', async () => {
      const idCs = await LayananPelanggan.cariLayananKosong(prisma as any);
      expect(idCs).toBe('cs-2');

      mockStore.layananPelanggan.set('cs-3', {
        idLayananPelanggan: 'cs-3',
        status: 'Busy',
        jumlahTiketDipegang: 0,
      });
      const idCsLowestLoad = await LayananPelanggan.cariLayananKosong(prisma as any);
      expect(idCsLowestLoad).toBe('cs-3');
    });

    it('[KF15, KF17 | ALGO-019] cariLayananKosong mengembalikan null jika semua CS tidak memenuhi syarat (status !== Available dan beban >= 5)', async () => {
      mockStore.layananPelanggan.set('cs-1', {
        idLayananPelanggan: 'cs-1',
        status: 'Busy',
        jumlahTiketDipegang: 5,
      });
      mockStore.layananPelanggan.set('cs-2', {
        idLayananPelanggan: 'cs-2',
        status: 'Offline',
        jumlahTiketDipegang: 7,
      });

      const idCs = await LayananPelanggan.cariLayananKosong(prisma as any);
      expect(idCs).toBeNull();
    });

    it('[KF15, KF17 | ALGO-019] tambahBeban menaikkan beban +1 dan kurangiBeban menurunkan -1 hanya jika beban > 0', async () => {
      await LayananPelanggan.tambahBeban(prisma as any, 'cs-2');
      expect(mockStore.layananPelanggan.get('cs-2')?.jumlahTiketDipegang).toBe(2);

      await LayananPelanggan.kurangiBeban(prisma as any, 'cs-2');
      expect(mockStore.layananPelanggan.get('cs-2')?.jumlahTiketDipegang).toBe(1);

      await LayananPelanggan.kurangiBeban(prisma as any, 'cs-2');
      await LayananPelanggan.kurangiBeban(prisma as any, 'cs-2');
      expect(mockStore.layananPelanggan.get('cs-2')?.jumlahTiketDipegang).toBe(0);
    });
  });

  describe('Pembuatan Tiket Laporan & Penugasan Otomatis CS [KF14, KF15, KF16, KF18 | UC08 | ALGO-013, ALGO-054, ALGO-055]', () => {
    it('[KF14, KF16 | ALGO-054] mengembalikan 400 jika form tiket tidak valid dan tidak menjalankan $transaction', async () => {
      const controller = new TiketLaporanController(mockNotifikasi);
      const { req, res } = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        body: { jenisTiket: 'Tidak Valid', keteranganTiket: '' },
      });

      await controller.buatTiketHandler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getJson().success).toBe(false);
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(mockStore.tiketLaporan.size).toBe(0);
    });

    it('[KF14, KF16] authorizeRoles mengizinkan PELANGGAN dan PEMBERI_JASA, serta menolak LAYANAN_PELANGGAN (403)', () => {
      const guard = authorizeRoles(Role.PELANGGAN, Role.PEMBERI_JASA);

      const pel = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
      });
      let pelNext = false;
      guard(pel.req, pel.res, () => {
        pelNext = true;
      });
      expect(pelNext).toBe(true);

      const mitra = createMockReqRes({
        user: { idPengguna: 'mitra-1', username: 'ahmad', role: Role.PEMBERI_JASA },
      });
      let mitraNext = false;
      guard(mitra.req, mitra.res, () => {
        mitraNext = true;
      });
      expect(mitraNext).toBe(true);

      const cs = createMockReqRes({
        user: { idPengguna: 'cs-1', username: 'rina', role: Role.LAYANAN_PELANGGAN },
      });
      let csNext = false;
      guard(cs.req, cs.res, () => {
        csNext = true;
      });
      expect(csNext).toBe(false);
      expect(cs.res.getStatus()).toBe(403);
    });

    it('[KF14, KF15, KF18 | ALGO-019, ALGO-054, ALGO-055] Pelanggan membuat tiket valid: auto-assign ke CS beban terkecil, tambah beban +1, dan kirim notifikasi CS', async () => {
      const controller = new TiketLaporanController(mockNotifikasi);
      const { req, res } = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        body: {
          jenisTiket: 'Laporan Pembayaran',
          keteranganTiket: '  Nominal transfer tidak sesuai kesepakatan  ',
        },
        file: { filename: 'bukti-transfer.png' },
      });

      await controller.buatTiketHandler(req, res);

      expect(res.getStatus()).toBe(201);
      const payload = res.getJson();
      expect(payload.success).toBe(true);
      expect(payload.data.tiket.id).toBe('A-2041');
      expect(payload.data.tiket.status).toBe('Tiket Baru');
      expect(payload.data.tiket.assignedTo).toBe('cs-2');
      expect(payload.data.tiket.image).toBe('/uploads/bukti-transfer.png');

      expect(mockStore.tiketLaporan.get('A-2041')?.statusTiket).toBe('Open');
      expect(mockStore.layananPelanggan.get('cs-2')?.jumlahTiketDipegang).toBe(2);
      expect(buatNotifikasiMock).toHaveBeenCalledTimes(1);
      expect(buatNotifikasiMock).toHaveBeenCalledWith(
        'cs-2',
        expect.stringContaining('#A-2041')
      );
    });

    it('[KF16, KF17, KF18 | ALGO-019, ALGO-054] Pemberi Jasa juga dapat membuat tiket laporan dan otomatis ditugaskan ke CS', async () => {
      const controller = new TiketLaporanController(mockNotifikasi);
      const { req, res } = createMockReqRes({
        user: { idPengguna: 'mitra-1', username: 'ahmad', role: Role.PEMBERI_JASA },
        body: {
          jenisTiket: 'Perilaku Pengguna',
          keteranganTiket: 'Pelanggan membatalkan sepihak saat saya sudah di lokasi',
        },
      });

      await controller.buatTiketHandler(req, res);

      expect(res.getStatus()).toBe(201);
      const ticketDto = res.getJson().data.tiket;
      expect(ticketDto.reporterId).toBe('mitra-1');
      expect(ticketDto.reporterRole).toBe(Role.PEMBERI_JASA);
      expect(ticketDto.assignedTo).toBe('cs-2');
      expect(buatNotifikasiMock).toHaveBeenCalledWith('cs-2', expect.stringContaining(ticketDto.id));
    });

    it('[KF15, KF18 | ALGO-019, ALGO-054] fallback tanpa CS tersedia (idCs === null): tetap 201 dengan assignedTo null tanpa tambahBeban/notifikasi', async () => {
      mockStore.layananPelanggan.set('cs-1', {
        idLayananPelanggan: 'cs-1',
        status: 'Offline',
        jumlahTiketDipegang: 5,
      });
      mockStore.layananPelanggan.set('cs-2', {
        idLayananPelanggan: 'cs-2',
        status: 'Busy',
        jumlahTiketDipegang: 6,
      });

      const controller = new TiketLaporanController(mockNotifikasi);
      const { req, res } = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        body: {
          jenisTiket: 'Kendala Aplikasi',
          keteranganTiket: 'Halaman chat tidak termuat',
        },
      });

      await controller.buatTiketHandler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getJson().data.tiket.assignedTo).toBeNull();
      expect(prisma.layananPelanggan.update).not.toHaveBeenCalled();
      expect(buatNotifikasiMock).not.toHaveBeenCalled();
    });

    it('[KF18 | ALGO-055] kegagalan pengiriman notifikasi (kirimNotifikasiAman) tidak menggagalkan pembuatan tiket (201)', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      buatNotifikasiMock.mockRejectedValueOnce(new Error('Socket.IO unavailable'));

      const controller = new TiketLaporanController(mockNotifikasi);
      const { req, res } = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        body: {
          jenisTiket: 'Lainnya',
          keteranganTiket: 'Pertanyaan umum layanan',
        },
      });

      await controller.buatTiketHandler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getJson().success).toBe(true);
      consoleErrorSpy.mockRestore();
    });

    it('[KF14, KF15 | ALGO-054] mengembalikan 500 jika terjadi error database saat transaksi', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (prisma.$transaction as jest.Mock).mockRejectedValueOnce(new Error('DB connection lost'));

      const controller = new TiketLaporanController(mockNotifikasi);
      const { req, res } = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        body: {
          jenisTiket: 'Kendala Aplikasi',
          keteranganTiket: 'Aplikasi crash saat upload',
        },
      });

      await controller.buatTiketHandler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getJson().success).toBe(false);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Ruang Komunikasi & Penanganan Tiket CS [KF15, KF17, KF18 | UC08, UC09 | ALGO-020, ALGO-021]', () => {
    it('[KF15, KF17 | ALGO-020] tiketSayaHandler dan detailTiketHandler menegakkan kontrol akses pelapor & CS', async () => {
      const controller = new TiketLaporanController(mockNotifikasi);
      mockStore.tiketLaporan.set('A-2041', {
        idTiket: 'A-2041',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-2',
        jenisTiket: 'Laporan Pembayaran',
        keteranganTiket: 'Kendala verifikasi',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Open',
      });

      const mineCall = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
      });
      await controller.tiketSayaHandler(mineCall.req, mineCall.res);
      expect(mineCall.res.getStatus()).toBe(200);
      expect(mineCall.res.getJson().data).toHaveLength(1);

      const notFoundCall = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        params: { id: 'A-9999' },
      });
      await controller.detailTiketHandler(notFoundCall.req, notFoundCall.res);
      expect(notFoundCall.res.getStatus()).toBe(404);

      const forbiddenCall = createMockReqRes({
        user: { idPengguna: 'pelanggan-2', username: 'siti', role: Role.PELANGGAN },
        params: { id: 'A-2041' },
      });
      await controller.detailTiketHandler(forbiddenCall.req, forbiddenCall.res);
      expect(forbiddenCall.res.getStatus()).toBe(403);

      const csCall = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-2041' },
      });
      await controller.detailTiketHandler(csCall.req, csCall.res);
      expect(csCall.res.getStatus()).toBe(200);
      expect(csCall.res.getJson().data.tiket.id).toBe('A-2041');
    });

    it('[KF15, KF17] kirimPesanPelaporHandler memvalidasi pesan ruang mediasi (201, 400, 404, 409)', async () => {
      const controller = new TiketLaporanController(mockNotifikasi);

      mockStore.tiketLaporan.set('A-UNASSIGNED', {
        idTiket: 'A-UNASSIGNED',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: null,
        jenisTiket: 'Kendala Aplikasi',
        keteranganTiket: 'Menunggu CS',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Open',
      });
      mockStore.tiketLaporan.set('A-CLOSED', {
        idTiket: 'A-CLOSED',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-2',
        jenisTiket: 'Lainnya',
        keteranganTiket: 'Sudah selesai',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Selesai',
      });
      mockStore.tiketLaporan.set('A-ACTIVE', {
        idTiket: 'A-ACTIVE',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-2',
        jenisTiket: 'Laporan Pembayaran',
        keteranganTiket: 'Masih aktif',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Diproses',
      });

      const notOwner = createMockReqRes({
        user: { idPengguna: 'pelanggan-2', username: 'siti', role: Role.PELANGGAN },
        params: { id: 'A-ACTIVE' },
        body: { text: 'Halo' },
      });
      await controller.kirimPesanPelaporHandler(notOwner.req, notOwner.res);
      expect(notOwner.res.getStatus()).toBe(404);

      const emptyMsg = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        params: { id: 'A-ACTIVE' },
        body: { text: '   ' },
      });
      await controller.kirimPesanPelaporHandler(emptyMsg.req, emptyMsg.res);
      expect(emptyMsg.res.getStatus()).toBe(400);

      const noCsMsg = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        params: { id: 'A-UNASSIGNED' },
        body: { text: 'Apakah sudah ada CS?' },
      });
      await controller.kirimPesanPelaporHandler(noCsMsg.req, noCsMsg.res);
      expect(noCsMsg.res.getStatus()).toBe(409);

      const closedMsg = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        params: { id: 'A-CLOSED' },
        body: { text: 'Masih bisa balas?' },
      });
      await controller.kirimPesanPelaporHandler(closedMsg.req, closedMsg.res);
      expect(closedMsg.res.getStatus()).toBe(409);

      const okMsg = createMockReqRes({
        user: { idPengguna: 'pelanggan-1', username: 'budi', role: Role.PELANGGAN },
        params: { id: 'A-ACTIVE' },
        body: { text: 'Ini bukti tambahannya kak' },
      });
      await controller.kirimPesanPelaporHandler(okMsg.req, okMsg.res);
      expect(okMsg.res.getStatus()).toBe(201);
      expect(mockStore.komunikasi).toHaveLength(1);
      expect(buatNotifikasiMock).toHaveBeenCalledWith('cs-2', expect.stringContaining('#A-ACTIVE'));
    });

    it('[KF17 | UC09 | ALGO-020] LayananPelangganCtrl.daftarTiket dan statistik mendukung filter valid serta menolak status invalid (400)', async () => {
      mockStore.tiketLaporan.set('A-1', {
        idTiket: 'A-1',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-2',
        jenisTiket: 'Kendala Aplikasi',
        keteranganTiket: 'Bug A',
        buktiFotoUrl: null,
        tanggalTiket: new Date('2026-11-12T08:00:00Z'),
        statusTiket: 'Open',
      });
      mockStore.tiketLaporan.set('A-2', {
        idTiket: 'A-2',
        idPengguna: 'mitra-1',
        idLayananPelanggan: null,
        jenisTiket: 'Lainnya',
        keteranganTiket: 'Tanya B',
        buktiFotoUrl: null,
        tanggalTiket: new Date('2026-11-12T09:00:00Z'),
        statusTiket: 'Diproses',
      });

      const badFilter = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        query: { status: 'StatusNgawur' },
      });
      await LayananPelangganCtrl.daftarTiket(badFilter.req, badFilter.res);
      expect(badFilter.res.getStatus()).toBe(400);

      const validFilter = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        query: { status: 'Tiket Baru' },
      });
      await LayananPelangganCtrl.daftarTiket(validFilter.req, validFilter.res);
      expect(validFilter.res.getStatus()).toBe(200);
      expect(validFilter.res.getJson().data).toHaveLength(1);
      expect(validFilter.res.getJson().data[0].id).toBe('A-1');

      const statsCall = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
      });
      await LayananPelangganCtrl.statistik(statsCall.req, statsCall.res);
      expect(statsCall.res.getStatus()).toBe(200);
      expect(statsCall.res.getJson().data).toEqual({
        tiketBaru: 1,
        diproses: 1,
        selesai: 0,
      });
    });

    it('[KF17, KF18 | UC09 | ALGO-021] LayananPelangganCtrl.balasTiket mengubah Open -> Diproses, auto-claim jika unassigned, dan menegakkan akses CS', async () => {
      mockStore.tiketLaporan.set('A-OPEN-UNASSIGNED', {
        idTiket: 'A-OPEN-UNASSIGNED',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: null,
        jenisTiket: 'Kendala Aplikasi',
        keteranganTiket: 'Belum ada CS',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Open',
      });
      mockStore.tiketLaporan.set('A-OTHER-CS', {
        idTiket: 'A-OTHER-CS',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-1',
        jenisTiket: 'Laporan Pembayaran',
        keteranganTiket: 'Milik CS 1',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Diproses',
      });
      mockStore.tiketLaporan.set('A-DONE', {
        idTiket: 'A-DONE',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-2',
        jenisTiket: 'Lainnya',
        keteranganTiket: 'Sudah tutup',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Selesai',
      });

      const forbiddenReply = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-OTHER-CS' },
        body: { text: 'Coba balas' },
      });
      await LayananPelangganCtrl.balasTiket(forbiddenReply.req, forbiddenReply.res);
      expect(forbiddenReply.res.getStatus()).toBe(403);

      const closedReply = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-DONE' },
        body: { text: 'Coba balas tiket tutup' },
      });
      await LayananPelangganCtrl.balasTiket(closedReply.req, closedReply.res);
      expect(closedReply.res.getStatus()).toBe(409);

      const okReply = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-OPEN-UNASSIGNED' },
        body: { text: 'Halo, laporan sedang kami cek' },
      });
      await LayananPelangganCtrl.balasTiket(okReply.req, okReply.res);
      expect(okReply.res.getStatus()).toBe(201);
      expect(mockStore.tiketLaporan.get('A-OPEN-UNASSIGNED')?.idLayananPelanggan).toBe('cs-2');
      expect(mockStore.tiketLaporan.get('A-OPEN-UNASSIGNED')?.statusTiket).toBe('Diproses');
      expect(mockStore.layananPelanggan.get('cs-2')?.jumlahTiketDipegang).toBe(2);
      expect(buatNotifikasiMock).toHaveBeenCalledWith(
        'pelanggan-1',
        expect.stringContaining('#A-OPEN-UNASSIGNED')
      );
    });

    it('[KF17, KF18 | UC09 | ALGO-021] LayananPelangganCtrl.tutupTiket mengubah status -> Selesai, mengurangi beban CS, dan menolak akses tidak sah', async () => {
      mockStore.tiketLaporan.set('A-CLOSE-1', {
        idTiket: 'A-CLOSE-1',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-2',
        jenisTiket: 'Laporan Pembayaran',
        keteranganTiket: 'Siap ditutup',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Diproses',
      });
      mockStore.tiketLaporan.set('A-CLOSE-OTHER', {
        idTiket: 'A-CLOSE-OTHER',
        idPengguna: 'pelanggan-1',
        idLayananPelanggan: 'cs-1',
        jenisTiket: 'Laporan Pembayaran',
        keteranganTiket: 'Milik CS lain',
        buktiFotoUrl: null,
        tanggalTiket: new Date(),
        statusTiket: 'Diproses',
      });

      const forbiddenClose = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-CLOSE-OTHER' },
      });
      await LayananPelangganCtrl.tutupTiket(forbiddenClose.req, forbiddenClose.res);
      expect(forbiddenClose.res.getStatus()).toBe(403);

      const okClose = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-CLOSE-1' },
      });
      await LayananPelangganCtrl.tutupTiket(okClose.req, okClose.res);
      expect(okClose.res.getStatus()).toBe(200);
      expect(mockStore.tiketLaporan.get('A-CLOSE-1')?.statusTiket).toBe('Selesai');
      expect(mockStore.layananPelanggan.get('cs-2')?.jumlahTiketDipegang).toBe(0);
      expect(buatNotifikasiMock).toHaveBeenCalledWith(
        'pelanggan-1',
        expect.stringContaining('#A-CLOSE-1')
      );

      const doubleClose = createMockReqRes({
        user: { idPengguna: 'cs-2', username: 'doni', role: Role.LAYANAN_PELANGGAN },
        params: { id: 'A-CLOSE-1' },
      });
      await LayananPelangganCtrl.tutupTiket(doubleClose.req, doubleClose.res);
      expect(doubleClose.res.getStatus()).toBe(409);
    });
  });
});
