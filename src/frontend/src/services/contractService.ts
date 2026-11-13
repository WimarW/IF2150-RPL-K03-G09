/**
 * Service Integrasi Kontrak Pekerjaan & Riwayat Transaksi/Pekerjaan (UC05, UC06, UC07, UC10)
 * Traceability:
 * - Kelas DPPL C16 KontrakPekerjaan (ALGO-036 s.d. ALGO-040)
 * - Kelas DPPL C17 KontrakPekerjaanUI
 * - Kelas DPPL C18 KontrakPekerjaanController (ALGO-041 s.d. ALGO-043)
 * - Kelas DPPL C01 Pengguna (ALGO-004 konfirmasiPekerjaan), C02 PenggunaUI, C05 PemberiJasaUI, C08 PemberiJasaController
 * - Antarmuka UI-08 (Ruang Obrolan Pelanggan: UI-08-04, UI-08-05, UI-08-09)
 * - Antarmuka UI-09 (Ruang Obrolan Penyedia Jasa: UI-09-06, UI-09-07, UI-09-08, UI-09-09)
 * - Antarmuka UI-10 (Riwayat Pelanggan: UI-10-01 s.d. UI-10-06, UC07 Konfirmasi Selesai)
 * - Antarmuka UI-12 (Riwayat Pekerjaan Penyedia Jasa: UI-12-01 s.d. UI-12-07, UC06 Pekerjaan Telah Selesai)
 */

import {
  apiGet,
  apiPatch,
  apiPost,
  apiRequest,
  getAuthToken,
  getCurrentUser,
} from './api';
import {
  markContractDoneInStore,
  markContractRatedInStore,
  markContractWaitingConfirmationInStore,
} from './ratingService';
import { CHAT_CONFIG } from '../config/chatConfig';
import {
  ContractCardStatus,
  ContractRecord,
  CustomerTransactionItem,
  HistoryDisplayStatus,
  ProviderJobItem,
  StatusPekerjaan,
} from '../types/chat';
import { formatTimeShort } from '../utils/chatUtils';

export interface BackendRatingInfo {
  idRating?: string;
  nilaiRating: number;
  komentar?: string | null;
  waktuPenilaian?: string | Date;
  idPenilai?: string;
  idDinilai?: string;
  idPemberiJasa?: string;
  /** Skema tabel `rating` backend (Prisma) */
  idPenggunaPemberi?: string;
  idPenggunaPenerima?: string;
  ulasan?: string | null;
  tags?: string[];
}

export interface BackendKontrakDetail {
  idKontrakPekerjaan: string | null;
  idPelanggan: string;
  idPemberiJasa: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan: string;
  hasRating?: boolean;
  nilaiRating?: number | null;
  komentar?: string | null;
  createdAt?: string | Date;
  expiresAt?: string | Date | null;
  pelanggan?: {
    idPengguna?: string;
    namaPengguna?: string;
    username?: string;
  } | null;
  pemberiJasa?: {
    idPemberiJasa?: string;
    namaToko?: string;
    jenisJasa?: string | null;
    statusKetersediaan?: string;
    version?: number;
    pengguna?: {
      idPengguna?: string;
      namaPengguna?: string;
      username?: string;
    } | null;
  } | null;
  rating?: BackendRatingInfo | null;
  ratings?: BackendRatingInfo[] | null;
  /** Field turunan per pengguna login dari GET /api/kontrak (UC10 dua arah) */
  hasRatedByMe?: boolean;
  ratingDariSaya?: BackendRatingInfo | null;
  ratingUntukSaya?: BackendRatingInfo | null;
}

export interface ChatPartnerKontrakResponse {
  kontrakAktif: BackendKontrakDetail | null;
  daftarKontrak: BackendKontrakDetail[];
  riwayatChat?: unknown[];
}

export interface CreateContractParams {
  partnerId: string;
  jasa: string;
  deskripsi: string;
  totalHarga: number;
  idPelanggan?: string;
  expectedVersion?: number;
  kirimKeChat?: boolean;
}

export const DEFAULT_JASA_NAME = 'Bersih-bersih Rumah';
export const DETAIL_SEPARATOR = ' - ';

