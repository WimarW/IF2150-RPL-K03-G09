/**
 * [Naufal Hasbialhaq] Controller & Custom Hook Katalog dan Pendaftaran Layanan Penyedia Jasa
 * Traceability: UC01 (Skenario Normal & Skenario Alternatif 1), UC02, KF04, KF05,
 * Kelas DPPL C15 KategoriJasaController (ALGO-032 s.d. ALGO-034) & C06 PemberiJasaController,
 * Antarmuka UI-16 (Daftar Penyedia Jasa)
 * Traceability Tambahan: UC02 (Skenario Normal & Alternatif 1), KF01, KF03, KF08,
 * Kelas DPPL C06 PemberiJasaController (ALGO-009 s.d. ALGO-011),
 * Antarmuka UI-04 (Beranda), UI-05 (Rekomendasi Pencarian), UI-06 (Hasil Pencarian)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import {
  ApiError,
  SessionUser,
  setCurrentUserRole,
  useSessionUser,
} from '../services/api';
import {
  JENIS_JASA_OPTIONS,
  JenisJasa,
  KategoriJasaRecord,
  PemberiJasaDetail,
  RegisterPenyediaJasaPayload,
  RegisterPenyediaJasaResult,
  SortKey,
  fetchServiceCategories,
  fetchServiceProviderById,
  registerServiceProvider,
  searchServiceProviders,
} from '../services/serviceCatalogService';

export interface PendaftaranJasaForm {
  namaToko: string;
  jenisJasa: JenisJasa | null;
  deskripsiJasa: string;
  tarif: string;
  jamMulai: string;
  jamSelesai: string;
  daerahKerja: string;
}

export type PendaftaranJasaField = keyof PendaftaranJasaForm;

export type PendaftaranJasaErrors = Partial<
  Record<PendaftaranJasaField, string>
>;

export const FIELD_ORDER: PendaftaranJasaField[] = [
  'namaToko',
  'jenisJasa',
  'deskripsiJasa',
  'tarif',
  'jamMulai',
  'jamSelesai',
  'daerahKerja',
];

export const FORM_LIMITS = {
  namaTokoMin: 3,
  namaTokoMax: 50,
  deskripsiMin: 20,
  deskripsiMax: 500,
  tarifMin: 1000,
  tarifMax: 100_000_000,
  daerahMin: 3,
  daerahMax: 100,
} as const;

const TIME_HHMM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const VALID_JENIS_JASA_SET = new Set<string>(
  JENIS_JASA_OPTIONS.map((item) => item.value)
);

/**
 * ALGO-032: Menyiapkan struktur data kosong untuk formulir pendaftaran layanan penyedia jasa
 */
export function showFormKategoriJasa(): PendaftaranJasaForm {
  return {
    namaToko: '',
    jenisJasa: null,
    deskripsiJasa: '',
    tarif: '',
    jamMulai: '',
    jamSelesai: '',
    daerahKerja: '',
  };
}

/**
 * Membersihkan input tarif agar hanya berisi digit angka, tanpa nol di depan, maksimal 9 digit
 */
export function sanitizeTarifInput(text: string): string {
  const digitsOnly = text.replace(/\D+/g, '');
  const withoutLeadingZeros = digitsOnly.replace(/^0+/, '');
  return withoutLeadingZeros.slice(0, 9);
}

/**
 * Memformat string digit tarif menjadi format ribuan Rupiah (contoh: "75000" -> "75.000")
 */
