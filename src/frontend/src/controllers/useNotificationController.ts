import { useState, useCallback } from 'react';
import { AppNotification } from '../types/chat';
import { notificationService } from '../services/notificationService';
import { useUnreadCounts } from '../context/UnreadContext';
import { useSessionUser } from '../services/api';

export interface NotificationNavigationTarget {
  targetScreen: string;
  params?: Record<string, unknown>;
}

export function useNotificationController() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const { setUnreadNotifications } = useUnreadCounts();
  const { isPenyediaJasa, isCS } = useSessionUser();

  const loadNotifications = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setIsLoading(true);
      setError(null);
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
        const unreadCount = data.filter((n) => !n.statusBaca).length;
        setUnreadNotifications(unreadCount);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memuat notifikasi.';
        if (!isSilent) setError(msg);
      } finally {
        if (!isSilent) setIsLoading(false);
      }
    },
    [setUnreadNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, statusBaca: true })));
    setUnreadNotifications(0);

    try {
      await notificationService.markAllAsRead();
    } catch {
      setSnackbarMessage('Gagal menandai semua notifikasi sebagai dibaca.');
    }
  }, [setUnreadNotifications]);

  const handleNotificationPress = useCallback(
    (item: AppNotification): NotificationNavigationTarget | null => {
      if (!item.statusBaca) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.idNotifikasi === item.idNotifikasi ? { ...n, statusBaca: true } : n
          )
        );
        setUnreadNotifications((prev) => Math.max(0, prev - 1));
        notificationService.markAsRead(item.idNotifikasi).catch(() => {});
      }

      if (item.tipe === 'INFO_TIKET') {
        const ticketId =
          item.refId || item.isiNotifikasi.match(/#([A-Za-z0-9-]+)/)?.[1];
        if (ticketId) {
          return {
            targetScreen: 'TicketDetail',
            params: { ticketId },
          };
        }
        return {
          targetScreen: isCS ? 'CSDashboard' : 'MyTickets',
        };
      }

      if (item.tipe === 'PESAN_BARU' || item.tipe === 'PESANAN_BARU') {
        const partnerId = item.refId || 'user-budi-wijaya';
        const partnerName = 'Mitra Jasa';
        if (isPenyediaJasa) {
          return {
            targetScreen: 'ProviderChat',
            params: { partnerId, partnerName, isCS: false },
          };
        }
        return {
          targetScreen: 'CustomerChat',
          params: {
            idPemberiJasa: partnerId,
            namaPemberiJasa: partnerName,
            partnerId,
            partnerName,
            isCS: false,
            isOnline: true,
          },
        };
      }

      return null;
    },
    [isCS, isPenyediaJasa, setUnreadNotifications]
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadNotifications(true);
    setIsRefreshing(false);
  }, [loadNotifications]);

  return {
    notifications,
    isLoading,
    isRefreshing,
    error,
    snackbarMessage,
    setSnackbarMessage,
    loadNotifications,
    markAllAsRead,
    handleNotificationPress,
    onRefresh,
  };
}