const BULAN_PENDEK_ID = [
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

/**
 * Menghasilkan inisial 2 huruf kapital dari nama pengguna/penyedia jasa.
 */
export function getInitials(name?: string | null, fallback = 'PJ'): string {
  const clean = (name ?? '').trim();
  if (!clean) return fallback;
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

/**
 * Memformat tanggal & waktu menjadi format DPPL UI-10 & UI-12 (contoh: "12 Mei 2026 · 14.20").
 */
export function formatTanggalWaktuIndonesia(
  dateInput?: string | Date | null,
  fallback = '12 Mei 2026 · 14.20'
): string {
  if (!dateInput) return fallback;
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return fallback;
    if (trimmed.includes('·') || /^\d{1,2}\s+[A-Za-z]{3,}/.test(trimmed)) {
      return trimmed;
    }
  }

  const parsed =
    dateInput instanceof Date ? dateInput : new Date(String(dateInput));
  if (Number.isNaN(parsed.getTime())) {
    return typeof dateInput === 'string' && dateInput.trim()
      ? dateInput.trim()
      : fallback;
  }

  const tanggal = parsed.getDate();
  const bulan = BULAN_PENDEK_ID[parsed.getMonth()] ?? 'Mei';
  const tahun = parsed.getFullYear();
  const jam = String(parsed.getHours()).padStart(2, '0');
  const menit = String(parsed.getMinutes()).padStart(2, '0');
  return `${tanggal} ${bulan} ${tahun} · ${jam}.${menit}`;
}

/**
 * Memformat tanggal selesai (contoh: "12 Mei 2026") dari tanggalWaktu atau ISO string.
 */
export function formatTanggalSelesaiIndonesia(
  dateInput?: string | Date | null,
  fallback = '12 Mei 2026'
): string {
  const formattedFull = formatTanggalWaktuIndonesia(dateInput, fallback);
  const dotIdx = formattedFull.indexOf('·');
  if (dotIdx > 0) {
    return formattedFull.slice(0, dotIdx).trim();
  }
  return formattedFull;
}

/**
 * Menggabungkan nama jenis jasa dan deskripsi pekerjaan ke dalam satu string detailPekerjaan
 * untuk dikirimkan ke backend KontrakPekerjaan (tanpa mengubah skema DB).
 */
export function formatDetailPekerjaan(jasa: string, deskripsi: string): string {
  const cleanJasa = (jasa ?? '').trim();
  const cleanDeskripsi = (deskripsi ?? '').trim();

  if (cleanJasa && cleanDeskripsi) {
    if (
      cleanDeskripsi
        .toLowerCase()
        .startsWith(`${cleanJasa.toLowerCase()}${DETAIL_SEPARATOR}`)
    ) {
      return cleanDeskripsi;
    }
    return `${cleanJasa}${DETAIL_SEPARATOR}${cleanDeskripsi}`;
  }
  return cleanDeskripsi || cleanJasa;
}

/**
 * Memisahkan kembali string detailPekerjaan dari backend menjadi pasangan { jasa, deskripsi }
 * untuk dirender pada kartu kontrak di UI-08 dan UI-09.
 */
export function parseDetailPekerjaan(
  detailPekerjaan: string,
  fallbackJasa: string = DEFAULT_JASA_NAME
): { jasa: string; deskripsi: string } {
  const raw = (detailPekerjaan ?? '').trim();
  const cleanFallback = (fallbackJasa ?? '').trim() || DEFAULT_JASA_NAME;

  if (!raw) {
    return {
      jasa: cleanFallback,
      deskripsi: '',
    };
  }

  const sepIdx = raw.indexOf(DETAIL_SEPARATOR);
  if (sepIdx > 0) {
    const parsedJasa = raw.slice(0, sepIdx).trim();
    const parsedDeskripsi = raw.slice(sepIdx + DETAIL_SEPARATOR.length).trim();
    if (parsedJasa && parsedDeskripsi) {
      return {
        jasa: parsedJasa,
        deskripsi: parsedDeskripsi,
      };
    }
  }

  return {
    jasa: cleanFallback,
    deskripsi: raw,
  };
}

/**
 * Memetakan statusPekerjaan dari backend ke status badge kartu kontrak (UI-08-09 & UI-09-07).
 */
export function mapStatusPekerjaanToCardStatus(
  statusPekerjaan?: string
): ContractCardStatus {
  const normalized = (statusPekerjaan ?? '').trim().toLowerCase();
  if (
    normalized === 'on progress' ||
    normalized === 'diterima' ||
    normalized === 'menunggu konfirmasi pelanggan' ||
    normalized === 'menunggu konfirmasi' ||
    normalized === 'done' ||
    normalized === 'selesai'
  ) {
    return 'DITERIMA';
  }
  if (normalized === 'ditolak' || normalized === 'dibatalkan') {
    return 'DITOLAK';
  }
  return 'MENUNGGU';
}

/**
 * Normalisasi string statusPekerjaan menjadi tipe StatusPekerjaan standar DPPL.
 */
export function normalizeStatusPekerjaan(
  statusPekerjaan?: string,
  cardStatus?: ContractCardStatus
): StatusPekerjaan {
  const raw = (statusPekerjaan ?? '').trim();
  const lower = raw.toLowerCase();

  if (lower === 'on progress') return 'On Progress';
  if (
    lower === 'menunggu konfirmasi pelanggan' ||
    lower === 'menunggu konfirmasi'
  ) {
    return 'Menunggu Konfirmasi Pelanggan';
  }
  if (lower === 'done' || lower === 'selesai') return 'Done';
  if (lower === 'ditolak') return 'Ditolak';
  if (lower === 'dibatalkan') return 'Dibatalkan';
  if (lower === 'menunggu') return 'Menunggu';

  if (cardStatus === 'DITERIMA') return 'On Progress';
  if (cardStatus === 'DITOLAK') return 'Ditolak';
  return 'Menunggu';
}

/**
 * Memetakan statusPekerjaan ke label badge tampilan riwayat (UI-10-04 & UI-12-05):
 * - 'Done' -> 'Selesai'
 * - 'Ditolak' | 'Dibatalkan' -> 'Dibatalkan'
 * - 'On Progress' | 'Menunggu Konfirmasi Pelanggan' | 'Menunggu' -> 'On Progress'
 */
export function mapStatusPekerjaanToDisplayStatus(
  statusPekerjaan?: string
): HistoryDisplayStatus {
  const normalized = normalizeStatusPekerjaan(statusPekerjaan);
  if (normalized === 'Done') {
    return 'Selesai';
  }
  if (normalized === 'Ditolak' || normalized === 'Dibatalkan') {
    return 'Dibatalkan';
  }
  return 'On Progress';
}

/**
 * Mengekstrak informasi rating dari respons kontrak backend (mendukung skema `rating` tunggal maupun `ratings` 2 arah).
 */
export function extractRatingFromBackendRow(
  raw: BackendKontrakDetail,
  currentUserId?: string
): {
  hasRating: boolean;
  nilaiRating: number | null;
  komentar: string | null;
} {
  if (Array.isArray(raw.ratings) && raw.ratings.length > 0) {
    const targetRating =
      (currentUserId
        ? raw.ratings.find((r) => r.idPenilai === currentUserId)
        : undefined) ?? raw.ratings[0];

    const hasUserRated =
      typeof raw.hasRating === 'boolean'
        ? raw.hasRating
        : currentUserId
        ? raw.ratings.some((r) => r.idPenilai === currentUserId)
        : raw.ratings.length > 0;

    return {
      hasRating: hasUserRated,
      nilaiRating:
        typeof targetRating?.nilaiRating === 'number'
          ? Number(targetRating.nilaiRating)
          : null,
      komentar: targetRating?.komentar ?? null,
    };
  }

  if (raw.rating && typeof raw.rating === 'object') {
    return {
      hasRating: true,
      nilaiRating:
        typeof raw.rating.nilaiRating === 'number'
          ? Number(raw.rating.nilaiRating)
          : null,
      komentar: raw.rating.komentar ?? null,
    };
  }

  return {
    hasRating: Boolean(raw.hasRating),
    nilaiRating:
      typeof raw.nilaiRating === 'number' ? Number(raw.nilaiRating) : null,
    komentar: raw.komentar ?? null,
  };
}

/**
 * UC10 dua arah: memisahkan rating yang DIBERIKAN oleh pengguna login dan rating yang DITERIMA
 * olehnya pada satu kontrak. Memakai field turunan backend (`hasRatedByMe`, `ratingDariSaya`,
 * `ratingUntukSaya`) bila tersedia, dan fallback ke array `ratings` mentah.
 */
export function extractPerUserRatingFromBackendRow(
  raw: BackendKontrakDetail,
  currentUserId?: string
): {
  hasRatedByMe: boolean;
  diberikan: BackendRatingInfo | null;
  diterima: BackendRatingInfo | null;
} {
  const ratings = Array.isArray(raw.ratings) ? raw.ratings : [];
  const pemberiOf = (r: BackendRatingInfo) => r.idPenggunaPemberi ?? r.idPenilai;
  const penerimaOf = (r: BackendRatingInfo) =>
    r.idPenggunaPenerima ?? r.idDinilai;

  const diberikan =
    raw.ratingDariSaya ??
    (currentUserId
      ? ratings.find((r) => pemberiOf(r) === currentUserId) ?? null
      : null);
  const diterima =
    raw.ratingUntukSaya ??
    (currentUserId
      ? ratings.find((r) => penerimaOf(r) === currentUserId) ?? null
      : null);

  return {
    hasRatedByMe:
      typeof raw.hasRatedByMe === 'boolean' ? raw.hasRatedByMe : diberikan !== null,
    diberikan,
    diterima,
  };
}

/**
 * Mengonversi objek kontrak dari backend ke struktur ContractRecord (DummyContract) di frontend.
 */
export function mapBackendToContractRecord(
  raw: BackendKontrakDetail,
  fallbackJasa: string = DEFAULT_JASA_NAME
): ContractRecord {
  const providerJasa = raw.pemberiJasa?.jenisJasa?.trim() || fallbackJasa;
  const { jasa, deskripsi } = parseDetailPekerjaan(
    raw.detailPekerjaan,
    providerJasa
  );
  const status = mapStatusPekerjaanToCardStatus(raw.statusPekerjaan);
  const statusPekerjaan = normalizeStatusPekerjaan(raw.statusPekerjaan, status);
  const createdIso =
    raw.createdAt instanceof Date
      ? raw.createdAt.toISOString()
      : typeof raw.createdAt === 'string' && raw.createdAt.trim().length > 0
      ? raw.createdAt
      : new Date().toISOString();

  const expiresIso =
    raw.expiresAt instanceof Date
      ? raw.expiresAt.toISOString()
      : typeof raw.expiresAt === 'string'
      ? raw.expiresAt
      : null;

  const idKontrak = raw.idKontrakPekerjaan || `kontrak-${Date.now()}`;

  const namaPemberiJasa =
    raw.pemberiJasa?.pengguna?.namaPengguna?.trim() ||
    raw.pemberiJasa?.namaToko?.trim() ||
    'Budi Wijaya';
  const namaPelanggan =
    raw.pelanggan?.namaPengguna?.trim() || 'Naufal Hasbialhaq';

  const ratingInfo = extractRatingFromBackendRow(raw);
  const perUserRating = extractPerUserRatingFromBackendRow(
    raw,
    getCurrentUser()?.idPengguna
  );
  const tanggalWaktu = formatTanggalWaktuIndonesia(createdIso);
  const tanggalSelesai = formatTanggalSelesaiIndonesia(createdIso);
  const rincianPekerjaan =
    raw.detailPekerjaan?.trim() ||
    formatDetailPekerjaan(jasa, deskripsi) ||
    jasa;

  return {
    idKontrak,
    idKontrakPekerjaan: idKontrak,
    idPelanggan: raw.idPelanggan,
    idPemberiJasa: raw.idPemberiJasa,
    namaPelanggan,
    inisialPelanggan: getInitials(namaPelanggan, 'PL'),
    namaPemberiJasa,
    inisialPemberiJasa: getInitials(namaPemberiJasa, 'PJ'),
    kategoriJasa: providerJasa,
    rincianPekerjaan,
    jasa,
    deskripsi,
    detailPekerjaan: raw.detailPekerjaan,
    totalHarga: Number(raw.persetujuanHarga) || 0,
    persetujuanHarga: Number(raw.persetujuanHarga) || 0,
    status,
    statusPekerjaan,
    hasRating: ratingInfo.hasRating,
    nilaiRating:
      typeof perUserRating.diterima?.nilaiRating === 'number'
        ? Number(perUserRating.diterima.nilaiRating)
        : ratingInfo.nilaiRating,
    komentar:
      perUserRating.diterima
        ? perUserRating.diterima.ulasan ?? perUserRating.diterima.komentar ?? null
        : ratingInfo.komentar,
    hasRatedByMe: perUserRating.hasRatedByMe,
    nilaiRatingDiberikan:
      typeof perUserRating.diberikan?.nilaiRating === 'number'
        ? Number(perUserRating.diberikan.nilaiRating)
        : null,
    ulasanDiberikan:
      perUserRating.diberikan?.ulasan ?? perUserRating.diberikan?.komentar ?? null,
    tagsDiberikan: perUserRating.diberikan?.tags ?? [],
    waktu: formatTimeShort(createdIso) || '14.28',
    tanggalWaktu,
    tanggalSelesai,
    createdAt: createdIso,
    expiresAt: expiresIso,
  };
}

/**
 * Mengonversi ContractRecord menjadi item Riwayat Pelanggan (UI-10).
 */
export function mapContractRecordToCustomerItem(
  record: ContractRecord
): CustomerTransactionItem {
  const statusPekerjaan = normalizeStatusPekerjaan(
    record.statusPekerjaan,
    record.status
  );
  const statusDisplay = mapStatusPekerjaanToDisplayStatus(statusPekerjaan);
  const namaPemberiJasa = (record.namaPemberiJasa ?? '').trim() || 'Budi Wijaya';
  const rincianPekerjaan =
    (record.rincianPekerjaan ?? '').trim() ||
    (record.deskripsi ?? '').trim() ||
    (record.detailPekerjaan ?? '').trim() ||
    record.jasa;
  const tanggalWaktu =
    (record.tanggalWaktu ?? '').trim() ||
    formatTanggalWaktuIndonesia(record.createdAt);
  const tanggalSelesai =
    (record.tanggalSelesai ?? '').trim() ||
    formatTanggalSelesaiIndonesia(tanggalWaktu);

  return {
    idKontrak: record.idKontrakPekerjaan || record.idKontrak,
    idPelanggan: record.idPelanggan,
    idPemberiJasa: record.idPemberiJasa || 'pj-budi-001',
    namaPemberiJasa,
    inisialPemberiJasa:
      record.inisialPemberiJasa || getInitials(namaPemberiJasa, 'BW'),
    kategoriJasa: record.kategoriJasa || record.jasa || DEFAULT_JASA_NAME,
    rincianPekerjaan,
    deskripsi: record.deskripsi || rincianPekerjaan,
    tanggalWaktu,
    tanggalSelesai,
    totalHarga: Number(record.totalHarga ?? record.persetujuanHarga ?? 0),
    statusDisplay,
    statusPekerjaan,
    hasRating: Boolean(record.hasRating),
    nilaiRating:
      typeof record.nilaiRating === 'number' ? record.nilaiRating : null,
    komentar: record.komentar ?? null,
  };
}

/**
 * Mengonversi ContractRecord menjadi item Riwayat Pekerjaan Penyedia Jasa (UI-12).
 */
export function mapContractRecordToProviderItem(
  record: ContractRecord
): ProviderJobItem {
  const statusPekerjaan = normalizeStatusPekerjaan(
    record.statusPekerjaan,
    record.status
  );
  const statusDisplay = mapStatusPekerjaanToDisplayStatus(statusPekerjaan);
  const namaPelanggan =
    (record.namaPelanggan ?? '').trim() || 'Naufal Hasbialhaq';
  const namaPemberiJasa =
    (record.namaPemberiJasa ?? '').trim() || 'Budi Wijaya';
  const rincianPekerjaan =
    (record.rincianPekerjaan ?? '').trim() ||
    (record.deskripsi ?? '').trim() ||
    (record.detailPekerjaan ?? '').trim() ||
    record.jasa;
  const tanggalWaktu =
    (record.tanggalWaktu ?? '').trim() ||
    formatTanggalWaktuIndonesia(record.createdAt);
  const tanggalSelesai =
    (record.tanggalSelesai ?? '').trim() ||
    formatTanggalSelesaiIndonesia(tanggalWaktu);

  return {
    idKontrak: record.idKontrakPekerjaan || record.idKontrak,
    idPelanggan: record.idPelanggan || 'user-naufal-hasbialhaq',
    idPemberiJasa: record.idPemberiJasa || 'pj-budi-001',
    namaPelanggan,
    inisialPelanggan:
      record.inisialPelanggan || getInitials(namaPelanggan, 'NH'),
    namaPemberiJasa,
    inisialPemberiJasa:
      record.inisialPemberiJasa || getInitials(namaPemberiJasa, 'BW'),
    kategoriJasa: record.kategoriJasa || record.jasa || DEFAULT_JASA_NAME,
    rincianPekerjaan,
    deskripsi: record.deskripsi || rincianPekerjaan,
    tanggalWaktu,
    tanggalSelesai,
    totalHarga: Number(record.totalHarga ?? record.persetujuanHarga ?? 0),
    statusDisplay,
    statusPekerjaan,
    hasRating: Boolean(record.hasRating),
    nilaiRating:
      typeof record.nilaiRating === 'number' ? record.nilaiRating : null,
    komentar: record.komentar ?? null,
    hasRatedByMe: Boolean(record.hasRatedByMe),
    nilaiRatingDiberikan:
      typeof record.nilaiRatingDiberikan === 'number'
        ? record.nilaiRatingDiberikan
        : null,
    ulasanDiberikan: record.ulasanDiberikan ?? null,
    tagsDiberikan: record.tagsDiberikan ? [...record.tagsDiberikan] : [],
  };
}

// ============================================================================
// State In-Memory & Listener untuk Sinkronisasi UI-08, UI-09, UI-10, UI-12, UI-04
// ============================================================================

const INITIAL_DEMO_CONTRACT: ContractRecord = {
  idKontrak: 'kontrak-1',
  idKontrakPekerjaan: 'kontrak-1',
  idPelanggan: 'user-naufal-hasbialhaq',
  idPemberiJasa: 'user-budi-wijaya',
  namaPelanggan: 'Naufal Hasbialhaq',
  inisialPelanggan: 'NH',
  namaPemberiJasa: 'Budi Wijaya',
  inisialPemberiJasa: 'BW',
  kategoriJasa: 'Kebersihan',
  rincianPekerjaan: 'Bersih-bersih rumah · 2 jam',
  jasa: 'Bersih-bersih Rumah',
  deskripsi: 'Bersihin rumah wimar',
  detailPekerjaan: 'Bersih-bersih Rumah - Bersihin rumah wimar',
  totalHarga: 100000,
  persetujuanHarga: 100000,
  status: 'MENUNGGU',
  statusPekerjaan: 'Menunggu',
  hasRating: false,
  nilaiRating: null,
  waktu: '14.28',
  tanggalWaktu: '12 Mei 2026 · 14.20',
  tanggalSelesai: '12 Mei 2026',
  createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 14).toISOString(),
};

