import { Request, Response } from 'express';
import {
  ConversationItem,
  DataChatInput,
  Komunikasi,
  KomunikasiRecord,
} from '../models/Komunikasi';
import {
  HttpAppError,
  NotifikasiController,
  RealtimeEmitter,
} from './NotifikasiController';

/**
 * C21 - Kelas Controller Komunikasi
 * Mengelola aturan bisnis pengiriman pesan, pengambilan riwayat obrolan, dan pemicu notifikasi.
 */
export class KomunikasiController {
  private komunikasiModel: Komunikasi;
  private notifikasiController: NotifikasiController;
  private realtimeEmitter?: RealtimeEmitter;

  constructor(
    komunikasiModel?: Komunikasi,
    notifikasiController?: NotifikasiController,
    realtimeEmitter?: RealtimeEmitter
  ) {
    this.komunikasiModel = komunikasiModel ?? new Komunikasi();
    this.notifikasiController = notifikasiController ?? new NotifikasiController();
    this.realtimeEmitter = realtimeEmitter;
  }

  public setRealtimeEmitter(emitter: RealtimeEmitter): void {
    this.realtimeEmitter = emitter;
    this.notifikasiController.setRealtimeEmitter(emitter);
  }

  /**
   * C21 · ALGO-049
   * Membuat objek Komunikasi baru, memanggil saveChat(), mengirim event Socket.IO `chat:new`,
   * lalu memanggil `notifikasiController.buatNotifikasi(dataChat.idPenerima, "Pesan baru: " + dataChat.isiPesan)`.
   * Kegagalan buatNotifikasi dicatat ke log dan tidak membatalkan pesan yang sudah tersimpan.
   */
  public async sendChat(dataChat: DataChatInput): Promise<KomunikasiRecord> {
    const pesanBaru = new Komunikasi(dataChat);
    const savedChat = await pesanBaru.saveChat();

    if (this.realtimeEmitter) {
      this.realtimeEmitter.emitToUser(dataChat.idPenerima, 'chat:new', savedChat);
    }

    try {
      await this.notifikasiController.buatNotifikasi(
        dataChat.idPenerima,
        'Pesan baru: ' + dataChat.isiPesan
      );
    } catch (notifErr) {
      console.error(
        `[ALGO-049] Gagal membuat notifikasi untuk idChat=${savedChat.idChat}:`,
        notifErr
      );
    }

    return savedChat;
  }

  /**
   * C21 · (tanpa ALGO) · kirimPesan
   * Memvalidasi input (pengirim != penerima, isiPesan bertipe string & tidak kosong setelah trim,
   * maksimal 1000 karakter, serta penerima ada di tabel pengguna via Prisma ORM),
   * kemudian mendelegasikan ke sendChat().
   */
  public async kirimPesan(dataChat: DataChatInput): Promise<KomunikasiRecord> {
    const { idPengirim, idPenerima, isiPesan } = dataChat;

    if (!idPengirim || typeof idPengirim !== 'string' || idPengirim.trim().length === 0) {
      throw new HttpAppError(401, 'UNAUTHORIZED', 'Identitas pengirim tidak ditemukan.');
    }

    if (!idPenerima || typeof idPenerima !== 'string' || idPenerima.trim().length === 0) {
      throw new HttpAppError(400, 'INVALID_RECIPIENT', 'idPenerima wajib diisi.');
    }

    if (idPengirim === idPenerima) {
      throw new HttpAppError(
        400,
        'SELF_MESSAGE_NOT_ALLOWED',
        'Pengirim tidak diperbolehkan mengirim pesan ke diri sendiri.'
      );
    }

    if (typeof isiPesan !== 'string') {
      throw new HttpAppError(400, 'INVALID_MESSAGE_TYPE', 'isiPesan wajib bertipe string.');
    }

    const trimmedPesan = isiPesan.trim();
    if (trimmedPesan.length === 0) {
      throw new HttpAppError(
        400,
        'EMPTY_MESSAGE',
        'isiPesan tidak boleh kosong setelah di-trim.'
      );
    }

    if (trimmedPesan.length > 1000) {
      throw new HttpAppError(
        400,
        'MESSAGE_TOO_LONG',
        'isiPesan maksimal terdiri dari 1000 karakter.'
      );
    }

    const penerimaTerdaftar = await this.komunikasiModel.isPenggunaTerdaftar(idPenerima);
    if (!penerimaTerdaftar) {
      throw new HttpAppError(
        404,
        'RECIPIENT_NOT_FOUND',
        `Penerima dengan ID ${idPenerima} tidak ditemukan.`
      );
    }

    return this.sendChat({
      idChat: dataChat.idChat,
      idPengirim,
      idPenerima,
      isiPesan: trimmedPesan,
    });
  }

