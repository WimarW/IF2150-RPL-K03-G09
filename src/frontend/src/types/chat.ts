export type ChatStatus = 'SENDING' | 'SENT' | 'FAILED';

export interface ChatMessage {
  idChat: string;
  clientId: string;
  idPengguna: string;
  idPenerima: string;
  isiPesan: string;
  waktuTerkirim: string; // ISO 8601
  isChatTerbaca: boolean;
  statusChat: ChatStatus;
}

export interface ConversationSummary {
  partnerId: string;
  partnerName: string;
  isCS: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastMessageAt: string; // ISO 8601
  unreadCount: number;
}

export type NotificationType = 'PESANAN_BARU' | 'PESAN_BARU' | 'INFO_TIKET' | 'PROMO';

export interface AppNotification {
  idNotifikasi: string;
  tipe?: NotificationType;
  refId?: string;
  isiNotifikasi: string;
  waktuNotifikasi: string; // ISO 8601
  statusBaca: boolean;
}

export interface DummyContract {
  idKontrak: string;
  jasa: string;
  deskripsi: string;
  totalHarga: number;
  status: 'MENUNGGU' | 'DITERIMA' | 'DITOLAK';
  waktu: string;
}

export type ChatTimelineItem =
  | { kind: 'message'; data: ChatMessage }
  | { kind: 'contract'; data: DummyContract; variant: 'create' | 'detail' | 'decision' };