/**
 * Data awal riwayat kontrak yang selaras dengan desain DPPL UI-10 & UI-12.
 * Mendukung alur penuh:
 * - kontrak-001: 'On Progress' -> Penyedia Jasa dapat menekan "Pekerjaan Telah Selesai" (UC06, UI-12-07)
 *   untuk mengubah ke 'Menunggu Konfirmasi Pelanggan', lalu Pelanggan menekan "Konfirmasi Selesai" (UC07, UI-10).
 * - kontrak-002: 'Done' ('Selesai') belum dinilai oleh pelanggan -> Tombol "Lihat Detail" (UI-10-05) & "Beri Rating" (UI-10-06) aktif.
 * - kontrak-003: 'Dibatalkan' -> Badge merah "Dibatalkan" (UI-10-04).
 * - kontrak-004: 'Menunggu Konfirmasi Pelanggan' -> Menampilkan "Menunggu Konfirmasi" pada UI-12 dan tombol "Konfirmasi Selesai" (UC07) pada UI-10.
 * - kontrak-005: 'Done' ('Selesai') sudah dinilai (★ 4.9) untuk Rudi Hartono pada UI-12.
 */
const INITIAL_HISTORY_CONTRACTS: ContractRecord[] = [
  {
    idKontrak: 'kontrak-001',
    idKontrakPekerjaan: 'kontrak-001',
    idPelanggan: 'user-naufal-hasbialhaq',
    idPemberiJasa: 'pj-budi-001',
    namaPelanggan: 'Naufal Hasbialhaq',
    inisialPelanggan: 'NH',
    namaPemberiJasa: 'Budi Wijaya',
    inisialPemberiJasa: 'BW',
    kategoriJasa: 'Kebersihan',
    rincianPekerjaan: 'Bersih-bersih rumah · 2 jam',
    jasa: 'Bersih-bersih Rumah',
    deskripsi: 'Bersih-bersih rumah · 2 jam ( ruang tamu, kamar tidur, dan dapur )',
    detailPekerjaan: 'Bersih-bersih Rumah - Bersih-bersih rumah · 2 jam',
    totalHarga: 100000,
    persetujuanHarga: 100000,
    status: 'DITERIMA',
    statusPekerjaan: 'On Progress',
    hasRating: false,
    nilaiRating: 5.0,
    waktu: '14.20',
    tanggalWaktu: '12 Mei 2026 · 14.20',
    tanggalSelesai: '12 Mei 2026',
    createdAt: '2026-05-12T07:20:00.000Z',
    expiresAt: null,
  },
  {
    idKontrak: 'kontrak-002',
    idKontrakPekerjaan: 'kontrak-002',
    idPelanggan: 'user-siti-rahayu',
    idPemberiJasa: 'pj-siti-002',
    namaPelanggan: 'Siti Rahayu',
    inisialPelanggan: 'SR',
    namaPemberiJasa: 'Siti Rahayu',
    inisialPemberiJasa: 'SR',
    kategoriJasa: 'Laundry',
    rincianPekerjaan: 'Cuci & setrika · 3 kg',
    jasa: 'Cuci & Setrika',
    deskripsi: 'Cuci & setrika · 3 kg pakaian harian lipat rapi',
    detailPekerjaan: 'Cuci & Setrika - Cuci & setrika · 3 kg',
    totalHarga: 60000,
    persetujuanHarga: 60000,
    status: 'DITERIMA',
    statusPekerjaan: 'Done',
    hasRating: false,
    nilaiRating: 4.8,
    waktu: '09.10',
    tanggalWaktu: '8 Mei 2026 · 09.10',
    tanggalSelesai: '8 Mei 2026',
    createdAt: '2026-05-08T02:10:00.000Z',
    expiresAt: null,
  },
  {
    idKontrak: 'kontrak-004',
    idKontrakPekerjaan: 'kontrak-004',
    idPelanggan: 'user-agus-pratama',
    idPemberiJasa: 'pj-agus-004',
    namaPelanggan: 'Agus Pratama',
    inisialPelanggan: 'AP',
    namaPemberiJasa: 'Agus Pratama',
    inisialPemberiJasa: 'AP',
    kategoriJasa: 'Pertukangan',
    rincianPekerjaan: 'Perbaikan keran bocor',
    jasa: 'Perbaikan Pipa & Keran',
    deskripsi: 'Perbaikan keran bocor di wastafel dapur dan penggantian seal',
    detailPekerjaan: 'Perbaikan Pipa & Keran - Perbaikan keran bocor',
    totalHarga: 85000,
    persetujuanHarga: 85000,
    status: 'DITERIMA',
    statusPekerjaan: 'Menunggu Konfirmasi Pelanggan',
    hasRating: false,
    nilaiRating: null,
    waktu: '16.45',
    tanggalWaktu: '2 Mei 2026 · 16.45',
    tanggalSelesai: '2 Mei 2026',
    createdAt: '2026-05-02T09:45:00.000Z',
    expiresAt: null,
  },
  {
    idKontrak: 'kontrak-003',
    idKontrakPekerjaan: 'kontrak-003',
    idPelanggan: 'user-naufal-hasbialhaq',
    idPemberiJasa: 'pj-dedi-003',
    namaPelanggan: 'Naufal Hasbialhaq',
    inisialPelanggan: 'NH',
    namaPemberiJasa: 'Dedi Prakoso',
    inisialPemberiJasa: 'DP',
    kategoriJasa: 'Angkut Barang',
    rincianPekerjaan: 'Angkut barang pindahan',
    jasa: 'Angkut Barang',
    deskripsi: 'Angkut barang pindahan kos ke apartemen dalam kota',
    detailPekerjaan: 'Angkut Barang - Angkut barang pindahan',
    totalHarga: 150000,
    persetujuanHarga: 150000,
    status: 'DITOLAK',
    statusPekerjaan: 'Dibatalkan',
    hasRating: false,
    nilaiRating: null,
    waktu: '11.30',
    tanggalWaktu: '27 Apr 2026 · 11.30',
    tanggalSelesai: '27 Apr 2026',
    createdAt: '2026-04-27T04:30:00.000Z',
    expiresAt: null,
  },
  {
    idKontrak: 'kontrak-005',
    idKontrakPekerjaan: 'kontrak-005',
    idPelanggan: 'user-rudi-hartono',
    idPemberiJasa: 'pj-budi-001',
    namaPelanggan: 'Rudi Hartono',
    inisialPelanggan: 'RH',
    namaPemberiJasa: 'Budi Wijaya',
    inisialPemberiJasa: 'BW',
    kategoriJasa: 'Angkut Barang',
    rincianPekerjaan: 'Angkut barang pindahan',
    jasa: 'Angkut Barang',
    deskripsi: 'Angkut barang pindahan rumah tangga dengan mobil pick-up',
    detailPekerjaan: 'Angkut Barang - Angkut barang pindahan',
    totalHarga: 150000,
    persetujuanHarga: 150000,
    status: 'DITERIMA',
    statusPekerjaan: 'Done',
    hasRating: true,
    nilaiRating: 4.9,
    waktu: '11.00',
    tanggalWaktu: '27 Apr 2026 · 11.00',
    tanggalSelesai: '27 Apr 2026',
    createdAt: '2026-04-27T04:00:00.000Z',
    expiresAt: null,
  },
];

