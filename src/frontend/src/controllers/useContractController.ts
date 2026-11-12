/**
 * Controller & Custom Hook Kontrak Pekerjaan (UC05, UC06, UC07)
 * Traceability:
 * - Kelas DPPL C16 KontrakPekerjaan (ALGO-036 statusUpdate, ALGO-038 newKontrak, ALGO-039 makeKontrak)
 * - Kelas DPPL C17 KontrakPekerjaanUI (openHalamanKontrak, inputDetailPekerjaan, showKontrakForm, showDetailPekerjaan)
 * - Kelas DPPL C18 KontrakPekerjaanController (ALGO-041 getKontrakPekerjaan, ALGO-043 kirimInput)
 * - Antarmuka UI-08 (UI-08-04, UI-08-05, UI-08-09) & UI-09 (UI-09-06, UI-09-07, UI-09-08, UI-09-09)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ContractFormErrors,
  ContractFormValues,
  ContractRecord,
} from '../types/chat';
import {
  contractService,
  DEFAULT_JASA_NAME,
  getCachedContractByPartner,
  subscribeContracts,
} from '../services/contractService';

/**
 * C17/C18 showKontrakForm(): Menginisialisasi nilai awal form kesepakatan kontrak pada UI-08-04.
 */
export function showKontrakForm(
  jasa: string = DEFAULT_JASA_NAME,
  deskripsi: string = 'Bersihin rumah wimar',
  totalHarga: string | number = 100000
): ContractFormValues {
  return {
    jasa: jasa.trim() || DEFAULT_JASA_NAME,
    deskripsi: deskripsi.trim(),
    totalHarga: String(totalHarga ?? '').replace(/[^\d]/g, ''),
  };
}

/**
 * Membersihkan input nominal harga persetujuan (Rp):
 * Mengizinkan nilai "0" (harga >= 0 sesuai ALGO-039) dan menghapus nol berlebih di depan angka positif.
 */
export function sanitizeHargaInput(raw: string): string {
  const digitsOnly = (raw ?? '').replace(/\D+/g, '');
  if (!digitsOnly) {
    return '';
  }
  if (/^0+$/.test(digitsOnly)) {
    return '0';
  }
  return digitsOnly.replace(/^0+/, '').slice(0, 10);
}

/**
 * Memformat string angka menjadi tampilan ribuan Indonesia (contoh: "100000" -> "100.000", "0" -> "0").
 */
export function formatHargaRibuan(rawDigits: string | number): string {
  const str = String(rawDigits ?? '');
  const sanitized = sanitizeHargaInput(str);
  if (sanitized === '') {
    return '';
  }
  return sanitized.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Mengurai string harga (dengan atau tanpa titik ribuan) menjadi bilangan bulat.
 * Mengembalikan NaN apabila input kosong atau bukan angka valid.
 */
export function parseHargaInput(raw: string | number): number {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? Math.trunc(raw) : Number.NaN;
  }
  const trimmed = (raw ?? '').trim();
  if (!trimmed) {
    return Number.NaN;
  }
  if (trimmed.startsWith('-')) {
    return -1;
  }
  const cleanDigits = trimmed.replace(/\./g, '').replace(/\s+/g, '');
  if (!/^\d+$/.test(cleanDigits)) {
    return Number.NaN;
  }
  return Number(cleanDigits);
}

export interface ValidateContractFormResult {
  isValid: boolean;
  errors: ContractFormErrors;
  parsedHarga: number;
  firstErrorMessage: string | null;
}

/**
 * ALGO-039 makeKontrak() & Validasi UI-08-05:
 * Memvalidasi input kesepakatan pelanggan:
 * - nama jenis jasa tidak kosong
 * - deskripsi pekerjaan tidak kosong
 * - total harga persetujuan >= 0
 */
export function validateContractForm(
  values: ContractFormValues
): ValidateContractFormResult {
  const errors: ContractFormErrors = {};
  let firstErrorMessage: string | null = null;

  const cleanJasa = (values.jasa ?? '').trim();
  const cleanDeskripsi = (values.deskripsi ?? '').trim();
  const parsedHarga = parseHargaInput(values.totalHarga);

  if (!cleanJasa) {
    errors.jasa = 'Nama jenis jasa tidak boleh kosong.';
    firstErrorMessage = firstErrorMessage ?? errors.jasa;
  }

  if (!cleanDeskripsi) {
    errors.deskripsi = 'Deskripsi pekerjaan tidak boleh kosong.';
    firstErrorMessage = firstErrorMessage ?? errors.deskripsi;
  }

  if (
    !Number.isFinite(parsedHarga) ||
    !Number.isInteger(parsedHarga) ||
    parsedHarga < 0
  ) {
    errors.totalHarga = 'Total harga persetujuan harus berupa angka >= 0.';
    firstErrorMessage = firstErrorMessage ?? errors.totalHarga;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    parsedHarga: Number.isFinite(parsedHarga) ? parsedHarga : -1,
    firstErrorMessage,
  };
}

export interface UseContractControllerOptions {
  defaultJasa?: string;
  onShowSnackbar?: (message: string) => void;
}

