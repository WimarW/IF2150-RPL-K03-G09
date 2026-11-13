# CariUang

### <img src="./docs/M7/assets/diagram/cariuang.svg" width="100" height="100">

---

<div style="text-align:justify;">
"CariUang" adalah suatu perangkat lunak berbasis *mobile application* pada sistem operasi Android yang menjadi jembatan antara pekerja jasa (freelance) dan pengguna yang ingin menggunakan jasa mereka. Perangkat lunak ini memungkinkan pengguna untuk mengunggah kebutuhan jasa dan memilih jasa mereka. Kemudian, pemilik jasa dapat terhubung dengan pengguna untuk memberikan estimasi harga. Jika harga disetujui, pengguna akan menginput persetujuan/deskripsi pekerjaan dan harga ke apikasi sebelum disetujui oleh pemilik jasa. Jika tidak disetujui, pengguna akan kembali memilih pemilik jasa yang lain. Setelah itu, pemilik jasa akan melakukan pekerjaan sesuai persetujuan/deskripsi pekerjaan. Setelah semua pekerjaan selesai, pengguna akan membayar harga yang telah ditetapkan sebelumnya.

Jika pengguna bingung akan pekerja jasa mana yang memiliki performa terbaik mengenai salah satu pekerjaan spesifik, perangkat lunak ini memiliki sistem rekomendasi pemilik jasa yang dikelompokkan kepada berbagai kelompok pekerjaan. Pengguna kemudian dapat langsung menghubungi pemilik jasa untuk menggunakan jasa mereka.

Di dalam perangkat lunak yang kami buat, terdapat sistem *rating* untuk memberi penilaian terhadap kinerja pemilik jasa dan perilaku pengguna jasa. Rating diberikan oleh pengguna kepada pemilik jasa dan begitupun sebaliknya, sehingga baik pengguna atau pemilik jasa harus memberikan pelayanan atau perilaku yang terbaik untuk menjaga rating mereka. Jika rating melewati batas bawah yang telah ditentukan, baik pemilik atau pengguna jasa akan mendapatkan sanksi tertentu.

Jika pengguna atau pemilik jasa memiliki beberapa keluhan yang tidak dapat diselesaikan antara kedua belah pihak, pengguna dapat membuat aduan kepada pihak Customer Service untuk ditindaklanjuti. Pengguna dapat mengirim tiket laporan mengenai berbagai topik spesifik dengan cara mengisi suatu form yang terdapat di menu Laporan. Setelah tiket dikirim, pihak Customer Service kemudian akan meninjau laporan tersebut untuk mencari langkah penyelesaian yang paling baik. Setelah selesai, pihak Customer Service akan memberikan tanggapan kepada pelapor mengenai hal yang telah dilakukan atau tindakan lanjutan yang perlu dilakukan.
</div>

---

## 1. Tech Stack & Versi yang Digunakan

* **Mobile Frontend:** React Native 0.88.1, Expo SDK ~58.0.22, TypeScript ~6.0.3, React Navigation v7
* **Backend API:** Node.js (>= v24.0.0), Express.js 4.21.2, Socket.IO 4.8.4, TypeScript 5.7.2
* **Database & ORM:** PostgreSQL 16 (via Docker image `postgres:16-alpine`), Prisma ORM 5.22.0
* **Testing:** Jest (~30.5.2) & Jest-Expo (~58.0.14)

---

## 2. Prasyarat Software & Langkah Instalasi Dependensi

### Prasyarat Sistem
* **Node.js** versi `>= 24.x` dan **npm**
* **Docker & Docker Compose** (Pastikan Docker Desktop sudah dibuka dan berstatus *running* untuk macOS/Windows, atau service Docker aktif `sudo service docker start` untuk Linux/WSL)
* **Expo Go** (terpasang pada perangkat HP fisik Android/iOS) atau **Android Emulator** (Android Studio)

### Langkah Instalasi Dependensi

Jalankan perintah berikut secara berurutan untuk memasang seluruh *dependencies* pada backend dan frontend:

```bash
# 1. Pasang dependensi Backend
cd src/backend
npm install

# 2. Pasang dependensi Frontend
cd ../frontend
npm install

# 3. Kembali ke root repository
cd ../..
```

---

## 3. Konfigurasi Environment, Docker, Migrasi, dan Seed Data

### A. Konfigurasi Environment Variable (`.env`)

#### 1. Backend (`src/backend/.env`)
Salin berkas template `src/.env.example` ke `src/backend/.env`:

