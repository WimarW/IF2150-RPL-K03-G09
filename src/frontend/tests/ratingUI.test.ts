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
  mapBackendKontrakToTransaction,
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

    it('memetakan format respon Prisma GET /api/kontrak ke CustomerTransactionItem dengan akurat', () => {
      const mapped = mapBackendKontrakToTransaction({
        idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440002',
        idPelanggan: '111e8400-e29b-41d4-a716-446655440001',
        idPemberiJasa: '222e8400-e29b-41d4-a716-446655440002',
        detailPekerjaan: 'Cuci & setrika · 3 kg',
        persetujuanHarga: 60000,
        statusPekerjaan: 'Done',
        hasRating: false,
        createdAt: '2026-05-08T09:10:00.000Z',
        pemberiJasa: {
          idPemberiJasa: '222e8400-e29b-41d4-a716-446655440002',
          pengguna: {
            namaPengguna: 'Siti Bersih',
          },
        },
        ratings: [],
      });

      expect(mapped.idKontrak).toBe('333e8400-e29b-41d4-a716-446655440002');
      expect(mapped.namaPenyedia).toBe('Siti Bersih');
      expect(mapped.inisialPenyedia).toBe('SB');
      expect(mapped.displayStatus).toBe('Selesai');
      expect(mapped.hasRating).toBe(false);
      expect(shouldShowBeriRatingButton(mapped)).toBe(true);
    });
  });
});

import {
  PROVIDER_RATING_TAG_OPTIONS,
  getRatingTagOptions,
  shouldShowProviderBeriRatingButton,
} from '../src/controllers/useRatingController';
import { extractPerUserRatingFromBackendRow } from '../src/services/contractService';

describe('UC10 dua arah: Penyedia Jasa memberi rating ke Pelanggan', () => {
  const baseRow = {
    idKontrakPekerjaan: 'kontrak-dua-arah',
    idPelanggan: 'pelanggan-1',
    idPemberiJasa: 'mitra-1',
    detailPekerjaan: 'Servis AC',
    persetujuanHarga: 150000,
    statusPekerjaan: 'Done',
    createdAt: '2026-05-12T07:20:00.000Z',
  };

  it('memakai tag khusus penyedia jasa dan tetap mempertahankan tag pelanggan', () => {
    expect(getRatingTagOptions('PEMBERI_JASA')).toEqual(PROVIDER_RATING_TAG_OPTIONS);
    expect(getRatingTagOptions('PELANGGAN')).toEqual(RATING_TAG_OPTIONS);
    expect(getRatingTagOptions()).toEqual(RATING_TAG_OPTIONS);
  });

  it('tombol "Beri Rating" penyedia hanya muncul saat Done dan penyedia belum menilai', () => {
    expect(shouldShowProviderBeriRatingButton({ statusPekerjaan: 'Done', hasRatedByMe: false })).toBe(true);
    expect(shouldShowProviderBeriRatingButton({ statusPekerjaan: 'Done', hasRatedByMe: true })).toBe(false);
    expect(
      shouldShowProviderBeriRatingButton({ statusPekerjaan: 'Menunggu Konfirmasi Pelanggan' })
    ).toBe(false);
  });

  it('rating dari pelanggan tidak dianggap sebagai rating milik penyedia', () => {
    const row = {
      ...baseRow,
      hasRating: true,
      ratings: [
        { idPenggunaPemberi: 'pelanggan-1', idPenggunaPenerima: 'mitra-1', nilaiRating: 5 },
      ],
    };
    const perUser = extractPerUserRatingFromBackendRow(row, 'mitra-1');
    expect(perUser.hasRatedByMe).toBe(false);
    expect(perUser.diterima?.nilaiRating).toBe(5);
    expect(perUser.diberikan).toBeNull();
  });

  it('mengutamakan field turunan backend hasRatedByMe & ratingDariSaya', () => {
    const perUser = extractPerUserRatingFromBackendRow(
      {
        ...baseRow,
        hasRatedByMe: true,
        ratingDariSaya: { nilaiRating: 4, ulasan: 'Komunikatif', tags: ['Komunikatif'] },
        ratingUntukSaya: null,
      },
      'mitra-1'
    );
    expect(perUser.hasRatedByMe).toBe(true);
    expect(perUser.diberikan?.nilaiRating).toBe(4);
  });

  it('riwayat pelanggan tetap menampilkan "Beri Rating" walau penyedia sudah menilai duluan', () => {
    const mapped = mapBackendKontrakToTransaction({
      ...baseRow,
      hasRating: true,
      ratings: [
        { idPenggunaPemberi: 'mitra-1', idPenggunaPenerima: 'pelanggan-1', nilaiRating: 4 },
      ],
    });
    expect(mapped.hasRating).toBe(false);
    expect(shouldShowBeriRatingButton(mapped)).toBe(true);
  });
});
