/// <reference types="jest" />

import {
  RATING_PREDICATE_LABELS,
  RATING_TAG_OPTIONS,
  filterTransactionsByTab,
  getRatingPredicate,
  isSubmitRatingEnabled,
  shouldShowBeriRatingButton,
  toggleRatingTag,
  validateRatingInput,
} from '../src/controllers/useRatingController';
import {
  confirmContractCompletion,
  getCustomerTransactionsSnapshot,
  resetCustomerTransactionsStore,
  submitRating,
  verifyContractForRating,
} from '../src/services/ratingService';

describe('UI-11 Beri Penilaian & UI-10 Riwayat Pelanggan (UC10)', () => {
  beforeEach(() => {
    resetCustomerTransactionsStore();
  });

  describe('UI-11-04 & UI-11-05: Rating Bar 5 Bintang & Label Predikat Dinamis', () => {
    it('mengembalikan teks predikat yang tepat untuk bintang 1 sampai 5', () => {
      expect(getRatingPredicate(1)).toBe('Sangat Buruk');
      expect(getRatingPredicate(2)).toBe('Buruk');
      expect(getRatingPredicate(3)).toBe('Cukup');
      expect(getRatingPredicate(4)).toBe('Baik');
      expect(getRatingPredicate(5)).toBe('Sangat Baik');
      expect(Object.keys(RATING_PREDICATE_LABELS)).toHaveLength(5);
    });

    it('mengembalikan instruksi default saat belum ada bintang dipilih (0 bintang)', () => {
      expect(getRatingPredicate(0)).toBe('Pilih bintang penilaian');
    });
  });

  describe('UI-11-07: Chip Tag Multi-Pilih', () => {
    it('menyediakan pilihan tag standar sesuai spesifikasi UI-11', () => {
      expect(RATING_TAG_OPTIONS).toEqual([
        'Tepat Waktu',
        'Kerja Bersih',
        'Ramah',
      ]);
    });

    it('mendukung pemilihan lebih dari satu tag dan pembatalan tag (toggle)', () => {
      let selected: string[] = [];
      selected = toggleRatingTag(selected, 'Tepat Waktu');
      selected = toggleRatingTag(selected, 'Kerja Bersih');
      expect(selected).toEqual(['Tepat Waktu', 'Kerja Bersih']);

      selected = toggleRatingTag(selected, 'Tepat Waktu');
      expect(selected).toEqual(['Kerja Bersih']);
    });
  });

  describe('UI-11-08 & C27 RatingController: Validasi & Aktivasi Tombol Kirim Penilaian', () => {
    it('menonaktifkan tombol Kirim Penilaian saat nilai rating 0 atau sedang submit', () => {
      expect(isSubmitRatingEnabled(0, false)).toBe(false);
      expect(isSubmitRatingEnabled(5, true)).toBe(false);
      expect(isSubmitRatingEnabled(1, false)).toBe(true);
      expect(isSubmitRatingEnabled(5, false)).toBe(true);
    });

    it('memvalidasi rentang bintang 1-5 serta identitas pengirim dan penerima', () => {
      expect(
        validateRatingInput('pelanggan-1', 'penyedia-1', 'kontrak-1', 5)
      ).toBe(true);
      expect(
        validateRatingInput('pelanggan-1', 'penyedia-1', 'kontrak-1', 0)
      ).toBe(false);
      expect(
        validateRatingInput('pelanggan-1', 'penyedia-1', 'kontrak-1', 6)
      ).toBe(false);
      expect(
        validateRatingInput('pengguna-sama', 'pengguna-sama', 'kontrak-1', 4)
      ).toBe(false);
    });
  });

  describe('UI-10 & UC10 Skenario Normal + Skenario Alternatif 1', () => {
    it('memfilter transaksi berdasarkan tab Semua, Selesai, dan On Progress (UI-10-02)', () => {
      const allItems = getCustomerTransactionsSnapshot();
      expect(filterTransactionsByTab(allItems, 'Semua')).toHaveLength(3);
      expect(filterTransactionsByTab(allItems, 'Selesai')).toHaveLength(1);
      expect(filterTransactionsByTab(allItems, 'On Progress')).toHaveLength(1);
    });

    it('menampilkan tombol Beri Rating (UI-10-06) hanya untuk kontrak Selesai yang belum dinilai', () => {
      const items = getCustomerTransactionsSnapshot();
      const onProgressItem = items.find((i) => i.idKontrak === 'kontrak-001')!;
      const doneUnratedItem = items.find((i) => i.idKontrak === 'kontrak-002')!;
      const cancelledItem = items.find((i) => i.idKontrak === 'kontrak-003')!;

      expect(shouldShowBeriRatingButton(onProgressItem)).toBe(false);
      expect(shouldShowBeriRatingButton(doneUnratedItem)).toBe(true);
      expect(shouldShowBeriRatingButton(cancelledItem)).toBe(false);
    });

    it('mendukung Skenario Normal & Alternatif 1 UC10: konfirmasi selesai membuka hak rating, dan menutup popup tidak menghilangkan tombol Beri Rating', async () => {
      // Skenario Normal: kontrak-001 dikonfirmasi selesai -> status menjadi Done & belum dinilai
      const confirmed = await confirmContractCompletion('kontrak-001');
      expect(confirmed?.statusPekerjaan).toBe('Done');
      expect(confirmed?.displayStatus).toBe('Selesai');
      expect(confirmed?.hasRating).toBe(false);

      // Skenario Alternatif 1: pengguna menutup popup rating tanpa submit -> tombol Beri Rating tetap tampil di UI-10
      expect(shouldShowBeriRatingButton(confirmed!)).toBe(true);
      const verification = await verifyContractForRating('kontrak-001');
      expect(verification.canRate).toBe(true);
    });

    it('menyembunyikan tombol Beri Rating di UI-10 seketika setelah penilaian berhasil dikirim', async () => {
      const response = await submitRating({
        idKontrakPekerjaan: 'kontrak-002',
        idPenggunaPenerima: 'penyedia-siti-002',
        nilaiRating: 5,
        ulasan: 'Pekerjaan sangat rapi dan ramah',
        tags: ['Tepat Waktu', 'Kerja Bersih'],
      });

      expect(response.success).toBe(true);

      const updatedList = getCustomerTransactionsSnapshot();
      const ratedContract = updatedList.find(
        (item) => item.idKontrak === 'kontrak-002'
      )!;

      expect(ratedContract.hasRating).toBe(true);
      expect(ratedContract.nilaiRatingDiberikan).toBe(5);
      expect(shouldShowBeriRatingButton(ratedContract)).toBe(false);
    });
  });
});