const DEMO_LINKED_PARTNERS = new Set<string>([
  'user-budi-wijaya',
  'user-naufal-hasbialhaq',
]);

let contractsByPartner: Record<string, ContractRecord> = {
  'user-budi-wijaya': { ...INITIAL_DEMO_CONTRACT },
  'user-naufal-hasbialhaq': { ...INITIAL_DEMO_CONTRACT },
};

let historyContractsById: Record<string, ContractRecord> =
  buildInitialHistoryMap();

function buildInitialHistoryMap(): Record<string, ContractRecord> {
  const map: Record<string, ContractRecord> = {};
  for (const item of INITIAL_HISTORY_CONTRACTS) {
    map[item.idKontrak] = { ...item };
  }
  return map;
}

type ContractStoreListener = (
  records: Record<string, ContractRecord>
) => void;

const listeners = new Set<ContractStoreListener>();

function notifyContractListeners(): void {
  const snapshot = { ...contractsByPartner };
  listeners.forEach((listener) => listener(snapshot));
}

function syncHistoryWithPartnerRecord(
  partnerId: string,
  record: ContractRecord
): void {
  const id = record.idKontrakPekerjaan || record.idKontrak;
  if (!id) return;

  // Apabila kontrak pada ruang obrolan disetujui atau diperbarui, sinkronkan ke daftar riwayat
  if (id === 'kontrak-1' || DEMO_LINKED_PARTNERS.has(partnerId)) {
    const existing001 = historyContractsById['kontrak-001'];
    if (existing001 && record.status === 'DITERIMA') {
      historyContractsById['kontrak-001'] = {
        ...existing001,
        status: record.status,
        statusPekerjaan: record.statusPekerjaan,
        hasRating: record.hasRating ?? existing001.hasRating,
        nilaiRating: record.nilaiRating ?? existing001.nilaiRating,
      };
    } else if (!existing001) {
      historyContractsById[id] = { ...record };
    }
    return;
  }

  historyContractsById[id] = {
    ...(historyContractsById[id] ?? {}),
    ...record,
    idKontrak: id,
    idKontrakPekerjaan: id,
  };
}

