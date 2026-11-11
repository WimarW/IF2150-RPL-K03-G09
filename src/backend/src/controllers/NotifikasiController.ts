import { Request, Response } from 'express';
import {
  Notifikasi,
  NotifikasiRecord,
  PaginatedNotifikasiResult,
} from '../models/Notifikasi';

/**
 * Antarmuka PushGateway untuk merealisasikan Q-028 (ALGO-069).
 * Menyediakan titik sambung ke layanan push notification pada React Native Expo.
 */
export interface PushGateway {
  sendPush(idPenerima: string, pesan: string): Promise<void>;
}

/**
 * Antarmuka RealtimeEmitter untuk abstraksi pengiriman event Socket.IO ke room pengguna.
 */
export interface RealtimeEmitter {
  emitToUser(idPengguna: string, event: string, payload: unknown): void;
}

/**
 * Implementasi default PushGateway untuk ekosistem React Native Expo.
 */
export class ExpoPushGateway implements PushGateway {
  public async sendPush(_idPenerima: string, _pesan: string): Promise<void> {
    // Titik sambung Q-028 untuk integrasi Expo Push Service
  }
}

export class HttpAppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * C30 - Kelas Controller Notifikasi
 * Mengelola aturan bisnis pembuatan notifikasi, pengiriman real-time, dan push notification.
 */
export class NotifikasiController {
  private notifikasiModel: Notifikasi;
  private pushGateway: PushGateway;
  private realtimeEmitter?: RealtimeEmitter;

  constructor(
    notifikasiModel?: Notifikasi,
    pushGateway?: PushGateway,
    realtimeEmitter?: RealtimeEmitter
  ) {
    this.notifikasiModel = notifikasiModel ?? new Notifikasi();
    this.pushGateway = pushGateway ?? new ExpoPushGateway();
    this.realtimeEmitter = realtimeEmitter;
  }

  public setRealtimeEmitter(emitter: RealtimeEmitter): void {
    this.realtimeEmitter = emitter;
  }

  /**
   * C30 · ALGO-067 · Q-027
   * Men-generate idNotifikasi dan waktuNotifikasi, menyimpan notifikasi baru (statusBaca = false)
   * melalui model Prisma, lalu memanggil kirimNotifikasi dan kirimPushNotifikasi.
   */
  public async buatNotifikasi(
    idPenerima: string,
    isiNotifikasi: string
  ): Promise<NotifikasiRecord> {
    if (!idPenerima || typeof idPenerima !== 'string' || idPenerima.trim().length === 0) {
      throw new HttpAppError(400, 'INVALID_RECIPIENT', 'idPenerima wajib berupa string valid.');
    }
    if (
      !isiNotifikasi ||
      typeof isiNotifikasi !== 'string' ||
      isiNotifikasi.trim().length === 0
    ) {
      throw new HttpAppError(
        400,
        'INVALID_NOTIFICATION_CONTENT',
        'isiNotifikasi tidak boleh kosong.'
      );
    }

    const notif = new Notifikasi(idPenerima, isiNotifikasi);
    const savedNotif = await notif.simpanNotifikasi();

    await this.kirimNotifikasi(notif);
    await this.kirimPushNotifikasi(idPenerima, notif.getIsiNotifikasi());

    return savedNotif;
  }

  /**
   * C30 · ALGO-068
   * Merealisasikan `kirimNotifikasi(notif)` (bersama `kirimPushNotifikasi` merealisasikan
   * ALGO-068 dan ALGO-069): meneruskan `notif.getIsiNotifikasi()` ke lapisan tampilan
   * dengan melakukan emit event Socket.IO `notification:new` ke room `user:{idPenerima}`.
   */
  public async kirimNotifikasi(notif: Notifikasi): Promise<string> {
    const isi = notif.getIsiNotifikasi();
    if (this.realtimeEmitter) {
      this.realtimeEmitter.emitToUser(notif.getIdPenerima(), 'notification:new', {
        idNotifikasi: notif.getIdNotifikasi(),
        idPenerima: notif.getIdPenerima(),
        isiNotifikasi: isi,
        waktuNotifikasi: notif.getWaktuNotifikasi(),
        statusBaca: notif.getStatusBaca(),
      });
    }
    return isi;
  }

