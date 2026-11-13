# Log Eksekusi Pengujian Otomatis Backend (M9 Bagian A.6.5 & B.2)

- **Proyek:** CariUang (`src/backend/`)
- **Tanggal Eksekusi:** 13 November 2026 (19:11:18 WIB)
- **Lingkungan Pengujian:** Jest + `ts-jest` (`src/backend/jest.config.js` → `src/backend/tests/tsconfig.json`), mode *in-memory mock* penuh (tanpa koneksi PostgreSQL atau server HTTP eksternal)
- **Ringkasan Hasil:**
  - **Test Suites:** `6 passed, 6 total` (`0 failed`)
  - **Test Cases:** `106 passed, 106 total` (`0 failed`, `0 skipped`)
  - **Waktu Eksekusi:** `2.983 s`

---

## Cara Menjalankan Pengujian

Dari root repositori:

```bash
cd src/backend
npm test
```

Atau untuk melihat rincian setiap test case:

```bash
cd src/backend
npm test -- --verbose
```

---

## Pemetaan Kebutuhan Fungsional (`KF01`–`KF21`) SKPL ke Test Suite

| ID KF | Deskripsi Singkat Kebutuhan Fungsional (`docs/M5/K03_G09_SKPL.md`) | Use Case / Algoritma DPPL2 Terkait | File Test Backend |
| :--- | :--- | :--- | :--- |
| `KF01` | Menampilkan halaman utama berisi daftar kategori dan jasa yang tersedia | `ALGO-022`–`ALGO-031`, `Q-015` | `src/backend/tests/serviceCatalog.test.ts` |
| `KF02` | Menyediakan fitur pemesanan jasa bagi pelanggan untuk memilih & memesan jasa | `UC05`, `KNF04`, `KNF05`, `ALGO-039`, `ALGO-041`–`ALGO-043` | `src/backend/tests/serviceCatalog.test.ts`, `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF03` | Menampilkan lokasi pemberi jasa beserta informasi jarak dari posisi pelanggan | `KNF05`, `KNF06` (Haversine) | `src/backend/tests/serviceCatalog.test.ts` |
| `KF04` | Formulir pendaftaran pemberi jasa mengisi data diri & jenis jasa yang ditawarkan | `UC01`, `ALGO-022`–`ALGO-029`, `ALGO-033`–`ALGO-035` | `src/backend/tests/serviceCatalog.test.ts` |
| `KF05` | Menyimpan seluruh data pemberi jasa yang telah mendaftar ke dalam basis data | `UC01`, `ALGO-034`, `ALGO-035` | `src/backend/tests/serviceCatalog.test.ts` |
| `KF06` | Menampilkan notifikasi pesanan yang masuk pada tampilan pemberi jasa | `UC05`, `ALGO-041`–`ALGO-043`, `KNF04`, `KNF19` | `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF07` | Membatalkan pesanan otomatis apabila pemberi jasa tidak menerima dalam 30 menit | `KNF11` (`cancelExpiredContracts`) | `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF08` | Menampilkan halaman detail lengkap jasa dan lokasi pemberi jasa kepada pelanggan | `ALGO-002`, `ALGO-009`, `ALGO-011`, `Q-002` | `src/backend/tests/serviceCatalog.test.ts` |
| `KF09` | Menyediakan fitur komunikasi pemberi jasa & pelanggan untuk negosiasi harga | `UC03`, `UC04`, `ALGO-044`–`ALGO-052` | `src/backend/tests/komunikasi.test.ts` |
| `KF10` | Form input pelanggan untuk memasukkan detail kesepakatan pekerjaan & harga | `UC05`, `ALGO-036`–`ALGO-040`, `ALGO-043`, `KNF18` | `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF11` | Menerima kesepakatan & harga, lalu mengubah status menjadi *On Process/On Progress* | `UC05`, `ALGO-036`–`ALGO-043`, `KNF04`, `KNF19`, `KNF22` | `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF12` | Fitur bagi pemberi jasa melaporkan kepada pelanggan bahwa pekerjaan telah selesai | `UC06`, `KNF20` | `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF13` | Tombol konfirmasi pelanggan menerima penyelesaian, bayar, dan status menjadi `Done` | `UC07`, `ALGO-042`, `KNF21`, `KNF22` | `src/backend/tests/kontrakPekerjaan.test.ts` |
| `KF14` | Fitur bagi pelanggan melaporkan masalah yang dialami ke layanan pengguna | `UC08`, `ALGO-013`, `ALGO-053`, `ALGO-054` | `src/backend/tests/tiketLaporan.test.ts` |
| `KF15` | Pembuatan tiket laporan otomatis & ruang komunikasi pelanggan-CS | `UC08`, `ALGO-019`, `ALGO-020`, `ALGO-054` | `src/backend/tests/tiketLaporan.test.ts` |
| `KF16` | Fitur bagi pemberi jasa melaporkan masalah selama pengerjaan jasa ke CS | `UC08`, `ALGO-053`, `ALGO-054` | `src/backend/tests/tiketLaporan.test.ts` |
| `KF17` | Pembuatan tiket laporan otomatis & ruang komunikasi pemberi jasa-CS | `UC08`, `UC09`, `ALGO-019`–`ALGO-021` | `src/backend/tests/tiketLaporan.test.ts` |
| `KF18` | Notifikasi kepada layanan pelanggan setiap ada tiket laporan baru / pembaruan | `UC08`, `UC09`, `ALGO-019`, `ALGO-021`, `ALGO-054`, `ALGO-055` | `src/backend/tests/tiketLaporan.test.ts` |
| `KF19` | Penilaian dua arah pelanggan dan pemberi jasa setelah pekerjaan selesai | `UC10`, `ALGO-056`–`ALGO-064` | `src/backend/tests/rating.test.ts` |
| `KF20` | Menyimpan rating, akumulasi nilai array, dan rata-rata rating pada profil pengguna | `UC10`, `ALGO-056`–`ALGO-063` | `src/backend/tests/rating.test.ts` |
| `KF21` | Pendaftaran dan login multi-role untuk pelanggan, pemberi jasa, dan CS | `UC11`, `UC12`, `ALGO-001`, `ALGO-012`, `ALGO-017` | `src/backend/tests/auth.test.ts` |