function setPartnerContractRecord(
  partnerId: string,
  record: ContractRecord
): void {
  const key = partnerId.trim();
  if (!key) return;

  contractsByPartner[key] = record;

  // Sinkronkan pasangan demo Pelanggan (Budi Wijaya) <-> Penyedia Jasa (Naufal Hasbialhaq)
  if (DEMO_LINKED_PARTNERS.has(key)) {
    DEMO_LINKED_PARTNERS.forEach((linkedKey) => {
      contractsByPartner[linkedKey] = { ...record };
    });
  }

  syncHistoryWithPartnerRecord(key, record);
  notifyContractListeners();
}

export function subscribeContracts(
  listener: ContractStoreListener
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCachedContractByPartner(
  partnerId: string
): ContractRecord | null {
  const key = (partnerId ?? '').trim();
  if (!key) return null;
  return contractsByPartner[key] ? { ...contractsByPartner[key] } : null;
}

export function getAllCachedContracts(): ContractRecord[] {
  const seenIds = new Set<string>();
  const result: ContractRecord[] = [];

  for (const record of Object.values(contractsByPartner)) {
    const id = record.idKontrakPekerjaan || record.idKontrak;
    if (!seenIds.has(id)) {
      seenIds.add(id);
      result.push({ ...record });
    }
  }

  for (const record of Object.values(historyContractsById)) {
    const id = record.idKontrakPekerjaan || record.idKontrak;
    if (id === 'kontrak-001' && seenIds.has('kontrak-1')) {
      continue;
    }
    if (!seenIds.has(id)) {
      seenIds.add(id);
      result.push({ ...record });
    }
  }

  return result;
}

/**
 * Mengambil seluruh kontrak riwayat untuk tampilan Pelanggan (UI-10).
 */
export function getCachedCustomerHistory(): CustomerTransactionItem[] {
  const records = Object.values(historyContractsById).filter(
    (r) => r.idKontrak !== 'kontrak-005'
  );
  return records.map(mapContractRecordToCustomerItem);
}

/**
 * Mengambil seluruh kontrak riwayat pekerjaan untuk tampilan Penyedia Jasa (UI-12).
 */
export function getCachedProviderHistory(): ProviderJobItem[] {
  const records = Object.values(historyContractsById).filter(
    (r) => r.idKontrak !== 'kontrak-003'
  );
  return records.map(mapContractRecordToProviderItem);
}

export function getHistoryContractById(
  idKontrak: string
): ContractRecord | null {
  const cleanId = (idKontrak ?? '').trim();
  if (!cleanId) return null;
  if (historyContractsById[cleanId]) {
    return { ...historyContractsById[cleanId] };
  }
  if (cleanId === 'kontrak-1' && historyContractsById['kontrak-001']) {
    return { ...historyContractsById['kontrak-001'] };
  }
  for (const record of Object.values(contractsByPartner)) {
    if (
      record.idKontrak === cleanId ||
      record.idKontrakPekerjaan === cleanId
    ) {
      return { ...record };
    }
  }
  return null;
}

export function resetMockContracts(): void {
  contractsByPartner = {
    'user-budi-wijaya': { ...INITIAL_DEMO_CONTRACT },
    'user-naufal-hasbialhaq': { ...INITIAL_DEMO_CONTRACT },
  };
  historyContractsById = buildInitialHistoryMap();
  notifyContractListeners();
}

function shouldAttemptBackendCall(explicitToken?: string): boolean {
  if (explicitToken && explicitToken.trim().length > 0) {
    return true;
  }
  if (!CHAT_CONFIG.USE_MOCK) {
    return true;
  }
  return Boolean(getAuthToken());
}

function updateContractStatusInStores(
  idKontrak: string,
  nextStatusPekerjaan: StatusPekerjaan,
  extra?: Partial<ContractRecord>
): ContractRecord {
  const cleanId = (idKontrak ?? '').trim();
  const nextCardStatus = mapStatusPekerjaanToCardStatus(nextStatusPekerjaan);

  const targetKey =
    historyContractsById[cleanId]
      ? cleanId
      : cleanId === 'kontrak-1' && historyContractsById['kontrak-001']
      ? 'kontrak-001'
      : cleanId;

  const existing =
    historyContractsById[targetKey] ??
    getHistoryContractById(cleanId) ?? {
      ...INITIAL_DEMO_CONTRACT,
      idKontrak: cleanId,
      idKontrakPekerjaan: cleanId,
    };

  const updated: ContractRecord = {
    ...existing,
    ...extra,
    idKontrak: existing.idKontrak || cleanId,
    idKontrakPekerjaan: existing.idKontrakPekerjaan || cleanId,
    status: nextCardStatus,
    statusPekerjaan: nextStatusPekerjaan,
  };

  historyContractsById[targetKey] = updated;

  // Sinkronkan juga ke contractsByPartner bila beririsan dengan kontrak aktif ruang chat
  if (cleanId === 'kontrak-001' || cleanId === 'kontrak-1') {
    DEMO_LINKED_PARTNERS.forEach((partnerKey) => {
      if (contractsByPartner[partnerKey]) {
        contractsByPartner[partnerKey] = {
          ...contractsByPartner[partnerKey],
          ...extra,
          status: nextCardStatus,
          statusPekerjaan: nextStatusPekerjaan,
        };
      }
    });
  } else {
    for (const [partnerKey, partnerRecord] of Object.entries(
      contractsByPartner
    )) {
      if (
        partnerRecord.idKontrak === cleanId ||
        partnerRecord.idKontrakPekerjaan === cleanId
      ) {
        contractsByPartner[partnerKey] = {
          ...partnerRecord,
          ...extra,
          status: nextCardStatus,
          statusPekerjaan: nextStatusPekerjaan,
        };
      }
    }
  }

  notifyContractListeners();
  return updated;
}

export const contractService = {
  /**
   * C18 KontrakPekerjaanController.showKontrakForm()
   * Mengambil template awal form pembuatan kontrak.
   */
  async getKontrakFormTemplate(): Promise<{
    detailPekerjaan: string;
    persetujuanHarga: number;
    idPemberiJasa: string;
  }> {
    if (shouldAttemptBackendCall()) {
      try {
        return await apiGet<{
          detailPekerjaan: string;
          persetujuanHarga: number;
          idPemberiJasa: string;
        }>('/kontrak/form');
      } catch {
        // Fallback ke template lokal apabila endpoint tidak terjangkau / tanpa token
      }
    }
    return {
      detailPekerjaan: '',
      persetujuanHarga: 0,
      idPemberiJasa: '',
    };
  },

  /**
   * Mengambil daftar riwayat kontrak dari backend (GET /api/kontrak).
   * Mendukung sinkronisasi dengan UI-10 (Riwayat Pelanggan) dan UI-12 (Riwayat Pekerjaan Penyedia Jasa).
   */
  async fetchContractHistory(options?: {
    status?: string;
    token?: string;
  }): Promise<ContractRecord[]> {
    const token = options?.token;
    const statusQuery = options?.status?.trim();

    if (shouldAttemptBackendCall(token)) {
      try {
        const queryString = statusQuery
          ? `?status=${encodeURIComponent(statusQuery)}`
          : '';
        const rows = await apiRequest<BackendKontrakDetail[]>(
          `/kontrak${queryString}`,
          {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (Array.isArray(rows) && rows.length > 0) {
          const mappedRecords = rows.map((row) =>
            mapBackendToContractRecord(row)
          );
          for (const rec of mappedRecords) {
            historyContractsById[rec.idKontrak] = rec;
          }
          notifyContractListeners();
          return mappedRecords;
        }
        if (!CHAT_CONFIG.USE_MOCK) {
          return [];
        }
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    return Object.values(historyContractsById).map((item) => ({ ...item }));
  },

  /**
   * Mengambil kontrak aktif antara pengguna dan lawan bicara (GET /api/kontrak/chat/:idLawanBicara).
   */
  async getContractByPartner(
    partnerId: string,
    fallbackJasa: string = DEFAULT_JASA_NAME
  ): Promise<ContractRecord | null> {
    const cleanPartnerId = (partnerId ?? '').trim();
    if (!cleanPartnerId) {
      return null;
    }

    if (shouldAttemptBackendCall()) {
      try {
        const res = await apiGet<ChatPartnerKontrakResponse>(
          `/kontrak/chat/${encodeURIComponent(cleanPartnerId)}`
        );
        const target =
          res?.kontrakAktif ??
          (Array.isArray(res?.daftarKontrak) && res.daftarKontrak.length > 0
            ? res.daftarKontrak[0]
            : null);

        if (target) {
          const mapped = mapBackendToContractRecord(target, fallbackJasa);
          setPartnerContractRecord(cleanPartnerId, mapped);
          return mapped;
        }
        if (!CHAT_CONFIG.USE_MOCK) {
          return null;
        }
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 120));
    return getCachedContractByPartner(cleanPartnerId);
  },

  /**
   * ALGO-038, ALGO-039, ALGO-043: Membuat kontrak pekerjaan baru dari sisi Pelanggan (UI-08-04 & UI-08-05).
   * Status awal kontrak diset 'MENUNGGU' (statusPekerjaan: 'Menunggu').
   */
  async createContract(params: CreateContractParams): Promise<ContractRecord> {
    const cleanPartnerId = params.partnerId.trim();
    const cleanJasa = params.jasa.trim() || DEFAULT_JASA_NAME;
    const cleanDeskripsi = params.deskripsi.trim();
    const numericHarga = Number(params.totalHarga);

    if (!cleanDeskripsi) {
      throw new Error('Deskripsi pekerjaan tidak boleh kosong.');
    }
    if (!Number.isFinite(numericHarga) || numericHarga < 0) {
      throw new Error('Total harga persetujuan harus >= Rp 0.');
    }

    const combinedDetail = formatDetailPekerjaan(cleanJasa, cleanDeskripsi);
    const currentUser = getCurrentUser();
    const idPelanggan = params.idPelanggan || currentUser.idPengguna;

    if (shouldAttemptBackendCall()) {
      // Sesuai aturan validasi backend (validateKontrakInput), harga ke backend wajib > 0
      if (numericHarga <= 0) {
        throw new Error(
          'Persetujuan harga untuk pengiriman ke server harus lebih dari Rp 0.'
        );
      }

      try {
        const createdBackend = await apiPost<BackendKontrakDetail>('/kontrak', {
          detailPekerjaan: combinedDetail,
          persetujuanHarga: Math.round(numericHarga),
          idPelanggan,
          idPemberiJasa: cleanPartnerId,
          ...(params.expectedVersion !== undefined
            ? { expectedVersion: params.expectedVersion }
            : {}),
          ...(params.kirimKeChat !== undefined
            ? { kirimKeChat: params.kirimKeChat }
            : {}),
        });

        const mapped = mapBackendToContractRecord(createdBackend, cleanJasa);
        setPartnerContractRecord(cleanPartnerId, mapped);
        return mapped;
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    const nowIso = new Date().toISOString();
    const idKontrak = `kontrak-${Date.now()}`;

    const newRecord: ContractRecord = {
      idKontrak,
      idKontrakPekerjaan: idKontrak,
      idPelanggan,
      idPemberiJasa: cleanPartnerId,
      namaPelanggan: currentUser.namaPengguna || 'Naufal Hasbialhaq',
      inisialPelanggan: getInitials(
        currentUser.namaPengguna || 'Naufal Hasbialhaq',
        'NH'
      ),
      namaPemberiJasa: 'Budi Wijaya',
      inisialPemberiJasa: 'BW',
      kategoriJasa: cleanJasa,
      rincianPekerjaan: cleanDeskripsi || cleanJasa,
      jasa: cleanJasa,
      deskripsi: cleanDeskripsi,
      detailPekerjaan: combinedDetail,
      totalHarga: Math.round(numericHarga),
      persetujuanHarga: Math.round(numericHarga),
      status: 'MENUNGGU',
      statusPekerjaan: 'Menunggu',
      hasRating: false,
      nilaiRating: null,
      waktu: formatTimeShort(nowIso) || 'Baru saja',
      tanggalWaktu: formatTanggalWaktuIndonesia(nowIso),
      tanggalSelesai: formatTanggalSelesaiIndonesia(nowIso),
      createdAt: nowIso,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    setPartnerContractRecord(cleanPartnerId, newRecord);
    return newRecord;
  },

  /**
   * UI-09-08 & UI-09-09: Penyedia jasa menerima atau menolak kontrak pekerjaan.
   * Saat "Terima" ditekan (disetujui = true):
   * - Tampilan status kartu berubah menjadi 'DITERIMA' (Diterima)
   * - Status pekerjaan berubah menjadi 'On Progress'
   * Saat "Tolak" ditekan (disetujui = false):
   * - Tampilan status kartu berubah menjadi 'DITOLAK' (Ditolak)
   * - Status pekerjaan berubah menjadi 'Ditolak'
   */
  async respondToContract(
    idKontrak: string,
    partnerId: string,
    disetujui: boolean,
    expectedVersion?: number
  ): Promise<ContractRecord> {
    const cleanId = (idKontrak ?? '').trim();
    const cleanPartnerId = (partnerId ?? '').trim();
    if (!cleanId) {
      throw new Error('ID kontrak pekerjaan tidak valid.');
    }

    const currentUser = getCurrentUser();
    const existing =
      getCachedContractByPartner(cleanPartnerId) ?? INITIAL_DEMO_CONTRACT;

    if (shouldAttemptBackendCall()) {
      try {
        const endpoint = `/kontrak/${encodeURIComponent(cleanId)}/${
          disetujui ? 'terima' : 'tolak'
        }`;
        const updatedBackend = await apiPatch<BackendKontrakDetail>(endpoint, {
          disetujui,
          aksi: disetujui ? 'terima' : 'tolak',
          idPemberiJasa: existing.idPemberiJasa || currentUser.idPengguna,
          ...(expectedVersion !== undefined ? { expectedVersion } : {}),
        });

        const mapped = mapBackendToContractRecord(updatedBackend, existing.jasa);
        setPartnerContractRecord(cleanPartnerId, mapped);
        return mapped;
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const updatedRecord: ContractRecord = {
      ...existing,
      idKontrak: cleanId,
      idKontrakPekerjaan: cleanId,
      status: disetujui ? 'DITERIMA' : 'DITOLAK',
      statusPekerjaan: disetujui ? 'On Progress' : 'Ditolak',
    };

    setPartnerContractRecord(cleanPartnerId, updatedRecord);
    return updatedRecord;
  },

  /**
   * UC06 (UI-12-07 | Kelas DPPL C05 PemberiJasaUI.onClickSelesai & C08 PemberiJasaController.selesaikanPekerjaan):
   * Penyedia jasa melaporkan pekerjaan telah selesai -> status berubah dari 'On Progress' menjadi 'Menunggu Konfirmasi Pelanggan'.
   * Endpoint Backend: PATCH /api/kontrak/:id/selesai
   */
  async completeWorkByProvider(
    idKontrak: string,
    token?: string
  ): Promise<ContractRecord> {
    const cleanId = (idKontrak ?? '').trim();
    if (!cleanId) {
      throw new Error('ID kontrak pekerjaan tidak boleh kosong.');
    }

    const existing = getHistoryContractById(cleanId);
    const currentUser = getCurrentUser();

    if (shouldAttemptBackendCall(token)) {
      try {
        const updatedBackend = await apiRequest<BackendKontrakDetail>(
          `/kontrak/${encodeURIComponent(cleanId)}/selesai`,
          {
            method: 'PATCH',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: {
              idPemberiJasa: existing?.idPemberiJasa || currentUser.idPengguna,
            },
          }
        );

        const mapped = mapBackendToContractRecord(
          updatedBackend,
          existing?.jasa || DEFAULT_JASA_NAME
        );
        markContractWaitingConfirmationInStore(cleanId);
        return updateContractStatusInStores(
          cleanId,
          'Menunggu Konfirmasi Pelanggan',
          mapped
        );
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    markContractWaitingConfirmationInStore(cleanId);
    return updateContractStatusInStores(
      cleanId,
      'Menunggu Konfirmasi Pelanggan'
    );
  },

  /**
   * UC07 (UI-10 | Kelas DPPL C01 Pengguna.konfirmasiPekerjaan & C18 KontrakPekerjaanController.handleKonfirmasiPekerjaan):
   * Pelanggan mengonfirmasi penyelesaian pekerjaan -> status berubah dari 'Menunggu Konfirmasi Pelanggan' menjadi 'Done' ('Selesai').
   * Endpoint Backend: PATCH /api/kontrak/:id/konfirmasi
   */
  async confirmWorkByCustomer(
    idKontrak: string,
    token?: string
  ): Promise<ContractRecord> {
    const cleanId = (idKontrak ?? '').trim();
    if (!cleanId) {
      throw new Error('ID kontrak pekerjaan tidak boleh kosong.');
    }

    const existing = getHistoryContractById(cleanId);
    const currentUser = getCurrentUser();

    if (shouldAttemptBackendCall(token)) {
      try {
        const updatedBackend = await apiRequest<BackendKontrakDetail>(
          `/kontrak/${encodeURIComponent(cleanId)}/konfirmasi`,
          {
            method: 'PATCH',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: {
              idPelanggan: existing?.idPelanggan || currentUser.idPengguna,
            },
          }
        );

        const mapped = mapBackendToContractRecord(
          updatedBackend,
          existing?.jasa || DEFAULT_JASA_NAME
        );
        markContractDoneInStore(cleanId);
        return updateContractStatusInStores(cleanId, 'Done', {
          ...mapped,
          hasRating: existing?.hasRating ?? false,
        });
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    markContractDoneInStore(cleanId);
    return updateContractStatusInStores(cleanId, 'Done', {
      hasRating: existing?.hasRating ?? false,
    });
  },

  /**
   * UC10 (UI-10-06 & UI-11): Mengirim penilaian (rating) ke backend POST /api/ratings
   * dan memperbarui status `hasRating = true` serta `nilaiRating` pada store riwayat.
   */
  async submitContractRating(
    payload: {
      idKontrak: string;
      idPemberiJasa: string;
      nilaiRating: number;
      komentar?: string;
    },
    token?: string
  ): Promise<ContractRecord> {
    const cleanId = (payload.idKontrak ?? '').trim();
    if (!cleanId) {
      throw new Error('ID kontrak wajib diisi.');
    }
    const nilai = Number(payload.nilaiRating);
    if (!Number.isInteger(nilai) || nilai < 1 || nilai > 5) {
      throw new Error('Silakan pilih bintang rating antara 1 hingga 5.');
    }

    if (shouldAttemptBackendCall(token)) {
      try {
        await apiRequest('/ratings', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: {
            idKontrak: cleanId,
            idPemberiJasa: payload.idPemberiJasa,
            nilaiRating: nilai,
            komentar: payload.komentar?.trim() ?? '',
          },
        });
      } catch (err) {
        if (!CHAT_CONFIG.USE_MOCK) {
          throw err;
        }
      }
    }

    const existing = getHistoryContractById(cleanId);
    markContractRatedInStore(cleanId, nilai, payload.komentar?.trim());
    return updateContractStatusInStores(
      cleanId,
      existing?.statusPekerjaan ?? 'Done',
      {
        hasRating: true,
        nilaiRating: nilai,
        komentar: payload.komentar?.trim() ?? null,
      }
    );
  },

  /**
   * Menandai kontrak pada store lokal bahwa rating telah diberikan (dipakai juga saat kembali dari layar RatingView UI-11).
   */
  markContractRated(
    idKontrak: string,
    nilaiRating?: number,
    komentar?: string
  ): ContractRecord {
    const cleanId = (idKontrak ?? '').trim();
    if (typeof nilaiRating === 'number') {
      markContractRatedInStore(cleanId, nilaiRating, komentar);
    }
    const existing = getHistoryContractById(cleanId);
    return updateContractStatusInStores(
      cleanId,
      existing?.statusPekerjaan ?? 'Done',
      {
        hasRating: true,
        ...(typeof nilaiRating === 'number' ? { nilaiRating } : {}),
        ...(komentar !== undefined ? { komentar } : {}),
      }
    );
  },

  /**
   * UC10 dua arah (UI-12 -> UI-11): Menandai bahwa penyedia jasa telah memberi rating ke pelanggan.
   * Tidak menyentuh `nilaiRating`/`hasRating` karena keduanya merepresentasikan rating dari pelanggan.
   */
  markContractRatedByProvider(
    idKontrak: string,
    nilaiRating: number,
    ulasan?: string,
    tags?: string[]
  ): ContractRecord {
    const cleanId = (idKontrak ?? '').trim();
    const existing = getHistoryContractById(cleanId);
    return updateContractStatusInStores(
      cleanId,
      existing?.statusPekerjaan ?? 'Done',
      {
        hasRatedByMe: true,
        nilaiRatingDiberikan: nilaiRating,
        ulasanDiberikan: ulasan?.trim() || null,
        tagsDiberikan: tags && tags.length > 0 ? [...tags] : [],
      }
    );
  },
};

export default contractService;
