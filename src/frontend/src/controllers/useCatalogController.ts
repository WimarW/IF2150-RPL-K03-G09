/**
 * [Naufal Hasbialhaq] Controller & Custom Hook Katalog dan Pendaftaran Layanan Penyedia Jasa
 * Traceability: UC01 (Skenario Normal & Skenario Alternatif 1), UC02, KF04, KF05,
 * Kelas DPPL C15 KategoriJasaController (ALGO-032 s.d. ALGO-034) & C06 PemberiJasaController,
 * Antarmuka UI-16 (Daftar Penyedia Jasa)
 * Traceability Tambahan: UC02 (Skenario Normal & Alternatif 1), KF01, KF03, KF08,
 * Kelas DPPL C06 PemberiJasaController (ALGO-009 s.d. ALGO-011),
 * Antarmuka UI-04 (Beranda), UI-05 (Rekomendasi Pencarian), UI-06 (Hasil Pencarian)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
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
  PemberiJasaDetail,
  RegisterPenyediaJasaPayload,
  RegisterPenyediaJasaResult,
  SortKey,
  registerServiceProvider,
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
  const toko = p.namaToko.trim();
  if (toko.length > 0) {
    return toko;
  }
  const nama = p.namaPengguna.trim();
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
    return r.toFixed(1);
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
  return p.statusKetersediaan.trim().toLowerCase() === 'available';
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
        setCoordinates(result.coordinates);
      }
      setLocationStatus(result.status);
    }
    return result.coordinates;
  }, []);

  useEffect(() => {
    if (autoRequest) {
      void requestLocation();
    }
  }, [autoRequest, requestLocation]);

  const isLocationResolved =
    locationStatus === 'granted' ||
    locationStatus === 'denied' ||
    locationStatus === 'error';

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

export default useCatalogController;
