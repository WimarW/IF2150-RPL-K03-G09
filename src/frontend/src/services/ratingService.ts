import { apiRequest } from './api';

export type RatingTag = 'Tepat Waktu' | 'Kerja Bersih' | 'Ramah';

export type ContractStatusBackend =
  | 'In Progress'
  | 'Completed'
  | 'Done'
  | 'Cancelled';

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
  waktuRating: string;
}

export interface CreateRatingResponse {
  success: boolean;
  message: string;
  data?: RatingRecord;
}

export interface VerifyRatingResponse {
  success: boolean;
  canRate: boolean;
  message?: string;
  data?: {
    idKontrak: string;
    statusPekerjaan: ContractStatusBackend;
    hasRating: boolean;
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

const listeners = new Set<StoreListener>();

function notifyListeners() {
  const snapshot = getCustomerTransactionsSnapshot();
  listeners.forEach((listener) => listener(snapshot));
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
  status: ContractStatusBackend
): HistoryDisplayStatus {
  if (status === 'Done') return 'Selesai';
  if (status === 'Cancelled') return 'Dibatalkan';
  return 'On Progress';
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
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await apiRequest<VerifyRatingResponse>(
      `/ratings/verify/${encodeURIComponent(idKontrak)}`,
      {
        method: 'GET',
        headers,
      }
    );
    return response;
  } catch {
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
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiRequest<CreateRatingResponse>('/ratings', {
      method: 'POST',
      headers,
      body: sanitizedPayload,
    });

    if (response.success) {
      markContractRatedInStore(
        sanitizedPayload.idKontrakPekerjaan,
        sanitizedPayload.nilaiRating,
        sanitizedPayload.ulasan,
        sanitizedPayload.tags
      );
    }

    return response;
  } catch {
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
 * Mengambil daftar riwayat transaksi pelanggan (`UI-10`).
 */
export async function fetchCustomerTransactions(
  token?: string
): Promise<CustomerTransactionItem[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await apiRequest<{
      success: boolean;
      data?: CustomerTransactionItem[];
    }>('/kontrak/riwayat', {
      method: 'GET',
      headers,
    });

    if (response?.success && Array.isArray(response.data)) {
      customerTransactionsStore = response.data.map((item) => ({
        ...item,
        inisialPenyedia:
          item.inisialPenyedia || getInitialsFromName(item.namaPenyedia),
        displayStatus:
          item.displayStatus || mapBackendStatusToDisplay(item.statusPekerjaan),
      }));
      notifyListeners();
    }
  } catch {
    // Gunakan state lokal jika backend belum aktif / offline
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
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    await apiRequest(`/kontrak/${encodeURIComponent(idKontrak)}/konfirmasi`, {
      method: 'PATCH',
      headers,
    });
  } catch {
    // Fallback ke update store lokal
  }

  return markContractDoneInStore(idKontrak);
}
