import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

type Db = Prisma.TransactionClient | typeof prisma;

/** Status di DB (sesuai Q-008) -> label yang tampil di UI */
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

/**
 * C22 - Kelas Model TiketLaporan
 * Akses data tiket laporan dan percakapan mediasinya (tabel komunikasi dengan id_tiket terisi).
 */
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

  /** ALGO-020: getDetailTiket */
  public static async getDetailTiket(idTiket: string, db: Db = prisma) {
    return db.tiketLaporan.findUnique({ where: { idTiket }, include: withPelapor });
  }

  /** Mengunci baris tiket selama transaksi (balas/tutup tidak bertabrakan). */
  public static async kunci(db: Prisma.TransactionClient, idTiket: string): Promise<void> {
    await db.$queryRaw`SELECT id_tiket FROM tiket_laporan WHERE id_tiket = ${idTiket} FOR UPDATE`;
  }

  /** Tiket milik CS ini + tiket yang belum punya petugas */
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

  /** ALGO-021 updateStatusTiket */
  public static async updateStatusTiket(db: Db, idTiket: string, statusTiket: string) {
    return db.tiketLaporan.update({ where: { idTiket }, data: { statusTiket } });
  }

  public static async klaim(db: Db, idTiket: string, idLayananPelanggan: string) {
    return db.tiketLaporan.update({ where: { idTiket }, data: { idLayananPelanggan } });
  }

  /** Simpan pesan di ruang mediasi tiket (KNF26) */
  public static async tambahPesan(
    db: Db,
    p: { idTiket: string; idPengirim: string; idPenerima: string; isiPesan: string; lampiranUrl?: string | null }
  ) {
    return db.komunikasi.create({
      data: {
        idTiket: p.idTiket,
        idPengguna: p.idPengirim,
        idPenerima: p.idPenerima,
        isiPesan: p.isiPesan,
        lampiranUrl: p.lampiranUrl ?? null,
      },
    });
  }

  public static async getPesan(idTiket: string) {
    const rows = await prisma.komunikasi.findMany({
      where: { idTiket },
      orderBy: { waktuTerkirim: 'asc' },
      include: { pengirim: { select: { role: true } } },
    });
    return rows.map((m) => ({
      id: m.idChat,
      sender: m.pengirim.role === 'LAYANAN_PELANGGAN' ? 'cs' : 'user',
      senderId: m.idPengguna,
      text: m.isiPesan,
      image: m.lampiranUrl ? `/uploads/${m.lampiranUrl}` : null,
      time: m.waktuTerkirim,
    }));
  }
}
