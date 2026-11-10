import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

type Db = Prisma.TransactionClient | typeof prisma;

/** C19 Komunikasi — kanal mediasi per tiket (KNF26) */
export class Komunikasi {
  public static async simpanPesan(
    data: { idTiket: string; idPengirim: string; idPenerima: string; isiPesan: string; lampiranUrl?: string | null },
    db: Db = prisma
  ) {
    return db.komunikasi.create({
      data: {
        idTiket: data.idTiket,
        idPengguna: data.idPengirim,
        idPenerima: data.idPenerima,
        isiPesan: data.isiPesan,
        lampiranUrl: data.lampiranUrl ?? null,
      },
    });
  }

  public static async getChatHistory(idTiket: string) {
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
