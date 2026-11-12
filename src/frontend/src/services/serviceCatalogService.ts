/**
 * [Naufal Hasbialhaq] Service Katalog & Pendaftaran Layanan Penyedia Jasa
 * Traceability: UC01 (Mendaftarkan Jasa), UC02 (Memilih Jasa), KF01, KF02, KF03, KF04, KF05, KF08,
 * Kelas DPPL C13 KategoriJasa, C14 KategoriJasaUI, C04 PemberiJasa, C05 PemberiJasaUI,
 * Antarmuka UI-04 (Beranda), UI-05 (Rekomendasi Pencarian), UI-06 (Hasil Pencarian), UI-16 (Daftar Penyedia Jasa)
 */

import { apiGet, apiPost, Role } from './api';

/**
 * Daftar pilihan kategori / jenis jasa sesuai spesifikasi DPPL UI-04-08 & UI-16-06
 */
export const JENIS_JASA_OPTIONS = [
  { label: 'Servis', value: 'Servis' },
  { label: 'Kebersihan', value: 'Kebersihan' },
  { label: 'Jahit', value: 'Jahit' },
  { label: 'Renovasi', value: 'Renovasi' },
  { label: 'Desain', value: 'Desain' },
  { label: 'Lainnya', value: 'Lainnya' },
] as const;

export type JenisJasa = (typeof JENIS_JASA_OPTIONS)[number]['value'];

export interface KategoriJasaRecord {
  idKategoriJasa: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
}

export interface PemberiJasaDetail {
  idPemberiJasa: string;
  namaPengguna: string;
  namaToko: string;
  nomorTelpon: string;
  email: string;
  role?: Role;
  avatarUrl: string | null;
  akumulasiRating: number;
  idKategoriJasa: string | null;
  jenisJasa: string | null;
  deskripsiJasa: string | null;
  tarif: number | null;
  jamKerja: string | null;
  daerahKerja: string | null;
  latitude: number | null;
  longitude: number | null;
  statusKetersediaan: string;
  isOnline: boolean;
  jarakKm?: number | null;
}

export interface RegisterPenyediaJasaPayload {
  idPemberiJasa: string;
  namaToko: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
  latitude?: number;
  longitude?: number;
}

export interface RegisterPenyediaJasaResult {
  kategori: KategoriJasaRecord;
  pemberiJasa: PemberiJasaDetail | null;
  role: Role;
}

export type SortKey = 'terdekat' | 'rating_terbaik' | 'termurah';

export interface SearchServiceParams {
  keyword?: string; // dikirim sebagai q
  idKategoriJasa?: string; // dikirim sebagai kategoriId
  lat?: number;
  long?: number;
  radiusKm?: number;
  sortBy?: SortKey;
}


export function buildSearchQuery(params: SearchServiceParams): string {
  const parts: string[] = [];

  if (params.keyword !== undefined) {
    const trimmedKeyword = params.keyword.trim();
    if (trimmedKeyword.length > 0) {
      parts.push(`q=${encodeURIComponent(trimmedKeyword)}`);
    }
  }

  if (params.idKategoriJasa !== undefined) {
    const trimmedKategoriId = params.idKategoriJasa.trim();
    if (trimmedKategoriId.length > 0) {
      parts.push(`kategoriId=${encodeURIComponent(trimmedKategoriId)}`);
    }
  }

  if (typeof params.lat === 'number' && Number.isFinite(params.lat)) {
    parts.push(`lat=${encodeURIComponent(String(params.lat))}`);
  }

  if (typeof params.long === 'number' && Number.isFinite(params.long)) {
    parts.push(`long=${encodeURIComponent(String(params.long))}`);
  }

  if (
    typeof params.radiusKm === 'number' &&
    Number.isFinite(params.radiusKm) &&
    params.radiusKm > 0
  ) {
    parts.push(`radiusKm=${encodeURIComponent(String(params.radiusKm))}`);
  }

  if (params.sortBy !== undefined) {
    const trimmedSort = params.sortBy.trim();
    if (trimmedSort.length > 0) {
      parts.push(`sortBy=${encodeURIComponent(trimmedSort)}`);
    }
  }

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

/**
 * Mengirimkan data pendaftaran penyedia jasa ke endpoint POST /api/services/register (UC01)
 */
export async function registerServiceProvider(
  payload: RegisterPenyediaJasaPayload
): Promise<RegisterPenyediaJasaResult> {
  return apiPost<RegisterPenyediaJasaResult>('/services/register', payload);
}

/**
 * Mengambil seluruh daftar kategori jasa dari endpoint GET /api/services/categories (Q-015)
 */
export async function fetchServiceCategories(): Promise<KategoriJasaRecord[]> {
  return apiGet<KategoriJasaRecord[]>('/services/categories');
}

/**
 * UC02 N1–N2, KF03 — pencarian + jarak Haversine + sort (KNF05)
 */
export async function searchServiceProviders(
  params: SearchServiceParams = {}
): Promise<PemberiJasaDetail[]> {
  const query = buildSearchQuery(params);
  const data = await apiGet<PemberiJasaDetail[]>(`/services/search${query}`);
  return Array.isArray(data) ? data : [];
}

/**
 * Q-002, ALGO-009 fetchPemberiJasaById / ALGO-011 choosePemberiJasa (KF08)
 */
export async function fetchServiceProviderById(
  idPemberiJasa: string
): Promise<PemberiJasaDetail> {
  const trimmedId = idPemberiJasa.trim();
  if (trimmedId.length === 0) {
    throw new Error('ID pemberi jasa tidak valid');
  }
  return apiGet<PemberiJasaDetail>(
    `/services/${encodeURIComponent(trimmedId)}`
  );
}

/**
 * Q-003, ALGO-010 showPemberiJasaFromKategori
 */
export async function fetchServiceProvidersByCategory(
  idKategoriJasa: string
): Promise<PemberiJasaDetail[]> {
  const trimmedKategoriId = idKategoriJasa.trim();
  if (trimmedKategoriId.length === 0) {
    return [];
  }
  const data = await apiGet<PemberiJasaDetail[]>(
    `/services/category/${encodeURIComponent(trimmedKategoriId)}`
  );
  return Array.isArray(data) ? data : [];
}