export function useContractController(
  partnerId?: string,
  options?: UseContractControllerOptions
) {
  const cleanPartnerId = (partnerId ?? '').trim();
  const defaultJasa = options?.defaultJasa?.trim() || DEFAULT_JASA_NAME;
  const onShowSnackbar = options?.onShowSnackbar;

  const [contract, setContract] = useState<ContractRecord | null>(() =>
    cleanPartnerId ? getCachedContractByPartner(cleanPartnerId) : null
  );

  const [formValues, setFormValues] = useState<ContractFormValues>(() => {
    const initial = cleanPartnerId
      ? getCachedContractByPartner(cleanPartnerId)
      : null;
    return showKontrakForm(
      initial?.jasa || defaultJasa,
      initial?.deskripsi || 'Bersihin rumah wimar',
      initial?.totalHarga ?? 100000
    );
  });

  const [formErrors, setFormErrors] = useState<ContractFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingContract, setIsLoadingContract] = useState<boolean>(false);

  // Sinkronisasi state kontrak antar layar (UI-08 <-> UI-09)
  useEffect(() => {
    if (!cleanPartnerId) return;
    setContract(getCachedContractByPartner(cleanPartnerId));

    const unsubscribe = subscribeContracts((records) => {
      const updated = records[cleanPartnerId] ?? null;
      setContract(updated ? { ...updated } : null);
    });
    return unsubscribe;
  }, [cleanPartnerId]);

  /**
   * C18 getKontrakPekerjaan / loadContract: Mengambil data kontrak aktif untuk ruang obrolan.
   */
  const loadContract = useCallback(
    async (isSilent = false): Promise<ContractRecord | null> => {
      if (!cleanPartnerId) return null;
      if (!isSilent) setIsLoadingContract(true);
      try {
        const loaded = await contractService.getContractByPartner(
          cleanPartnerId,
          defaultJasa
        );
        setContract(loaded);
        return loaded;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Gagal memuat data kontrak.';
        if (!isSilent && onShowSnackbar) {
          onShowSnackbar(msg);
        }
        return null;
      } finally {
        if (!isSilent) setIsLoadingContract(false);
      }
    },
    [cleanPartnerId, defaultJasa, onShowSnackbar]
  );

  /**
   * C17 KontrakPekerjaanUI.inputDetailPekerjaan: Memperbarui nilai field pada form "Buat Kontrak" (UI-08-04).
   */
  const inputDetailPekerjaan = useCallback(
    (field: keyof ContractFormValues, value: string) => {
      const nextVal =
        field === 'totalHarga' ? sanitizeHargaInput(value) : value;

      setFormValues((prev) => ({
        ...prev,
        [field]: nextVal,
      }));

      setFormErrors((prev) => {
        if (!prev[field]) return prev;
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    },
    []
  );

  /**
   * ALGO-043 kirimInput(detailPekerjaan, persetujuanHarga):
   * Memvalidasi form kesepakatan (harga >= 0 & deskripsi tidak kosong) lalu mengirim kontrak baru
   * dan merender kartu "Detail Kontrak" di aliran chat dengan status Menunggu (UI-08-05 & UI-08-09).
   */
  const kirimInput = useCallback(async (): Promise<ContractRecord | null> => {
    if (!cleanPartnerId || isSubmitting) return null;

    const validation = validateContractForm(formValues);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      if (validation.firstErrorMessage && onShowSnackbar) {
        onShowSnackbar(validation.firstErrorMessage);
      }
      return null;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const created = await contractService.createContract({
        partnerId: cleanPartnerId,
        jasa: formValues.jasa.trim(),
        deskripsi: formValues.deskripsi.trim(),
        totalHarga: validation.parsedHarga,
      });

      setContract(created);
      if (onShowSnackbar) {
        onShowSnackbar(
          'Kontrak pekerjaan berhasil dibuat dengan status Menunggu.'
        );
      }
      return created;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal membuat kontrak pekerjaan.';
      if (onShowSnackbar) {
        onShowSnackbar(msg);
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [cleanPartnerId, formValues, isSubmitting, onShowSnackbar]);

  /**
   * UI-09-09: Penyedia jasa menekan tombol "Terima".
   * Memperbarui tampilan status kartu menjadi Diterima dan mengubah status pekerjaan menjadi On Progress.
   */
  const acceptContract =
    useCallback(async (): Promise<ContractRecord | null> => {
      if (!cleanPartnerId || !contract || isSubmitting) return null;
      if (contract.status !== 'MENUNGGU') return contract;

      setIsSubmitting(true);
      try {
        const targetId = contract.idKontrakPekerjaan || contract.idKontrak;
        const updated = await contractService.respondToContract(
          targetId,
          cleanPartnerId,
          true
        );
        setContract(updated);
        if (onShowSnackbar) {
          onShowSnackbar(
            'Kontrak diterima. Status pekerjaan kini On Progress.'
          );
        }
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal menyetujui kontrak pekerjaan.';
        if (onShowSnackbar) {
          onShowSnackbar(msg);
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    }, [cleanPartnerId, contract, isSubmitting, onShowSnackbar]);

  /**
   * UI-09-08: Penyedia jasa menekan tombol "Tolak".
   * Memperbarui tampilan status kartu menjadi Ditolak.
   */
  const rejectContract =
    useCallback(async (): Promise<ContractRecord | null> => {
      if (!cleanPartnerId || !contract || isSubmitting) return null;
      if (contract.status !== 'MENUNGGU') return contract;

      setIsSubmitting(true);
      try {
        const targetId = contract.idKontrakPekerjaan || contract.idKontrak;
        const updated = await contractService.respondToContract(
          targetId,
          cleanPartnerId,
          false
        );
        setContract(updated);
        if (onShowSnackbar) {
          onShowSnackbar('Kontrak pekerjaan telah ditolak.');
        }
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal menolak kontrak pekerjaan.';
        if (onShowSnackbar) {
          onShowSnackbar(msg);
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    }, [cleanPartnerId, contract, isSubmitting, onShowSnackbar]);

  return {
    contract,
    formValues,
    formErrors,
    isSubmitting,
    isLoadingContract,
    loadContract,
    inputDetailPekerjaan,
    kirimInput,
    acceptContract,
    rejectContract,
  };
}

export default useContractController;
