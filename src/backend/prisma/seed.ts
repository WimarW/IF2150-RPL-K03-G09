import bcrypt from 'bcrypt';
import prisma from '../src/database/prisma';
import { Role } from '@prisma/client';

async function main() {
  console.log('🌱 Memulai proses seeding database CariUang dengan format UUID...');

  const defaultPasswordHash = await bcrypt.hash('PasswordAman123', 10);

  // 1. Seed Kategori Jasa (UUID)
  const kategoriList = [
    {
      idKategoriJasa: '550e8400-e29b-41d4-a716-446655440001',
      jenisJasa: 'Jasa Kebersihan Rumah',
      deskripsiJasa: 'Layanan bersih-bersih rumah, kos, dan apartemen menyeluruh.',
      tarif: 75000,
      jamKerja: '08:00 - 17:00',
      daerahKerja: 'Coblong, Dago, Bandung Utara',
    },
    {
      idKategoriJasa: '550e8400-e29b-41d4-a716-446655440002',
      jenisJasa: 'Perbaikan Elektronik & AC',
      deskripsiJasa: 'Servis cuci AC, perbaikan kulkas, mesin cuci, dan instalasi listrik.',
      tarif: 120000,
      jamKerja: '09:00 - 20:00',
      daerahKerja: 'Seluruh Kota Bandung',
    },
    {
      idKategoriJasa: '550e8400-e29b-41d4-a716-446655440003',
      jenisJasa: 'Tukang Ledeng & Pipa',
      deskripsiJasa: 'Perbaikan pipa bocor, saluran mampet, dan pemasangan pompa air.',
      tarif: 95000,
      jamKerja: '07:00 - 18:00',
      daerahKerja: 'Buah Batu, Lengkong, Bandung Selatan',
    },
  ];

  for (const kat of kategoriList) {
    await prisma.kategoriJasa.upsert({
      where: { idKategoriJasa: kat.idKategoriJasa },
      update: kat,
      create: kat,
    });
  }

  // 2. Seed Pengguna: Pelanggan (UUID)
  const idPelangganSeed = '111e8400-e29b-41d4-a716-446655440001';
  const pelanggan = await prisma.pengguna.upsert({
    where: { username: 'budi_pelanggan' },
    update: {
      email: 'budi@pelanggan.com',
      password: defaultPasswordHash,
    },
    create: {
      idPengguna: idPelangganSeed,
      namaPengguna: 'Budi Santoso',
      username: 'budi_pelanggan',
      password: defaultPasswordHash,
      email: 'budi@pelanggan.com',
      nomorTelpon: '081234567890',
      role: Role.PELANGGAN,
      akumulasiRating: 4.8,
      riwayatRating: [5.0, 4.6],
    },
  });

  const actualPelangganId = pelanggan.idPengguna;

  // 3. Seed Pengguna & Pemberi Jasa (UUID + koordinat GPS sekitar Bandung)
  const providers = [
    {
      idPemberiJasa: '222e8400-e29b-41d4-a716-446655440001',
      namaPengguna: 'Ahmad Teknik',
      username: 'ahmad_teknik',
      email: 'ahmad@cariuang.id',
      nomorTelpon: '081298765431',
      akumulasiRating: 4.9,
      riwayatRating: [5.0, 4.8, 4.9],
      namaToko: 'Ahmad Jaya AC & Elektronik',
      idKategoriJasa: '550e8400-e29b-41d4-a716-446655440002',
      jenisJasa: 'Perbaikan Elektronik & AC',
      latitude: -6.8915, // Sekitar ITB Ganesha / Dago
      longitude: 107.6107,
    },
    {
      idPemberiJasa: '222e8400-e29b-41d4-a716-446655440002',
      namaPengguna: 'Siti Bersih',
      username: 'siti_clean',
      email: 'siti@cariuang.id',
      nomorTelpon: '081298765432',
      akumulasiRating: 4.7,
      riwayatRating: [4.7],
      namaToko: 'Kinclong Home Cleaning',
      idKategoriJasa: '550e8400-e29b-41d4-a716-446655440001',
      jenisJasa: 'Jasa Kebersihan Rumah',
      latitude: -6.8850, // Sekitar Cisitu / Coblong
      longitude: 107.6135,
    },
    {
      idPemberiJasa: '222e8400-e29b-41d4-a716-446655440003',
      namaPengguna: 'Kang Dedi Pipa',
      username: 'dedi_ledeng',
      email: 'dedi@cariuang.id',
      nomorTelpon: '081298765433',
      akumulasiRating: 4.5,
      riwayatRating: [4.5],
      namaToko: 'Dedi Plumbing Bandung',
      idKategoriJasa: '550e8400-e29b-41d4-a716-446655440003',
      jenisJasa: 'Tukang Ledeng & Pipa',
      latitude: -6.9430, // Sekitar Buah Batu
      longitude: 107.6335,
    },
  ];

  const providerIdMap: Record<string, string> = {};

  for (const prov of providers) {
    const userProv = await prisma.pengguna.upsert({
      where: { username: prov.username },
      update: {
        password: defaultPasswordHash,
        akumulasiRating: prov.akumulasiRating,
        riwayatRating: prov.riwayatRating,
      },
      create: {
        idPengguna: prov.idPemberiJasa,
        namaPengguna: prov.namaPengguna,
        username: prov.username,
        password: defaultPasswordHash,
        email: prov.email,
        nomorTelpon: prov.nomorTelpon,
        role: Role.PEMBERI_JASA,
        akumulasiRating: prov.akumulasiRating,
        riwayatRating: prov.riwayatRating,
      },
    });

    const pemberi = await prisma.pemberiJasa.upsert({
      where: { idPemberiJasa: userProv.idPengguna },
      update: {
        namaToko: prov.namaToko,
        idKategoriJasa: prov.idKategoriJasa,
        jenisJasa: prov.jenisJasa,
        latitude: prov.latitude,
        longitude: prov.longitude,
      },
      create: {
        idPemberiJasa: userProv.idPengguna,
        namaToko: prov.namaToko,
        idKategoriJasa: prov.idKategoriJasa,
        jenisJasa: prov.jenisJasa,
        latitude: prov.latitude,
        longitude: prov.longitude,
        statusKetersediaan: 'Available',
        isOnline: true,
      },
    });

    providerIdMap[prov.username] = pemberi.idPemberiJasa;
  }

  // 4. Seed Pengguna & Layanan Pelanggan (UUID)
  const idLayananPelanggan = '444e8400-e29b-41d4-a716-446655440001';
  await prisma.pengguna.upsert({
    where: { username: 'cs_cariuang' },
    update: {
      password: defaultPasswordHash,
    },
    create: {
      idPengguna: idLayananPelanggan,
      namaPengguna: 'Rina Customer Care',
      username: 'cs_cariuang',
      password: defaultPasswordHash,
      email: 'cs@cariuang.id',
      nomorTelpon: '081100001111',
      role: Role.LAYANAN_PELANGGAN,
    },
  });

  await prisma.layananPelanggan.upsert({
    where: { idLayananPelanggan },
    update: {},
    create: {
      idLayananPelanggan,
      status: 'Available',
      jumlahTiketDipegang: 0,
    },
  });

  // 5. Seed Kontrak Pekerjaan (Riwayat Transaksi Pelanggan & Penyedia)
  const ahmadId = providerIdMap['ahmad_teknik'] || providers[0].idPemberiJasa;
  const sitiId = providerIdMap['siti_clean'] || providers[1].idPemberiJasa;
  const dediId = providerIdMap['dedi_ledeng'] || providers[2].idPemberiJasa;

  const kontrakList = [
    {
      idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440001',
      idPelanggan: actualPelangganId,
      idPemberiJasa: sitiId,
      detailPekerjaan: 'Bersih-bersih rumah · 2 jam',
      persetujuanHarga: 100000,
      statusPekerjaan: 'On Progress',
      hasRating: false,
      createdAt: new Date('2026-05-12T14:20:00Z'),
    },
    {
      idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440002',
      idPelanggan: actualPelangganId,
      idPemberiJasa: sitiId,
      detailPekerjaan: 'Cuci & setrika · 3 kg',
      persetujuanHarga: 60000,
      statusPekerjaan: 'Done',
      hasRating: false, // Belum dinilai -> Tombol "Beri Rating" (UI-10-06) akan muncul
      createdAt: new Date('2026-05-08T09:10:00Z'),
    },
    {
      idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440003',
      idPelanggan: actualPelangganId,
      idPemberiJasa: ahmadId,
      detailPekerjaan: 'Servis AC & Perbaikan Elektronik',
      persetujuanHarga: 120000,
      statusPekerjaan: 'Done',
      hasRating: true, // Sudah dinilai
      createdAt: new Date('2026-04-20T10:00:00Z'),
    },
    {
      idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440004',
      idPelanggan: actualPelangganId,
      idPemberiJasa: dediId,
      detailPekerjaan: 'Angkut barang pindahan',
      persetujuanHarga: 150000,
      statusPekerjaan: 'Dibatalkan',
      hasRating: false,
      createdAt: new Date('2026-04-27T11:30:00Z'),
    },
  ];

  for (const kontrak of kontrakList) {
    await prisma.kontrakPekerjaan.upsert({
      where: { idKontrakPekerjaan: kontrak.idKontrakPekerjaan },
      update: kontrak,
      create: kontrak,
    });
  }

  // 6. Seed Rating untuk Kontrak yang Sudah Dinilai (Kontrak 3)
  await prisma.rating.upsert({
    where: {
      idKontrakPekerjaan_idPenggunaPemberi: {
        idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440003',
        idPenggunaPemberi: actualPelangganId,
      },
    },
    update: {},
    create: {
      idRating: '888e8400-e29b-41d4-a716-446655440001',
      idKontrakPekerjaan: '333e8400-e29b-41d4-a716-446655440003',
      idPenggunaPemberi: actualPelangganId,
      idPenggunaPenerima: ahmadId,
      nilaiRating: 5.0,
      ulasan: 'Pekerjaan servis AC sangat rapi dan teknisi ramah.',
      tags: ['Tepat Waktu', 'Kerja Bersih', 'Ramah'],
      tanggalRating: new Date('2026-04-20T12:30:00Z'),
    },
  });

  console.log('✅ Seeding database CariUang selesai (Kategori, Pengguna, Pemberi Jasa, Kontrak, dan Rating)!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Gagal melakukan seeding:', e);
    await prisma.$disconnect();
    throw e;
  });
