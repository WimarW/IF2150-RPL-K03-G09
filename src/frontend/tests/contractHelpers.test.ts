/// <reference types="jest" />

/**
 * Unit Test Integrasi Kontrak Pekerjaan pada Ruang Obrolan Pelanggan (UI-08) & Penyedia Jasa (UI-09)
 * Traceability:
 * - UC05 (Pelanggan memasukkan kesepakatan harga dan pekerjaan)
 * - Kelas DPPL C16 KontrakPekerjaan, C17 KontrakPekerjaanUI, C18 KontrakPekerjaanController
 * - Antarmuka UI-08 (UI-08-04, UI-08-05, UI-08-09)
 * - Antarmuka UI-09 (UI-09-06, UI-09-07, UI-09-08, UI-09-09)
 */

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

import {
  formatDetailPekerjaan,
  parseDetailPekerjaan,
  mapStatusPekerjaanToCardStatus,
  mapBackendToContractRecord,
  contractService,
  resetMockContracts,
} from '../src/services/contractService';
import {
  formatHargaRibuan,
  parseHargaInput,
  sanitizeHargaInput,
  showKontrakForm,
  validateContractForm,
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
