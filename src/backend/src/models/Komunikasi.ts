import crypto from 'crypto';
import prisma from '../database/prisma';

export interface DataChatInput {
  idChat?: string;
  idPengirim: string;
  idPenerima: string;
  isiPesan: string;
}

export interface KomunikasiRecord {
  idChat: string;
  idPengguna: string;
  idPenerima: string;
  isiPesan: string;
  waktuTerkirim: Date;
  isChatTerbaca: boolean;
  statusChat: string;
  durasiChat: number;
}

export interface ConversationItem {
  idLawanBicara: string;
  namaLawanBicara: string;
  isiPesanTerakhir: string;
  waktuTerkirim: Date;
  unreadCount: number;
}

/**
 * C19 - Kelas Model Komunikasi
 * Mengelola seluruh akses data komunikasi murni menggunakan Prisma ORM.
 * Tidak mengandung aturan bisnis.
 */
export class Komunikasi {
  private idChat: string;
  private idPengguna: string;
  private idPenerima: string;
  private isiPesan: string;
  private waktuTerkirim: Date;
  private isChatTerbaca: boolean;
  private statusChat: string;
  private durasiChat: number;
  private dataChat: DataChatInput;

  /**
   * C19 · ALGO-044
   * Menginisialisasi objek Komunikasi dengan nilai awal sesuai spesifikasi DPPL:
   * idChat = ID unik baru; idPengguna = dataChat.idPengirim; idPenerima = dataChat.idPenerima;
   * isiPesan = dataChat.isiPesan; waktuTerkirim = waktu sekarang; isChatTerbaca = false;
   * statusChat = "SENT"; durasiChat = 0; simpan dataChat.
   */
  constructor(dataChat?: DataChatInput) {
    const input: DataChatInput = dataChat ?? {
      idPengirim: '',
      idPenerima: '',
      isiPesan: '',
    };

    this.idChat = input.idChat ?? `CHAT-${crypto.randomUUID()}`;
    this.idPengguna = input.idPengirim;
    this.idPenerima = input.idPenerima;
    this.isiPesan = input.isiPesan;
    this.waktuTerkirim = new Date();
    this.isChatTerbaca = false;
    this.statusChat = 'SENT';
    this.durasiChat = 0;
    this.dataChat = input;
  }

  /**
   * C19 · ALGO-045 · Q-020
   * Menyimpan objek Komunikasi ke database menggunakan `prisma.komunikasi.create`.
   */
  public async saveChat(): Promise<KomunikasiRecord> {
    return prisma.komunikasi.create({
      data: {
        idChat: this.idChat,
        idPengguna: this.idPengguna,
        idPenerima: this.idPenerima,
        isiPesan: this.isiPesan,
        waktuTerkirim: this.waktuTerkirim,
        isChatTerbaca: this.isChatTerbaca,
        statusChat: this.statusChat,
        durasiChat: this.durasiChat,
      },
    });
  }

  /**
   * C19 · (tanpa ALGO) · Q-020
   * Wrapper yang membuat objek Komunikasi baru lalu memanggil saveChat().
   */
  public async simpanPesan(dataChat: DataChatInput): Promise<KomunikasiRecord> {
    const pesanBaru = new Komunikasi(dataChat);
    return pesanBaru.saveChat();
  }

  /**
   * C19 · ALGO-046
   * Mengembalikan atribut private idChat.
   */
  public getIDChat(): string {
    return this.idChat;
  }

  /**
   * C19 · ALGO-047 · Q-021
   * Mengambil satu pesan berdasarkan idChat menggunakan `prisma.komunikasi.findUnique`.
   */
  public async getPesan(idChat: string): Promise<KomunikasiRecord | null> {
    return prisma.komunikasi.findUnique({
      where: { idChat },
    });
  }

  /**
   * C19 · ALGO-048 · Q-022
   * Mengambil riwayat chat dua arah antara idPengguna1 dan idPengguna2
   * terurut secara kronologis ASC menggunakan `prisma.komunikasi.findMany`.
   */
  public async getChatHistory(
    idPengguna1: string,
    idPengguna2: string
  ): Promise<KomunikasiRecord[]> {
    return prisma.komunikasi.findMany({
      where: {
        OR: [
          { idPengguna: idPengguna1, idPenerima: idPengguna2 },
          { idPengguna: idPengguna2, idPenerima: idPengguna1 },
        ],
      },
      orderBy: {
        waktuTerkirim: 'asc',
      },
    });
  }