export function formatRupiah(digits: string): string {
  const cleanDigits = digits.replace(/\D+/g, '');
  if (!cleanDigits) {
    return '';
  }
  return cleanDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Memformat input jam secara otomatis ke bentuk HH:MM saat pengguna mengetik (contoh: "0830" -> "08:30")
 */
export function sanitizeJamInput(text: string): string {
  const digits = text.replace(/\D+/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

/**
 * Memvalidasi satu field pada formulir pendaftaran penyedia jasa (UC01 Skenario Alternatif 1)
 */
export function validateField(
  field: PendaftaranJasaField,
  form: PendaftaranJasaForm
): string | undefined {
  switch (field) {
    case 'namaToko': {
      const val = form.namaToko.trim();
      if (val.length === 0) {
        return 'Nama toko wajib diisi';
      }
      if (val.length < FORM_LIMITS.namaTokoMin) {
        return 'Nama toko minimal 3 karakter';
      }
      if (val.length > FORM_LIMITS.namaTokoMax) {
        return 'Nama toko maksimal 50 karakter';
      }
      return undefined;
    }

    case 'jenisJasa': {
      if (!form.jenisJasa || !VALID_JENIS_JASA_SET.has(form.jenisJasa)) {
        return 'Pilih jenis jasa';
      }
      return undefined;
    }

    case 'deskripsiJasa': {
      const val = form.deskripsiJasa.trim();
      if (val.length === 0) {
        return 'Deskripsi jasa wajib diisi';
      }
      if (val.length < FORM_LIMITS.deskripsiMin) {
        return 'Deskripsi minimal 20 karakter agar pelanggan memahami jasamu';
      }
      if (val.length > FORM_LIMITS.deskripsiMax) {
        return 'Deskripsi maksimal 500 karakter';
      }
      return undefined;
    }

    case 'tarif': {
      const raw = form.tarif.trim();
      if (raw.length === 0) {
        return 'Estimasi tarif wajib diisi';
      }
      if (!/^\d+$/.test(raw)) {
        return 'Tarif hanya boleh berisi angka';
      }
      const numericTarif = Number(raw);
      if (
        !Number.isInteger(numericTarif) ||
        numericTarif < FORM_LIMITS.tarifMin
      ) {
        return 'Tarif minimal Rp1.000';
      }
      if (numericTarif > FORM_LIMITS.tarifMax) {
        return 'Tarif maksimal Rp100.000.000';
      }
      return undefined;
    }

    case 'jamMulai': {
      const val = form.jamMulai.trim();
      if (val.length === 0) {
        return 'Jam mulai wajib diisi';
      }
      if (!TIME_HHMM_REGEX.test(val)) {
        return 'Format jam harus HH:MM (00:00–23:59)';
      }
      return undefined;
    }

    case 'jamSelesai': {
      const selesai = form.jamSelesai.trim();
      if (selesai.length === 0) {
        return 'Jam selesai wajib diisi';
      }
      if (!TIME_HHMM_REGEX.test(selesai)) {
        return 'Format jam harus HH:MM (00:00–23:59)';
      }
      const mulai = form.jamMulai.trim();
      if (TIME_HHMM_REGEX.test(mulai) && selesai <= mulai) {
        return 'Jam selesai harus setelah jam mulai';
      }
      return undefined;
    }

    case 'daerahKerja': {
      const val = form.daerahKerja.trim();
      if (val.length === 0) {
        return 'Wilayah kerja wajib diisi';
      }
      if (val.length < FORM_LIMITS.daerahMin) {
        return 'Wilayah kerja minimal 3 karakter';
      }
      if (val.length > FORM_LIMITS.daerahMax) {
        return 'Wilayah kerja maksimal 100 karakter';
      }
      return undefined;
    }
  }
}

export interface ValidateKategoriJasaResult {
  isValid: boolean;
  errors: PendaftaranJasaErrors;
  firstInvalidField: PendaftaranJasaField | null;
}

/**
 * ALGO-033: Memvalidasi seluruh field formulir pendaftaran jasa dan mengembalikan
 * daftar error per field beserta field pertama yang tidak valid
 */
export function validateKategoriJasa(
  form: PendaftaranJasaForm
): ValidateKategoriJasaResult {
  const errors: PendaftaranJasaErrors = {};
  let firstInvalidField: PendaftaranJasaField | null = null;

  for (const field of FIELD_ORDER) {
    const errorMsg = validateField(field, form);
    if (errorMsg) {
      errors[field] = errorMsg;
      if (firstInvalidField === null) {
        firstInvalidField = field;
      }
    }
  }

  return {
    isValid: firstInvalidField === null,
    errors,
    firstInvalidField,
  };
}

/**
 * Mengecek apakah syarat minimal tombol "Ajukan Pendaftaran" (UI-16-07) terpenuhi:
 * aktif apabila UI-16-04 (Nama Toko) dan UI-16-06 (Jenis Jasa) sudah terisi.
 */
export function isMinimalFilled(form: PendaftaranJasaForm): boolean {
  return (
    form.namaToko.trim().length > 0 &&
    form.jenisJasa !== null &&
    VALID_JENIS_JASA_SET.has(form.jenisJasa)
  );
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'error';

export type LocationResult = {
  coordinates: Coordinates | null;
  status: LocationStatus;
};

/**
 * Pilihan chip filter pengurutan hasil pencarian (UI-06-05)
 */
export const SORT_OPTIONS: ReadonlyArray<{ key: SortKey; label: string }> = [
  { key: 'terdekat', label: 'Terdekat' },
  { key: 'rating_terbaik', label: 'Rating Terbaik' },
  { key: 'termurah', label: 'Termurah' },
];

/**
 * Pesan kosong apabila tidak ada penyedia jasa yang bersedia (UC02 Skenario Alternatif 1)
 */
export const EMPTY_PROVIDER_MESSAGE =
  'Tidak ada yang sedang bersedia untuk memberi jasa ini';

/**
 * Koordinat default peta di sekitar ITB Bandung (konsisten dengan data seed)
 */
export const DEFAULT_MAP_REGION = {
  latitude: -6.8915,
  longitude: 107.6107,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

/**
 * Batas waktu permintaan lokasi GPS dalam milidetik
 */
export const LOCATION_TIMEOUT_MS = 8000;

/**
 * Mengambil maksimal 2 huruf inisial kapital dari nama pengguna atau nama toko
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return '?';
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return words[0].slice(0, 2).toUpperCase();
}

/**
 * Mengambil nama depan dari nama lengkap pengguna dengan fallback 'User' (UI-04-03)
 */
export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (trimmed.length === 0) {
    return 'User';
  }
  return trimmed.split(/\s+/)[0] || 'User';
}

/**
 * Mengembalikan nama tampilan utama penyedia jasa (prioritas namaToko lalu namaPengguna)
 */
export function getProviderDisplayName(p: PemberiJasaDetail): string {
  const toko = (p.namaToko ?? '').trim();
  if (toko.length > 0) {
    return toko;
  }
  const nama = (p.namaPengguna ?? '').trim();
  if (nama.length > 0) {
    return nama;
  }
  return 'Penyedia Jasa';
}

/**
 * Memformat jarak dalam kilometer menjadi string tampilan (contoh: '0.8 km', '12 km', atau '–')
 */
export function formatJarak(km: number | null | undefined): string {
  if (typeof km !== 'number' || !Number.isFinite(km) || km < 0) {
    return '–';
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

/**
 * Memformat nilai akumulasi rating menjadi 1 desimal atau 'Baru' bila belum ada penilaian
 */
export function formatRating(r: number | null | undefined): string {
  if (typeof r === 'number' && Number.isFinite(r) && r > 0) {
    return (Math.round(r * 10) / 10).toFixed(1);
  }
  return 'Baru';
}

/**
 * Memformat nominal tarif penyedia jasa ke dalam format mata uang Rupiah
 */
export function formatTarifRupiah(tarif: number | null | undefined): string {
  if (typeof tarif !== 'number' || !Number.isFinite(tarif)) {
    return 'Tarif belum diatur';
  }
  const rounded = Math.round(tarif);
  if (rounded <= 0) {
    return 'Rp0';
  }
  return `Rp${formatRupiah(String(rounded))}`;
}

/**
 * UC02 Alt 1 — hanya penyedia yang bersedia yang boleh ditampilkan; backend belum memfilter
 */
export function isProviderAvailable(p: PemberiJasaDetail): boolean {
  return (p.statusKetersediaan ?? '').trim().toLowerCase() === 'available';
}

/**
 * Menyaring daftar penyedia jasa agar hanya menyertakan penyedia dengan status Available (UC02 Alt 1)
 */
export function filterAvailableProviders(
  list: PemberiJasaDetail[]
): PemberiJasaDetail[] {
  return list.filter(isProviderAvailable);
}

/**
 * Memeriksa apakah objek memiliki pasangan koordinat latitude & longitude yang valid
 */
export function hasValidCoordinates<
  T extends { latitude: number | null; longitude: number | null },
>(p: T): p is T & { latitude: number; longitude: number } {
  return (
    typeof p.latitude === 'number' &&
    Number.isFinite(p.latitude) &&
    p.latitude >= -90 &&
    p.latitude <= 90 &&
    typeof p.longitude === 'number' &&
    Number.isFinite(p.longitude) &&
    p.longitude >= -180 &&
    p.longitude <= 180
  );
}

/**
 * Mengambil koordinat GPS pengguna saat ini dengan batas waktu LOCATION_TIMEOUT_MS
 * dan fallback ke posisi terakhir yang diketahui apabila pengambilan GPS gagal/timeout
 */
export async function getCurrentCoordinates(): Promise<LocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { coordinates: null, status: 'denied' };
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Location request timed out'));
        }, LOCATION_TIMEOUT_MS);
      });

      const position = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        timeoutPromise,
      ]);

      return {
        coordinates: {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        },
        status: 'granted',
      };
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  } catch {
    try {
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        return {
          coordinates: {
            latitude: Number(lastKnown.coords.latitude.toFixed(6)),
            longitude: Number(lastKnown.coords.longitude.toFixed(6)),
          },
          status: 'granted',
        };
      }
    } catch {
      // Abaikan jika fallback gagal
    }
    return { coordinates: null, status: 'error' };
  }
}