---

## Output Aktual Terminal (`npm test -- --verbose`)

```text
> cariuang-backend@1.0.0 test
> jest --verbose

PASS tests/rating.test.ts
  Rating System Unit & Integration Tests [KF19, KF20 | UC10 | ALGO-056 s.d. ALGO-064]
    RatingController.validateRatingValue [KF19 | ALGO-064]
      ✓ [KF19 | ALGO-064] returns true for valid parameters (2 ms)
      ✓ [KF19 | ALGO-064] returns false if rating value is out of bounds
      ✓ [KF19 | ALGO-064] returns false if any required ID is missing or empty
    Rating.makeRating & Model Getters [KF19, KF20 | ALGO-057, ALGO-059 s.d. ALGO-063]
      ✓ [KF19 | ALGO-057] safely handles non-string ulasan without crashing
      ✓ [KF19 | ALGO-057] safely filters invalid non-string items in tags (1 ms)
      ✓ [KF19 | ALGO-057] sets nilaiRating to -1 if out of bounds
      ✓ [KF20 | ALGO-059 s.d. ALGO-063] mengembalikan seluruh atribut melalui getter dan toJSON()
    Two-Way Rating Flow [KF19, KF20 | UC10 | ALGO-056, ALGO-058]
      ✓ [KF19, KF20 | UC10] allows Pelanggan to rate Mitra on completed contract (1 ms)
      ✓ [KF19, KF20 | UC10] allows Mitra to rate Pelanggan on the same contract (Two-Way) (1 ms)
      ✓ [KF19 | UC10] rejects double rating from the same user for the same contract
      ✓ [KF19 | UC10] rejects rating if contract status is not Done
    Penyimpanan DB & Kalkulasi Rata-Rata Array PostgreSQL [KF20 | ALGO-056, ALGO-058]
      ✓ [KF20 | ALGO-056] Rating.simpanKeDb melempar error jika nilaiRating === -1 (10 ms)
      ✓ [KF20 | ALGO-056] Rating.simpanKeDb menyimpan entri rating dan memperbarui hasRating = true pada kontrak (1 ms)
      ✓ [KF20 | ALGO-058] Rating.updateRatingPengguna mengakumulasi multi-rating pada array riwayatRating dengan pembulatan 2 desimal
      ✓ [KF20 | ALGO-058] Rating.updateRatingPengguna melempar error jika nilaiRating === -1 atau pengguna penerima tidak ditemukan
      ✓ [KF20 | ALGO-058] Pengguna.addNewRatingRiwayat memperbarui array rating beserta rata-rata 2 desimal dan menolak skor < 1 atau > 5 (2 ms)
    Profil Riwayat Rating Pengguna [KF20 | UC10 | RatingController.getRatingsByUser]
      ✓ [KF20 | UC10] mengembalikan 400 jika parameter id pengguna kosong atau hanya spasi (1 ms)
      ✓ [KF20 | UC10] mengembalikan 404 jika pengguna tidak ditemukan
      ✓ [KF20 | UC10] mengembalikan 200 beserta akumulasiRating, riwayatRating, totalRating, dan daftar ratings pengguna

PASS tests/serviceCatalog.test.ts
  Issue #5: Backend Pendaftaran Jasa, Katalog Kategori, dan Pencarian Terdekat [KF01 s.d. KF05, KF08]
    1. Utility Formula Haversine [KF03 | KNF05 & KNF06]
      ✓ [KF03 | KNF05] mengembalikan jarak 0 km untuk titik koordinat yang identik (2 ms)
      ✓ [KF03 | KNF05] menghitung jarak GPS secara akurat antara ITB Ganesha, Cisitu, dan Buah Batu
    2. Kelas C13 KategoriJasa & C15 KategoriJasaController [KF01, KF04, KF05 | ALGO-022 s.d. ALGO-035]
      ✓ [KF01, KF04 | ALGO-022 s.d. ALGO-029] mengimplementasikan getter dan setter sesuai ALGO-022 s.d. ALGO-029
      ✓ [KF01 | Acceptance Criteria #1 | ALGO-031, Q-015] mengembalikan daftar seluruh kategori terurut alfabetis (10 ms)
      ✓ [KF04 | Acceptance Criteria #3 | ALGO-033] menolak tarif negatif atau field kosong pada validateKategoriJasa
      ✓ [KF04, KF05 | ALGO-034 & ALGO-035] menyimpan kategori baru dengan UUID otomatis dan memperbarui data PemberiJasa
    3. Kelas C04 PemberiJasa & C06 PemberiJasaController [KF02, KF03, KF08 | ALGO-002, ALGO-009, ALGO-011]
      ✓ [KF03 | Acceptance Criteria #2 | KNF05] mengurutkan hasil pencarian berdasarkan jarak terdekat Haversine (1 ms)
      ✓ [KF02 | KNF05] mengurutkan berdasarkan Rating Terbaik (DESC) dan Termurah (tarif ASC)
      ✓ [KF08 | ALGO-002, ALGO-009, ALGO-011, Q-002] mengambil detail profil lengkap PemberiJasa berdasarkan ID
    4. HTTP Route Handlers Integration (/api/services) [KF01, KF02, KF03, KF04, KF08]
      ✓ [KF01 | ALGO-031] GET /api/services/categories mengembalikan 200 beserta daftar kategori terurut alfabetis dengan UUID (1 ms)
      ✓ [KF04 | ALGO-033] POST /api/services/register mengembalikan 400 jika tarif negatif atau field kosong
      ✓ [KF02, KF03 | KNF05] GET /api/services/search mengembalikan penyedia jasa terurut terdekat berdasarkan koordinat user (1 ms)
      ✓ [KF08 | ALGO-002, ALGO-009, ALGO-011] GET /api/services/:id mengembalikan 200 beserta detail lengkap jasa dan lokasi pemberi jasa (1 ms)
      ✓ [KF08 | ALGO-009] GET /api/services/:id mengembalikan 400 jika ID kosong atau hanya spasi
      ✓ [KF08 | ALGO-002, ALGO-009] GET /api/services/:id mengembalikan 404 jika pemberi jasa tidak ditemukan (1 ms)
    5. Issue #6: Pendaftaran Penyedia Jasa [KF04, KF05 | UC01]
      ✓ [KF04, KF05 | UC01] POST /api/services/register mengembalikan 201, mengubah role menjadi PEMBERI_JASA, dan menyimpan namaToko
      ✓ [KF04 | UC01] POST /api/services/register mengembalikan 400 jika namaToko kosong (1 ms)
      ✓ [KF04 | UC01] POST /api/services/register mengembalikan 400 jika idPemberiJasa tidak dikirim
      ✓ [KF04, KF05 | UC01] POST /api/services/register mengembalikan 404 jika idPemberiJasa tidak dikenal (1 ms)

PASS tests/tiketLaporan.test.ts
  Sistem Tiket Laporan & Penugasan Otomatis CS [KF14 s.d. KF18 | UC08, UC09]
    Validasi Form Tiket [KF14, KF16 | ALGO-053]
      ✓ [KF14, KF16 | ALGO-053] mengembalikan true untuk jenisTiket valid: Laporan Pembayaran (3 ms)
      ✓ [KF14, KF16 | ALGO-053] mengembalikan true untuk jenisTiket valid: Kendala Aplikasi
      ✓ [KF14, KF16 | ALGO-053] mengembalikan true untuk jenisTiket valid: Perilaku Pengguna
      ✓ [KF14, KF16 | ALGO-053] mengembalikan true untuk jenisTiket valid: Lainnya
      ✓ [KF14, KF16 | ALGO-053] mengembalikan false jika jenisTiket di luar JENIS_TIKET, kosong, atau bukan string
      ✓ [KF14, KF16 | ALGO-053] mengembalikan false jika keteranganTiket kosong, hanya spasi, atau bukan string
    Pencarian Staf CS Kosong & Manajemen Beban [KF15, KF17 | ALGO-019]
      ✓ [KF15, KF17 | ALGO-019] cariLayananKosong memilih CS dengan jumlahTiketDipegang terkecil (Available atau < 5) (1 ms)
      ✓ [KF15, KF17 | ALGO-019] cariLayananKosong mengembalikan null jika semua CS tidak memenuhi syarat (status !== Available dan beban >= 5)
      ✓ [KF15, KF17 | ALGO-019] tambahBeban menaikkan beban +1 dan kurangiBeban menurunkan -1 hanya jika beban > 0 (1 ms)
    Pembuatan Tiket Laporan & Penugasan Otomatis CS [KF14, KF15, KF16, KF18 | UC08 | ALGO-013, ALGO-054, ALGO-055]
      ✓ [KF14, KF16 | ALGO-054] mengembalikan 400 jika form tiket tidak valid dan tidak menjalankan $transaction (1 ms)
      ✓ [KF14, KF16] authorizeRoles mengizinkan PELANGGAN dan PEMBERI_JASA, serta menolak LAYANAN_PELANGGAN (403) (1 ms)
      ✓ [KF14, KF15, KF18 | ALGO-019, ALGO-054, ALGO-055] Pelanggan membuat tiket valid: auto-assign ke CS beban terkecil, tambah beban +1, dan kirim notifikasi CS (1 ms)
      ✓ [KF16, KF17, KF18 | ALGO-019, ALGO-054] Pemberi Jasa juga dapat membuat tiket laporan dan otomatis ditugaskan ke CS (1 ms)
      ✓ [KF15, KF18 | ALGO-019, ALGO-054] fallback tanpa CS tersedia (idCs === null): tetap 201 dengan assignedTo null tanpa tambahBeban/notifikasi
      ✓ [KF18 | ALGO-055] kegagalan pengiriman notifikasi (kirimNotifikasiAman) tidak menggagalkan pembuatan tiket (201) (1 ms)
      ✓ [KF14, KF15 | ALGO-054] mengembalikan 500 jika terjadi error database saat transaksi (1 ms)
    Ruang Komunikasi & Penanganan Tiket CS [KF15, KF17, KF18 | UC08, UC09 | ALGO-020, ALGO-021]
      ✓ [KF15, KF17 | ALGO-020] tiketSayaHandler dan detailTiketHandler menegakkan kontrol akses pelapor & CS (1 ms)
      ✓ [KF15, KF17] kirimPesanPelaporHandler memvalidasi pesan ruang mediasi (201, 400, 404, 409) (1 ms)
      ✓ [KF17 | UC09 | ALGO-020] LayananPelangganCtrl.daftarTiket dan statistik mendukung filter valid serta menolak status invalid (400) (11 ms)
      ✓ [KF17, KF18 | UC09 | ALGO-021] LayananPelangganCtrl.balasTiket mengubah Open -> Diproses, auto-claim jika unassigned, dan menegakkan akses CS (1 ms)
      ✓ [KF17, KF18 | UC09 | ALGO-021] LayananPelangganCtrl.tutupTiket mengubah status -> Selesai, mengurangi beban CS, dan menolak akses tidak sah (1 ms)

PASS tests/auth.test.ts
  Sistem Autentikasi: Registrasi & Login Multi-Role [KF21 | UC11, UC12]
    Validasi Info Registrasi Pelanggan [KF21 | ALGO-017]
      ✓ [KF21 | ALGO-017] meloloskan input valid, men-trim spasi, lowercase email, serta menerima nomorTelpon maupun nomorTelepon (5 ms)
      ✓ [KF21 | ALGO-017] menolak registrasi jika field wajib namaPengguna kosong atau hanya spasi (1 ms)
      ✓ [KF21 | ALGO-017] menolak registrasi jika field wajib username kosong atau hanya spasi
      ✓ [KF21 | ALGO-017] menolak registrasi jika field wajib password kosong atau hanya spasi
      ✓ [KF21 | ALGO-017] menolak registrasi jika field wajib email kosong atau hanya spasi (1 ms)
      ✓ [KF21 | ALGO-017] menolak registrasi jika field wajib nomorTelpon kosong atau hanya spasi
      ✓ [KF21 | ALGO-017] menolak password kurang dari 8 karakter (1 ms)
      ✓ [KF21 | ALGO-017] menolak format email tidak valid: budi.example.com
      ✓ [KF21 | ALGO-017] menolak format email tidak valid: budi@
      ✓ [KF21 | ALGO-017] menolak format email tidak valid: @example.com
      ✓ [KF21 | ALGO-017] menolak format email tidak valid: budi@invalid
      ✓ [KF21 | ALGO-017] menolak nomor telepon non-angka, < 10 digit, atau > 15 digit: 08123abc9012
      ✓ [KF21 | ALGO-017] menolak nomor telepon non-angka, < 10 digit, atau > 15 digit: +628123456789
      ✓ [KF21 | ALGO-017] menolak nomor telepon non-angka, < 10 digit, atau > 15 digit: 081234567 (1 ms)
      ✓ [KF21 | ALGO-017] menolak nomor telepon non-angka, < 10 digit, atau > 15 digit: 0812345678901234
    Validasi Info Registrasi Pemberi Jasa [KF21 | ALGO-012]
      ✓ [KF21 | ALGO-012] mewarisi aturan validasi dasar ALGO-017 (menolak email/password/telepon invalid)
      ✓ [KF21 | ALGO-012] menolak jika idKategoriJasa kosong atau hanya spasi
      ✓ [KF21 | ALGO-012] menolak jika jenisJasa kosong atau hanya spasi (1 ms)
      ✓ [KF21 | ALGO-012] meloloskan input valid dan mengembalikan sanitizedData beserta providerData lengkap
    Integration Test Registrasi Akun [KF21 | UC12 | ALGO-012, ALGO-017]
      ✓ [KF21 | UC12] registrasiPelanggan mengembalikan 400 jika validasi input gagal
      ✓ [KF21 | UC12] registrasiPelanggan menyimpan password ter-hash bcrypt, mengembalikan 201 tanpa field password, dan menolak duplikasi username/email (400) (176 ms)
      ✓ [KF21 | UC12] registrasiPemberiJasa mengembalikan 201 dengan role PEMBERI_JASA, password ter-hash, dan menolak duplikasi (400) (146 ms)
    Pengecekan Info Login & Handler Login Multi-Role [KF21 | UC11 | ALGO-001]
      ✓ [KF21 | ALGO-001] cekInfoLogin tetap menjalankan bcrypt.compare ke dummy hash jika user tidak ditemukan dan mengembalikan authenticated: false (73 ms)
      ✓ [KF21 | ALGO-001] cekInfoLogin mengembalikan authenticated: false jika password salah (3 ms)
      ✓ [KF21 | ALGO-001] cekInfoLogin berhasil via username dan email, menghasilkan JWT valid, menyelesaikan role, dan menghapus field password (8 ms)
      ✓ [KF21 | UC11 | ALGO-001] PenggunaController.login mengembalikan 400 jika input kosong, 401 jika kredensial salah, dan 200 beserta token jika sukses (4 ms)
      ✓ [KF21 | UC11 | ALGO-001] LayananPelangganCtrl.loginLayananPelanggan hanya mengizinkan role LAYANAN_PELANGGAN (200) dan menolak PELANGGAN/PEMBERI_JASA (401) (11 ms)

PASS tests/komunikasi.test.ts
  [KF09] Unit Test Model Komunikasi (UC03, UC04 | ALGO-044 s.d. ALGO-048)
    ✓ [KF09][ALGO-044][ALGO-046] menginisialisasi entitas Komunikasi beserta ID otomatis dan getter (3 ms)
    ✓ [KF09][ALGO-045][ALGO-047] saveChat, simpanPesan, dan getPesan menyimpan serta mengambil pesan dari DB
    ✓ [KF09][ALGO-048] getChatHistory mengembalikan riwayat dua arah terurut ascending dan terisolasi dari user lain (1 ms)
    ✓ [KF09] markMessagesAsRead hanya menandai pesan unread dari lawan bicara ke pengguna login
    ✓ [KF09] getConversationsByUser merangkum percakapan terbaru dan unreadCount akurat per lawan bicara (1 ms)
  [KF09] Integration Test KomunikasiController & Chat Handlers (UC03, UC04 | ALGO-049 s.d. ALGO-052)
    ✓ [KF09][ALGO-049] kirimPesan berhasil menyimpan chat, memancarkan Socket.IO chat:new, dan memicu NotifikasiController
    ✓ [KF09][ALGO-049] sendChat tidak menggagalkan pengiriman pesan meski NotifikasiController melempar error (1 ms)
    ✓ [KF09] kirimPesan menolak input tidak valid (pengirim kosong, penerima kosong, self-message, non-string, kosong, >1000 char, penerima 404)
    ✓ [KF09][ALGO-049] sendChatHandler mengembalikan 401 tanpa auth, 403 saat spoofing pengirim, dan 201 saat valid (1 ms)
    ✓ [KF09][ALGO-050][ALGO-051][ALGO-052] getChatHistoryHandler menangani 401, 403 akses user lain, 400 partner kosong, serta mode startChat dan loadChat
    ✓ [KF09] getConversationsHandler dan markChatReadHandler menangani 401, 400, dan 200 dengan akurat (1 ms)

PASS tests/kontrakPekerjaan.test.ts
  [KF02][KF06][KF07][KF10][KF11][KF12][KF13] KontrakPekerjaan & KontrakPekerjaanController (UC05, UC06, UC07 | ALGO-036 s.d. ALGO-043)
    ✓ [KF10][KF11] ALGO-036 (statusUpdate Q-016), ALGO-037 (saveKontrak Q-017 & Q-018), ALGO-038 (newKontrak), ALGO-039 (makeKontrak), ALGO-040 (fetchKontrakPekerjaan Q-019), dan KNF18 (3 ms)
    ✓ [KF02][KF06][KF10][KF11] UC05, ALGO-043 (kirimInput), KNF04 & KNF19: Pelanggan membuat kontrak -> status Menunggu, notifikasi penyedia, & Optimistic Lock (29 ms)
    ✓ [KF02][KF06][KF11][KF12][KF13] ALGO-041, ALGO-042: Penyedia menerima kontrak (Optimistic Locking KNF04 & KNF19) -> On Progress -> Selesai (UC06, KNF20) -> Konfirmasi Pelanggan (UC07, KNF21, KNF22) -> Done (1 ms)
    ✓ [KF07] KNF11: Auto-cancel 30 menit membatalkan kontrak Menunggu yang kedaluwarsa dan membuka kunci penyedia jasa
    ✓ [KF11][KF13] ALGO-036, ALGO-042, KNF22: Validasi state transition menolak perubahan status yang tidak sah & mendukung Pengguna.konfirmasiPekerjaan()
    ✓ [KF02][KF10][KF11][KF12][KF13] ALGO-036 s.d. ALGO-043: REST API Handlers + JWT Auth Middleware (auth.middleware.ts): alur lengkap dari pembuatan kontrak hingga selesai (3 ms)
    ✓ [KF06][KF10] ALGO-043: Integrasi dengan NotifikasiController (C30), KomunikasiController (C21), dan Socket.IO RealtimeEmitter (1 ms)
    ✓ [KF02][KF10][KF11] ALGO-036, ALGO-039, ALGO-040, ALGO-041: Edge case fetch/get null, makeKontrak data tidak valid, dan statusUpdate string kosong (1 ms)
    ✓ [KF02][KF10] ALGO-043: Menolak self-contract (idPelanggan === idPemberiJasa) dengan 400 SELF_CONTRACT_FORBIDDEN

Test Suites: 6 passed, 6 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        2.983 s, estimated 3 s
Ran all test suites.
```