  // Tambahan non-DPPL: Mengambil snapshot atribut private untuk keperluan unit test
  public getAtributInternal(): KomunikasiRecord & { dataChat: DataChatInput } {
    return {
      idChat: this.idChat,
      idPengguna: this.idPengguna,
      idPenerima: this.idPenerima,
      isiPesan: this.isiPesan,
      waktuTerkirim: this.waktuTerkirim,
      isChatTerbaca: this.isChatTerbaca,
      statusChat: this.statusChat,
      durasiChat: this.durasiChat,
      dataChat: this.dataChat,
    };
  }

  // Tambahan non-DPPL: Memeriksa keberadaan pengguna di tabel pengguna via Prisma ORM
  public async isPenggunaTerdaftar(idPengguna: string): Promise<boolean> {
    const pengguna = await prisma.pengguna.findUnique({
      where: { idPengguna },
      select: { idPengguna: true },
    });
    return pengguna !== null;
  }

  // Tambahan non-DPPL: Mengambil daftar percakapan aktif murni dengan Prisma ORM
  // (1 query findMany distinct + include relasi pengguna, dan 1 query agregat groupBy untuk unreadCount)
  public async getConversationsByUser(idPengguna: string): Promise<ConversationItem[]> {
    const [distinctDirectionMessages, unreadGroups] = await Promise.all([
      prisma.komunikasi.findMany({
        where: {
          OR: [{ idPengguna }, { idPenerima: idPengguna }],
        },
        orderBy: {
          waktuTerkirim: 'desc',
        },
        distinct: ['idPengguna', 'idPenerima'],
        include: {
          pengirim: {
            select: {
              idPengguna: true,
              namaPengguna: true,
            },
          },
          penerima: {
            select: {
              idPengguna: true,
              namaPengguna: true,
            },
          },
        },
      }),
      prisma.komunikasi.groupBy({
        by: ['idPengguna'],
        where: {
          idPenerima: idPengguna,
          isChatTerbaca: false,
        },
        _count: {
          idChat: true,
        },
      }),
    ]);

    const unreadCountMap = new Map<string, number>();
    for (const group of unreadGroups) {
      unreadCountMap.set(group.idPengguna, group._count.idChat);
    }

    // Menggabungkan arah (A -> B) dan (B -> A) agar tersisa tepat 1 pesan terbaru per lawan bicara
    const latestPerPartnerMap = new Map<string, ConversationItem>();

    for (const msg of distinctDirectionMessages) {
      const isOutgoing = msg.idPengguna === idPengguna;
      const idLawanBicara = isOutgoing ? msg.idPenerima : msg.idPengguna;
      const namaLawanBicara = isOutgoing
        ? (msg.penerima?.namaPengguna ?? msg.idPenerima)
        : (msg.pengirim?.namaPengguna ?? msg.idPengguna);

      const existing = latestPerPartnerMap.get(idLawanBicara);
      if (!existing || msg.waktuTerkirim > existing.waktuTerkirim) {
        latestPerPartnerMap.set(idLawanBicara, {
          idLawanBicara,
          namaLawanBicara,
          isiPesanTerakhir: msg.isiPesan,
          waktuTerkirim: msg.waktuTerkirim,
          unreadCount: unreadCountMap.get(idLawanBicara) ?? 0,
        });
      }
    }

    return Array.from(latestPerPartnerMap.values()).sort(
      (a, b) => b.waktuTerkirim.getTime() - a.waktuTerkirim.getTime()
    );
  }

  // Tambahan non-DPPL: Menandai pesan masuk dari lawan bicara sebagai terbaca via Prisma ORM updateMany
  public async markMessagesAsRead(
    idPenerimaLogin: string,
    idLawanBicara: string
  ): Promise<number> {
    const updated = await prisma.komunikasi.updateMany({
      where: {
        idPengguna: idLawanBicara,
        idPenerima: idPenerimaLogin,
        isChatTerbaca: false,
      },
      data: {
        isChatTerbaca: true,
      },
    });
    return updated.count;
  }
}