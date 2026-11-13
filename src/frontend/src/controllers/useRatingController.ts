import { useCallback, useMemo, useState } from 'react';
import {
  CreateRatingPayload,
  CustomerTransactionItem,
  HistoryFilterTab,
  RatingTag,
  submitRating,
  verifyContractForRating,
} from '../services/ratingService';

export const RATING_PREDICATE_LABELS: Record<number, string> = {
  1: 'Sangat Buruk',
  2: 'Buruk',
  3: 'Cukup',
  4: 'Baik',
  5: 'Sangat Baik',
};

export const RATING_TAG_OPTIONS: RatingTag[] = [
  'Tepat Waktu',
  'Kerja Bersih',
  'Ramah',
];

/**
 * Mengembalikan teks predikat dinamis sesuai jumlah bintang (UI-11-05).
 */
export function getRatingPredicate(nilaiRating: number): string {
  return RATING_PREDICATE_LABELS[nilaiRating] ?? 'Pilih bintang penilaian';
}

/**
 * Validasi input rating sesuai spesifikasi kelas C27 RatingController pada DPPL:
 * - idPemberi, idPenerima, dan idKontrak tidak boleh kosong
 * - idPemberi !== idPenerima
 * - nilaiRating merupakan bilangan bulat pada rentang 1..5
 */
export function validateRatingInput(
  idPemberi: string,
  idPenerima: string,
  idKontrak: string,
  nilaiRating: number
): boolean {
  if (!idPemberi?.trim() || !idPenerima?.trim() || !idKontrak?.trim()) {
    return false;
  }
  if (idPemberi.trim() === idPenerima.trim()) {
    return false;
  }
  if (!Number.isInteger(nilaiRating) || nilaiRating < 1 || nilaiRating > 5) {
    return false;
  }
  return true;
}

/**
 * Toggle multi-pilih chip tag penilaian (UI-11-07).
 */
export function toggleRatingTag(
  currentTags: string[],
  tag: string
): string[] {
  if (currentTags.includes(tag)) {
    return currentTags.filter((item) => item !== tag);
  }
  return [...currentTags, tag];
}

/**
 * Menentukan apakah tombol "Kirim Penilaian" (UI-11-08) aktif.
 */
export function isSubmitRatingEnabled(
  nilaiRating: number,
  isSubmitting = false
): boolean {
  return (
    !isSubmitting &&
    Number.isInteger(nilaiRating) &&
    nilaiRating >= 1 &&
    nilaiRating <= 5
  );
}

/**
 * Memfilter daftar transaksi pada layar Riwayat Pelanggan (UI-10-02).
 */
export function filterTransactionsByTab(
  transactions: CustomerTransactionItem[],
  activeTab: HistoryFilterTab
): CustomerTransactionItem[] {
  if (activeTab === 'Semua') {
    return transactions;
  }
  if (activeTab === 'Selesai') {
    return transactions.filter(
      (item) =>
        item.statusPekerjaan === 'Done' || item.displayStatus === 'Selesai'
    );
  }
  if (activeTab === 'On Progress') {
    return transactions.filter(
      (item) =>
        item.statusPekerjaan === 'In Progress' ||
        item.statusPekerjaan === 'Completed' ||
        item.displayStatus === 'On Progress'
    );
  }
  return transactions;
}

/**
 * Menentukan apakah tombol "Beri Rating" (UI-10-06) ditampilkan pada kartu riwayat.
 * Hanya muncul jika kontrak berstatus Selesai (`Done`) dan belum dinilai (`hasRating === false`).
 */
export function shouldShowBeriRatingButton(
  transaction: Pick<
    CustomerTransactionItem,
    'statusPekerjaan' | 'displayStatus' | 'hasRating'
  >
): boolean {
  const isCompleted =
    transaction.statusPekerjaan === 'Done' ||
    transaction.displayStatus === 'Selesai';
  return isCompleted && !transaction.hasRating;
}

export interface UseRatingControllerParams {
  idKontrakPekerjaan: string;
  idPenggunaPemberi?: string;
  idPenggunaPenerima: string;
  namaPenerima: string;
  detailPekerjaan: string;
  initialStars?: number;
  token?: string;
  onSuccess?: (result: {
    idKontrakPekerjaan: string;
    nilaiRating: number;
    ulasan: string;
    tags: string[];
    message: string;
  }) => void;
  onCancel?: () => void;
}

