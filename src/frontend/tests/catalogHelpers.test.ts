/// <reference types="jest" />

/**
 * [Naufal Hasbialhaq] Unit Test Fungsi Murni Katalog & Pencarian Jasa
 * Traceability: UC02 (Skenario Normal & Alternatif 1), KF01, KF02, KF03, KF08,
 * Kelas DPPL C06 PemberiJasaController, C15 KategoriJasaController, Antarmuka UI-04, UI-05, UI-06
 */

jest.mock('expo-location', () => ({
  Accuracy: {
    Balanced: 3,
  },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
}));

import {
  buildSearchQuery,
  KategoriJasaRecord,
  PemberiJasaDetail,
} from '../src/services/serviceCatalogService';
import {
  filterAvailableProviders,
  filterKategoriJasa,
  formatJarak,
  formatRating,
  formatTanggalPesanan,
  getInitials,
  isProviderAvailable,
} from '../src/controllers/useCatalogController';

function createMockProvider(
  overrides: Partial<PemberiJasaDetail> = {}
): PemberiJasaDetail {
  return {
    idPemberiJasa: '222e8400-e29b-41d4-a716-446655440001',
    namaPengguna: 'Ahmad Teknik',
    namaToko: 'Ahmad Jaya AC',
    nomorTelpon: '081298765431',
    email: 'ahmad@cariuang.id',
    avatarUrl: null,
    akumulasiRating: 4.9,
    idKategoriJasa: '550e8400-e29b-41d4-a716-446655440002',
    jenisJasa: 'Perbaikan Elektronik & AC',
    deskripsiJasa: 'Servis AC dan elektronik rumah tangga',
    tarif: 120000,
    jamKerja: '09:00 - 20:00',
    daerahKerja: 'Kota Bandung',
    latitude: -6.8915,
    longitude: 107.6107,
    statusKetersediaan: 'Available',
    isOnline: true,
    jarakKm: 1.2,
    ...overrides,
  };
}

describe('buildSearchQuery', () => {
  it('mengembalikan string kosong ketika parameter kosong', () => {
    expect(buildSearchQuery({})).toBe('');
  });

  it('melakukan trim dan URL-encode pada keyword', () => {
    expect(buildSearchQuery({ keyword: '  cuci baju  ' })).toBe(
      '?q=cuci%20baju'
    );
  });

  it('melewati nilai NaN, undefined, dan radiusKm <= 0 serta menyertakan sortBy', () => {
    const query = buildSearchQuery({
      keyword: 'servis',
      idKategoriJasa: undefined,
      lat: Number.NaN,
      long: 107.6107,
      radiusKm: 0,
      sortBy: 'terdekat',
    });

    expect(query).toBe('?q=servis&long=107.6107&sortBy=terdekat');
  });
});

describe('getInitials', () => {
  it('mengambil huruf depan dua kata pertama untuk nama multi-kata', () => {
    expect(getInitials('Juan Bengkel')).toBe('JB');
  });

  it('mengambil dua karakter pertama untuk nama satu kata', () => {
    expect(getInitials('Nick')).toBe('NI');
  });

  it('mengembalikan tanda tanya untuk string kosong', () => {
    expect(getInitials('')).toBe('?');
    expect(getInitials('   ')).toBe('?');
  });
});

describe('formatJarak', () => {
  it('mengembalikan tanda strip untuk nilai null atau tidak valid', () => {
    expect(formatJarak(null)).toBe('–');
    expect(formatJarak(undefined)).toBe('–');
    expect(formatJarak(-1)).toBe('–');
  });

  it('memformat jarak di bawah 10 km dengan 1 angka desimal', () => {
    expect(formatJarak(0.84)).toBe('0.8 km');
  });

  it('membulatkan jarak 10 km ke atas menjadi bilangan bulat', () => {
    expect(formatJarak(12.6)).toBe('13 km');
  });
});

describe('formatRating', () => {
  it('mengembalikan "Baru" untuk rating 0 atau belum ada penilaian', () => {
    expect(formatRating(0)).toBe('Baru');
    expect(formatRating(null)).toBe('Baru');
  });

  it('memformat rating positif menjadi 1 angka desimal', () => {
    expect(formatRating(4.85)).toBe('4.9');
  });
});

describe('isProviderAvailable & filterAvailableProviders', () => {
  it('meloloskan status "Available" dan " available " (case-insensitive & trim)', () => {
    const p1 = createMockProvider({
      idPemberiJasa: 'p1',
      statusKetersediaan: 'Available',
    });
    const p2 = createMockProvider({
      idPemberiJasa: 'p2',
      statusKetersediaan: ' available ',
    });
    const p3 = createMockProvider({
      idPemberiJasa: 'p3',
      statusKetersediaan: 'On Progress',
    });

    expect(isProviderAvailable(p1)).toBe(true);
    expect(isProviderAvailable(p2)).toBe(true);
    expect(isProviderAvailable(p3)).toBe(false);

    const filtered = filterAvailableProviders([p1, p2, p3]);
    expect(filtered.map((item) => item.idPemberiJasa)).toEqual(['p1', 'p2']);
  });
});

describe('filterKategoriJasa', () => {
  const sampleBackendCategories: KategoriJasaRecord[] = [
    {
      idKategoriJasa: 'kat-1',
      jenisJasa: 'Cuci Baju Kilat',
      deskripsiJasa: 'Laundry kilat 1 hari beres',
      tarif: 50000,
      jamKerja: '08:00 - 20:00',
      daerahKerja: 'Coblong',
    },
    {
      idKategoriJasa: 'kat-2',
      jenisJasa: 'Jasa Cuci Mobil',
      deskripsiJasa: 'Cuci mobil panggilan',
      tarif: 80000,
      jamKerja: '08:00 - 17:00',
      daerahKerja: 'Dago',
    },
  ];

  it('menyaring label yang mengandung "cuci", memprioritaskan awalan "cuci", dan bebas duplikat', () => {
    const results = filterKategoriJasa('cuci', sampleBackendCategories, 10);

    expect(results.length).toBeGreaterThan(0);
    for (const item of results) {
      expect(item.label.toLowerCase()).toContain('cuci');
    }

    // Item pertama harus diawali dengan "cuci" (skor 0)
    expect(results[0].label.toLowerCase().startsWith('cuci')).toBe(true);

    // Pastikan tidak ada duplikat case-insensitive (mis. 'Jasa Cuci Mobil')
    const normalizedLabels = results.map((r) => r.label.toLowerCase().trim());
    const uniqueLabels = new Set(normalizedLabels);
    expect(normalizedLabels.length).toBe(uniqueLabels.size);
  });

  it('mengembalikan kategori populer ketika kriteria kosong', () => {
    const results = filterKategoriJasa('', sampleBackendCategories);
    const labels = results.map((r) => r.label);

    expect(labels).toContain('Servis');
    expect(labels).toContain('Kebersihan');
    expect(labels).not.toContain('Lainnya');
  });
});

describe('formatTanggalPesanan', () => {
  it('memformat string ISO valid ke pola "<tgl> <Bulan> <tahun> · HH.MM"', () => {
    const formatted = formatTanggalPesanan('2026-05-12T14:20:00');
    expect(formatted).toMatch(
      /^\d{1,2}\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4}\s+·\s+\d{2}\.\d{2}$/
    );
    expect(formatted).toBe('12 Mei 2026 · 14.20');
  });

  it('mengembalikan string kosong untuk ISO tidak valid atau kosong', () => {
    expect(formatTanggalPesanan('bukan-tanggal')).toBe('');
    expect(formatTanggalPesanan('')).toBe('');
  });
});
