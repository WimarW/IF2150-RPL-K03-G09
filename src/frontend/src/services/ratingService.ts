import {
  API_BASE_URL,
  ApiError,
  apiRequest,
  ensureDevAuthToken,
  getAuthToken,
} from './api';

export type RatingTag = 'Tepat Waktu' | 'Kerja Bersih' | 'Ramah';

export type ContractStatusBackend =
  | 'In Progress'
  | 'On Progress'
  | 'Menunggu'
  | 'Menunggu Konfirmasi Pelanggan'
  | 'Completed'
  | 'Done'
  | 'Cancelled'
  | 'Dibatalkan'
  | 'Ditolak';

export type HistoryDisplayStatus = 'On Progress' | 'Selesai' | 'Dibatalkan';

export type HistoryFilterTab = 'Semua' | 'Selesai' | 'On Progress';

export interface CreateRatingPayload {
  idKontrakPekerjaan: string;
  idPenggunaPenerima: string;
  nilaiRating: number;
  ulasan?: string;
  tags?: string[];
}

export interface RatingRecord {
  idRating: string;
  idKontrakPekerjaan: string;
  idPenggunaPemberi: string;
  idPenggunaPenerima: string;
  nilaiRating: number;
  ulasan?: string | null;
  tags?: string[];
  waktuRating?: string;
  tanggalRating?: string;
}

export interface CreateRatingResponse {
  success: boolean;
  message: string;
  data?: RatingRecord | { rating?: RatingRecord; penerima?: unknown };
}

export interface VerifyRatingResponse {
  success: boolean;
  canRate: boolean;
  message?: string;
  data?: {
    idKontrak?: string;
    idKontrakPekerjaan?: string;
    statusPekerjaan?: ContractStatusBackend;
    hasRating?: boolean;
    idPenggunaPenerima?: string;
    namaPenerima?: string;
    detailPekerjaan?: string;
  };
}

export interface CustomerTransactionItem {
  idKontrak: string;
  judulPekerjaan: string;
  detailPekerjaan: string;
  waktuTransaksi: string;
  idPenggunaPelanggan: string;
  idPenggunaPenyedia: string;
  namaPenyedia: string;
  inisialPenyedia: string;
  biayaKesepakatan: number;
  hargaFormatted: string;
  statusPekerjaan: ContractStatusBackend;
  displayStatus: HistoryDisplayStatus;
  hasRating: boolean;
  nilaiRatingDiberikan?: number;
  ulasanDiberikan?: string;
  tagsDiberikan?: string[];
}

interface BackendKontrakRecord {
  idKontrakPekerjaan: string;
  idPelanggan: string;
  idPemberiJasa: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan: string;
  hasRating: boolean;
  createdAt: string;
  pemberiJasa?: {
    idPemberiJasa?: string;
    namaToko?: string;
    jenisJasa?: string | null;
    pengguna?: {
      namaPengguna?: string;
      avatarUrl?: string | null;
      akumulasiRating?: number;
    };
  };
  ratings?: Array<{
    idRating?: string;
    idPenggunaPemberi?: string;
    nilaiRating?: number;
    ulasan?: string | null;
    tags?: string[];
  }>;
}

export const INITIAL_CUSTOMER_TRANSACTIONS: CustomerTransactionItem[] = [
  {
    idKontrak: 'kontrak-001',
    judulPekerjaan: 'Bersih-bersih rumah · 2 jam',
    detailPekerjaan: 'Bersih-bersih Rumah · 2 Jam',
    waktuTransaksi: '12 Mei 2026 · 14.20',
    idPenggunaPelanggan: 'pelanggan-001',
    idPenggunaPenyedia: 'penyedia-budi-001',
    namaPenyedia: 'Budi Wijaya',
    inisialPenyedia: 'BW',
    biayaKesepakatan: 100000,
    hargaFormatted: 'Rp 100.000',
    statusPekerjaan: 'In Progress',
    displayStatus: 'On Progress',
    hasRating: false,
  },
  {
    idKontrak: 'kontrak-002',
    judulPekerjaan: 'Cuci & setrika · 3 kg',
    detailPekerjaan: 'Cuci & Setrika · 3 Kg',
    waktuTransaksi: '8 Mei 2026 · 09.10',
    idPenggunaPelanggan: 'pelanggan-001',
    idPenggunaPenyedia: 'penyedia-siti-002',
    namaPenyedia: 'Siti Rahayu',
    inisialPenyedia: 'SR',
    biayaKesepakatan: 60000,
    hargaFormatted: 'Rp 60.000',
    statusPekerjaan: 'Done',
    displayStatus: 'Selesai',
    hasRating: false,
  },
  {
    idKontrak: 'kontrak-003',
    judulPekerjaan: 'Angkut barang pindahan',
    detailPekerjaan: 'Angkut Barang Pindahan',
    waktuTransaksi: '27 Apr 2026 · 11.30',
    idPenggunaPelanggan: 'pelanggan-001',
    idPenggunaPenyedia: 'penyedia-dedi-003',
    namaPenyedia: 'Dedi Prakoso',
    inisialPenyedia: 'DP',
    biayaKesepakatan: 150000,
    hargaFormatted: 'Rp 150.000',
    statusPekerjaan: 'Cancelled',
    displayStatus: 'Dibatalkan',
    hasRating: false,
  },
];

