/// <reference types="jest" />

/**
 * Unit Test Integrasi Kontrak Pekerjaan & Riwayat Transaksi/Pekerjaan (UI-08, UI-09, UI-10, UI-12)
 * Traceability:
 * - UC05 (Pelanggan memasukkan kesepakatan harga dan pekerjaan)
 * - UC06 (Penyedia jasa menyelesaikan pekerjaan -> UI-12-07 "Pekerjaan Telah Selesai")
 * - UC07 (Pelanggan mengonfirmasi penyelesaian pekerjaan -> UI-10 "Konfirmasi Selesai")
 * - UC10 (Slot Beri Rating UI-10-06 & UI-11)
 * - Kelas DPPL C01, C02, C05, C08, C16, C17, C18
 * - Antarmuka UI-08, UI-09, UI-10 (UI-10-01 s.d. UI-10-06), UI-12 (UI-12-01 s.d. UI-12-07)
 */

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

import { setAuthToken } from '../src/services/api';
import {
  formatDetailPekerjaan,
  parseDetailPekerjaan,
  mapStatusPekerjaanToCardStatus,
  mapStatusPekerjaanToDisplayStatus,
  mapBackendToContractRecord,
  contractService,
  getCachedCustomerHistory,
  getCachedProviderHistory,
  resetMockContracts,
} from '../src/services/contractService';
import {
  formatHargaRibuan,
  parseHargaInput,
  sanitizeHargaInput,
  showKontrakForm,
  validateContractForm,
  filterCustomerTransactionsByTab,
  filterProviderJobsByTab,
  shouldShowKonfirmasiSelesaiButton,
  shouldShowLihatDetailButton,
  shouldShowBeriRatingButton,
  shouldShowPekerjaanSelesaiButton,
  shouldShowMenungguKonfirmasiLabel,
} from '../src/controllers/useContractController';

describe('Format & Parse detailPekerjaan (Jasa - Deskripsi)', () => {
  it('menggabungkan nama jenis jasa dan deskripsi pekerjaan dengan pemisah " - "', () => {
    expect(
      formatDetailPekerjaan('Bersih-bersih Rumah', 'Bersihin rumah wimar')
    ).toBe('Bersih-bersih Rumah - Bersihin rumah wimar');
  });

  it('memisahkan kembali detailPekerjaan menjadi jasa dan deskripsi', () => {
    const parsed = parseDetailPekerjaan(
      'Bersih-bersih Rumah - Bersihin rumah wimar'
    );
    expect(parsed).toEqual({
      jasa: 'Bersih-bersih Rumah',
      deskripsi: 'Bersihin rumah wimar',
    });
  });

  it('menggunakan fallbackJasa apabila detailPekerjaan tidak memiliki pemisah', () => {
    const parsed = parseDetailPekerjaan('Bersihin rumah wimar', 'Kebersihan');
    expect(parsed).toEqual({
      jasa: 'Kebersihan',
      deskripsi: 'Bersihin rumah wimar',
    });
  });
});

