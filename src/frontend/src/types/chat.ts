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

export type ContractCardStatus = 'MENUNGGU' | 'DITERIMA' | 'DITOLAK';

export type StatusPekerjaan =
  | 'Menunggu'
  | 'On Progress'
  | 'Menunggu Konfirmasi Pelanggan'
  | 'Done'
  | 'Ditolak'
  | 'Dibatalkan';

export interface DummyContract {
  idKontrak: string;
  idKontrakPekerjaan?: string;
  idPelanggan?: string;
  idPemberiJasa?: string;
  jasa: string;
  deskripsi: string;
  detailPekerjaan?: string;
  totalHarga: number;
  persetujuanHarga?: number;
  status: ContractCardStatus;
  statusPekerjaan?: StatusPekerjaan;
  hasRating?: boolean;
  waktu: string;
  createdAt?: string;
  expiresAt?: string | null;
}

export type ContractRecord = DummyContract;

export interface ContractFormValues {
  jasa: string;
  deskripsi: string;
  totalHarga: string;
}

export interface ContractFormErrors {
  jasa?: string;
  deskripsi?: string;
  totalHarga?: string;
}

export type ChatTimelineItem =
  | { kind: 'message'; data: ChatMessage }
  | { kind: 'contract'; data: DummyContract; variant: 'create' | 'detail' | 'decision' };