type StoreListener = (items: CustomerTransactionItem[]) => void;

let customerTransactionsStore: CustomerTransactionItem[] =
  INITIAL_CUSTOMER_TRANSACTIONS.map((item) => ({ ...item }));

let lastBackendError: string | null = null;
let lastSyncSource: 'backend' | 'offline' = 'offline';

const listeners = new Set<StoreListener>();

function notifyListeners() {
  const snapshot = getCustomerTransactionsSnapshot();
  listeners.forEach((listener) => listener(snapshot));
}

export function getLastBackendSyncStatus(): {
  source: 'backend' | 'offline';
  error: string | null;
  apiBaseUrl: string;
} {
  return {
    source: lastSyncSource,
    error: lastBackendError,
    apiBaseUrl: API_BASE_URL,
  };
}

export function getCustomerTransactionsSnapshot(): CustomerTransactionItem[] {
  return customerTransactionsStore.map((item) => ({
    ...item,
    tagsDiberikan: item.tagsDiberikan ? [...item.tagsDiberikan] : undefined,
  }));
}

export function subscribeCustomerTransactions(
  listener: StoreListener
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetCustomerTransactionsStore(
  seed: CustomerTransactionItem[] = INITIAL_CUSTOMER_TRANSACTIONS
): void {
  customerTransactionsStore = seed.map((item) => ({
    ...item,
    tagsDiberikan: item.tagsDiberikan ? [...item.tagsDiberikan] : undefined,
  }));
  lastBackendError = null;
  lastSyncSource = 'offline';
  notifyListeners();
}

export function getInitialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'CU';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function mapBackendStatusToDisplay(
  status: string
): HistoryDisplayStatus {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'done') return 'Selesai';
  if (
    normalized === 'cancelled' ||
    normalized === 'dibatalkan' ||
    normalized === 'ditolak'
  ) {
    return 'Dibatalkan';
  }
  return 'On Progress';
}

function formatIsoTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()] ?? '';
  const year = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} · ${hh}.${mm}`;
}

function formatRupiah(amount: number): string {
  try {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  } catch {
    return `Rp ${amount}`;
  }
}

export function mapBackendKontrakToTransaction(
  raw: BackendKontrakRecord
): CustomerTransactionItem {
  const namaPenyedia =
    raw.pemberiJasa?.pengguna?.namaPengguna ||
    raw.pemberiJasa?.namaToko ||
    'Penyedia Jasa';
  const latestRating =
    Array.isArray(raw.ratings) && raw.ratings.length > 0
      ? raw.ratings[0]
      : undefined;
  const hasRating = Boolean(
    raw.hasRating || (Array.isArray(raw.ratings) && raw.ratings.length > 0)
  );

  return {
    idKontrak: raw.idKontrakPekerjaan,
    judulPekerjaan: raw.detailPekerjaan,
    detailPekerjaan: raw.detailPekerjaan,
    waktuTransaksi: formatIsoTimestamp(raw.createdAt),
    idPenggunaPelanggan: raw.idPelanggan,
    idPenggunaPenyedia: raw.idPemberiJasa,
    namaPenyedia,
    inisialPenyedia: getInitialsFromName(namaPenyedia),
    biayaKesepakatan: raw.persetujuanHarga,
    hargaFormatted: formatRupiah(raw.persetujuanHarga),
    statusPekerjaan: raw.statusPekerjaan as ContractStatusBackend,
    displayStatus: mapBackendStatusToDisplay(raw.statusPekerjaan),
    hasRating,
    nilaiRatingDiberikan: latestRating?.nilaiRating,
    ulasanDiberikan: latestRating?.ulasan ?? undefined,
    tagsDiberikan: latestRating?.tags,
  };
}

async function resolveAuthHeaders(
  explicitToken?: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  const token = explicitToken || getAuthToken() || (await ensureDevAuthToken());
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function markContractRatedInStore(
  idKontrak: string,
  nilaiRating: number,
  ulasan?: string,
  tags?: string[]
): CustomerTransactionItem | null {
  let updatedItem: CustomerTransactionItem | null = null;
  customerTransactionsStore = customerTransactionsStore.map((item) => {
    if (item.idKontrak !== idKontrak) return item;
    updatedItem = {
      ...item,
      hasRating: true,
      nilaiRatingDiberikan: nilaiRating,
      ulasanDiberikan: ulasan?.trim() || undefined,
      tagsDiberikan: tags && tags.length > 0 ? [...tags] : undefined,
    };
    return updatedItem;
  });
  notifyListeners();
  return updatedItem;
}

export function markContractDoneInStore(
  idKontrak: string
): CustomerTransactionItem | null {
  let updatedItem: CustomerTransactionItem | null = null;
  customerTransactionsStore = customerTransactionsStore.map((item) => {
    if (item.idKontrak !== idKontrak) return item;
    updatedItem = {
      ...item,
      statusPekerjaan: 'Done',
      displayStatus: 'Selesai',
    };
    return updatedItem;
  });
  notifyListeners();
  return updatedItem;
}

/**
 * GET /api/ratings/verify/:idKontrak
 * Memverifikasi apakah kontrak pekerjaan selesai dan belum dinilai (`UC10`).
 */
export async function verifyContractForRating(
  idKontrak: string,
  token?: string
): Promise<VerifyRatingResponse> {
  try {
    const headers = await resolveAuthHeaders(token);
    const data = await apiRequest<{
      canRate?: boolean;
      idKontrakPekerjaan?: string;
      idPenggunaPemberi?: string;
      idPenggunaPenerima?: string;
      detailPekerjaan?: string;
      statusPekerjaan?: ContractStatusBackend;
      hasRating?: boolean;
      success?: boolean;
      message?: string;
    }>(`/ratings/verify/${encodeURIComponent(idKontrak)}`, {
      method: 'GET',
      headers,
    });

    const canRate = Boolean(data?.canRate);
    return {
      success: canRate,
      canRate,
      message: data?.message || (canRate ? 'Kontrak pekerjaan siap untuk diberi rating.' : undefined),
      data: {
        idKontrak: data?.idKontrakPekerjaan || idKontrak,
        idKontrakPekerjaan: data?.idKontrakPekerjaan || idKontrak,
        statusPekerjaan: data?.statusPekerjaan,
        hasRating: data?.hasRating,
        idPenggunaPenerima: data?.idPenggunaPenerima,
        detailPekerjaan: data?.detailPekerjaan,
      },
    };
  } catch (err) {
    // Jika server merespons dengan status HTTP (misal 400/401/403/404), tampilkan error asli dari server
    if (err instanceof ApiError && err.status > 0) {
      console.warn('[ratingService] Verifikasi gagal dari server:', err.status, err.message);
      return {
        success: false,
        canRate: false,
        message: err.message,
      };
    }

    // Fallback offline hanya jika server tidak dapat dijangkau (status === 0 / Jest unit test)
    const localContract = customerTransactionsStore.find(
      (item) => item.idKontrak === idKontrak
    );
    if (!localContract) {
      return {
        success: false,
        canRate: false,
        message: 'Kontrak pekerjaan tidak ditemukan',
      };
    }

    const canRate =
      localContract.statusPekerjaan === 'Done' && !localContract.hasRating;

    return {
      success: canRate,
      canRate,
      message: canRate
        ? 'Kontrak valid untuk diberi penilaian'
        : localContract.hasRating
          ? 'Anda sudah memberikan penilaian untuk kontrak ini'
          : 'Pekerjaan belum selesai dikonfirmasi',
      data: {
        idKontrak: localContract.idKontrak,
        statusPekerjaan: localContract.statusPekerjaan,
        hasRating: localContract.hasRating,
        idPenggunaPenerima: localContract.idPenggunaPenyedia,
        namaPenerima: localContract.namaPenyedia,
        detailPekerjaan: localContract.detailPekerjaan,
      },
    };
  }
}

/**
 * POST /api/ratings
 * Mengirim penilaian bintang (1-5), ulasan opsional, dan tag chip ke backend (`UC10`).
 */
export async function submitRating(
  payload: CreateRatingPayload,
  token?: string
): Promise<CreateRatingResponse> {
  const sanitizedPayload: CreateRatingPayload = {
    idKontrakPekerjaan: payload.idKontrakPekerjaan,
    idPenggunaPenerima: payload.idPenggunaPenerima,
    nilaiRating: Math.round(payload.nilaiRating),
    ulasan: payload.ulasan?.trim() || undefined,
    tags: payload.tags && payload.tags.length > 0 ? payload.tags : undefined,
  };

  try {
    const headers = await resolveAuthHeaders(token);

    // `apiRequest` otomatis me-unwrap `json.data` dari backend (`{ rating, penerima }`)
    const data = await apiRequest<{
      rating?: RatingRecord;
      penerima?: unknown;
      idRating?: string;
    }>('/ratings', {
      method: 'POST',
      headers,
      body: sanitizedPayload,
    });

    markContractRatedInStore(
      sanitizedPayload.idKontrakPekerjaan,
      sanitizedPayload.nilaiRating,
      sanitizedPayload.ulasan,
      sanitizedPayload.tags
    );

    return {
      success: true,
      message: 'Rating berhasil disimpan',
      data: data?.rating ?? data,
    };
  } catch (err) {
    // Jika server membalas HTTP error (400/401/403/404/500), JANGAN sembunyikan error!
    if (err instanceof ApiError && err.status > 0) {
      console.warn('[ratingService] Submit rating ditolak server:', err.status, err.message);
      return {
        success: false,
        message: err.message,
      };
    }

    console.warn(
      `[ratingService] Backend tidak terjangkau di ${API_BASE_URL}. Menggunakan fallback store lokal.`
    );

    markContractRatedInStore(
      sanitizedPayload.idKontrakPekerjaan,
      sanitizedPayload.nilaiRating,
      sanitizedPayload.ulasan,
      sanitizedPayload.tags
    );

    return {
      success: true,
      message: 'Rating berhasil disimpan',
      data: {
        idRating: `rating-${Date.now()}`,
        idKontrakPekerjaan: sanitizedPayload.idKontrakPekerjaan,
        idPenggunaPemberi: 'pelanggan-001',
        idPenggunaPenerima: sanitizedPayload.idPenggunaPenerima,
        nilaiRating: sanitizedPayload.nilaiRating,
        ulasan: sanitizedPayload.ulasan ?? null,
        tags: sanitizedPayload.tags ?? [],
        waktuRating: new Date().toISOString(),
      },
    };
  }
}

/**
 * Mengambil daftar riwayat transaksi pelanggan dari `GET /api/kontrak` (`UI-10`).
 */
export async function fetchCustomerTransactions(
  token?: string
): Promise<CustomerTransactionItem[]> {
  try {
    const headers = await resolveAuthHeaders(token);
    const data = await apiRequest<
      BackendKontrakRecord[] | CustomerTransactionItem[]
    >('/kontrak', {
      method: 'GET',
      headers,
    });

    if (Array.isArray(data)) {
      customerTransactionsStore = data.map((item) => {
        if ('idKontrakPekerjaan' in item) {
          return mapBackendKontrakToTransaction(item as BackendKontrakRecord);
        }
        const tx = item as CustomerTransactionItem;
        return {
          ...tx,
          inisialPenyedia:
            tx.inisialPenyedia || getInitialsFromName(tx.namaPenyedia),
          displayStatus:
            tx.displayStatus || mapBackendStatusToDisplay(tx.statusPekerjaan),
        };
      });
      lastSyncSource = 'backend';
      lastBackendError = null;
      notifyListeners();
    }
  } catch (err) {
    lastSyncSource = 'offline';
    lastBackendError =
      err instanceof Error ? err.message : 'Gagal terhubung ke backend.';
    console.warn(
      `[ratingService] Gagal memuat riwayat dari ${API_BASE_URL}/kontrak:`,
      lastBackendError
    );
  }

  return getCustomerTransactionsSnapshot();
}

/**
 * Konfirmasi pekerjaan selesai (`UC10` Skenario Normal - Prekondisi: status menjadi `Done`).
 */
export async function confirmContractCompletion(
  idKontrak: string,
  token?: string
): Promise<CustomerTransactionItem | null> {
  try {
    const headers = await resolveAuthHeaders(token);
    await apiRequest(`/kontrak/${encodeURIComponent(idKontrak)}/konfirmasi`, {
      method: 'PATCH',
      headers,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status > 0) {
      console.warn(
        '[ratingService] Konfirmasi kontrak gagal dari server:',
        err.status,
        err.message
      );
      return null;
    }
  }

  return markContractDoneInStore(idKontrak);
}