describe('Sanitasi, Format, dan Validasi Input Kontrak (UI-08-04 & UI-08-05)', () => {
  it('sanitizeHargaInput mengizinkan nilai 0 dan menghapus nol di depan angka positif', () => {
    expect(sanitizeHargaInput('0')).toBe('0');
    expect(sanitizeHargaInput('000')).toBe('0');
    expect(sanitizeHargaInput('0100000')).toBe('100000');
    expect(formatHargaRibuan('100000')).toBe('100.000');
    expect(formatHargaRibuan('0')).toBe('0');
    expect(parseHargaInput('100.000')).toBe(100000);
    expect(parseHargaInput('0')).toBe(0);
  });

  it('meloloskan validasi ketika harga >= 0 dan deskripsi tidak kosong (ALGO-039)', () => {
    const validZero = validateContractForm({
      jasa: 'Bersih-bersih Rumah',
      deskripsi: 'Bersihin rumah wimar',
      totalHarga: '0',
    });
    expect(validZero.isValid).toBe(true);
    expect(validZero.parsedHarga).toBe(0);

    const validPositive = validateContractForm(
      showKontrakForm('Bersih-bersih Rumah', 'Bersihin rumah wimar', 100000)
    );
    expect(validPositive.isValid).toBe(true);
    expect(validPositive.parsedHarga).toBe(100000);
  });

  it('menolak validasi apabila deskripsi kosong atau harga tidak valid / negatif', () => {
    const emptyDesc = validateContractForm({
      jasa: 'Bersih-bersih Rumah',
      deskripsi: '   ',
      totalHarga: '100000',
    });
    expect(emptyDesc.isValid).toBe(false);
    expect(emptyDesc.errors.deskripsi).toBeDefined();

    const invalidPrice = validateContractForm({
      jasa: 'Bersih-bersih Rumah',
      deskripsi: 'Bersihin rumah wimar',
      totalHarga: '-5000',
    });
    expect(invalidPrice.isValid).toBe(false);
    expect(invalidPrice.errors.totalHarga).toBeDefined();
  });
});

describe('Alur Pembuatan Kontrak (UI-08) & Persetujuan Penyedia Jasa (UI-09)', () => {
  beforeEach(() => {
    setAuthToken(null);
    resetMockContracts();
  });

  it('membuat kontrak baru dari sisi pelanggan dengan status Menunggu (UI-08-05 & UI-08-09)', async () => {
    const created = await contractService.createContract({
      partnerId: 'user-budi-wijaya',
      jasa: 'Servis AC',
      deskripsi: 'Cuci AC kamar lantai 2',
      totalHarga: 150000,
    });

    expect(created.jasa).toBe('Servis AC');
    expect(created.deskripsi).toBe('Cuci AC kamar lantai 2');
    expect(created.detailPekerjaan).toBe('Servis AC - Cuci AC kamar lantai 2');
    expect(created.totalHarga).toBe(150000);
    expect(created.status).toBe('MENUNGGU');
    expect(created.statusPekerjaan).toBe('Menunggu');
  });

  it('saat tombol Terima ditekan (UI-09-09), status kartu berubah menjadi DITERIMA dan status pekerjaan menjadi On Progress', async () => {
    const initial = await contractService.getContractByPartner(
      'user-naufal-hasbialhaq'
    );
    expect(initial).not.toBeNull();
    expect(initial?.status).toBe('MENUNGGU');

    const accepted = await contractService.respondToContract(
      initial!.idKontrak,
      'user-naufal-hasbialhaq',
      true
    );

    expect(accepted.status).toBe('DITERIMA');
    expect(accepted.statusPekerjaan).toBe('On Progress');

    // Pastikan tersinkronisasi juga ke sisi pelanggan (UI-08)
    const customerViewContract = await contractService.getContractByPartner(
      'user-budi-wijaya'
    );
    expect(customerViewContract?.status).toBe('DITERIMA');
    expect(customerViewContract?.statusPekerjaan).toBe('On Progress');
  });

  it('saat tombol Tolak ditekan (UI-09-08), status kartu berubah menjadi DITOLAK dan status pekerjaan menjadi Ditolak', async () => {
    const initial = await contractService.getContractByPartner(
      'user-naufal-hasbialhaq'
    );
    const rejected = await contractService.respondToContract(
      initial!.idKontrak,
      'user-naufal-hasbialhaq',
      false
    );

    expect(rejected.status).toBe('DITOLAK');
    expect(rejected.statusPekerjaan).toBe('Ditolak');
  });

  it('memetakan response backend KontrakPekerjaanDetail ke ContractRecord dengan benar', () => {
    expect(mapStatusPekerjaanToCardStatus('Menunggu')).toBe('MENUNGGU');
    expect(mapStatusPekerjaanToCardStatus('On Progress')).toBe('DITERIMA');
    expect(mapStatusPekerjaanToCardStatus('Ditolak')).toBe('DITOLAK');
    expect(mapStatusPekerjaanToDisplayStatus('On Progress')).toBe(
      'On Progress'
    );
    expect(
      mapStatusPekerjaanToDisplayStatus('Menunggu Konfirmasi Pelanggan')
    ).toBe('On Progress');
    expect(mapStatusPekerjaanToDisplayStatus('Done')).toBe('Selesai');
    expect(mapStatusPekerjaanToDisplayStatus('Dibatalkan')).toBe('Dibatalkan');

    const record = mapBackendToContractRecord({
      idKontrakPekerjaan: 'uuid-123',
      idPelanggan: 'cust-1',
      idPemberiJasa: 'prov-1',
      detailPekerjaan: 'Bersih-bersih Rumah - Bersihin rumah wimar',
      persetujuanHarga: 100000,
      statusPekerjaan: 'On Progress',
      hasRating: false,
      createdAt: '2026-05-12T14:28:00.000Z',
      expiresAt: null,
    });

    expect(record.idKontrak).toBe('uuid-123');
    expect(record.jasa).toBe('Bersih-bersih Rumah');
    expect(record.deskripsi).toBe('Bersihin rumah wimar');
    expect(record.totalHarga).toBe(100000);
    expect(record.status).toBe('DITERIMA');
    expect(record.statusPekerjaan).toBe('On Progress');
  });
});