  /**
   * C30 · ALGO-069 · Q-028
   * Merealisasikan `kirimNotifikasi(idPenerima, pesan)` (bersama `kirimNotifikasi(notif)`
   * merealisasikan ALGO-068 dan ALGO-069): mengirim push notification melalui `PushGateway`.
   */
  public async kirimPushNotifikasi(idPenerima: string, pesan: string): Promise<void> {
    await this.pushGateway.sendPush(idPenerima, pesan);
  }

  // Tambahan non-DPPL: Mengambil daftar notifikasi milik pengguna beserta unreadCount
  public async getNotifikasiPengguna(
    idPenerima: string,
    limit: number = 20,
    cursor?: string
  ): Promise<PaginatedNotifikasiResult> {
    return this.notifikasiModel.findPaginatedByUser(idPenerima, limit, cursor);
  }

  // Tambahan non-DPPL: Menandai satu notifikasi sebagai terbaca (ALGO-066) dengan pemeriksaan kepemilikan
  public async tandaiSatuNotifikasiTerbaca(
    idNotifikasi: string,
    idPenggunaLogin: string
  ): Promise<NotifikasiRecord> {
    const existing = await this.notifikasiModel.findById(idNotifikasi);
    if (!existing) {
      throw new HttpAppError(404, 'NOTIFICATION_NOT_FOUND', 'Notifikasi tidak ditemukan.');
    }

    if (existing.idPenerima !== idPenggunaLogin) {
      throw new HttpAppError(
        403,
        'FORBIDDEN',
        'Anda tidak memiliki akses untuk mengubah notifikasi milik pengguna lain.'
      );
    }

    const notifInstance = new Notifikasi(
      existing.idPenerima,
      existing.isiNotifikasi,
      existing.idNotifikasi,
      existing.waktuNotifikasi,
      existing.statusBaca
    );

    return notifInstance.tandaiTerbaca(idNotifikasi);
  }

  // Tambahan non-DPPL: Menandai seluruh notifikasi milik pengguna yang login sebagai terbaca
  public async tandaiSemuaNotifikasiTerbaca(
    idPenggunaLogin: string
  ): Promise<{ updatedCount: number }> {
    const updatedCount = await this.notifikasiModel.markAllAsReadByUser(idPenggunaLogin);
    return { updatedCount };
  }

  // Tambahan non-DPPL: Handler Express GET /api/notifications
  public getNotificationsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const idPenggunaLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPenggunaLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      const rawLimit = req.query.limit !== undefined ? Number(req.query.limit) : 20;
      if (Number.isNaN(rawLimit) || !Number.isInteger(rawLimit) || rawLimit <= 0) {
        res.status(400).json({
          error: {
            code: 'INVALID_LIMIT',
            message: 'Parameter query limit harus berupa bilangan bulat positif.',
          },
        });
        return;
      }

      const cursor =
        typeof req.query.cursor === 'string' && req.query.cursor.trim().length > 0
          ? req.query.cursor.trim()
          : undefined;

      const data = await this.getNotifikasiPengguna(idPenggunaLogin, rawLimit, cursor);
      res.status(200).json(data);
    } catch (error) {
      this.sendErrorResponse(error, res);
    }
  };

  // Tambahan non-DPPL: Handler Express PATCH /api/notifications/read-all
  public markAllNotificationsReadHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idPenggunaLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPenggunaLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      const result = await this.tandaiSemuaNotifikasiTerbaca(idPenggunaLogin);
      res.status(200).json(result);
    } catch (error) {
      this.sendErrorResponse(error, res);
    }
  };

  // Tambahan non-DPPL: Handler Express PATCH /api/notifications/:id/read
  public markOneNotificationReadHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idPenggunaLogin = (req as Request & { user?: { idPengguna: string } }).user
        ?.idPengguna;
      if (!idPenggunaLogin) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Token autentikasi diperlukan.' },
        });
        return;
      }

      const { id } = req.params;
      const updated = await this.tandaiSatuNotifikasiTerbaca(id, idPenggunaLogin);
      res.status(200).json(updated);
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

    console.error('[NotifikasiController Unhandled Error]:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan internal pada server.',
      },
    });
  }
}