export interface UseUserLocationResult {
  coordinates: Coordinates | null;
  locationStatus: LocationStatus;
  isLocationResolved: boolean;
  requestLocation: () => Promise<Coordinates | null>;
}

/**
 * Custom hook untuk mengelola deteksi koordinat GPS pelanggan (KF03)
 */
export function useUserLocation(options?: {
  autoRequest?: boolean;
}): UseUserLocationResult {
  const autoRequest = options?.autoRequest ?? true;
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>('idle');
  const [isLocationResolved, setIsLocationResolved] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const requestLocation = useCallback(async (): Promise<Coordinates | null> => {
    if (isMountedRef.current) {
      setLocationStatus('loading');
    }
    const result = await getCurrentCoordinates();
    if (isMountedRef.current) {
      if (result.coordinates) {
        setCoordinates((prev) =>
          prev &&
          prev.latitude === result.coordinates!.latitude &&
          prev.longitude === result.coordinates!.longitude
            ? prev
            : result.coordinates
        );
      } else if (result.status === 'denied') {
        setCoordinates(null);
      }
      setLocationStatus(result.status);
      setIsLocationResolved(true);
    }
    return result.coordinates;
  }, []);

  useEffect(() => {
    if (autoRequest) {
      void requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return {
    coordinates,
    locationStatus,
    isLocationResolved,
    requestLocation,
  };
}

/**
 * Mengonversi state formulir UI-16 menjadi payload request POST /api/services/register
 */
export function toRegisterPayload(
  form: PendaftaranJasaForm,
  idPemberiJasa: string,
  coordinates?: Coordinates | null
): RegisterPenyediaJasaPayload {
  return {
    idPemberiJasa: idPemberiJasa.trim(),
    namaToko: form.namaToko.trim(),
    jenisJasa: form.jenisJasa ?? '',
    deskripsiJasa: form.deskripsiJasa.trim(),
    tarif: Number(form.tarif.trim()),
    jamKerja: `${form.jamMulai.trim()} - ${form.jamSelesai.trim()}`,
    daerahKerja: form.daerahKerja.trim(),
    ...(coordinates
      ? {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }
      : {}),
  };
}

/**
 * ALGO-034: Memvalidasi formulir dan mengirimkan data pendaftaran ke backend
 */
export async function submitFormKategoriJasa(
  form: PendaftaranJasaForm,
  idPemberiJasa: string,
  coordinates?: Coordinates | null
): Promise<RegisterPenyediaJasaResult> {
  const validation = validateKategoriJasa(form);
  if (!validation.isValid) {
    throw new Error('Data formulir tidak valid');
  }
  const payload = toRegisterPayload(form, idPemberiJasa, coordinates);
  return registerServiceProvider(payload);
}

export interface UseCatalogControllerResult {
  user: SessionUser;
  isPenyediaJasa: boolean;
  form: PendaftaranJasaForm;
  errors: PendaftaranJasaErrors;
  touched: Partial<Record<PendaftaranJasaField, boolean>>;
  submitAttempted: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  successResult: RegisterPenyediaJasaResult | null;
  coordinates: Coordinates | null;
  locationStatus: LocationStatus;
  detectCoordinates: () => Promise<Coordinates | null>;
  setFieldValue: <K extends PendaftaranJasaField>(
    field: K,
    value: PendaftaranJasaForm[K]
  ) => void;
  handleBlur: (field: PendaftaranJasaField) => void;
  validateBeforeSubmit: () => ValidateKategoriJasaResult;
  submitRegistration: () => Promise<RegisterPenyediaJasaResult | null>;
  dismissServerError: () => void;
  dismissSuccessModal: () => void;
}

/**
 * Custom Hook Controller (C15 KategoriJasaController) untuk mengelola state,
 * validasi real-time, deteksi koordinat GPS, dan pengiriman formulir UI-16 Daftar Penyedia Jasa
 */
export function useCatalogController(): UseCatalogControllerResult {
  const { user, isPenyediaJasa } = useSessionUser();
  const [form, setForm] = useState<PendaftaranJasaForm>(() =>
    showFormKategoriJasa()
  );
  const [errors, setErrors] = useState<PendaftaranJasaErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<PendaftaranJasaField, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successResult, setSuccessResult] =
    useState<RegisterPenyediaJasaResult | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>('idle');

  const detectCoordinates = useCallback(async (): Promise<Coordinates | null> => {
    setLocationStatus('loading');
    const result = await getCurrentCoordinates();
    if (result.coordinates) {
      setCoordinates(result.coordinates);
    }
    setLocationStatus(result.status);
    return result.coordinates;
  }, []);

  const setFieldValue = useCallback(
    <K extends PendaftaranJasaField>(
      field: K,
      value: PendaftaranJasaForm[K]
    ) => {
      setForm((prevForm) => {
        const nextForm: PendaftaranJasaForm = {
          ...prevForm,
          [field]: value,
        };

        setErrors((prevErrors) => {
          const shouldRevalidate =
            submitAttempted ||
            Boolean(touched[field]) ||
            Boolean(prevErrors[field]);

          if (
            !shouldRevalidate &&
            !(
              field === 'jamMulai' &&
              (submitAttempted ||
                Boolean(touched.jamSelesai) ||
                Boolean(prevErrors.jamSelesai))
            )
          ) {
            return prevErrors;
          }

          const nextErrors: PendaftaranJasaErrors = { ...prevErrors };

          if (shouldRevalidate) {
            const fieldErr = validateField(field, nextForm);
            if (fieldErr) {
              nextErrors[field] = fieldErr;
            } else {
              delete nextErrors[field];
            }
          }

          if (
            field === 'jamMulai' &&
            (submitAttempted ||
              Boolean(touched.jamSelesai) ||
              Boolean(prevErrors.jamSelesai))
          ) {
            const selesaiErr = validateField('jamSelesai', nextForm);
            if (selesaiErr) {
              nextErrors.jamSelesai = selesaiErr;
            } else {
              delete nextErrors.jamSelesai;
            }
          }

          return nextErrors;
        });

        return nextForm;
      });
    },
    [submitAttempted, touched]
  );

  const handleBlur = useCallback(
    (field: PendaftaranJasaField) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prevErrors) => {
        const nextErrors: PendaftaranJasaErrors = { ...prevErrors };
        const fieldErr = validateField(field, form);
        if (fieldErr) {
          nextErrors[field] = fieldErr;
        } else {
          delete nextErrors[field];
        }
        return nextErrors;
      });
    },
    [form]
  );

  const validateBeforeSubmit = useCallback((): ValidateKategoriJasaResult => {
    setSubmitAttempted(true);
    const allTouched: Partial<Record<PendaftaranJasaField, boolean>> = {};
    for (const f of FIELD_ORDER) {
      allTouched[f] = true;
    }
    setTouched(allTouched);

    const validation = validateKategoriJasa(form);
    setErrors(validation.errors);
    return validation;
  }, [form]);

  const submitRegistration =
    useCallback(async (): Promise<RegisterPenyediaJasaResult | null> => {
      if (isSubmitting) {
        return null;
      }

      const validation = validateBeforeSubmit();
      if (!validation.isValid) {
        return null;
      }

      setIsSubmitting(true);
      setServerError(null);

      try {
        const result = await submitFormKategoriJasa(
          form,
          user.idPengguna,
          coordinates
        );
        setCurrentUserRole(result.role ?? 'PEMBERI_JASA');
        setSuccessResult(result);
        return result;
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          if (err.status === 0) {
            setServerError(err.message);
          } else if (err.status === 400) {
            setServerError(`Pendaftaran ditolak: ${err.message}`);
          } else if (err.status === 404) {
            setServerError('Akun tidak ditemukan. Silakan masuk ulang.');
          } else {
            setServerError(
              'Terjadi kesalahan pada server. Coba beberapa saat lagi.'
            );
          }
        } else {
          setServerError(
            'Terjadi kesalahan pada server. Coba beberapa saat lagi.'
          );
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    }, [
      coordinates,
      form,
      isSubmitting,
      user.idPengguna,
      validateBeforeSubmit,
    ]);

  const dismissServerError = useCallback(() => {
    setServerError(null);
  }, []);

  const dismissSuccessModal = useCallback(() => {
    setSuccessResult(null);
  }, []);

  return {
    user,
    isPenyediaJasa,
    form,
    errors,
    touched,
    submitAttempted,
    isSubmitting,
    serverError,
    successResult,
    coordinates,
    locationStatus,
    detectCoordinates,
    setFieldValue,
    handleBlur,
    validateBeforeSubmit,
    submitRegistration,
    dismissServerError,
    dismissSuccessModal,
  };
}

