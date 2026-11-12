import { ChatMessage, NotificationType } from '../types/chat';

export function getInitials(name: string): string {
  if (!name) return '?';
  const clean = name.trim();
  if (clean.toUpperCase() === 'LAYANAN PELANGGAN' || clean.toUpperCase() === 'CS') {
    return 'CS';
  }
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatTimeShort(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (isToday) {
    return `${hours}.${minutes}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Kemarin';
  }

  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  }

  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yy = date.getFullYear().toString().slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function formatDateSeparatorLabel(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (isToday) {
    return `Hari ini, ${hours}.${minutes}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Kemarin, ${hours}.${minutes}`;
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${hours}.${minutes}`;
}

export function formatRelativeNotificationTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 5) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Kemarin';
  }

  return formatTimeShort(isoString);
}

// TEMP: infer NotificationType if backend hasn't provided explicit column (A2)
export function inferNotificationType(text: string): NotificationType {
  const lower = text.toLowerCase();
  if (lower.includes('menerima pesanan') || lower.includes('pesanan baru')) {
    return 'PESANAN_BARU';
  }
  if (lower.includes('tiket') || lower.includes('cs')) {
    return 'INFO_TIKET';
  }
  if (lower.includes('diskon') || lower.includes('promo')) {
    return 'PROMO';
  }
  return 'PESAN_BARU';
}

export function mergeMessages(
  localMessages: ChatMessage[],
  serverMessages: ChatMessage[]
): ChatMessage[] {
  const map = new Map<string, ChatMessage>();

  localMessages.forEach((msg) => {
    if (msg.statusChat === 'SENDING' || msg.statusChat === 'FAILED') {
      map.set(msg.clientId, msg);
    }
  });

  serverMessages.forEach((sMsg) => {
    const key = sMsg.clientId || sMsg.idChat;
    map.set(key, sMsg);
  });

  const merged = Array.from(map.values());
  merged.sort(
    (a, b) => new Date(a.waktuTerkirim).getTime() - new Date(b.waktuTerkirim).getTime()
  );
  return merged;
}