import { Prisma } from '@prisma/client';
import prisma from '../database/prisma';

type Db = Prisma.TransactionClient | typeof prisma;

/** C28 Notifikasi */
export class Notifikasi {
  public static async buat(idPenerima: string, isiNotifikasi: string, db: Db = prisma) {
    return db.notifikasi.create({ data: { idPenerima, isiNotifikasi } });
  }

  public static async daftar(idPenerima: string) {
    return prisma.notifikasi.findMany({
      where: { idPenerima },
      orderBy: { waktuNotifikasi: 'desc' },
      take: 50,
    });
  }

  public static async tandaiTerbaca(idNotifikasi: string, idPenerima: string) {
    return prisma.notifikasi.updateMany({
      where: { idNotifikasi, idPenerima },
      data: { statusBaca: 'Read' },
    });
  }
}