  /**
   * C21 · ALGO-050 · Q-022
   * Mengembalikan komunikasi.getChatHistory(id1, id2).
   */
  public async getRiwayatChat(id1: string, id2: string): Promise<KomunikasiRecord[]> {
    return this.komunikasiModel.getChatHistory(id1, id2);
  }

  /**
   * C21 · ALGO-051
   * Mengembalikan getRiwayatChat(idPelanggan, idPemberiJasa) saat memuat ulang ruang obrolan.
   */
  public async loadChat(
    idPelanggan: string,
    idPemberiJasa: string
  ): Promise<KomunikasiRecord[]> {
    return this.getRiwayatChat(idPelanggan, idPemberiJasa);
  }

  /**
   * C21 · ALGO-052
   * Mengembalikan getRiwayatChat(idPelanggan, idPemberiJasa) saat ruang obrolan pertama kali dibuka.
   */
  public async startChat(
    idPelanggan: string,
    idPemberiJasa: string
  ): Promise<KomunikasiRecord[]> {
    return this.getRiwayatChat(idPelanggan, idPemberiJasa);
  }

  // Tambahan non-DPPL: Mengambil daftar percakapan aktif milik pengguna
  public async getConversations(idPengguna: string): Promise<ConversationItem[]> {
    return this.komunikasiModel.getConversationsByUser(idPengguna);
  }

  // Tambahan non-DPPL: Menandai seluruh pesan masuk dari lawan bicara sebagai terbaca
  public async tandaiChatTerbaca(
    idPengguna: string,
    idLawanBicara: string
  ): Promise<{ updatedCount: number }> {
    if (!idLawanBicara || idLawanBicara.trim().length === 0) {
      throw new HttpAppError(400, 'INVALID_PARTNER_ID', 'idLawanBicara wajib diisi.');
    }
    const updatedCount = await this.komunikasiModel.markMessagesAsRead(
      idPengguna,
      idLawanBicara
    );
    return { updatedCount };
  }

  // Tambahan non-DPPL: Handler Express POST /api/chats
  public sendChatHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const idPengirimLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPengirimLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      if (req.body?.idPengirim && req.body.idPengirim !== idPengirimLogin) {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Anda tidak diizinkan mengirim pesan atas nama pengguna lain.',
          },
        });
        return;
      }

      const savedMessage = await this.kirimPesan({
        idPengirim: idPengirimLogin,
        idPenerima: req.body?.idPenerima,
        isiPesan: req.body?.isiPesan,
      });

      res.status(201).json(savedMessage);
    } catch (error) {
      this.sendErrorResponse(error, res);
    }
  };

  // Tambahan non-DPPL: Handler Express GET /api/chats/conversations
  public getConversationsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const idPenggunaLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPenggunaLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      const conversations = await this.getConversations(idPenggunaLogin);
      res.status(200).json(conversations);
    } catch (error) {
      this.sendErrorResponse(error, res);
    }
  };

  // Tambahan non-DPPL: Handler Express GET /api/chats/:idLawanBicara
  public getChatHistoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const idPenggunaLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPenggunaLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      const targetUserParam =
        (req.query.idPengguna as string | undefined) ??
        (req.query.asUserId as string | undefined) ??
        (req.headers['x-user-id'] as string | undefined);

      if (targetUserParam && targetUserParam !== idPenggunaLogin) {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Anda tidak berhak mengakses riwayat percakapan milik pengguna lain.',
          },
        });
        return;
      }

      const { idLawanBicara } = req.params;
      if (!idLawanBicara || idLawanBicara.trim().length === 0) {
        res.status(400).json({
          error: { code: 'INVALID_PARTNER_ID', message: 'Parameter idLawanBicara tidak valid.' },
        });
        return;
      }

      const isInitialOpen = req.query.action === 'start' || req.query.mode === 'start';
      const messages = isInitialOpen
        ? await this.startChat(idPenggunaLogin, idLawanBicara)
        : await this.loadChat(idPenggunaLogin, idLawanBicara);

      res.status(200).json(messages);
    } catch (error) {
      this.sendErrorResponse(error, res);
    }
  };

  // Tambahan non-DPPL: Handler Express PATCH /api/chats/:idLawanBicara/read
  public markChatReadHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const idPenggunaLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPenggunaLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      const { idLawanBicara } = req.params;
      const result = await this.tandaiChatTerbaca(idPenggunaLogin, idLawanBicara);
      res.status(200).json(result);
    } catch (error) {
      this.sendErrorResponse(error, res);
    }
  };

  private sendErrorResponse(error: unknown, res: Response): void {
    if (error instanceof HttpAppError) {
      res.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }

    console.error('[KomunikasiController Unhandled Error]:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan internal pada server.',
      },
    });
  }
}