```bash
cp src/.env.example src/backend/.env
```

Pastikan isi `src/backend/.env` sesuai *(port `5433` disesuaikan dengan mapping port PostgreSQL pada `src/docker-compose.yml`)*:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://cariuang_user:cariuang_password@localhost:5433/cariuang_db?schema=public"
JWT_SECRET="kunci_rahasia_cariuang_2026_super_aman_minimal_32_karakter"
JWT_EXPIRES_IN="7d"
```
*(Catatan: Jika port `5000` di macOS bentrok dengan AirPlay Receiver, Anda dapat mengubah `PORT=3000` dan menyesuaikan port mapping).*

#### 2. Frontend (`src/frontend/.env`)
Buat berkas `src/frontend/.env` untuk menentukan alamat *endpoint* backend. Nilai `EXPO_PUBLIC_API_URL` harus disesuaikan dengan jenis perangkat yang Anda gunakan untuk menguji aplikasi:

* **Opsi 1 — Pengujian via HP Fisik (Expo Go):**
  HP fisik tidak dapat mengakses `localhost` laptop. Gunakan IP lokal Wi-Fi laptop Anda (dapatkan IP melalui perintah `ipconfig getifaddr en0` di Mac atau `ipconfig` di Windows).
  ```env
  EXPO_PUBLIC_API_URL=http://<IP_WIFI_LAPTOP>:5000/api
  ```
  *(Contoh: `EXPO_PUBLIC_API_URL=http://192.168.1.101:5000/api`)*

* **Opsi 2 — Pengujian via Android Emulator:**
  Android Emulator menggunakan alias IP khusus `10.0.2.2` untuk terhubung ke localhost mesin host:
  ```env
  EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
  ```

* **Opsi 3 — Pengujian via iOS Simulator atau Web Browser:**
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:5000/api
  ```

---

### B. Menjalankan Database PostgreSQL via Docker Compose

Pastikan Docker Desktop aktif, lalu jalankan container PostgreSQL dari folder `src`:

```bash
# Menyalakan service database PostgreSQL
cd src
docker compose up -d db
cd ..
```

---

### C. Migrasi Skema Basis Data & Seed Data Awal

Jalankan Prisma generate, migrasi skema tabel, dan pengisian data dummy awal (pastikan container `db` pada langkah B sudah berstatus *healthy*):

```bash
cd src/backend
# Sinkronisasi client Prisma
npm run db:generate

# Jalankan migrasi schema ke PostgreSQL (port 5433 sesuai src/docker-compose.yml)
npx prisma migrate deploy

# Isi database dengan data uji coba awal (seed)
npm run db:seed

cd ../..
```

*(Alternatif jika Anda menjalankan seluruh stack via `cd src && docker compose up -d --build`: container backend sudah otomatis menjalankan `prisma migrate deploy`, sehingga Anda cukup menjalankan seed melalui container backend dengan `docker exec -it cariuang-backend npx prisma db seed`.)*

---

## 4. Langkah Menjalankan Aplikasi & Rangkaian Pengujian (Test)

### A. Menjalankan Backend Server (Terminal 1)
```bash
cd src/backend
npm run dev
```
Backend API dan server Socket.IO akan berjalan pada `http://localhost:5000`.

### B. Menjalankan Frontend Expo (Terminal 2)
```bash
cd src/frontend
npx expo start -c
```
* **Untuk HP Fisik:** Buka aplikasi **Expo Go**, lalu scan QR code yang muncul di terminal (pastikan HP dan laptop berada dalam satu jaringan Wi-Fi yang sama).
* **Untuk Android Emulator:** Tekan tombol **`a`** pada keyboard.
* **Untuk iOS Simulator:** Tekan tombol **`i`** pada keyboard.

### C. Menjalankan Rangkaian Pengujian Otomatis (Unit Test)

Seluruh pengujian unit dapat dijalankan dengan perintah Jest:

```bash
# 1. Menjalankan pengujian backend (Katalog Jasa & Kontrak Pekerjaan)
cd src/backend
npm test

# 2. Menjalankan pengujian frontend (Catalog Helper & Formatters)
cd ../frontend
npm test

cd ../..
```

---

## 5. Daftar Akun & Kredensial Uji Coba

Gunakan kredensial akun uji coba berikut yang telah terisi secara otomatis melalui `prisma/seed.ts`:

| Peran (*Role*) | Username | Email | Password | Nama Akun / Keterangan |
|---|---|---|---|---|
| **Pelanggan** | `budi_pelanggan` | `budi@pelanggan.com` | `PasswordAman123` | Budi Santoso (Pelanggan) |
| **Pemberi Jasa (AC)** | `ahmad_teknik` | `ahmad@cariuang.id` | `PasswordAman123` | Ahmad Teknik (Ahmad Jaya AC & Elektronik) |
| **Pemberi Jasa (Kebersihan)** | `siti_clean` | `siti@cariuang.id` | `PasswordAman123` | Siti Bersih (Kinclong Home Cleaning) |
| **Pemberi Jasa (Pipa & Ledeng)** | `dedi_ledeng` | `dedi@cariuang.id` | `PasswordAman123` | Kang Dedi Pipa (Dedi Plumbing Bandung) |
| **Layanan Pelanggan (CS)** | `cs_cariuang` | `cs@cariuang.id` | `PasswordAman123` | Rina Customer Care |

---

## 6. Daftar Modul/Fitur & Pembagian Tugas Anggota

| NIM | Nama Anggota | Use Case & Antarmuka | Deskripsi Modul & Kontribusi |
|---|---|---|---|
| **13525120** | Naufal Hasbialhaq | **UC01, UC02** (UI-04, UI-05, UI-06, UI-16) | Setup Database PostgreSQL, Pendaftaran Jasa, Katalog, Pencarian & Peta Lokasi, Unit/Integration Test |
| **13525009** | Wimar Widiarto | **UC10, UC11, UC12** (UI-01, UI-02, UI-03, UI-11, UI-14) | Setup Monorepo MVC, Autentikasi Multi-Role & Profil, Sistem Rating Dua Arah |
| **13525093** | Vinsensius Juan Setiady | **UC03 & UC04** (UI-07, UI-08, UI-09, UI-13) | Chat Real-Time, Sistem Notifikasi Otomatis, `src/README.md` |
| **13525126** | Raymond Edson Sabajan | **UC05, UC06, UC07** (UI-08, UI-09, UI-10, UI-12) | Siklus Kontrak Pekerjaan (Optimistic Locking & Auto-Cancel), Riwayat Pesanan, Profiling & Indeks DB |
| **13525048** | Yohanes Nicholas Setiawan | **UC08 & UC09** (UI-15, UI-17, UI-18g) | Tiket Laporan Masalah, Auto-Assign & Dashboard CS, Mediasi Tiket |

---

## 7. Struktur Basis Data & Relasi Tabel

Aplikasi menggunakan skema basis data relasional PostgreSQL yang dimodelkan melalui Prisma ORM (`src/backend/prisma/schema.prisma`):

1. **`Pengguna`**: Entitas pengguna utama aplikasi yang menyimpan informasi akun, kredensial password, role (`PELANGGAN`, `PEMBERI_JASA`, `LAYANAN_PELANGGAN`), serta akumulasi rating.
2. **`PemberiJasa`**: Detail spesifik penyedia jasa (nama toko, deskripsi jasa, tarif dasar, jam kerja, daerah kerja, koordinat latitude/longitude, status ketersediaan). Berelasi *one-to-one* dengan `Pengguna` dan *many-to-one* dengan `KategoriJasa`.
3. **`KategoriJasa`**: Master data kategori klasifikasi jenis pekerjaan jasa (misal: Jasa Kebersihan, Perbaikan AC, Tukang Ledeng).
4. **`LayananPelanggan`**: Detail akun staf operasional customer care. Berelasi *one-to-one* dengan `Pengguna`.
5. **`KontrakPekerjaan`**: Entitas transaksi pekerjaan dan negosiasi antara pelanggan dan penyedia jasa (status: `MENUNGGU`, `DITERIMA`, `DITOLAK`, `SELESAI`, `DIBATALKAN`).
6. **`Komunikasi`**: Riwayat percakapan pesan teks secara realtime antara dua pengguna (dilengkapi status keterbacaan dan waktu kirim).
7. **`TiketLaporan`**: Aduan keluhan/masalah dari pengguna kepada Layanan Pelanggan beserta bukti foto dan status penyelesaian (`Menunggu`, `Diproses`, `Selesai`).
8. **`Rating`**: Rekam penilaian rating numerik (1-5) dan ulasan feedback timbal balik antara pengguna setelah transaksi kontrak selesai.
9. **`Notifikasi`**: Riwayat pemberitahuan aktivitas pengguna (pesanan baru, pesan baru, tiket laporan, atau promo) beserta status telah dibaca.