/**
 * Hook controller untuk C26 RatingUI & C27 RatingController (`UC10` Memberi Rating).
 */
export function useRatingController({
  idKontrakPekerjaan,
  idPenggunaPemberi = 'pelanggan-001',
  idPenggunaPenerima,
  initialStars = 0,
  token,
  onSuccess,
  onCancel,
}: UseRatingControllerParams) {
  const [nilaiRating, setNilaiRating] = useState<number>(initialStars);
  const [ulasan, setUlasan] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const predikatLabel = useMemo(
    () => getRatingPredicate(nilaiRating),
    [nilaiRating]
  );

  const canSubmit = useMemo(
    () => isSubmitRatingEnabled(nilaiRating, isSubmitting),
    [nilaiRating, isSubmitting]
  );

  /**
   * Metode C26 RatingUI: `pressJumlahBintang(bintang: int)`
   */
  const pressJumlahBintang = useCallback((bintang: number) => {
    if (bintang >= 1 && bintang <= 5) {
      setNilaiRating(bintang);
      setErrorMessage(null);
    }
  }, []);

  /**
   * Mengubah isi text area ulasan pengalaman (UI-11-06).
   */
  const onChangeUlasan = useCallback((text: string) => {
    setUlasan(text);
  }, []);

  /**
   * Memilih / membatalkan chip tag opsional (UI-11-07).
   */
  const pressTagChip = useCallback((tag: string) => {
    setSelectedTags((prev) => toggleRatingTag(prev, tag));
  }, []);

  /**
   * Metode C26 RatingUI: `pressBatalRating()` (`UC10` Skenario Alternatif 1)
   * Menutup form/modal penilaian tanpa menghilangkan hak pengguna untuk menilai dari Riwayat.
   */
  const pressBatalRating = useCallback(() => {
    setErrorMessage(null);
    onCancel?.();
  }, [onCancel]);

  /**
   * Metode C26 RatingUI: `pressSubmitRating(nilaiRating: int, ulasan: string)`
   */
  const pressSubmitRating = useCallback(async (): Promise<boolean> => {
    const isValid = validateRatingInput(
      idPenggunaPemberi,
      idPenggunaPenerima,
      idKontrakPekerjaan,
      nilaiRating
    );

    if (!isValid) {
      setErrorMessage('Pilih 1 hingga 5 bintang sebelum mengirim penilaian.');
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const verification = await verifyContractForRating(
        idKontrakPekerjaan,
        token
      );
      if (!verification.canRate) {
        setErrorMessage(
          verification.message ||
            'Transaksi ini tidak dapat dinilai atau sudah dinilai.'
        );
        return false;
      }

      const payload: CreateRatingPayload = {
        idKontrakPekerjaan,
        idPenggunaPenerima,
        nilaiRating,
        ulasan: ulasan.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const response = await submitRating(payload, token);
      if (!response.success) {
        setErrorMessage(response.message || 'Gagal menyimpan penilaian.');
        return false;
      }

      onSuccess?.({
        idKontrakPekerjaan,
        nilaiRating,
        ulasan: ulasan.trim(),
        tags: selectedTags,
        message: response.message || 'Rating berhasil disimpan',
      });
      return true;
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Terjadi kesalahan saat mengirim penilaian.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    idPenggunaPemberi,
    idPenggunaPenerima,
    idKontrakPekerjaan,
    nilaiRating,
    ulasan,
    selectedTags,
    token,
    onSuccess,
  ]);

  const resetForm = useCallback((stars = 0) => {
    setNilaiRating(stars);
    setUlasan('');
    setSelectedTags([]);
    setErrorMessage(null);
  }, []);

  return {
    nilaiRating,
    ulasan,
    selectedTags,
    predikatLabel,
    canSubmit,
    isSubmitting,
    errorMessage,
    pressJumlahBintang,
    onChangeUlasan,
    pressTagChip,
    pressBatalRating,
    pressSubmitRating,
    resetForm,
  };
}
