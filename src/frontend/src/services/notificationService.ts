import { apiGet, apiRequest } from './api';
import { AppNotification } from '../types/chat';
import { CHAT_CONFIG } from '../config/chatConfig';
import { inferNotificationType } from '../utils/chatUtils';

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    idNotifikasi: 'notif-1',
    tipe: 'PESANAN_BARU',
    refId: 'user-budi-wijaya',
    isiNotifikasi: 'Budi Wijaya menerima pesanan bersih-bersih rumahmu.',
    waktuNotifikasi: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    statusBaca: false,
  },
  {
    idNotifikasi: 'notif-2',
    tipe: 'PESAN_BARU',
    refId: 'user-siti-rahayu',
    isiNotifikasi: 'Siti Rahayu: Terima kasih ya kak, sudah dibayar 😊',
    waktuNotifikasi: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    statusBaca: false,
  },
  {
    idNotifikasi: 'notif-3',
    tipe: 'PROMO',
    refId: undefined,
    isiNotifikasi: 'Diskon 20% untuk jasa kebersihan minggu ini!',
    waktuNotifikasi: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    statusBaca: true,
  },
];

type NotificationsEnvelope =
  | AppNotification[]
  | { items?: AppNotification[]; unreadCount?: number; nextCursor?: string | null };

function extractRefId(isi: string, existingRefId?: string): string | undefined {
  if (existingRefId) return existingRefId;
  const match = isi.match(/#([A-Za-z0-9-]+)/);
  return match?.[1];
}

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_NOTIFICATIONS.map((n) => ({
        ...n,
        tipe: n.tipe || inferNotificationType(n.isiNotifikasi),
        refId: extractRefId(n.isiNotifikasi, n.refId),
      }));
    }

    try {
      const data = await apiGet<NotificationsEnvelope>('/notifications');
      const rawItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];
      return rawItems.map((n) => ({
        ...n,
        tipe: n.tipe || inferNotificationType(n.isiNotifikasi),
        refId: extractRefId(n.isiNotifikasi, n.refId),
      }));
    } catch {
      return MOCK_NOTIFICATIONS.map((n) => ({
        ...n,
        tipe: n.tipe || inferNotificationType(n.isiNotifikasi),
        refId: extractRefId(n.isiNotifikasi, n.refId),
      }));
    }
  },

  async markAsRead(idNotifikasi: string): Promise<void> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
      const target = MOCK_NOTIFICATIONS.find((n) => n.idNotifikasi === idNotifikasi);
      if (target) {
        target.statusBaca = true;
      }
      return;
    }
    await apiRequest<void>(`/notifications/${idNotifikasi}/read`, { method: 'PATCH' });
  },

  async markAllAsRead(): Promise<void> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
      MOCK_NOTIFICATIONS.forEach((n) => {
        n.statusBaca = true;
      });
      return;
    }
    await apiRequest<void>('/notifications/read-all', { method: 'PATCH' });
  },
};