// ============================================================================
// A. Rekomendasi Pencarian (C15 filterKategoriJasa, UI-05-05)
// ============================================================================

export interface SearchSuggestion {
  id: string;
  label: string;
  keyword: string;
  source: 'populer' | 'kategori';
}

export const SUGGESTION_KEYWORDS: readonly string[] = [
  'Jasa Cuci Mobil',
  'Jasa Cuci Motor',
  'Jasa Cuci AC',
  'Jasa Cuci Sofa',
  'Cuci Baju (Laundry)',
  'Jasa Cuci Karpet',
  'Servis AC',
  'Servis Elektronik',
  'Bersih Rumah',
  'Jasa Kebersihan',
  'Tukang Ledeng',
  'Perbaikan Pipa',
  'Jahit Baju',
  'Permak Celana',
  'Renovasi Rumah',
  'Tukang Cat',
  'Desain Grafis',
  'Desain Logo',
];

/**
 * Menormalisasi teks menjadi huruf kecil, tanpa spasi di ujung, dan spasi ganda diringkas menjadi tunggal
 */
export function normalizeText(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * C15 KategoriJasaController.filterKategoriJasa:
 * Menyaring dan mengurutkan daftar rekomendasi pencarian berdasarkan kata kunci pelanggan (UI-05-05)
 */
export function filterKategoriJasa(
  kriteria: string,
  kategori: KategoriJasaRecord[],
  limit = 8
): SearchSuggestion[] {
  const maxItems = Math.max(0, limit);
  if (maxItems === 0) {
    return [];
  }

  const normalizedQuery = normalizeText(kriteria);
  const seen = new Set<string>();
  const addSuggestion = (
    target: SearchSuggestion[],
    rawLabel: string,
    source: 'populer' | 'kategori'
  ) => {
    if (typeof rawLabel !== 'string') {
      return;
    }
    const label = rawLabel.trim();
    if (!label) {
      return;
    }
    const norm = normalizeText(label);
    if (!norm || seen.has(norm)) {
      return;
    }
    seen.add(norm);
    target.push({
      id: `${source}-${norm}`,
      label,
      keyword: label,
      source,
    });
  };

  // Jika kriteria kosong, kembalikan label JENIS_JASA_OPTIONS (kecuali 'Lainnya') + jenisJasa unik backend
  if (normalizedQuery.length === 0) {
    const defaultList: SearchSuggestion[] = [];
    for (const option of JENIS_JASA_OPTIONS.slice(0, 6)) {
      if (option.label !== 'Lainnya') {
        addSuggestion(defaultList, option.label, 'populer');
      }
    }
    for (const item of kategori) {
      addSuggestion(defaultList, item.jenisJasa, 'kategori');
    }
    return defaultList.slice(0, maxItems);
  }

  const candidates: SearchSuggestion[] = [];
  for (const kw of SUGGESTION_KEYWORDS) {
    addSuggestion(candidates, kw, 'populer');
  }
  for (const option of JENIS_JASA_OPTIONS) {
    if (option.label !== 'Lainnya') {
      addSuggestion(candidates, option.label, 'populer');
    }
  }
  for (const item of kategori) {
    addSuggestion(candidates, item.jenisJasa, 'kategori');
  }

  const tokens = normalizedQuery.split(' ').filter(Boolean);

  const matched = candidates.filter((candidate) => {
    const normLabel = normalizeText(candidate.label);
    return tokens.every((token) => normLabel.includes(token));
  });

  const getRank = (label: string): number => {
    const normLabel = normalizeText(label);
    if (normLabel.startsWith(normalizedQuery)) {
      return 1;
    }
    const words = normLabel.split(/[\s()/,-]+/).filter(Boolean);
    if (words.some((w) => w.startsWith(normalizedQuery))) {
      return 2;
    }
    return 3;
  };

  matched.sort((a, b) => {
    const rankA = getRank(a.label);
    const rankB = getRank(b.label);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.label.localeCompare(b.label, 'id');
  });

  return matched.slice(0, maxItems);
}

// B. Tipe Pesanan Aktif & Pemformat Tanggal (UI-04-13)

export interface OnProgressOrderSummary {
  idKontrakPekerjaan: string;
  judulPekerjaan: string;
  namaPemberiJasa: string;
  createdAt: string; // ISO
  statusPekerjaan: 'On Progress';
}

const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

/**
 * Memformat string tanggal ISO menjadi format Bahasa Indonesia "12 Mei 2026 · 14.20" (UI-04-13)
 */
export function formatTanggalPesanan(iso: string): string {
  if (!iso || typeof iso !== 'string') {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const tanggal = date.getDate();
  const bulan = BULAN_INDONESIA[date.getMonth()];
  const tahun = date.getFullYear();
  const jam = String(date.getHours()).padStart(2, '0');
  const menit = String(date.getMinutes()).padStart(2, '0');
  return `${tanggal} ${bulan} ${tahun} · ${jam}.${menit}`;
}

// C. Hook Controller Beranda Pelanggan (UI-04, C14 -> C15 fetchAllKategoriJasa)

export interface UseHomeCatalogControllerResult {
  user: SessionUser;
  greetingName: string;
  isPenyediaJasa: boolean;
  popularCategories: typeof JENIS_JASA_OPTIONS;
  recommendations: PemberiJasaDetail[];
  activeOrder: OnProgressOrderSummary | null;
  isLoadingRecommendations: boolean;
  isRefreshing: boolean;
  recommendationError: string | null;
  coordinates: Coordinates | null;
  locationStatus: LocationStatus;
  refresh: () => Promise<void>;
}

/**
 * Custom Hook Controller untuk layar Beranda Pelanggan (UI-04, KF01)
 */
export function useHomeCatalogController(): UseHomeCatalogControllerResult {
  const { user, isPenyediaJasa } = useSessionUser();
  const greetingName = getFirstName(user.namaPengguna);
  const {
    coordinates,
    locationStatus,
    isLocationResolved,
    requestLocation,
  } = useUserLocation();

  const [recommendations, setRecommendations] = useState<PemberiJasaDetail[]>(
    []
  );

  const [activeOrder] = useState<OnProgressOrderSummary | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null
  );

  const requestIdRef = useRef<number>(0);
  const lastFetchedCoordsKeyRef = useRef<string | undefined>(undefined);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadRecommendations = useCallback(
    async (coords: Coordinates | null, isRefreshCall = false) => {
      const currentRequestId = ++requestIdRef.current;
      lastFetchedCoordsKeyRef.current = coords
        ? `${coords.latitude},${coords.longitude}`
        : 'null';
      if (!isRefreshCall && isMountedRef.current) {
        setIsLoadingRecommendations(true);
      }
      if (isMountedRef.current) {
        setRecommendationError(null);
      }

      try {
        const data = await searchServiceProviders({
          lat: coords?.latitude,
          long: coords?.longitude,
          sortBy: 'rating_terbaik',
        });

        if (
          !isMountedRef.current ||
          currentRequestId !== requestIdRef.current
        ) {
          return;
        }

        const available = filterAvailableProviders(data).slice(0, 6);
        setRecommendations(available);
      } catch (err: unknown) {
        if (
          !isMountedRef.current ||
          currentRequestId !== requestIdRef.current
        ) {
          return;
        }

        if (err instanceof ApiError && err.status === 0) {
          setRecommendationError(err.message);
        } else {
          setRecommendationError('Gagal memuat rekomendasi jasa.');
        }
      } finally {
        if (
          isMountedRef.current &&
          currentRequestId === requestIdRef.current
        ) {
          setIsLoadingRecommendations(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!isLocationResolved) {
      return;
    }
    const coordsKey = coordinates
      ? `${coordinates.latitude},${coordinates.longitude}`
      : 'null';
    if (lastFetchedCoordsKeyRef.current === coordsKey) {
      return;
    }
    void loadRecommendations(coordinates, false);
  }, [coordinates, isLocationResolved, loadRecommendations]);

  const refresh = useCallback(async () => {
    if (isMountedRef.current) {
      setIsRefreshing(true);
    }
    try {
      const freshCoords = await requestLocation();
      await loadRecommendations(freshCoords, true);
    } finally {
      if (isMountedRef.current) {
        setIsRefreshing(false);
      }
    }
  }, [loadRecommendations, requestLocation]);

  return {
    user,
    greetingName,
    isPenyediaJasa,
    popularCategories: JENIS_JASA_OPTIONS,
    recommendations,
    activeOrder,
    isLoadingRecommendations,
    isRefreshing,
    recommendationError,
    coordinates,
    locationStatus,
    refresh,
  };
}

// ============================================================================
// D. Hook Controller Rekomendasi Pencarian (UI-05)
// ============================================================================

export interface UseSearchRecommendationControllerResult {
  query: string;
  setQuery: (text: string) => void;
  clearQuery: () => void;
  suggestions: SearchSuggestion[];
  isLoadingCategories: boolean;
  trimmedQuery: string;
}

/**
 * Custom Hook Controller untuk layar Rekomendasi Pencarian (UI-05)
 */
export function useSearchRecommendationController(
  initialQuery = ''
): UseSearchRecommendationControllerResult {
  const [query, setQuery] = useState<string>(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);
  const [categories, setCategories] = useState<KategoriJasaRecord[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCategories(true);

    fetchServiceCategories()
      .then((records) => {
        if (isMounted && Array.isArray(records)) {
          setCategories(records);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  const clearQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const suggestions = useMemo(
    () => filterKategoriJasa(debouncedQuery, categories),
    [debouncedQuery, categories]
  );

  return {
    query,
    setQuery,
    clearQuery,
    suggestions,
    isLoadingCategories,
    trimmedQuery: query.trim(),
  };
}

// ============================================================================
// E. Hook Controller Hasil Pencarian & Peta (UI-06, C05 & C06)
// ============================================================================

export interface UseSearchResultControllerParams {
  keyword: string;
  initialSort?: SortKey;
  focusProviderId?: string;
}

export interface UseSearchResultControllerResult {
  keyword: string;
  setKeyword: (text: string) => void;
  clearKeyword: () => void;
  submitKeyword: () => void;
  activeKeyword: string;
  sortBy: SortKey;
  setSortBy: (sort: SortKey) => void;
  sortOptions: typeof SORT_OPTIONS;
  providers: PemberiJasaDetail[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isEmpty: boolean;
  hasFetched: boolean;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  coordinates: Coordinates | null;
  locationStatus: LocationStatus;
  isLocationResolved: boolean;
  selectedProviderId: string | null;
  selectedProvider: PemberiJasaDetail | null;
  isDetailLoading: boolean;
  detailError: string | null;
  choosePemberiJasa: (idPemberiJasa: string) => Promise<void>;
  dismissPemberiJasa: () => void;
}

/**
 * Custom Hook Controller untuk layar Hasil Pencarian & Peta (UI-06, UC02, KF03, KF08)
 */
export function useSearchResultController(
  params: UseSearchResultControllerParams
): UseSearchResultControllerResult {
  const [keyword, setKeyword] = useState<string>(params.keyword);
  const [activeKeyword, setActiveKeyword] = useState<string>(
    params.keyword.trim()
  );
  const [sortBy, setSortBy] = useState<SortKey>(
    params.initialSort ?? 'terdekat'
  );

  const [providers, setProviders] = useState<PemberiJasaDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null
  );
  const [selectedProvider, setSelectedProvider] =
    useState<PemberiJasaDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const {
    coordinates,
    locationStatus,
    isLocationResolved,
    requestLocation,
  } = useUserLocation();

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRequestIdRef = useRef<number>(0);
  const lastSearchKeyRef = useRef<string | undefined>(undefined);
  const detailRequestIdRef = useRef<number>(0);
  const hasAutoFocusedRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const providersRef = useRef<PemberiJasaDetail[]>(providers);
  providersRef.current = providers;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setActiveKeyword(keyword.trim());
    }, 400);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [keyword]);

  const submitKeyword = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setActiveKeyword(keyword.trim());
  }, [keyword]);

  const clearKeyword = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setKeyword('');
    setActiveKeyword('');
  }, []);

  const choosePemberiJasa = useCallback(
    async (
      idPemberiJasa: string,
      currentProviders?: PemberiJasaDetail[]
    ): Promise<void> => {
      const trimmedId = idPemberiJasa.trim();
      if (!trimmedId) {
        return;
      }

      const sourceList = currentProviders ?? providersRef.current;
      const listItem =
        sourceList.find((item) => item.idPemberiJasa === trimmedId) ?? null;

      setSelectedProviderId(trimmedId);
      setSelectedProvider(listItem);
      setIsDetailLoading(true);
      setDetailError(null);

      const currentDetailRequestId = ++detailRequestIdRef.current;

      try {
        const detail = await fetchServiceProviderById(trimmedId);
        if (
          !isMountedRef.current ||
          currentDetailRequestId !== detailRequestIdRef.current
        ) {
          return;
        }
        setSelectedProvider({
          ...detail,
          jarakKm: detail.jarakKm ?? listItem?.jarakKm ?? null,
        });
      } catch {
        if (
          !isMountedRef.current ||
          currentDetailRequestId !== detailRequestIdRef.current
        ) {
          return;
        }
        setDetailError('Gagal memuat detail penyedia.');
      } finally {
        if (
          isMountedRef.current &&
          currentDetailRequestId === detailRequestIdRef.current
        ) {
          setIsDetailLoading(false);
        }
      }
    },
    []
  );

  const dismissPemberiJasa = useCallback(() => {
    detailRequestIdRef.current += 1;
    setSelectedProviderId(null);
    setSelectedProvider(null);
    setIsDetailLoading(false);
    setDetailError(null);
  }, []);

  const fetchProviders = useCallback(
    async (
      queryKeyword: string,
      sortOption: SortKey,
      coords: Coordinates | null,
      isRefreshCall = false
    ) => {
      const currentListRequestId = ++listRequestIdRef.current;
      lastSearchKeyRef.current = `${queryKeyword}::${sortOption}::${
        coords ? `${coords.latitude},${coords.longitude}` : 'null'
      }`;
      if (!isRefreshCall && isMountedRef.current) {
        setIsLoading(true);
      }
      if (isMountedRef.current) {
        setError(null);
      }

      try {
        const data = await searchServiceProviders({
          keyword: queryKeyword,
          lat: coords?.latitude,
          long: coords?.longitude,
          sortBy: sortOption,
        });

        if (
          !isMountedRef.current ||
          currentListRequestId !== listRequestIdRef.current
        ) {
          return;
        }

        const available = filterAvailableProviders(data);
        setProviders(available);
        setHasFetched(true);

        if (
          !hasAutoFocusedRef.current &&
          params.focusProviderId &&
          available.some((p) => p.idPemberiJasa === params.focusProviderId)
        ) {
          hasAutoFocusedRef.current = true;
          void choosePemberiJasa(params.focusProviderId, available);
        }
      } catch (err: unknown) {
        if (
          !isMountedRef.current ||
          currentListRequestId !== listRequestIdRef.current
        ) {
          return;
        }

        setProviders([]);
        if (err instanceof ApiError && err.status === 0) {
          setError(err.message);
        } else {
          setError('Gagal memuat hasil pencarian jasa.');
        }
        setHasFetched(true);
      } finally {
        if (
          isMountedRef.current &&
          currentListRequestId === listRequestIdRef.current
        ) {
          setIsLoading(false);
        }
      }
    },
    [choosePemberiJasa, params.focusProviderId]
  );

  useEffect(() => {
    if (!isLocationResolved) {
      return;
    }
    const nextSearchKey = `${activeKeyword}::${sortBy}::${
      coordinates ? `${coordinates.latitude},${coordinates.longitude}` : 'null'
    }`;
    if (lastSearchKeyRef.current === nextSearchKey) {
      return;
    }
    void fetchProviders(activeKeyword, sortBy, coordinates, false);
  }, [activeKeyword, coordinates, fetchProviders, isLocationResolved, sortBy]);

  const refresh = useCallback(async () => {
    if (isMountedRef.current) {
      setIsRefreshing(true);
    }
    try {
      const freshCoords = await requestLocation();
      await fetchProviders(activeKeyword, sortBy, freshCoords, true);
    } finally {
      if (isMountedRef.current) {
        setIsRefreshing(false);
      }
    }
  }, [activeKeyword, fetchProviders, requestLocation, sortBy]);

  const retry = useCallback(async () => {
    await fetchProviders(activeKeyword, sortBy, coordinates, false);
  }, [activeKeyword, coordinates, fetchProviders, sortBy]);

  const publicChoosePemberiJasa = useCallback(
    async (idPemberiJasa: string): Promise<void> => {
      await choosePemberiJasa(idPemberiJasa);
    },
    [choosePemberiJasa]
  );

  const isEmpty =
    hasFetched && !isLoading && error === null && providers.length === 0;

  return {
    keyword,
    setKeyword,
    clearKeyword,
    submitKeyword,
    activeKeyword,
    sortBy,
    setSortBy,
    sortOptions: SORT_OPTIONS,
    providers,
    isLoading,
    isRefreshing,
    error,
    isEmpty,
    hasFetched,
    refresh,
    retry,
    coordinates,
    locationStatus,
    isLocationResolved,
    selectedProviderId,
    selectedProvider,
    isDetailLoading,
    detailError,
    choosePemberiJasa: publicChoosePemberiJasa,
    dismissPemberiJasa,
  };
}

export default useCatalogController;