describe('Layar Riwayat Pelanggan (UI-10) & Riwayat Pekerjaan Penyedia Jasa (UI-12)', () => {
  beforeEach(() => {
    setAuthToken(null);
    resetMockContracts();
  });

  it('memfilter daftar transaksi pelanggan (UI-10-02) berdasarkan chip Semua, Selesai, dan On Progress', () => {
    const allTx = getCachedCustomerHistory();
    expect(allTx.length).toBeGreaterThanOrEqual(4);

    const semua = filterCustomerTransactionsByTab(allTx, 'Semua');
    const selesai = filterCustomerTransactionsByTab(allTx, 'Selesai');
    const onProgress = filterCustomerTransactionsByTab(allTx, 'On Progress');

    expect(semua.length).toBe(allTx.length);
    expect(selesai.every((tx) => tx.statusDisplay === 'Selesai')).toBe(true);
    expect(onProgress.every((tx) => tx.statusDisplay === 'On Progress')).toBe(
      true
    );
  });

  it('memfilter daftar pekerjaan penyedia jasa (UI-12-03) berdasarkan chip Semua, Selesai, dan On Progress', () => {
    const allJobs = getCachedProviderHistory();
    expect(allJobs.length).toBeGreaterThanOrEqual(4);

    const semua = filterProviderJobsByTab(allJobs, 'Semua');
    const selesai = filterProviderJobsByTab(allJobs, 'Selesai');
    const onProgress = filterProviderJobsByTab(allJobs, 'On Progress');

    expect(semua.length).toBe(allJobs.length);
    expect(selesai.every((job) => job.statusDisplay === 'Selesai')).toBe(true);
    expect(onProgress.every((job) => job.statusDisplay === 'On Progress')).toBe(
      true
    );
  });

  it('mengatur visibilitas tombol UC06, UC07, Lihat Detail (UI-10-05), dan Beri Rating (UI-10-06) sesuai status', () => {
    // UC06: Tombol "Pekerjaan Telah Selesai" hanya muncul saat status murni 'On Progress'
    expect(shouldShowPekerjaanSelesaiButton('On Progress')).toBe(true);
    expect(
      shouldShowPekerjaanSelesaiButton('Menunggu Konfirmasi Pelanggan')
    ).toBe(false);
    expect(shouldShowPekerjaanSelesaiButton('Done')).toBe(false);

    // Label "Menunggu Konfirmasi" pada UI-12 muncul saat status 'Menunggu Konfirmasi Pelanggan'
    expect(
      shouldShowMenungguKonfirmasiLabel('Menunggu Konfirmasi Pelanggan')
    ).toBe(true);
    expect(shouldShowMenungguKonfirmasiLabel('On Progress')).toBe(false);

    // UC07: Tombol "Konfirmasi Selesai" pada UI-10 hanya muncul saat status 'Menunggu Konfirmasi Pelanggan'
    expect(
      shouldShowKonfirmasiSelesaiButton('Menunggu Konfirmasi Pelanggan')
    ).toBe(true);
    expect(shouldShowKonfirmasiSelesaiButton('On Progress')).toBe(false);
    expect(shouldShowKonfirmasiSelesaiButton('Done')).toBe(false);

    // UI-10-05 & UI-10-06: Tombol "Lihat Detail" dan "Beri Rating"
    expect(shouldShowLihatDetailButton('Done', 'Selesai')).toBe(true);
    expect(shouldShowBeriRatingButton('Done', false, 'Selesai')).toBe(true);
    expect(shouldShowBeriRatingButton('Done', true, 'Selesai')).toBe(false);
    expect(shouldShowBeriRatingButton('On Progress', false, 'On Progress')).toBe(
      false
    );
  });

  it('UC06 & UC07: menyinkronkan pelaporan selesai oleh penyedia jasa (UI-12-07) hingga konfirmasi selesai oleh pelanggan (UI-10) dan pemberian rating', async () => {
    // 1. Awalnya kontrak-001 berstatus 'On Progress'
    const beforeProvider = getCachedProviderHistory().find(
      (j) => j.idKontrak === 'kontrak-001'
    );
    expect(beforeProvider?.statusPekerjaan).toBe('On Progress');
    expect(
      shouldShowPekerjaanSelesaiButton(beforeProvider?.statusPekerjaan)
    ).toBe(true);

    // 2. Penyedia jasa menekan tombol "Pekerjaan Telah Selesai" (UC06)
    const afterReport = await contractService.completeWorkByProvider(
      'kontrak-001'
    );
    expect(afterReport.statusPekerjaan).toBe('Menunggu Konfirmasi Pelanggan');

    // Di UI-12 berubah menjadi "Menunggu Konfirmasi"
    const providerJobWaiting = getCachedProviderHistory().find(
      (j) => j.idKontrak === 'kontrak-001'
    );
    expect(
      shouldShowMenungguKonfirmasiLabel(providerJobWaiting?.statusPekerjaan)
    ).toBe(true);

    // Di UI-10 muncul tombol "Konfirmasi Selesai" (UC07)
    const customerTxWaiting = getCachedCustomerHistory().find(
      (tx) => tx.idKontrak === 'kontrak-001'
    );
    expect(
      shouldShowKonfirmasiSelesaiButton(customerTxWaiting?.statusPekerjaan)
    ).toBe(true);

    // 3. Pelanggan menekan tombol "Konfirmasi Selesai" (UC07)
    const afterConfirm = await contractService.confirmWorkByCustomer(
      'kontrak-001'
    );
    expect(afterConfirm.statusPekerjaan).toBe('Done');

    // Di UI-10 status menjadi 'Selesai' dan tombol "Beri Rating" (UI-10-06) aktif
    const customerTxDone = getCachedCustomerHistory().find(
      (tx) => tx.idKontrak === 'kontrak-001'
    );
    expect(customerTxDone?.statusDisplay).toBe('Selesai');
    expect(
      shouldShowBeriRatingButton(
        customerTxDone?.statusPekerjaan,
        customerTxDone?.hasRating,
        customerTxDone?.statusDisplay
      )
    ).toBe(true);

    // 4. Pelanggan memberikan rating (UC10)
    await contractService.submitContractRating({
      idKontrak: 'kontrak-001',
      idPemberiJasa: 'pj-budi-001',
      nilaiRating: 5,
      komentar: 'Sangat bersih dan tepat waktu',
    });

    const customerTxRated = getCachedCustomerHistory().find(
      (tx) => tx.idKontrak === 'kontrak-001'
    );
    expect(customerTxRated?.hasRating).toBe(true);
    expect(
      shouldShowBeriRatingButton(
        customerTxRated?.statusPekerjaan,
        customerTxRated?.hasRating,
        customerTxRated?.statusDisplay
      )
    ).toBe(false);

    const providerJobRated = getCachedProviderHistory().find(
      (j) => j.idKontrak === 'kontrak-001'
    );
    expect(providerJobRated?.statusDisplay).toBe('Selesai');
    expect(providerJobRated?.nilaiRating).toBe(5);
  });

  it('terhubung dengan endpoint backend GET /api/kontrak, PATCH /api/kontrak/:id/selesai, dan PATCH /api/kontrak/:id/konfirmasi saat token autentikasi tersedia', async () => {
    const originalFetchDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'fetch'
    );
    const mockFetch = jest.fn();
    Object.defineProperty(globalThis, 'fetch', {
      value: mockFetch,
      writable: true,
      configurable: true,
    });

    try {
      setAuthToken('jwt-token-test');

      // 1. Mock GET /api/kontrak
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: [
              {
                idKontrakPekerjaan: 'kontrak-be-101',
                idPelanggan: 'cust-101',
                idPemberiJasa: 'prov-101',
                detailPekerjaan: 'Servis AC - Cuci AC 2 unit',
                persetujuanHarga: 120000,
                statusPekerjaan: 'On Progress',
                createdAt: '2026-05-12T07:20:00.000Z',
                pelanggan: {
                  idPengguna: 'cust-101',
                  namaPengguna: 'Naufal Hasbialhaq',
                },
                pemberiJasa: {
                  idPemberiJasa: 'prov-101',
                  namaToko: 'Budi Teknik',
                  jenisJasa: 'Servis AC',
                  pengguna: {
                    idPengguna: 'user-prov-101',
                    namaPengguna: 'Budi Wijaya',
                  },
                },
                rating: null,
              },
            ],
          }),
      });

      const historyFromBe = await contractService.fetchContractHistory();
      expect(historyFromBe).toHaveLength(1);
      expect(historyFromBe[0].idKontrak).toBe('kontrak-be-101');
      expect(historyFromBe[0].statusPekerjaan).toBe('On Progress');

      // 2. Mock PATCH /api/kontrak/kontrak-be-101/selesai (UC06)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: {
              idKontrakPekerjaan: 'kontrak-be-101',
              idPelanggan: 'cust-101',
              idPemberiJasa: 'prov-101',
              detailPekerjaan: 'Servis AC - Cuci AC 2 unit',
              persetujuanHarga: 120000,
              statusPekerjaan: 'Menunggu Konfirmasi Pelanggan',
              createdAt: '2026-05-12T07:20:00.000Z',
            },
          }),
      });

      const completedBe = await contractService.completeWorkByProvider(
        'kontrak-be-101'
      );
      expect(completedBe.statusPekerjaan).toBe('Menunggu Konfirmasi Pelanggan');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/kontrak/kontrak-be-101/selesai'),
        expect.objectContaining({ method: 'PATCH' })
      );

      // 3. Mock PATCH /api/kontrak/kontrak-be-101/konfirmasi (UC07)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: {
              idKontrakPekerjaan: 'kontrak-be-101',
              idPelanggan: 'cust-101',
              idPemberiJasa: 'prov-101',
              detailPekerjaan: 'Servis AC - Cuci AC 2 unit',
              persetujuanHarga: 120000,
              statusPekerjaan: 'Done',
              createdAt: '2026-05-12T07:20:00.000Z',
            },
          }),
      });

      const confirmedBe = await contractService.confirmWorkByCustomer(
        'kontrak-be-101'
      );
      expect(confirmedBe.statusPekerjaan).toBe('Done');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/kontrak/kontrak-be-101/konfirmasi'),
        expect.objectContaining({ method: 'PATCH' })
      );
    } finally {
      if (originalFetchDescriptor) {
        Object.defineProperty(globalThis, 'fetch', originalFetchDescriptor);
      }
      setAuthToken(null);
    }
  });
});
