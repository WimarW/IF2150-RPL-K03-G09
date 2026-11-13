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
  /** Path relatif dari backend (mis. /uploads/xx.jpg) atau URI lokal saat pesan masih terkirim */
  lampiranUrl?: string | null;
  /** Lampiran lokal yang dipakai ulang saat kirim ulang pesan gagal */
  localAttachment?: ChatAttachment | null;
}

export interface ChatAttachment {
  uri: string;
  mimeType: 'image/jpeg' | 'image/png';
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
  namaPelanggan?: string;
  inisialPelanggan?: string;
  namaPemberiJasa?: string;
  inisialPemberiJasa?: string;
  kategoriJasa?: string;
  rincianPekerjaan?: string;
  jasa: string;
  deskripsi: string;
  detailPekerjaan?: string;
  totalHarga: number;
  persetujuanHarga?: number;
  status: ContractCardStatus;
  statusPekerjaan?: StatusPekerjaan;
  hasRating?: boolean;
  nilaiRating?: number | null;
  komentar?: string | null;
  /** UC10 dua arah: apakah pengguna yang login sudah memberi rating pada kontrak ini */
  hasRatedByMe?: boolean;
  /** Rating yang diberikan oleh pengguna yang login kepada lawan transaksinya */
  nilaiRatingDiberikan?: number | null;
  ulasanDiberikan?: string | null;
  tagsDiberikan?: string[];
  waktu: string;
  tanggalWaktu?: string;
  tanggalSelesai?: string;
  createdAt?: string;
  expiresAt?: string | null;
}

export type ContractRecord = DummyContract;

export type HistoryFilterTab = 'Semua' | 'Selesai' | 'On Progress';

export type HistoryDisplayStatus = 'On Progress' | 'Selesai' | 'Dibatalkan';

export interface CustomerTransactionItem {
  idKontrak: string;
  idPelanggan?: string;
  idPemberiJasa: string;
  namaPemberiJasa: string;
  inisialPemberiJasa: string;
  kategoriJasa?: string;
  rincianPekerjaan: string;
  deskripsi?: string;
  tanggalWaktu: string;
  tanggalSelesai?: string;
  totalHarga: number;
  statusDisplay: HistoryDisplayStatus;
  statusPekerjaan: StatusPekerjaan;
  hasRating: boolean;
  nilaiRating?: number | null;
  komentar?: string | null;
}

export interface ProviderJobItem {
  idKontrak: string;
  idPelanggan: string;
  idPemberiJasa: string;
  namaPelanggan: string;
  inisialPelanggan: string;
  namaPemberiJasa?: string;
  inisialPemberiJasa?: string;
  kategoriJasa?: string;
  rincianPekerjaan: string;
  deskripsi?: string;
  tanggalWaktu: string;
  tanggalSelesai?: string;
  totalHarga: number;
  statusDisplay: HistoryDisplayStatus;
  statusPekerjaan: StatusPekerjaan;
  hasRating: boolean;
  nilaiRating?: number | null;
  komentar?: string | null;
  /** UC10 dua arah: penyedia jasa sudah memberi rating ke pelanggan */
  hasRatedByMe?: boolean;
  nilaiRatingDiberikan?: number | null;
  ulasanDiberikan?: string | null;
  tagsDiberikan?: string[];
}

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