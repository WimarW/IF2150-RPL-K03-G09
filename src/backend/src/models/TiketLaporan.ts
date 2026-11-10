import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

type Db = Prisma.TransactionClient | typeof prisma;

/** Status di DB (sesuai Q-008) -> label di UI */
export const STATUS_LABEL: Record<string, string> = { Open: 'Tiket Baru', Diproses: 'Diproses', Selesai: 'Selesai' };
const LABEL_TO_DB: Record<string, string> = { 'Tiket Baru': 'Open', Diproses: 'Diproses', Selesai: 'Selesai' };
export const statusDb = (label?: string): string | undefined => (label ? LABEL_TO_DB[label] : undefined);

const withPelapor = { pelapor: { select: { namaPengguna: true, role: true } } } satisfies Prisma.TiketLaporanInclude;
export type TiketRow = Prisma.TiketLaporanGetPayload<{ include: typeof withPelapor }>;

export function toTiketDto(t: TiketRow) {
  const nama = t.pelapor.namaPengguna;
  return {
    id: t.idTiket,
    name: nama,
    initials: nama.split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? '').join(''),
    title: t.jenisTiket,
    desc: t.keteranganTiket,
    image: t.buktiFotoUrl ? `/uploads/${t.buktiFotoUrl}` : null,
    createdAt: t.tanggalTiket,
    status: STATUS_LABEL[t.statusTiket] ?? t.statusTiket,
    reporterRole: t.pelapor.role,
    reporterId: t.idPengguna,
    assignedTo: t.idLayananPelanggan,
  };
}

/** C22 TiketLaporan */
export class TiketLaporan {
  /** Nomor unik tiket, contoh A-2041 (sequence seq_nomor_tiket) */
  public static async generateId(db: Db): Promise<string> {
    const r = await db.$queryRaw<{ n: bigint }[]>`SELECT nextval('seq_nomor_tiket') AS n`;
    return `A-${r[0].n}`;
  }

  /** Q-008 (+ bukti foto & petugas CS) */
  public static async simpan(
    db: Db,
    t: { idTiket: string; idPengguna: string; jenisTiket: string; keteranganTiket: string; buktiFotoUrl: string | null; idLayananPelanggan: string | null }
  ) {
    return db.tiketLaporan.create({ data: { ...t, statusTiket: 'Open' } });
  }

  public static async getDetailTiket(idTiket: string, db: Db = prisma) {
    return db.tiketLaporan.findUnique({ where: { idTiket }, include: withPelapor });
  }

  public static async daftarCs(idCs: string, status?: string) {
    return prisma.tiketLaporan.findMany({
      where: { OR: [{ idLayananPelanggan: idCs }, { idLayananPelanggan: null }], ...(status ? { statusTiket: status } : {}) },
      orderBy: { tanggalTiket: 'desc' },
      include: withPelapor,
    });
  }

  public static async daftarPelapor(idPengguna: string) {
    return prisma.tiketLaporan.findMany({ where: { idPengguna }, orderBy: { tanggalTiket: 'desc' }, include: withPelapor });
  }

  public static async statistik(idCs: string) {
    const g = await prisma.tiketLaporan.groupBy({
      by: ['statusTiket'],
      where: { OR: [{ idLayananPelanggan: idCs }, { idLayananPelanggan: null }] },
      _count: { _all: true },
    });
    const n = (s: string) => g.find((x) => x.statusTiket === s)?._count._all ?? 0;
    return { tiketBaru: n('Open'), diproses: n('Diproses'), selesai: n('Selesai') };
  }

  public static async updateStatusTiket(db: Db, idTiket: string, statusTiket: string) {
    return db.tiketLaporan.update({ where: { idTiket }, data: { statusTiket } });
  }

  public static async klaim(db: Db, idTiket: string, idLayananPelanggan: string) {
    return db.tiketLaporan.update({ where: { idTiket }, data: { idLayananPelanggan } });
  }
}
