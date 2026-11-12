/**
 * Service Integrasi Kontrak Pekerjaan (UC05, UC06, UC07)
 * Traceability:
 * - Kelas DPPL C16 KontrakPekerjaan (ALGO-036 s.d. ALGO-040)
 * - Kelas DPPL C17 KontrakPekerjaanUI
 * - Kelas DPPL C18 KontrakPekerjaanController (ALGO-041 s.d. ALGO-043)
 * - Antarmuka UI-08 (Ruang Obrolan Pelanggan: UI-08-04, UI-08-05, UI-08-09)
 * - Antarmuka UI-09 (Ruang Obrolan Penyedia Jasa: UI-09-06, UI-09-07, UI-09-08, UI-09-09)
 */

import { apiGet, apiPatch, apiPost, getAuthToken, getCurrentUser } from './api';
import { CHAT_CONFIG } from '../config/chatConfig';
import {
  ContractCardStatus,
  ContractRecord,
  StatusPekerjaan,
} from '../types/chat';
import { formatTimeShort } from '../utils/chatUtils';

export interface BackendKontrakDetail {
  idKontrakPekerjaan: string | null;
  idPelanggan: string;
  idPemberiJasa: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan: string;
  hasRating?: boolean;
  createdAt?: string | Date;
  expiresAt?: string | Date | null;
  pemberiJasa?: {
    idPemberiJasa?: string;
    namaToko?: string;
    jenisJasa?: string | null;
    statusKetersediaan?: string;
    version?: number;
  } | null;
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

/**
 * Menggabungkan nama jenis jasa dan deskripsi pekerjaan ke dalam satu string detailPekerjaan
 * untuk dikirimkan ke backend KontrakPekerjaan (tanpa mengubah skema DB).
 */
export function formatDetailPekerjaan(jasa: string, deskripsi: string): string {
  const cleanJasa = (jasa ?? '').trim();
  const cleanDeskripsi = (deskripsi ?? '').trim();

  if (cleanJasa && cleanDeskripsi) {
    if (
      cleanDeskripsi.toLowerCase().startsWith(`${cleanJasa.toLowerCase()}${DETAIL_SEPARATOR}`)
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
    normalized === 'done'
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
  if (lower === 'done') return 'Done';
  if (lower === 'ditolak') return 'Ditolak';
  if (lower === 'dibatalkan') return 'Dibatalkan';
  if (lower === 'menunggu') return 'Menunggu';

  if (cardStatus === 'DITERIMA') return 'On Progress';
  if (cardStatus === 'DITOLAK') return 'Ditolak';
  return 'Menunggu';
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

  return {
    idKontrak,
    idKontrakPekerjaan: idKontrak,
    idPelanggan: raw.idPelanggan,
    idPemberiJasa: raw.idPemberiJasa,
    jasa,
    deskripsi,
    detailPekerjaan: raw.detailPekerjaan,
    totalHarga: Number(raw.persetujuanHarga) || 0,
    persetujuanHarga: Number(raw.persetujuanHarga) || 0,
    status,
    statusPekerjaan,
    hasRating: Boolean(raw.hasRating),
    waktu: formatTimeShort(createdIso) || '14.28',
    createdAt: createdIso,
    expiresAt: expiresIso,
  };
}

// ============================================================================
// State In-Memory & Listener untuk Sinkronisasi UI-08, UI-09, UI-12, dan UI-04
// ============================================================================

const INITIAL_DEMO_CONTRACT: ContractRecord = {
  idKontrak: 'kontrak-1',
  idKontrakPekerjaan: 'kontrak-1',
  idPelanggan: 'user-naufal-hasbialhaq',
  idPemberiJasa: 'user-budi-wijaya',
  jasa: 'Bersih-bersih Rumah',
  deskripsi: 'Bersihin rumah wimar',
  detailPekerjaan: 'Bersih-bersih Rumah - Bersihin rumah wimar',
  totalHarga: 100000,
  persetujuanHarga: 100000,
  status: 'MENUNGGU',
  statusPekerjaan: 'Menunggu',
  hasRating: false,
  waktu: '14.28',
  createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 14).toISOString(),
};

const DEMO_LINKED_PARTNERS = new Set<string>([
  'user-budi-wijaya',
  'user-naufal-hasbialhaq',
]);

let contractsByPartner: Record<string, ContractRecord> = {
  'user-budi-wijaya': { ...INITIAL_DEMO_CONTRACT },
  'user-naufal-hasbialhaq': { ...INITIAL_DEMO_CONTRACT },
};

type ContractStoreListener = (
  records: Record<string, ContractRecord>
) => void;

const listeners = new Set<ContractStoreListener>();

function notifyContractListeners(): void {
  const snapshot = { ...contractsByPartner };
  listeners.forEach((listener) => listener(snapshot));
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
  return result;
}

export function resetMockContracts(): void {
  contractsByPartner = {
    'user-budi-wijaya': { ...INITIAL_DEMO_CONTRACT },
    'user-naufal-hasbialhaq': { ...INITIAL_DEMO_CONTRACT },
  };
  notifyContractListeners();
}

function shouldAttemptBackendCall(): boolean {
  if (!CHAT_CONFIG.USE_MOCK) {
    return true;
  }
  return Boolean(getAuthToken());
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
      jasa: cleanJasa,
      deskripsi: cleanDeskripsi,
      detailPekerjaan: combinedDetail,
      totalHarga: Math.round(numericHarga),
      persetujuanHarga: Math.round(numericHarga),
      status: 'MENUNGGU',
      statusPekerjaan: 'Menunggu',
      hasRating: false,
      waktu: formatTimeShort(nowIso) || 'Baru saja',
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
};

export default contractService;
