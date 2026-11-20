<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## Cari Uang
### <img src="../M7/assets/diagram//cariuang.svg" width="100" height="100">

### Untuk: Agatha Tatianingseto

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | 3 |
| Kelompok | 9 |

| NIM | Nama |
|---|---|
| 13525120 | Naufal Hasbialhaq |
| 13525009 | Wimar Widiarto |
| 13525093 | Vinsensius Juan Setiady |
| 13525126 | Raymond Edson Sabajan |
| 13525048 | Yohanes Nicholas Setiawan |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | Menambahkan file auth.middleware.ts ke dalam Implementasi Modul untuk kelas PenggunaController (di M9 belum ada) |
| *B* | Menambahkan file MyTicketScreen.tsx untuk UI Tiket (sudah disebutkan pada dokumen Implementasi pada Tabel B.1 No. 18) |
| *C* |  |
| ... |  |

---

# Bab 1: Pendahuluan
## 1.1 Tujuan Penulisan Dokumen
<p align="justify">

Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun untuk mendokumentasikan hasil realisasi implementasi serta hasil pengujian perangkat lunak **CariUang**. Isi dokumen mencakup gambaran umum perangkat lunak, rincian lingkungan implementasi beserta daftar modul, antarmuka, dan berkas pendukung yang telah dibangun, hasil pengujian pada tingkat unit kelas, integrasi antarkomponen, *use case*, dan kebutuhan non-fungsional (KNF) beserta bukti pengujiannya, hingga matriks kerunutan (*traceability*) antara spesifikasi kebutuhan, implementasi, dan kasus uji. Tujuan pembuatan dokumen ini adalah memverifikasi dan membuktikan secara terukur bahwa perangkat lunak **CariUang** telah diimplementasikan sesuai dengan rancangan pada dokumen DPPL serta memenuhi kebutuhan fungsional dan non-fungsional pada dokumen SKPL. Dokumen ini ditujukan bagi dosen dan asisten mata kuliah IF2150 Rekayasa Perangkat Lunak sebagai bahan evaluasi dan penilaian, tim pengembang sebagai dokumentasi acuan untuk pemeliharaan maupun perbaikan lanjutan, serta penguji perangkat lunak untuk menelusuri cakupan dan hasil pengujian sistem.

</p>

## 1.2 Lingkup Masalah
<div align="justify">

  Lingkup masalah dari proyek ini adalah membangun perangkat lunak **CariUang**, yaitu aplikasi *mobile* berbasis Android yang menjembatani pekerja jasa sektor informal (seperti teknisi AC, tukang listrik, jasa kebersihan rumah, tukang ledeng, penjahit, tukang sol sepatu, dan *handyman*) dengan pelanggan melalui fitur katalog jasa, pencarian berbasis lokasi, obrolan negosiasi, pengelolaan kontrak pekerjaan, penilaian (*rating*) dua arah, serta pelaporan dan mediasi kendala oleh *Customer Service* guna membantu mengatasi kesenjangan sosial-ekonomi (SDG 10). Dalam pengoperasiannya, CariUang berinteraksi dengan layanan eksternal perangkat berupa GPS (`expo-location`), penyedia peta (`react-native-maps`), dan kamera/galeri (`expo-image-picker`), menyimpan seluruh data pada DBMS PostgreSQL 16 melalui server *backend* Express.js dan Socket.IO, menyediakan titik sambung *push notification* (`ExpoPushGateway`), sementara proses pengerjaan fisik jasa dan transaksi pembayaran dilakukan secara langsung di luar sistem.

</div>

## 1.3 Definisi, Istilah, dan Singkatan
<div align="justify">

  Seluruh definisi, istilah, dan singkatan yang digunakan pada dokumen ini dijelaskan pada Tabel 1.3.
  
  Tabel 1.3. Definisi Istilah dan Singkatan
  
  | Singkatan, Akronim, atau Istilah | Penjelasan |
  | :--- | :--- |
  | P/L | Singkatan dari Perangkat Lunak, yaitu aplikasi atau program komputer yang dibangun untuk menjalankan tugas tertentu. |
  | SKPL | Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kebutuhan fungsional, non-fungsional, dan pemodelan *use case* P/L. |
  | APL | Singkatan dari Arsitektur Perangkat Lunak, yaitu dokumen yang menetapkan pola arsitektur, modul/subsistem, dan pandangan arsitektur P/L. |
  | DPPL | Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, algoritma, *query*, dan antarmuka P/L. |
  | HIUPL | Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi, pengujian, dan kerunutan (*traceability*) P/L. |
  | KF | Singkatan dari Kebutuhan Fungsional, yaitu layanan atau fitur spesifik yang harus disediakan oleh P/L. |
  | KNF | Singkatan dari Kebutuhan Non-Fungsional, yaitu batasan dan atribut kualitas P/L seperti *response time*, *reliability*, *security*, *availability*, dan *ergonomy*. |
  | UC | Singkatan dari *Use Case*, yaitu skenario interaksi antara aktor dan P/L untuk mencapai suatu tujuan tertentu. |
  | UI | Singkatan dari *User Interface*, yaitu antarmuka layar aplikasi tempat pengguna berinteraksi dengan P/L. |
  | MVC | Singkatan dari *Model-View-Controller*, yaitu pola arsitektur yang memisahkan pengelolaan data (*Model*), tampilan (*View*), dan logika aplikasi (*Controller*). |
  | DBMS | Singkatan dari *Database Management System*, yaitu perangkat lunak pengelola basis data (pada CariUang menggunakan PostgreSQL 16). |
  | ORM | Singkatan dari *Object-Relational Mapping*, yaitu pustaka pemetaan objek program ke tabel basis data relasional (pada CariUang menggunakan Prisma ORM). |
  | API / REST API | Singkatan dari *Application Programming Interface* / *Representational State Transfer API*, yaitu antarmuka komunikasi berbasis HTTP/JSON antara aplikasi *mobile* dan server *backend*. |
  | JWT | Singkatan dari *JSON Web Token*, yaitu token standar yang digunakan untuk autentikasi dan otorisasi peran pengguna pada setiap permintaan API. |
  | CS | Singkatan dari *Customer Service* (Layanan Pelanggan), yaitu aktor operasional yang menangani dan memediasi tiket laporan kendala pengguna. |
  | GPS | Singkatan dari *Global Positioning System*, yaitu layanan penentuan koordinat lokasi geografis perangkat untuk pencarian penyedia jasa terdekat. |
  | *Optimistic Locking* | Mekanisme pengendalian konkurensi berbasis versi data untuk mencegah dua pelanggan memesan satu pemberi jasa yang sama secara bersamaan. |
  | TC | Singkatan dari *Test Case*, yaitu satu kasus uji untuk memverifikasi skenario atau kebutuhan tertentu. |
  | UT | Singkatan dari *Unit Test*, yaitu kasus uji pada tingkat kelas atau operasi secara terisolasi. |
  | INT | Singkatan dari *Integration Test*, yaitu kasus uji yang memverifikasi interaksi antarkomponen melewati batas modul, basis data, atau layanan eksternal. |
  | *Boundary* | Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat pada ambang aturan bisnis. |
  | *Coverage* | Persentase baris (*statement/line*) maupun cabang (*branch*) kode program yang tereksekusi selama pengujian otomatis. |
</div>

## 1.4 Aturan Penomoran
<div align="justify">

  Aturan penomoran yang digunakan secara konsisten pada dokumen ini serta merujuk pada dokumen SKPL dan DPPL dirangkum pada Tabel 1.4.
  <br>
  <br>
  Tabel 1.4. Aturan Penomoran

  | Hal/Bagian | Penomoran | Keterangan |
  | :--- | :--- | :--- |
  | Kebutuhan Fungsional | KFXX | XX menyatakan dua digit nomor urut kebutuhan fungsional P/L (contoh: `KF01`). |
  | Kebutuhan Non-Fungsional | KNFXX | XX menyatakan dua digit nomor urut kebutuhan non-fungsional P/L (contoh: `KNF01`). |
  | Aktor | AXX | XX menyatakan dua digit nomor urut aktor yang berinteraksi dengan P/L (contoh: `A01`). |
  | *Use Case* | UCXX | XX menyatakan dua digit nomor urut *use case* P/L (contoh: `UC01`). |
  | Kelas | CXX | XX menyatakan dua digit nomor urut kelas perancangan P/L (contoh: `C01`). |
  | Algoritma | ALGO-XXX | XXX menyatakan tiga digit nomor urut algoritma operasi kelas pada DPPL (contoh: `ALGO-001`). |
  | *Query* Basis Data | Q-XXX | XXX menyatakan tiga digit nomor urut *query* basis data pada DPPL (contoh: `Q-001`). |
  | Antarmuka Pengguna (Layar) | UI-XX | XX menyatakan dua digit nomor urut layar antarmuka pengguna sesuai DPPL (contoh: `UI-01`). |
  | Antarmuka Antarkomponen | I-XX | XX menyatakan dua digit nomor urut antarmuka antarkomponen pada pengujian integrasi (contoh: `I-01`). |
  | *Test Case* Unit | CXX-UTYY | XX adalah nomor kelas, YY adalah nomor urut *test case* unit pada kelas tersebut (contoh: `C03-UT01`). |
  | *Test Case* Integrasi | INT-TCYY | YY adalah nomor urut *test case* pengujian integrasi (contoh: `INT-TC01`). |
  | *Test Case Use Case* | UCXX-TCYY | XX adalah nomor *use case*, YY adalah nomor urut *test case* pada *use case* tersebut (contoh: `UC01-TC01`). |
  | *Test Case* KNF | KNFXX-TCYY | XX adalah nomor KNF, YY adalah nomor urut *test case* pada KNF tersebut (contoh: `KNF01-TC01`). |
</div>

## 1.5 Referensi

- [Dokumen SKPL](../M5/K03_G09_SKPL.md)
- [Dokumen APL](../M6/K03_G09_APL.md)
- [Dokumen DPPL](../M7/DPPL.md)
- [Dokumen DPPL2](../M8/K03_G09_DPPL2.md)
- [Dokumen Implementasi](../M9/K03_G09_Implementasi.md)
- [Dokumentasi Node.js](https://nodejs.org/docs/latest/api/)
- [Dokumentasi Prisma ORM](https://www.prisma.io/docs/getting-started)
- [Dokumentasi ExpressJS](https://expressjs.com/)
- [Dokumentasi React Expo](https://expressjs.com/)
- [Dokumentasi Jest](https://jestjs.io/docs/getting-started)

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf.

<br>

---

<div align="justify">

# BAB 2: Deskripsi Umum Perangkat Lunak
  
**CariUang** adalah perangkat lunak berbasis *mobile application* (dikembangkan dengan React Native/Expo untuk perangkat Android) yang berperan sebagai penghubung antara pekerja jasa sektor informal (**Pemberi Jasa**, seperti teknisi AC, tukang listrik, jasa kebersihan rumah, tukang ledeng, penjahit, dan tukang sol sepatu) dengan masyrakat yang membutuhkan layanan tersebut (**Pelanggan**), serta didukung oleh pihak **Layanan Pelanggan (*Customer Service*)** untuk menangani aduan dan mediasi kendala. Perangkat lunak ini dibangun untuk menjawab keterbatasan akses pemasaran pekerja informal, ketidakpastian pencarian tenaga kerja terdekat yang tepercaya, serta minimnya rekam jejak reputasi dan mekanisme penyelesaian sengketa.<br>
  
Secara garis besar, CariUang beroperasi dengan arsitektur *client–server* berpola **MVC (*Model-View-Controller*)** yang terdiri atas tiga komponen utama: <br>
1. **Aplikasi Mobile (*Frontend*: *View* & *Client Controller*):** Menyediakan antarmuka multi-peran bagi Pelanggan, Pemberi Jasa, dan Layanan Pelanggan untuk autentikasi, pencarian katalog jasa beserta pemetaan lokasi berbasis radius GPS, ruang percakapan (*chat*), pengelolaan kontrak pekerjaan, penilaian (*rating*) dua arah, pengajuan dan mediasi tiket laporan, serta pusat notifikasi.
2. **Server Aplikasi (*Backend API & Real-Time Server*: *Controller* & *Model*):** Dibangun menggunakan Node.js, Express.js, Socket.IO, dan Prisma ORM. Bagian ini menjalankan seluruh logika bisnis, termasuk autentikasi dan otorisasi berbasis JWT, perhitungan jarak lokasi (*Haversine*), mekanisme *optimistic locking* saat pemesanan jasa agar satu pemberi jasa tidak dipesan ganda secara bersamaan, *background worker* pembatalan otomatis kontrak apabila tidak direspons dalam 30 menit, distribusi tiket laporan secara otomatis ke petugas CS yang tersedia, serta pengiriman notifikasi *real-time*.
3. **Basis Data Relasional (*DBMS*):** Menggunakan PostgreSQL 16 (dijalankan melalui Docker Compose) untuk menyimpan secara persisten data pengguna, profil pemberi jasa, kategori jasa, kontrak pekerjaan, riwayat komunikasi, tiket laporan, rating, dan notifikasi.


## 2.2 Batasan dan Keterkaitan dengan Sistem Lain
### 2.2.1 Keterkaitan dengan Sistem dan Layanan Eksternal
Keterkaitan antara perangkat lunak CariUang dengan sistem, layanan perangkat, maupun proses eksternal di luar sistem dirangkum pada Tabel 2.1.
Tabel 2.1. Keterkaitan Perangkat Lunak CariUang dengan Sistem Eksternal
| No | Sistem / Layanan Eksternal | Arah & Bentuk Keterkaitan | Batasan Tanggung Jawab Sistem CariUang |
| :--- | :--- | :--- | :--- |
| 1 | **Layanan Lokasi / GPS Perangkat** (*OS Location Services* melalui `expo-location`) | Sistem membaca koordinat lintang dan bujur (*latitude/longitude*) perangkat Pelanggan dan Pemberi Jasa. | Sistem menghitung jarak (*Haversine*) dan menyaring radius pencarian; akurasi sinyal GPS bergantung pada perangkat keras dan izin lokasi sistem operasi. |
| 2 | **Layanan Peta Eksternal** (*Map Provider* melalui `react-native-maps`) | Sistem mengirimkan daftar koordinat penyedia jasa untuk ditampilkan sebagai penanda (*marker*) di atas peta interaktif. | Sistem hanya menyediakan data koordinat dan tampilan kartu peta; penyediaan *tile* peta dan layanan pemetaan dikelola penyedia peta eksternal. |
| 3 | **Kamera & Galeri Perangkat** (melalui `expo-image-picker`) | Sistem meminta akses media perangkat untuk mengambil gambar bukti laporan (UI-15) atau lampiran percakapan (UI-08/UI-18). | Sistem memvalidasi format (JPG/PNG) dan ukuran berkas (maks. 5 MB) sebelum disimpan di penyimpanan server; pengambilan gambar bergantung pada izin perangkat. |
| 4 | **Layanan *Push Notification* Eksternal** (*Expo Push Service*) | Server menyediakan antarmuka titik sambung `ExpoPushGateway` (`PushGateway`) sebagai jalur integrasi *push notification* di samping *event* Socket.IO. | Pengiriman notifikasi internal ditangani melalui basis data, Socket.IO, dan *polling* aplikasi; pengiriman *push notification* produksi bergantung pada konfigurasi layanan Expo eksternal. |
| 5 | **DBMS PostgreSQL 16** (melalui Docker Compose & Prisma ORM) | *Backend* melakukan operasi baca, tulis, transaksi, penguncian baris (`FOR UPDATE`), dan indeksasi melalui koneksi TCP ke PostgreSQL. | Pengelolaan penyimpanan fisik dan persistensi volume data ditangani oleh layanan DBMS PostgreSQL. |

### 2.2.2 Batasan Perangkat Lunak
Batasan ruang lingkup, pengguna, dan teknis yang berlaku pada perangkat lunak CariUang adalah sebagai berikut:
1. **Batasan Ruang Lingkup Fungsional:**
   - **Pembayaran di luar sistem:** Transaksi pembayaran upah jasa dilakukan secara langsung antara Pelanggan dan Pemberi Jasa di luar aplikasi; CariUang tidak menyediakan *payment gateway* maupun dompet digital internal.
   - **Pekerjaan fisik luring (*offline*):** Pelaksanaan jasa dilakukan secara langsung di lokasi pelanggan. Aplikasi hanya mengelola pencatatan kontrak, status pengerjaan (`Menunggu` → `On Progress` → `Menunggu Konfirmasi Pelanggan` → `Done`, atau `Ditolak`/`Dibatalkan`), komunikasi, penilaian, dan mediasi tiket.
   - **Validasi data administratif:** Aplikasi memvalidasi kelengkapan, format, tipe data, serta keamanan masukan pada sisi server, tetapi tidak melakukan verifikasi identitas kependudukan (misalnya integrasi Dukcapil/KYC) ataupun pengujian keahlian fisik secara otomatis.
   - **Akun Layanan Pelanggan (CS):** Akun CS disediakan oleh pengelola sistem (*pre-provisioned* melalui basis data/seed) dan tidak dibuka untuk pendaftaran mandiri publik.
2. **Batasan Pengguna dan Asumsi Operasional:**
   - Pengguna (Pelanggan dan Pemberi Jasa) diasumsikan memiliki *smartphone* yang kompatibel, koneksi internet aktif, literasi digital dasar untuk mengoperasikan aplikasi, serta memberikan data profil dan kebutuhan jasa yang nyata (bukan fiktif).
   - Pemberi Jasa diasumsikan mengaktifkan layanan GPS saat menerima pesanan serta melaksanakan pekerjaan secara profesional sesuai kesepakatan.
3. **Batasan Teknis:**
   - Target utama platform *client* adalah sistem operasi **Android** (dijalankan melalui React Native / Expo Go atau Android Emulator) dengan dukungan antarmuka satu bahasa (**Bahasa Indonesia**).
   - Arsitektur diimplementasikan untuk lingkungan *deployment* lokal/kontainer (Node.js/Express + PostgreSQL 16 pada Docker Compose) dengan skalabilitas yang disesuaikan untuk kebutuhan pengujian dan operasional skala terbatas.

## 2.3 Pemodelan Kasus Penggunaan (*Use Case*)
### 2.3.1 Identifikasi Aktor
Perangkat lunak CariUang melibatkan tiga aktor utama yang berinteraksi langsung dengan sistem, sebagaimana tercantum pada Tabel 2.2. Dalam pemodelan *use case*, **Pelanggan** dan **Pemberi Jasa** juga digeneralisasikan sebagai aktor **Pengguna** untuk fungsionalitas bersama (registrasi akun, *login*, dan pemberian *rating*).
Tabel 2.2. Identifikasi Aktor Perangkat Lunak CariUang
| ID Aktor | Aktor | Deskripsi |
| :--- | :--- | :--- |
| A01 | Pemberi Jasa | Pihak penyedia jasa informal yang mendaftarkan layanan, menerima atau menolak pesanan, bernegosiasi dengan pelanggan, melaksanakan pekerjaan fisik di lokasi, memperbarui status penyelesaian, memberi *rating*, serta melaporkan masalah jika terjadi kendala. |
| A02 | Pelanggan | Pihak yang membutuhkan, mencari, memilih, dan memesan layanan jasa, melakukan negosiasi harga, menginput kesepakatan kontrak, mengonfirmasi penyelesaian pekerjaan, membayar jasa secara langsung, memberi *rating*, serta melaporkan masalah. |
| A03 | Layanan Pelanggan | Pihak pengelola (*Customer Service*) yang memantau, merespons, dan memediasi tiket laporan masalah yang diajukan oleh Pelanggan maupun Pemberi Jasa hingga permasalahan terselesaikan. |
### 2.3.2 *Use Case Diagram*
Pemodelan fungsionalitas perangkat lunak berdasarkan interaksi antaraktor disajikan pada *Use Case Diagram* Gambar 2.3.
<p align="center">
<img alt="Use Case Diagram CariUang" src="../M5/assets/diagram/USE-CASE-DIAGRAM.png" width="90%">
</p>
<p align="center">
<i>Gambar 2.X. Use Case Diagram Perangkat Lunak CariUang</i>
</p>

### 2.3.3 Daftar *Use Case*

Ringkasan seluruh *use case* yang dimodelkan pada Gambar 2.3 beserta pemetaannya terhadap Kebutuhan Fungsional (KF) pada SKPL disajikan pada Tabel 2.3.<br>
Tabel 2.3. Daftar *Use Case* Perangkat Lunak CariUang

| ID UC | Nama *Use Case* | Deskripsi Singkat | Aktor | ID KF Terkait |
| :--- | :--- | :--- | :--- | :--- |
| UC01 | Mendaftarkan jasa | Pemberi jasa mendaftarkan diri beserta informasi kategori, tarif, jam kerja, daerah kerja, dan deskripsi jasa yang ditawarkan. | Pemberi Jasa | KF04, KF05 |
| UC02 | Memilih jasa | Pelanggan menelusuri katalog kategori jasa, melihat lokasi pemberi jasa pada peta dan jaraknya, serta memilih jasa yang sesuai kebutuhan. | Pelanggan | KF01, KF02, KF03, KF08 |
| UC03 | Menghubungi pemberi jasa | Pelanggan mengirimkan pesan kepada pemberi jasa melalui ruang komunikasi terkait detail pekerjaan dan penawaran harga awal. | Pelanggan | KF09 |
| UC04 | Merespon pelanggan | Pemberi jasa menerima notifikasi dan menanggapi pelanggan melalui obrolan, baik memberikan estimasi/tawaran harga, menyetujui, maupun menolak pesanan. | Pemberi Jasa | KF06, KF07, KF09 |
| UC05 | Memasukkan kesepakatan harga dan pekerjaan | Pelanggan menginput detail kesepakatan pekerjaan dan harga ke dalam aplikasi; setelah disetujui, status pekerjaan berubah menjadi *On Progress* dan penyedia jasa dikunci dari pesanan lain. | Pelanggan | KF10, KF11 |
| UC06 | Mengubah status pekerjaan menjadi selesai | Pemberi jasa melaporkan melalui aplikasi bahwa pekerjaan fisik telah selesai dilaksanakan sehingga menunggu konfirmasi pelanggan. | Pemberi Jasa | KF12 |
| UC07 | Mengonfirmasi status pekerjaan | Pelanggan mengonfirmasi laporan penyelesaian pekerjaan dari pemberi jasa sehingga status pekerjaan berubah menjadi *Done*. | Pelanggan | KF13 |
| UC08 | Melaporkan masalah | Pelanggan atau pemberi jasa mengajukan tiket laporan kendala beserta keterangan dan bukti foto kepada layanan pelanggan. | Pelanggan, Pemberi Jasa | KF14, KF15, KF16 |
| UC09 | Merespon laporan masalah | Layanan pelanggan menerima notifikasi tiket baru, meninjau laporan, berkomunikasi di ruang mediasi dengan pelapor, dan menutup tiket setelah selesai. | Layanan Pelanggan, Pelanggan, Pemberi Jasa | KF15, KF17, KF18 |
| UC10 | Memberi rating | Pelanggan dan pemberi jasa saling memberikan skor penilaian (1–5) dan ulasan setelah kontrak selesai untuk memperbarui akumulasi rata-rata rating profil. | Pelanggan, Pemberi Jasa | KF19, KF20 |
| UC11 | Memasuki akun dalam perangkat lunak | Pelanggan, pemberi jasa, dan layanan pelanggan melakukan autentikasi (*login*) menggunakan akun yang telah terdaftar untuk mengakses fitur sesuai peran. | Pelanggan, Pemberi Jasa, Layanan Pelanggan | KF21 |
| UC12 | Mendaftar akun ke perangkat lunak | Pelanggan dan pemberi jasa mendaftarkan akun baru pada aplikasi CariUang. | Pelanggan, Pemberi Jasa | KF21 |


</div>

<br>

---

<div align="justify">

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *Menggunakan laptop atau PC* |
| *Operating System* | *Windows 10 atau yang terbaru, macOS* |
| *Bahasa Pemrograman* | *TypeScript 5.7.2 (backend), TypeScript ~6.0.3 (frontend)* |
| *Framework/Library* | *<ul> Framework <li>React Native 0.88.1 <li> Expo SDK ~58.0.22 <li> Express.js 4.21.2 </ul> <ul> Library <li> React Navigation v7 <li> Socket.IO 4.8.4 </li> </ul>* |
| *DBMS* | *<ul> <li> PostgreSQL 16 (via Docker image `postgres:16-alpine`)<li>Prisma ORM 5.22.0 </li> </ul>* |
| *Development Tools* | *<ul> <li> IDE : Visual Studio Code <li> Version Control: Git <li> Remote Repository: GitHub </li> </ul>* |
| *Testing Tools* | *<ul> <li> Jest (~30.5.2) <li> Jest-Expo (~58.0.14)</li> </ul>* |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | Pengguna | `src/backend/src/models/Pengguna.ts`<br>`src/backend/prisma/schema.prisma` (`model Pengguna`) | - |
| 2 | C02 | PenggunaUI | `src/frontend/src/views/auth/RegisterCustomerView.tsx`<br>`src/frontend/src/views/profile/ProfileView.tsx`<br>`src/frontend/src/views/history/CustomerHistoryView.tsx`<br>`src/frontend/src/views/chat/ConversationListView.tsx`<br>`src/frontend/src/controllers/useAuthController.ts` | - |
| 3 | C03 | PenggunaController | `src/backend/src/controllers/PenggunaController.ts`<br>`src/backend/src/routes/auth.routes.ts`<br>`src/backend/src/routes/user.routes.ts` <br> `src/backend/src/middlewares/auth.middleware.ts` | - |
| 4 | C04 | PemberiJasa | `src/backend/src/models/PemberiJasa.ts`<br>`src/backend/prisma/schema.prisma` (`model PemberiJasa`) | - |
| 5 | C05 | PemberiJasaUI | `src/frontend/src/views/home/SearchResultView.tsx`<br>`src/frontend/src/components/MapViewCard.tsx`<br>`src/frontend/src/views/auth/RegisterProviderView.tsx`<br>`src/frontend/src/views/history/ProviderHistoryView.tsx`<br>`src/frontend/src/views/chat/ProviderChatView.tsx`<br>`src/frontend/src/views/auth/LoginView.tsx` | - |
| 6 | C06 | PemberiJasaController | `src/backend/src/controllers/PemberiJasaController.ts`<br>`src/backend/src/routes/services.routes.ts`<br>`src/backend/src/routes/auth.routes.ts`<br>`src/frontend/src/controllers/useCatalogController.ts` | - |
| 7 | C07 | Pelanggan | `src/backend/src/models/Pelanggan.ts` | - |
| 8 | C08 | PelangganUI | `src/frontend/src/views/auth/LoginView.tsx`<br>`src/frontend/src/views/auth/RegisterCustomerView.tsx`<br>`src/frontend/src/views/home/HomeView.tsx`<br>`src/frontend/src/views/home/SearchRecommendationView.tsx`<br>`src/frontend/src/views/chat/CustomerChatView.tsx`<br>`src/frontend/src/navigation/RootNavigator.tsx`<br>`src/frontend/src/navigation/MainTabNavigator.tsx` | - |
| 9 | C09 | PelangganController | `src/backend/src/controllers/PelangganController.ts`<br>`src/backend/src/routes/auth.routes.ts` | - |
| 10 | C10 | LayananPelanggan | `src/backend/src/models/LayananPelanggan.ts`<br>`src/backend/prisma/schema.prisma` (`model LayananPelanggan`) | - |
| 11 | C11 | LayananPelangganUI | `src/frontend/src/views/ticket/CSDashboardScreen.tsx`<br>`src/frontend/src/views/ticket/TicketDetailScreen.tsx`<br>`src/frontend/src/views/auth/LoginView.tsx` | - |
| 12 | C12 | LayananPelangganController | `src/backend/src/controllers/LayananPelangganCtrl.ts`<br>`src/backend/src/routes/cs.routes.ts`<br>`src/backend/src/routes/auth.routes.ts` | - |
| 13 | C13 | KategoriJasa | `src/backend/src/models/KategoriJasa.ts`<br>`src/backend/prisma/schema.prisma` (`model KategoriJasa`) | - |
| 14 | C14 | KategoriJasaUI | `src/frontend/src/views/service/ServiceRegistrationView.tsx`<br>`src/frontend/src/views/home/HomeView.tsx`<br>`src/frontend/src/views/home/SearchRecommendationView.tsx` | - |
| 15 | C15 | KategoriJasaController | `src/backend/src/controllers/KategoriJasaController.ts`<br>`src/backend/src/routes/services.routes.ts`<br>`src/frontend/src/controllers/useCatalogController.ts` | - |
| 16 | C16 | KontrakPekerjaan | `src/backend/src/models/KontrakPekerjaan.ts`<br>`src/backend/prisma/schema.prisma` (`model KontrakPekerjaan`)<br>`src/backend/src/workers/autoCancelKontrakWorker.ts` | - |
| 17 | C17 | KontrakPekerjaanUI | `src/frontend/src/components/chat/ContractCard.tsx`<br>`src/frontend/src/views/chat/CustomerChatView.tsx`<br>`src/frontend/src/views/chat/ProviderChatView.tsx`<br>`src/frontend/src/views/history/CustomerHistoryView.tsx`<br>`src/frontend/src/views/history/ProviderHistoryView.tsx`<br>`src/frontend/src/controllers/useContractController.ts`<br>`src/frontend/src/services/contractService.ts` | - |
| 18 | C18 | KontrakPekerjaanController | `src/backend/src/controllers/KontrakPekerjaanController.ts`<br>`src/backend/src/routes/kontrakRoutes.ts` | - |
| 19 | C19 | Komunikasi | `src/backend/src/models/Komunikasi.ts`<br>`src/backend/prisma/schema.prisma` (`model Komunikasi`) | - |
| 20 | C20 | KomunikasiUI | `src/frontend/src/views/ChatScreen.tsx`<br>`src/frontend/src/views/chat/ConversationListView.tsx`<br>`src/frontend/src/views/chat/CustomerChatView.tsx`<br>`src/frontend/src/views/chat/ProviderChatView.tsx`<br>`src/frontend/src/views/chat/ChatRoom.tsx`<br>`src/frontend/src/components/chat/ChatBubble.tsx`<br>`src/frontend/src/components/chat/MessageInput.tsx`<br>`src/frontend/src/components/chat/ChatHeader.tsx`<br>`src/frontend/src/components/chat/ConversationCard.tsx`<br>`src/frontend/src/components/chat/SearchField.tsx`<br>`src/frontend/src/controllers/useChatController.ts`<br>`src/frontend/src/services/chatService.ts` | - |
| 21 | C21 | KomunikasiController | `src/backend/src/controllers/KomunikasiController.ts`<br>`src/backend/src/routes/chats.routes.ts`<br>`src/backend/src/server.ts` | - |
| 22 | C22 | TiketLaporan | `src/backend/src/models/TiketLaporan.ts`<br>`src/backend/prisma/schema.prisma` (`model TiketLaporan`)<br>`src/backend/prisma/migrations/20261112100000_tiket_nomor_sequence/migration.sql` | - |
| 23 | C23 | TiketLaporanUI | `src/frontend/src/views/ticket/CreateTicketScreen.tsx`<br>`src/frontend/src/views/ticket/TicketDetailScreen.tsx`<br>`src/frontend/src/views/ticket/MyTicketsScreen.tsx`<br>`src/frontend/src/services/ticketService.ts` | - |
| 24 | C24 | TiketLaporanController | `src/backend/src/controllers/TiketLaporanController.ts`<br>`src/backend/src/routes/tickets.routes.ts`<br>`src/backend/src/middlewares/upload.middleware.ts` | - |
| 25 | C25 | Rating | `src/backend/src/models/Rating.ts`<br>`src/backend/prisma/schema.prisma` (`model Rating`) | - |
| 26 | C26 | RatingUI | src/frontend/src/views/rating/RatingView.tsx<br>src/frontend/src/controllers/useRatingController.ts<br>src/frontend/src/services/ratingService.ts | - |
| 27 | C27 | RatingController | src/backend/src/controllers/RatingController.ts<br>src/backend/src/routes/ratings.routes.ts | - |
| 28 | C28 | Notifikasi | src/backend/src/models/Notifikasi.ts<br>src/backend/prisma/schema.prisma (model Notifikasi) | - |
| 29 | C29 | NotifikasiUI | src/frontend/src/views/chat/notifications/NotificationView.tsx<br>src/frontend/src/components/notifications/NotificationCard.tsx<br>src/frontend/src/controllers/useNotificationController.ts<br>src/frontend/src/services/notificationService.ts<br>src/frontend/src/context/UnreadContext.tsx<br>src/frontend/src/components/chat/UnreadBadge.tsx | - |
| 30 | C30 | NotifikasiController | src/backend/src/controllers/NotifikasiController.ts <br> src/backend/src/routes/notifications.routes.ts | - |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | UI-01 (I-01) | Login | `src/frontend/src/views/auth/LoginView.tsx.` | - |
| 2 | UI-02 (I-02) | Buat Akun Pengguna | `src/frontend/src/views/auth/RegisterCustomerView.tsx` | - |
| 3 | UI-03 (I-03) | Buat Akun Pemilik Jasa | src/frontend/src/views/auth/RegisterCustomerView.tsx | - |
| 4 | UI-04 (I-04) | Home / Beranda | `src/frontend/src/views/home/HomeView.tsx` | - |
| 5 | UI-05 (I-05) | Rekomendasi Pencarian | src/frontend/src/views/home/SearchRecommendationView.tsx | - |
| 6 | UI-06 (I-06) | Hasil Pencarian | src/frontend/src/views/home/SearchResultView.tsx <br> src/frontend/src/components/MapViewCard.tsx | - |
| 7 | UI-07 (I-07) | Daftar Pesan | src/frontend/src/views/chat/CustomerChatView.tsx <br> src/frontend/src/views/ChatScreen.tsx | - |
| 8 | UI-08 (I-08) | Ruang Obrolan (Chat Channel) Pelanggan | src/frontend/src/views/chat/CustomerChatView.tsx <br> src/frontend/src/views/chat/ChatRoom.tsx <br> src/frontend/src/components/chat/ContractCard.tsx | - | 
| 9 | UI-09 (I-09) | Ruang Obrolan (Chat Channel) Pemilik Jasa | src/frontend/src/views/chat/ProviderChatView.tsx <br> src/frontend/src/views/chat/ChatRoom.tsx <br> src/frontend/src/components/chat/ContractCard.tsx | - | 
| 10 | UI-10 (I-10) | Riwayat (Pelanggan) | src/frontend/src/views/history/CustomerHistoryView.tsx <br> src/frontend/src/views/RiwayatScreen.tsx | - |
| 11 | UI-11 (I-11) | Beri Penilaian | src/frontend/src/views/rating/RatingView.tsx | - |
| 12 | UI-12 (I-12) | Riwayat Pekerjaan (Pemilik Jasa) | src/frontend/src/views/history/ProviderHistoryView.tsx <br> src/frontend/src/views/RiwayatScreen.tsx |
| 13 | UI-13 (I-13) | Notifikasi | src/frontend/src/views/chat/notifications/NotificationView.tsx <br> src/frontend/src/components/notifications/NotificationCard.tsx | - |
| 14 | UI-14 (I-14) | Profil | src/frontend/src/views/profile/ProfileView.tsx | - |
| 15 | UI-15 (I-15) | Buat Tiket Laporan | src/frontend/src/views/ticket/CreateTicketScreen.tsx | - |
| 16 | UI-16 (I-16) | Daftar Penyedia Jasa | src/frontend/src/views/service/ServiceRegistrationView.tsx <br> src/frontend/src/views/home/SearchResultView.tsx | - |
| 17 | UI-17 (I-17) | Home untuk CS | src/frontend/src/views/ticket/CSDashboardScreen.tsx <br> src/frontend/src/views/cs/CSHomeView.tsx | - |
| 18 | UI-18 (I-18) | Detail Tiket (Chat Channel CS & Pelapor) | src/frontend/src/views/ticket/TicketDetailScreen.tsx | - |
| 19 | UI-19 (I-19) | Tiket Saya | src/frontend/src/views/ticket/MyTicketsScreen.tsx | - |




## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
| ... | *...* | *...* |

<br>

</div>

---

<div align="justify">

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL (`C01` s.d. `C30`) diklasifikasikan ke dalam tiga tingkat kedalaman pengujian:
- **Mendalam (13 kelas):** Kelas yang memuat logika bisnis inti, validasi masukan, perhitungan (jarak *Haversine*, akumulasi *rating*), aturan transisi status, pengendalian konkurensi (*optimistic locking*, penguncian baris `FOR UPDATE`), algoritma DPPL (`ALGO-XXX`), atau keamanan autentikasi/otorisasi. Kelas pada tingkat ini diuji pada seluruh operasi `public` (kasus *Normal*, *Batas*, dan *Negatif*) dengan target *coverage* ≥ 70%.
- **Sedang (7 kelas):** Kelas yang mengoordinasikan/mendelegasikan proses ke kelas lain atau memuat *helper* presentasi/validasi ringan di sisi klien. Kelas pada tingkat ini diuji minimal dengan kasus *Normal* dan *Negatif/Gagal* pada operasi utama.
- **Tidak perlu (10 kelas):** Kelas tanpa logika bisnis, seperti *entity/DTO* murni, kelas akses ORM tanpa aturan bisnis, serta lapisan *View* React Native murni yang diuji secara tidak langsung melalui pengujian *use case* pada Subbab 4.4.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas
| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C01 | Pengguna | Sedang | Kelas induk akun yang mayoritas berisi *getter/setter* dan *query* profil, namun memiliki operasi `addNewRatingRiwayat()` dan delegasi `konfirmasiPekerjaan()`. | C01-UT01 s.d. C01-UT04, INT-TC01, INT-TC07 |
| C02 | PenggunaUI | Tidak perlu | Lapisan *View* React Native (registrasi, profil, riwayat) tanpa logika bisnis internal; teruji melalui pengujian *use case* (`UC10`, `UC11`, `UC12`). | - |
| C03 | PenggunaController | Mendalam | Memuat aturan keamanan autentikasi (*bcrypt*, *dummy hash* anti-*timing attack*, pembuatan JWT) serta validasi format input registrasi (`ALGO-001`, `ALGO-017`). | C03-UT01 s.d. C03-UT08, INT-TC01 |
| C04 | PemberiJasa | Mendalam | Memuat pencarian penyedia jasa berbasis jarak *Haversine*, filter kategori/radius, pengurutan (*terdekat*, *rating*, *termurah*), dan atribut *optimistic locking* (`version`). | C04-UT01 s.d. C04-UT06, INT-TC02, INT-TC03 |
| C05 | PemberiJasaUI | Tidak perlu | Lapisan *View* React Native (hasil pencarian, peta, registrasi penyedia, riwayat) tanpa logika bisnis internal; teruji melalui `UC01`, `UC02`, `UC04`, `UC06`, `UC11`. | - |
| C06 | PemberiJasaController | Mendalam | Memuat validasi registrasi penyedia jasa (`ALGO-012`), validasi parameter pencarian & detail penyedia (`ALGO-002`, `ALGO-009`, `ALGO-011`), serta *helper* katalog klien (`useCatalogController`). | C06-UT01 s.d. C06-UT07, INT-TC02, INT-TC03 |
| C07 | Pelanggan | Tidak perlu | Subkelas *entity/DTO* murni dari `Pengguna` tanpa aturan bisnis tambahan (hanya konstruksi `makePelanggan()` dan penyimpanan ke tabel `pengguna`). | - |
| C08 | PelangganUI | Tidak perlu | Lapisan *View* React Native (login, beranda, rekomendasi pencarian, obrolan pelanggan) tanpa logika bisnis; teruji melalui `UC02`, `UC03`, `UC05`, `UC07`, `UC11`, `UC12`. | - |
| C09 | PelangganController | Sedang | Mengoordinasikan registrasi pelanggan dengan mendelegasikan validasi ke `PenggunaController`, cek duplikasi ke `Pengguna`, dan penyimpanan ke `Pelanggan`. | C09-UT01 s.d. C09-UT03, INT-TC01 |
| C10 | LayananPelanggan | Mendalam | Memuat algoritma pemilihan staf CS berbeban terkecil (`cariLayananKosong()`, `ALGO-019` dengan penguncian baris `FOR UPDATE`) serta manajemen beban tiket (`tambahBeban`, `kurangiBeban`). | C10-UT01 s.d. C10-UT05, INT-TC08, INT-TC09 |
| C11 | LayananPelangganUI | Tidak perlu | Lapisan *View* React Native (Meja Kerja CS & tampilan detail tiket) tanpa logika bisnis internal; teruji melalui `UC09`, `UC11`. | - |
| C12 | LayananPelangganController | Mendalam | Memuat otorisasi login khusus peran CS, validasi filter tiket (`ALGO-020`), *auto-claim* & perubahan status `Open` → `Diproses` saat membalas (`ALGO-021`), serta penutupan tiket dan pengurangan beban CS. | C12-UT01 s.d. C12-UT06, INT-TC09 |
| C13 | KategoriJasa | Sedang | Kelas entitas kategori jasa yang berisi *getter/setter* (`ALGO-022`–`ALGO-029`) serta operasi penyimpanan dan pengurutan alfabetis via Prisma (`ALGO-031`, `Q-015`). | C13-UT01 s.d. C13-UT03, INT-TC02 |
| C14 | KategoriJasaUI | Tidak perlu | Lapisan *View* React Native (form pendaftaran jasa & daftar kategori beranda) tanpa logika bisnis; teruji melalui `UC01`, `UC02`. | - |
| C15 | KategoriJasaController | Mendalam | Memuat validasi input pendaftaran jasa (`validateKategoriJasa()`, `ALGO-033`), transaksi penyimpanan kategori & pembaruan peran penyedia (`ALGO-034`, `ALGO-035`), dan pemfilteran kategori (`filterKategoriJasa()`). | C15-UT01 s.d. C15-UT06, INT-TC02 |
| C16 | KontrakPekerjaan | Mendalam | Memuat aturan transisi status pekerjaan (`VALID_TRANSITIONS`, `KNF22`), *optimistic locking* pemesanan (`KNF04`, `KNF19`), konstruksi/validasi kontrak (`ALGO-036`–`ALGO-040`), dan *worker* *auto-cancel* 30 menit (`KNF11`). | C16-UT01 s.d. C16-UT07, INT-TC05, INT-TC06, INT-TC07 |
| C17 | KontrakPekerjaanUI | Sedang | Mencakup *hook* `useContractController` di sisi klien yang menjalankan sanitasi/validasi form kontrak, pemetaan status kartu, filter tab riwayat, dan aturan visibilitas tombol aksi. | C17-UT01 s.d. C17-UT04 |
| C18 | KontrakPekerjaanController | Mendalam | Mengatur seluruh siklus bisnis kontrak (`kirimInput`, `konfirmasiPersetujuanPenyedia`, `selesaikanPekerjaan`, `konfirmasiPekerjaan`, `ALGO-041`–`ALGO-043`), larangan *self-contract*, serta integrasi notifikasi & chat. | C18-UT01 s.d. C18-UT07, INT-TC05, INT-TC07 |
| C19 | Komunikasi | Mendalam | Memuat inisialisasi pesan, isolasi dan pengurutan riwayat percakapan dua arah (`ALGO-044`–`ALGO-048`), penandaan pesan terbaca, dan agregasi daftar percakapan serta jumlah belum terbaca (`unreadCount`). | C19-UT01 s.d. C19-UT05, INT-TC04 |
| C20 | KomunikasiUI | Tidak perlu | Lapisan *View* React Native (daftar percakapan & ruang obrolan) tanpa logika bisnis internal; teruji melalui `UC03`, `UC04`. | - |
| C21 | KomunikasiController | Mendalam | Memuat validasi pesan (anti-*self-message*, batas 1000 karakter, anti-*spoofing* pengirim), kontrol akses riwayat chat (`ALGO-049`–`ALGO-052`), pemancaran *Socket.IO*, dan pemicuan notifikasi aman. | C21-UT01 s.d. C21-UT06, INT-TC04 |
| C22 | TiketLaporan | Sedang | Mengelola operasi persistensi tiket, penomoran `A-xxxx`, statistik status, dan pengambilan/penambahan pesan mediasi via Prisma (`Q-008`). | C22-UT01 s.d. C22-UT03, INT-TC08, INT-TC09 |
| C23 | TiketLaporanUI | Tidak perlu | Lapisan *View* React Native (buat tiket, daftar tiket saya, detail mediasi) tanpa logika bisnis internal; teruji melalui `UC08`, `UC09`. | - |
| C24 | TiketLaporanController | Mendalam | Memuat validasi form aduan (`validasiFormTiket()`, `ALGO-053`), transaksi pembuatan tiket + penugasan otomatis CS (`ALGO-013`, `ALGO-054`), notifikasi non-blokir (`ALGO-055`), dan kontrol akses pelapor. | C24-UT01 s.d. C24-UT06, INT-TC08, INT-TC09 |
| C25 | Rating | Mendalam | Memuat sanitasi *ulasan* & *tags* (`makeRating()`, `ALGO-057`), validasi nilai batas 1–5 (`ALGO-056`), serta kalkulasi rata-rata array PostgreSQL dengan pembulatan 2 desimal (`updateRatingPengguna()`, `ALGO-058`). | C25-UT01 s.d. C25-UT06, INT-TC10 |
| C26 | RatingUI | Sedang | Mencakup *hook* `useRatingController` di sisi klien yang mengelola label predikat bintang (1–5), multi-pilih *tag* per peran, aktivasi tombol kirim, dan logika visibilitas tombol *Beri Rating* dua arah. | C26-UT01 s.d. C26-UT04 |
| C27 | RatingController | Mendalam | Memuat validasi parameter rating (`validateRatingValue()`, `ALGO-064`), penegakan status kontrak wajib `Done`, pencegahan rating ganda per kontrak, dan pengambilan riwayat rating pengguna. | C27-UT01 s.d. C27-UT06, INT-TC10 |
| C28 | Notifikasi | Tidak perlu | Kelas model akses data murni Prisma ORM tanpa aturan bisnis (terdokumentasi langsung di `Notifikasi.ts`); teruji tidak langsung melalui `C30` dan pengujian integrasi. | - |
| C29 | NotifikasiUI | Tidak perlu | Lapisan *View* React Native (daftar notifikasi & *badge* belum dibaca) tanpa logika bisnis internal; teruji melalui `UC04`, `UC08`, `UC09`. | - |
| C30 | NotifikasiController | Sedang | Mengoordinasikan pembuatan notifikasi (`buatNotifikasi()`, `ALGO-067`), pemancaran *Socket.IO*, pemanggilan `ExpoPushGateway`, dan penandaan notifikasi terbaca. | C30-UT01 s.d. C30-UT03, INT-TC04, INT-TC05, INT-TC08 |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: jalankan `npm install` lalu `npx jest` di direktori `src/backend` dan `src/frontend`. Laporan *coverage* diperoleh dengan `npx jest --coverage`.

Lokasi file test: `src/backend/tests/` (kelas *Model* dan *Controller* sisi server) dan `src/frontend/tests/` (*hook controller* sisi klien, mis. `useContractController` dan `useRatingController`).

### 4.2.1 Kelas Pengguna

**ID Kelas:** C01  
**Nama Kelas:** Pengguna  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C01]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C01-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C01-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C01-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C01]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.2 Kelas PenggunaUI

**ID Kelas:** C02  
**Nama Kelas:** PenggunaUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.2. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.2b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.3 Kelas PenggunaController

**ID Kelas:** C03  
**Nama Kelas:** PenggunaController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.3. Hasil Pengujian Unit Kelas [C03]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C03-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C03-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C03-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.3b. Ringkasan Cakupan Kelas [C03]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.4 Kelas PemberiJasa

**ID Kelas:** C04  
**Nama Kelas:** PemberiJasa  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.4. Hasil Pengujian Unit Kelas [C04]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C04-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C04-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C04-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.4b. Ringkasan Cakupan Kelas [C04]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.5 Kelas PemberiJasaUI

**ID Kelas:** C05  
**Nama Kelas:** PemberiJasaUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.5. Hasil Pengujian Unit Kelas [C05]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C05-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C05-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C05-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.5b. Ringkasan Cakupan Kelas [C05]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.6 Kelas PemberiJasaController

**ID Kelas:** C06  
**Nama Kelas:** PemberiJasaController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.6. Hasil Pengujian Unit Kelas [C06]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C06-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C06-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C06-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.6b. Ringkasan Cakupan Kelas [C06]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.7 Kelas Pelanggan

**ID Kelas:** C07  
**Nama Kelas:** Pelanggan  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.7. Hasil Pengujian Unit Kelas [C07]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C07-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C07-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C07-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.7b. Ringkasan Cakupan Kelas [C07]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.8 Kelas PelangganUI

**ID Kelas:** C08  
**Nama Kelas:** PelangganUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.8. Hasil Pengujian Unit Kelas [C08]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C08-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C08-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C08-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.8b. Ringkasan Cakupan Kelas [C08]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.9 Kelas PelangganController

**ID Kelas:** C09  
**Nama Kelas:** PelangganController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.9. Hasil Pengujian Unit Kelas [C09]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C09-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C09-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C09-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.9b. Ringkasan Cakupan Kelas [C09]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.10 Kelas LayananPelanggan

**ID Kelas:** C10  
**Nama Kelas:** LayananPelanggan  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.10. Hasil Pengujian Unit Kelas [C10]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C10-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C10-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C10-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.10b. Ringkasan Cakupan Kelas [C10]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.11 Kelas LayananPelangganUI

**ID Kelas:** C11  
**Nama Kelas:** LayananPelangganUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.11. Hasil Pengujian Unit Kelas [C11]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C11-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C11-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C11-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.11b. Ringkasan Cakupan Kelas [C11]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.12 Kelas LayananPelangganController

**ID Kelas:** C12  
**Nama Kelas:** LayananPelangganController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.12. Hasil Pengujian Unit Kelas [C12]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C12-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C12-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C12-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.12b. Ringkasan Cakupan Kelas [C12]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.13 Kelas KategoriJasa

**ID Kelas:** C13  
**Nama Kelas:** KategoriJasa  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.13. Hasil Pengujian Unit Kelas [C13]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C13-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C13-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C13-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.13b. Ringkasan Cakupan Kelas [C13]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.14 Kelas KategoriJasaUI

**ID Kelas:** C14  
**Nama Kelas:** KategoriJasaUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.14. Hasil Pengujian Unit Kelas [C14]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C14-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C14-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C14-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.14b. Ringkasan Cakupan Kelas [C14]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.15 Kelas KategoriJasaController

**ID Kelas:** C15  
**Nama Kelas:** KategoriJasaController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.15. Hasil Pengujian Unit Kelas [C15]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C15-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C15-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C15-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.15b. Ringkasan Cakupan Kelas [C15]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.16 Kelas KontrakPekerjaan

**ID Kelas:** C16  
**Nama Kelas:** KontrakPekerjaan  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.16. Hasil Pengujian Unit Kelas [C16]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C16-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C16-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C16-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.16b. Ringkasan Cakupan Kelas [C16]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.11 Kelas KontrakPekerjaanUI

**ID Kelas:** C17  
**Nama Kelas:** KontrakPekerjaanUI  
**Tingkat:** *Sedang* (diuji melalui *hook* `useContractController`)

Tabel 4.2.11. Hasil Pengujian Unit Kelas [C17]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C17-UT01 | `sanitizeHargaInput()`, `validateContractForm()` | Normal & Batas | Panggil `sanitizeHargaInput()` dengan `'0'`, `'000'`, dan `'0100000'`; panggil `formatHargaRibuan('100000')`; panggil `validateContractForm()` dengan deskripsi `"Bersihin rumah wimar"` dan `totalHarga` `'0'` serta `100000`. | Sanitasi menghasilkan `'0'`, `'0'`, dan `'100000'` (nol di depan terhapus); format menghasilkan `'100.000'`; validasi mengembalikan `isValid = true` dengan `parsedHarga` bernilai `0` dan `100000`. | `sanitizeHargaInput()` menghasilkan `'0'`, `'0'`, `'100000'`; `formatHargaRibuan()` menghasilkan `'100.000'`; `validateContractForm()` mengembalikan `isValid = true` dengan `parsedHarga` `0` dan `100000`. Sesuai harapan. | Pass |
| C17-UT02 | `validateContractForm()` | Negatif | Panggil `validateContractForm()` dengan (a) deskripsi `'   '` (hanya spasi) dan harga `'100000'`; (b) deskripsi valid dan harga `'-5000'`. | (a) `isValid = false` dan `errors.deskripsi` terisi; (b) `isValid = false` dan `errors.totalHarga` terisi. | (a) `isValid = false` dengan `errors.deskripsi` terisi; (b) `isValid = false` dengan `errors.totalHarga` terisi. Sesuai harapan. | Pass |
| C17-UT03 | `filterCustomerTransactionsByTab()`, `filterProviderJobsByTab()` | Normal | Ambil data riwayat pelanggan dan riwayat pekerjaan penyedia jasa (masing-masing ≥ 4 entri dengan status campuran), lalu filter dengan tab `'Semua'`, `'Selesai'`, dan `'On Progress'`. | Tab `Semua` mengembalikan seluruh data; tab `Selesai` hanya berisi item dengan `statusDisplay = 'Selesai'`; tab `On Progress` hanya berisi item dengan `statusDisplay = 'On Progress'` (berlaku untuk pelanggan dan penyedia jasa). | Tab `Semua` mengembalikan seluruh data; tab `Selesai` dan `On Progress` hanya berisi item dengan `statusDisplay` yang sesuai, baik untuk riwayat pelanggan maupun penyedia jasa. Sesuai harapan. | Pass |
| C17-UT04 | `shouldShowPekerjaanSelesaiButton()`, `shouldShowKonfirmasiSelesaiButton()`, `shouldShowBeriRatingButton()` | Normal & Batas | Panggil tiap fungsi dengan status `'On Progress'`, `'Menunggu Konfirmasi Pelanggan'`, dan `'Done'`; untuk Beri Rating gunakan kombinasi (`'Done'`, `hasRating = false`), (`'Done'`, `hasRating = true`), dan (`'On Progress'`, `hasRating = false`). | Tombol *Pekerjaan Telah Selesai* `true` hanya untuk `On Progress`; tombol *Konfirmasi Selesai* `true` hanya untuk `Menunggu Konfirmasi Pelanggan`; tombol *Beri Rating* `true` hanya untuk `Done` dan belum dinilai, selain itu `false`. | *Pekerjaan Telah Selesai* hanya `true` untuk `On Progress`; *Konfirmasi Selesai* hanya `true` untuk `Menunggu Konfirmasi Pelanggan`; *Beri Rating* hanya `true` untuk (`Done`, belum dinilai). Sesuai harapan. | Pass |

### 4.2.12 Kelas KontrakPekerjaanController

**ID Kelas:** C18  
**Nama Kelas:** KontrakPekerjaanController  
**Tingkat:** *Mendalam*

Tabel 4.2.12. Hasil Pengujian Unit Kelas [C18]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C18-UT01 | `kirimInput()` | Normal | Pelanggan `cust-1` memanggil `kirimInput('Servis resleting jaket kulit', 85000, 'cust-1', 'provider-1', 1)`; ulangi melalui `handleKirimInput()` dengan JWT pelanggan dan `kirimKeChat = true`. | Kontrak tersimpan dengan status `Menunggu`, `persetujuanHarga = 85000`, dan `expiresAt` terisi; notifikasi tersimpan untuk `provider-1` (event `notification:new`); kartu kontrak tersisip ke Komunikasi (event `chat:new` & `kontrak:new`); respons HTTP `201`. | Kontrak tersimpan berstatus `Menunggu` dengan `persetujuanHarga = 85000` dan `expiresAt` terisi; notifikasi `NOTIF-…` (`statusBaca = false`) tersimpan untuk `provider-1`; pesan kontrak tercatat di Komunikasi; event `notification:new`, `kontrak:new`, dan `chat:new` terpancar; respons `201`. Sesuai harapan. | Pass |
| C18-UT02 | `kirimInput()` | Negatif | (a) `kirimInput('Memesan jasa milik sendiri', 100000, 'provider-1', 'provider-1', 1)` dan versi HTTP-nya; (b) `kirimInput()` dengan deskripsi `'   '` atau harga `-1000`. | (a) Ditolak `400 SELF_CONTRACT_FORBIDDEN`; (b) ditolak sebagai input tidak valid; pada kedua kasus tidak ada kontrak maupun notifikasi yang tersimpan. | (a) Ditolak `400 SELF_CONTRACT_FORBIDDEN` (pemanggilan langsung maupun via HTTP); (b) ditolak `400 INVALID_INPUT`; jumlah kontrak dan notifikasi tetap 0. Sesuai harapan. | Pass |
| C18-UT03 | `konfirmasiPersetujuanPenyedia()` | Normal | Untuk kontrak berstatus `Menunggu`: (a) `konfirmasiPersetujuanPenyedia(id, 'provider-1', true, 2)`; (b) pada kontrak lain, `konfirmasiPersetujuanPenyedia(id, 'provider-1', false)`. | (a) Status menjadi `On Progress`, ketersediaan penyedia tetap terkunci, dan `version` bertambah; (b) status menjadi `Ditolak` dan ketersediaan penyedia kembali `Available`. | (a) Status menjadi `On Progress` dan `version` penyedia naik menjadi 3; (b) status menjadi `Ditolak` dan `statusKetersediaan` penyedia kembali `Available`. Sesuai harapan. | Pass |
| C18-UT04 | `konfirmasiPersetujuanPenyedia()` | Negatif | (a) Panggil dengan `idPemberiJasa` yang bukan pemilik kontrak (mis. `provider-2`); (b) panggil pada kontrak yang sudah berstatus `On Progress`/`Ditolak`. | (a) Ditolak `403 FORBIDDEN_PROVIDER`; (b) ditolak `400 INVALID_STATE_TRANSITION`; status kontrak tidak berubah. | (a) Ditolak `403 FORBIDDEN_PROVIDER` dan status tetap `Menunggu`; (b) ditolak `400 INVALID_STATE_TRANSITION` dan status tetap `On Progress`. Sesuai harapan. | Pass |
| C18-UT05 | `selesaikanPekerjaan()` | Normal & Negatif | (a) Kontrak `On Progress`, panggil `selesaikanPekerjaan(id, 'provider-1')`; (b) panggil pada kontrak yang masih berstatus `Menunggu`. | (a) Status menjadi `Menunggu Konfirmasi Pelanggan` dan notifikasi terkirim ke pelanggan; (b) ditolak `400 INVALID_STATE_TRANSITION` dan status tidak berubah. | (a) Status menjadi `Menunggu Konfirmasi Pelanggan` dan notifikasi tersimpan untuk `cust-1`; (b) ditolak `400 INVALID_STATE_TRANSITION` dan status tetap `Menunggu`. Sesuai harapan. | Pass |
| C18-UT06 | `konfirmasiPekerjaan()` | Normal & Negatif | (a) Kontrak `Menunggu Konfirmasi Pelanggan`, panggil `konfirmasiPekerjaan(id, 'cust-1')`; (b) panggil pada kontrak yang masih `Menunggu` (termasuk melalui `Pengguna.konfirmasiPekerjaan()`) dan pada kontrak yang sudah `Done` (konfirmasi ulang). | (a) Mengembalikan `true`, status menjadi `Done`, dan ketersediaan penyedia kembali `Available`; (b) mengembalikan `false` dan status tidak berubah. | (a) Mengembalikan `true`, status menjadi `Done`, dan penyedia kembali `Available`; (b) mengembalikan `false` saat status `Menunggu` maupun `Done`, status tidak berubah. Sesuai harapan. | Pass |
| C18-UT07 | `getKontrakPekerjaan()` | Normal & Negatif | Panggil `handleGetKontrakById()` dengan (a) JWT valid dan ID kontrak yang ada; (b) tanpa header `Authorization`; (c) ID `kontrak-tidak-ada`. | (a) `200` beserta detail kontrak; (b) `401 Unauthorized`; (c) `404` kontrak tidak ditemukan (`getKontrakPekerjaan()` mengembalikan `null`). | (a) `200` dengan detail kontrak; (b) `401` dan *middleware* tidak meneruskan ke *handler*; (c) `404 CONTRACT_NOT_FOUND`. Selain itu, pengguna yang tidak terlibat mendapat `403`. Sesuai harapan. | Pass |

Tabel 4.2.12b. Ringkasan Cakupan Kelas [C18]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getKontrakPekerjaan()`, `konfirmasiPekerjaan()`, `showKontrakForm()`, `kirimInput()` |
| Operasi yang diuji | `kirimInput()`, `konfirmasiPersetujuanPenyedia()`, `selesaikanPekerjaan()`, `konfirmasiPekerjaan()`, `getKontrakPekerjaan()`; `showKontrakForm()` diuji di sisi klien melalui C17-UT01 |
| ID Algoritma yang tercakup | ALGO-036 (melalui `statusUpdate()` *private*), ALGO-041, ALGO-042, ALGO-043 |
| Coverage (wajib ≥ 70%) | 85,95% baris / 72,26% cabang (Jest + Istanbul, `npx jest --coverage`; bukti pada 4.6) |

### 4.2.13 Kelas Komunikasi

**ID Kelas:** C19  
**Nama Kelas:** Komunikasi  
**Tingkat:** *Mendalam*

Tabel 4.2.13. Hasil Pengujian Unit Kelas [C19]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C19-UT01 | `constructor()`, `getIDChat()`, `getAtributInternal()` | Normal | Buat `new Komunikasi({ idPengirim: 'pelanggan-01', idPenerima: 'penyedia-01', isiPesan: 'Halo, apakah biaya servis AC bisa dinego menjadi 150rb?' })`. | `getIDChat()` berawalan `CHAT-`; atribut `idPengguna`, `idPenerima`, dan `isiPesan` sesuai masukan; `isChatTerbaca = false`, `statusChat = 'SENT'`, `durasiChat = 0`, dan `waktuTerkirim` bertipe `Date`. | `getIDChat()` berawalan `CHAT-`; atribut sesuai masukan dengan `isChatTerbaca = false`, `statusChat = 'SENT'`, `durasiChat = 0`, dan `waktuTerkirim` bertipe `Date`. Sesuai harapan. | Pass |
| C19-UT02 | `saveChat()`, `simpanPesan()`, `getPesan()` | Normal | Simpan pesan `CHAT-NEGOSIASI-001` dengan `saveChat()`, ambil dengan `getPesan('CHAT-NEGOSIASI-001')`, lalu simpan pesan kedua `CHAT-NEGOSIASI-002` dengan `simpanPesan()`; panggil juga `getPesan('CHAT-TIDAK-ADA')`. | Pesan tersimpan dengan ID, pengirim, dan penerima yang sesuai; `getPesan()` mengembalikan isi pesan yang sama; jumlah pesan di DB menjadi 2; ID yang tidak ada mengembalikan `null`. | Kedua pesan tersimpan dengan ID, pengirim, dan penerima yang sesuai; `getPesan()` mengembalikan isi pesan yang sama; jumlah pesan menjadi 2; `getPesan('CHAT-TIDAK-ADA')` mengembalikan `null`. Sesuai harapan. | Pass |
| C19-UT03 | `getChatHistory()` | Normal | Isi DB dengan pesan `CHAT-02` (10:05) dan `CHAT-01` (10:00) antara `pelanggan-01` ↔ `penyedia-01`, serta `CHAT-LAIN` antara `pelanggan-01` ↔ `penyedia-02`; panggil `getChatHistory('pelanggan-01', 'penyedia-01')`. | Mengembalikan 2 pesan dengan urutan `['CHAT-01', 'CHAT-02']` (ASC) dan tidak memuat `CHAT-LAIN`. | Mengembalikan 2 pesan dengan urutan `['CHAT-01', 'CHAT-02']` dan tidak memuat `CHAT-LAIN`. Sesuai harapan. | Pass |
| C19-UT04 | `markMessagesAsRead()` | Normal & Batas | Isi DB dengan 2 pesan *unread* dari `penyedia-01` ke `pelanggan-01` dan 1 pesan *unread* dari `pelanggan-01` ke `penyedia-01`; panggil `markMessagesAsRead('pelanggan-01', 'penyedia-01')`. | Mengembalikan `2`; hanya 2 pesan dari lawan bicara yang berubah menjadi `isChatTerbaca = true`, sedangkan pesan milik pengguna login tetap `false`. | Mengembalikan `2`; `CHAT-R1` dan `CHAT-R2` menjadi terbaca, sedangkan `CHAT-R3` tetap `false`. Sesuai harapan. | Pass |
| C19-UT05 | `getConversationsByUser()` | Normal & Batas | (a) Isi DB dengan percakapan `pelanggan-01` bersama `penyedia-01` (1 *unread*) dan `penyedia-02` (2 *unread*), lalu panggil `getConversationsByUser('pelanggan-01')`; (b) panggil untuk pengguna tanpa percakapan. | (a) Mengembalikan 2 percakapan terurut dari yang terbaru dengan `isiPesanTerakhir` dan `unreadCount` (1 dan 2) yang tepat; (b) mengembalikan *array* kosong. | (a) 2 percakapan terurut dari yang terbaru (`penyedia-01` dengan `unreadCount = 1`, lalu `penyedia-02` dengan `unreadCount = 2`); (b) mengembalikan `[]`. Sesuai harapan. | Pass |

Tabel 4.2.13b. Ringkasan Cakupan Kelas [C19]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `constructor()`, `saveChat()`, `simpanPesan()`, `getIDChat()`, `getPesan()`, `getChatHistory()` |
| Operasi yang diuji | `constructor()`, `saveChat()`, `simpanPesan()`, `getIDChat()`, `getPesan()`, `getChatHistory()`, serta tambahan non-DPPL `markMessagesAsRead()` dan `getConversationsByUser()` |
| ID Algoritma yang tercakup | ALGO-044, ALGO-045, ALGO-046, ALGO-047, ALGO-048 |
| Coverage (wajib ≥ 70%) | 100% baris / 78,26% cabang (Jest + Istanbul, `npx jest --coverage`; bukti pada 4.6) |

### 4.2.14 Kelas KomunikasiController

**ID Kelas:** C21  
**Nama Kelas:** KomunikasiController  
**Tingkat:** *Mendalam*

Tabel 4.2.14. Hasil Pengujian Unit Kelas [C21]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C21-UT01 | `kirimPesan()` | Normal | Panggil `kirimPesan({ idPengirim: 'pelanggan-01', idPenerima: 'penyedia-01', isiPesan: <pesan valid> })` dengan `RealtimeEmitter` dan `NotifikasiController` tiruan. | Pesan tersimpan di DB; event Socket.IO `chat:new` terpancar ke penerima; `NotifikasiController.buatNotifikasi()` dipanggil untuk `penyedia-01`. | Pesan tersimpan (spasi di awal/akhir di-*trim*); `chat:new` terpancar ke `penyedia-01`; `buatNotifikasi()` dipanggil untuk `penyedia-01` dengan isi "Pesan baru: …". Sesuai harapan. | Pass |
| C21-UT02 | `kirimPesan()` | Batas | Kirim pesan dengan panjang tepat 1 karakter, tepat 1000 karakter, dan 1001 karakter. | Pesan 1 dan 1000 karakter tersimpan; pesan 1001 karakter ditolak dengan `400`. | Pesan 1 karakter dan 1000 karakter tersimpan (total 2 pesan); pesan 1001 karakter ditolak `400 MESSAGE_TOO_LONG`. Sesuai harapan. | Pass |
| C21-UT03 | `kirimPesan()` | Negatif | Kirim pesan dengan (a) `idPengirim` kosong; (b) `idPenerima` kosong; (c) `idPengirim = idPenerima`; (d) `isiPesan` kosong/spasi atau bukan *string*; (e) `idPenerima` tidak terdaftar. | (a) ditolak `401 UNAUTHORIZED`; (b) `400 INVALID_RECIPIENT`; (c) `400 SELF_MESSAGE_NOT_ALLOWED`; (d) `400 EMPTY_MESSAGE`/`INVALID_MESSAGE_TYPE`; (e) `404 RECIPIENT_NOT_FOUND`; tidak ada pesan yang tersimpan. | (a) `401 UNAUTHORIZED`; (b) `400 INVALID_RECIPIENT`; (c) `400 SELF_MESSAGE_NOT_ALLOWED`; (d) `400 EMPTY_MESSAGE`/`INVALID_MESSAGE_TYPE`; (e) `404 RECIPIENT_NOT_FOUND`. Sesuai harapan. | Pass |
| C21-UT04 | `sendChat()` | Normal/*Resilience* | Atur `buatNotifikasi()` agar melempar error, lalu panggil `sendChat()` dengan pesan valid. | Pesan tetap tersimpan dan event `chat:new` tetap terpancar; error notifikasi tidak diteruskan ke pemanggil. | Pesan tetap tersimpan dan dikembalikan ke pemanggil; error notifikasi hanya dicatat ke `console.error`. Sesuai harapan. | Pass |
| C21-UT05 | `sendChatHandler()` | Negatif | Panggil `POST /api/chats` (a) tanpa data autentikasi; (b) dengan JWT `pelanggan-01` tetapi `idPengirim` pada *body* diisi `penyedia-01` (*spoofing*). | (a) `401 Unauthorized`; (b) `403 Forbidden`; pesan tidak tersimpan. | (a) `401`; (b) `403`; permintaan valid menghasilkan `201`. Sesuai harapan. | Pass |
| C21-UT06 | `getChatHistoryHandler()`, `getConversationsHandler()`, `markChatReadHandler()` | Normal & Negatif | Panggil ketiga *handler* dengan (a) JWT valid dan lawan bicara valid (mode `startChat` dan `loadChat`); (b) parameter lawan bicara kosong; (c) tanpa autentikasi; (d) meminta riwayat percakapan milik pengguna lain. | (a) `200` beserta riwayat chat/daftar percakapan/jumlah pesan yang ditandai terbaca; (b) `400`; (c) `401`; (d) `403`. | (a) `200` untuk mode `startChat`/`loadChat`, daftar percakapan, dan penandaan terbaca; (b) `400`; (c) `401`; (d) `403`. Sesuai harapan. | Pass |

Tabel 4.2.14b. Ringkasan Cakupan Kelas [C21]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `sendChat()`, `kirimPesan()`, `getRiwayatChat()`, `loadChat()`, `startChat()` |
| Operasi yang diuji | `sendChat()`, `kirimPesan()`, `getRiwayatChat()`, `loadChat()`, `startChat()` (melalui `getChatHistoryHandler()`), serta `sendChatHandler()`, `getConversationsHandler()`, dan `markChatReadHandler()` |
| ID Algoritma yang tercakup | ALGO-049, ALGO-050, ALGO-051, ALGO-052 |
| Coverage (wajib ≥ 70%) | 92,07% baris / 88,70% cabang (Jest + Istanbul, `npx jest --coverage`; bukti pada 4.6) |

### 4.2.15 Kelas TiketLaporan

**ID Kelas:** C22  
**Nama Kelas:** TiketLaporan  
**Tingkat:** *Sedang*

Tabel 4.2.15. Hasil Pengujian Unit Kelas [C22]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C22-UT01 | `generateId()`, `simpan()` | Normal | Panggil `generateId()`, lalu `simpan()` dengan `idTiket` hasil *generate*, `idPengguna`, `jenisTiket = 'Kendala Aplikasi'`, `keteranganTiket` terisi, dan `buktiFotoUrl` berisi path foto. | `generateId()` menghasilkan nomor berformat `A-xxxx`; tiket tersimpan dengan `statusTiket = 'Open'` beserta `buktiFotoUrl` yang sesuai. | `generateId()` menghasilkan `A-2041`; tiket tersimpan dengan `statusTiket = 'Open'`, `buktiFotoUrl = 'bukti-crash.jpg'`, dan petugas `cs-1`. Sesuai harapan. | Pass |
| C22-UT02 | `getDetailTiket()`, `daftarCs()`, `daftarPelapor()` | Normal & Negatif | (a) Panggil `getDetailTiket()` dengan ID tiket yang ada; (b) panggil `daftarCs(idCs)` dan `daftarPelapor(idPengguna)`; (c) panggil `getDetailTiket('A-TIDAK-ADA')`. | (a) Mengembalikan detail tiket beserta data pelapor; (b) `daftarCs()` mengembalikan tiket milik CS tersebut ditambah tiket aktif yang belum ditugaskan, `daftarPelapor()` hanya mengembalikan tiket milik pelapor; (c) mengembalikan `null`. | (a) Detail `A-1` beserta data pelapor; (b) `daftarCs('cs-1')` mengembalikan `A-1` & `A-2` (tiket `Selesai` tanpa petugas tidak ikut), `daftarPelapor('pelanggan-2')` mengembalikan `A-2` & `A-3`; (c) `null`. Sesuai harapan. | Pass |
| C22-UT03 | `updateStatusTiket()`, `tambahPesan()` | Normal | Panggil `updateStatusTiket(db, idTiket, 'Diproses')`, lalu `tambahPesan(db, { idTiket, idPengirim, idPenerima, isiPesan })`. | Status tiket berubah menjadi `Diproses`; pesan mediasi tersimpan pada tabel `komunikasi` dengan kolom `idTiket` terisi sesuai tiket terkait. | Status tiket menjadi `Diproses`; pesan tersimpan pada `komunikasi` dengan `idTiket = 'A-10'` dan lampiran dinormalisasi menjadi `/uploads/bukti-transfer.png`. Sesuai harapan. | Pass |

### 4.2.16 Kelas TiketLaporanController

**ID Kelas:** C24  
**Nama Kelas:** TiketLaporanController  
**Tingkat:** *Mendalam*

Tabel 4.2.16. Hasil Pengujian Unit Kelas [C24]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C24-UT01 | `validasiFormTiket()` | Normal | Panggil `validasiFormTiket()` untuk setiap `jenisTiket` valid (`Laporan Pembayaran`, `Kendala Aplikasi`, `Perilaku Pengguna`, `Lainnya`) dengan `keteranganTiket = 'Pembayaran belum terkonfirmasi oleh sistem'`. | Mengembalikan `true` untuk seluruh jenis tiket valid. | Mengembalikan `true` untuk keempat jenis tiket. Sesuai harapan. | Pass |
| C24-UT02 | `validasiFormTiket()` | Negatif | Panggil dengan (a) `jenisTiket` `'Kategori Asal'`, `'   '`, `123`, atau `undefined`; (b) `jenisTiket = 'Kendala Aplikasi'` dengan `keteranganTiket` `''`, `'    '`, `null`, atau `999`. | Mengembalikan `false` untuk seluruh masukan tidak valid. | Mengembalikan `false` untuk seluruh masukan tidak valid. Sesuai harapan. | Pass |
| C24-UT03 | `buatTiketHandler()` | Normal | Pelanggan dan Pemberi Jasa (JWT valid) masing-masing mengirim `POST /api/tickets` dengan form valid; tersedia beberapa CS dengan beban berbeda. | Respons `201`; tiket ditugaskan otomatis ke CS dengan beban terkecil; `tambahBeban()` menaikkan beban CS sebesar +1; `buatNotifikasi()` dipanggil untuk CS terpilih dengan menyertakan nomor tiket. | Respons `201` untuk Pelanggan maupun Pemberi Jasa; tiket ditugaskan ke CS dengan beban terkecil, beban CS bertambah 1, dan notifikasi terkirim ke CS tersebut dengan nomor tiket. Sesuai harapan. | Pass |
| C24-UT04 | `buatTiketHandler()` | Batas | (a) Kirim form valid saat tidak ada CS yang memenuhi syarat (`cariLayananKosong()` mengembalikan `null`); (b) kirim form valid saat `buatNotifikasi()` melempar error. | (a) Respons `201` dengan `assignedTo: null` tanpa memanggil `tambahBeban()` maupun notifikasi; (b) respons tetap `201` dan tiket tetap tersimpan. | (a) `201` dengan `assignedTo: null`, tanpa pemanggilan `tambahBeban()` maupun notifikasi; (b) tetap `201` dan tiket tersimpan. Sesuai harapan. | Pass |
| C24-UT05 | `buatTiketHandler()` | Negatif | (a) Kirim form dengan `jenisTiket` tidak valid; (b) akses dengan peran `LAYANAN_PELANGGAN`; (c) simulasikan error DB saat `$transaction`. | (a) `400` tanpa menjalankan `$transaction`; (b) `403 Forbidden`; (c) `500` dengan pesan kesalahan server. | (a) `400` dan `$transaction` tidak dijalankan; (b) `403`; (c) `500`. Sesuai harapan. | Pass |
| C24-UT06 | `tiketSayaHandler()`, `detailTiketHandler()`, `kirimPesanPelaporHandler()` | Normal & Negatif | (a) Pelapor mengambil daftar & detail tiket miliknya serta mengirim pesan valid; (b) pengguna lain mengakses detail tiket bukan miliknya; (c) kirim pesan kosong; (d) kirim pesan ke ID tiket yang tidak ada; (e) kirim pesan ke tiket berstatus `Selesai`. | (a) `200` untuk daftar/detail dan `201` untuk pesan; (b) `403` akses ditolak; (c) `400`; (d) `404`; (e) `409`. | (a) `200` untuk daftar/detail dan `201` untuk pesan; (b) `403`; (c) `400`; (d) `404`; (e) `409`. Sesuai harapan. | Pass |

Tabel 4.2.16b. Ringkasan Cakupan Kelas [C24]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiFormTiket()`, `buatTiket()`, `teruskanKeNotifikasi()`, `getTiketLaporan()`, `balasTiket()`, `tutupTiket()` |
| Operasi yang diuji | `validasiFormTiket()`, `buatTiketHandler()` (realisasi `buatTiket()` & `teruskanKeNotifikasi()`), `detailTiketHandler()` (realisasi `getTiketLaporan()`), `tiketSayaHandler()`, `kirimPesanPelaporHandler()`; `balasTiket()` & `tutupTiket()` direalisasikan pada `LayananPelangganCtrl` dan diuji pada C12 |
| ID Algoritma yang tercakup | ALGO-013, ALGO-053, ALGO-054, ALGO-055 |
| Coverage (wajib ≥ 70%) | 96,05% baris / 84,84% cabang (Jest + Istanbul, `npx jest --coverage`; bukti pada 4.6) |

### 4.2.17 Kelas Rating

**ID Kelas:** C25  
**Nama Kelas:** Rating  
**Tingkat:** *Mendalam*

Tabel 4.2.17. Hasil Pengujian Unit Kelas [C25]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C25-UT01 | `makeRating()`, *getter*, `toJSON()` | Normal | Panggil `makeRating('id-1', 'pemberi', 'penerima', 'kontrak', 5, 'Bagus', ['Tepat Waktu'])`, lalu panggil seluruh *getter* dan `toJSON()`. | `getIdRating()`, `getIdPemberi()`, `getIdPenerima()`, `getIdKontrakPekerjaan()`, `getRatingValue()`, `getUlasan()`, `getTags()`, dan `getTanggalRating()` mengembalikan nilai sesuai masukan; `toJSON()` memuat seluruh atribut tersebut. | Seluruh *getter* mengembalikan nilai sesuai masukan dan `toJSON()` memuat seluruh atribut. Sesuai harapan. | Pass |
| C25-UT02 | `makeRating()` | Batas & Negatif | Panggil `makeRating()` dengan (a) `ulasan = 12345`; (b) `tags = ['tepat waktu', 99, null]`; (c) `nilaiRating = 0` (di luar 1..5). | (a) `getUlasan()` bernilai `null` tanpa *crash* dan nilai rating tetap; (b) `getTags()` menjadi `['tepat waktu']`; (c) `getRatingValue()` bernilai `-1`. | (a) `getUlasan()` bernilai `null` tanpa *crash*, nilai rating tetap `4`; (b) `getTags()` menjadi `['tepat waktu']`; (c) `getRatingValue()` bernilai `-1`. Sesuai harapan. | Pass |
| C25-UT03 | `simpanKeDb()` | Normal | Buat rating valid (nilai 1..5) untuk kontrak `Done`, lalu panggil `simpanKeDb()`. | Entri rating tersimpan di tabel `rating` dan kolom `hasRating` pada kontrak terkait berubah menjadi `true`. | Entri rating tersimpan dan `hasRating` kontrak berubah menjadi `true`. Sesuai harapan. | Pass |
| C25-UT04 | `simpanKeDb()` | Negatif | Buat rating dengan `nilaiRating` di luar batas (tersimpan sebagai `-1`), lalu panggil `simpanKeDb()`. | Melempar error dan tidak ada data rating yang tersimpan. | `simpanKeDb()` melempar error dan tidak ada rating yang tersimpan. Sesuai harapan. | Pass |
| C25-UT05 | `updateRatingPengguna()` | Normal | Panggil `updateRatingPengguna()` secara berurutan dengan nilai rating `5`, `4`, lalu `4` untuk pengguna penerima yang sama. | `riwayatRating` berturut-turut menjadi `[5]`, `[5, 4]`, `[5, 4, 4]` dengan `akumulasiRating` `5`, `4.5`, dan `4.33` (pembulatan 2 desimal). | `riwayatRating` menjadi `[5]`, `[5, 4]`, `[5, 4, 4]` dengan `akumulasiRating` `5`, `4.5`, `4.33`. Sesuai harapan. | Pass |
| C25-UT06 | `updateRatingPengguna()` | Negatif | Panggil `updateRatingPengguna()` dengan (a) rating bernilai `-1`; (b) `idPenerima` yang tidak terdaftar. | Melempar error pada kedua kasus dan data rating pengguna tidak berubah. | Melempar error pada kedua kasus. Sesuai harapan. | Pass |

Tabel 4.2.17b. Ringkasan Cakupan Kelas [C25]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getIdRating()`, `getIdPemberi()`, `getIdPenerima()`, `getIdKontrakPekerjaan()`, `getRatingValue()`, `makeRating()`, `simpanKeDb()`, `updateRatingPengguna()` |
| Operasi yang diuji | Seluruh operasi pada DPPL, serta tambahan `getTanggalRating()`, `getUlasan()`, `getTags()`, dan `toJSON()` |
| ID Algoritma yang tercakup | ALGO-056, ALGO-057, ALGO-058, ALGO-059, ALGO-060, ALGO-061, ALGO-062, ALGO-063 |
| Coverage (wajib ≥ 70%) | 98,30% baris / 81,48% cabang (Jest + Istanbul, `npx jest --coverage`; bukti pada 4.6) |

### 4.2.18 Kelas RatingUI

**ID Kelas:** C26  
**Nama Kelas:** RatingUI  
**Tingkat:** *Sedang* (diuji melalui *hook* `useRatingController`)

Tabel 4.2.18. Hasil Pengujian Unit Kelas [C26]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C26-UT01 | `getRatingPredicate()`, `toggleRatingTag()` | Normal & Batas | (a) Panggil `getRatingPredicate()` dengan bintang `0` sampai `5`; (b) pilih tag `'Tepat Waktu'` dan `'Kerja Bersih'`, lalu pilih ulang `'Tepat Waktu'`; (c) ambil opsi tag untuk peran `PELANGGAN` dan `PEMBERI_JASA`. | (a) `0` → `'Pilih bintang penilaian'`, `1`–`5` → `'Sangat Buruk'`, `'Buruk'`, `'Cukup'`, `'Baik'`, `'Sangat Baik'`; (b) tag terpilih menjadi `['Tepat Waktu', 'Kerja Bersih']` lalu `['Kerja Bersih']`; (c) daftar tag sesuai peran masing-masing. | (a) Label predikat sesuai untuk 0–5; (b) tag menjadi `['Tepat Waktu', 'Kerja Bersih']` lalu `['Kerja Bersih']`; (c) `PELANGGAN` mendapat tag pelanggan, `PEMBERI_JASA` mendapat tag khusus penyedia. Sesuai harapan. | Pass |
| C26-UT02 | `isSubmitRatingEnabled()`, `validateRatingInput()` | Batas & Negatif | (a) Panggil `isSubmitRatingEnabled()` dengan (`0`, `false`), (`5`, `true`), (`1`, `false`), (`5`, `false`); (b) panggil `validateRatingInput()` dengan skor `5`, `0`, `6`, serta pemberi = penerima (`'pengguna-sama'`). | (a) Tombol nonaktif untuk bintang 0 atau saat sedang *submit*, aktif untuk (`1`, `false`) dan (`5`, `false`); (b) hanya skor `5` dengan pemberi ≠ penerima yang mengembalikan `true`. | (a) Tombol nonaktif untuk (`0`, `false`) dan (`5`, `true`), aktif untuk (`1`, `false`) dan (`5`, `false`); (b) hanya skor `5` dengan pemberi ≠ penerima yang `true`. Sesuai harapan. | Pass |
| C26-UT03 | `shouldShowBeriRatingButton()`, `shouldShowProviderBeriRatingButton()` | Normal | Panggil dengan kontrak berstatus `On Progress`, `Done` belum dinilai, `Done` sudah dinilai, `Dibatalkan`, dan `Menunggu Konfirmasi Pelanggan`, baik dari sisi pelanggan maupun penyedia jasa. | Tombol *Beri Rating* hanya tampil (`true`) untuk kontrak `Done` yang belum dinilai oleh pengguna login; selain itu `false`. | Tombol *Beri Rating* hanya `true` untuk kontrak `Done` yang belum dinilai pengguna login, baik di sisi pelanggan maupun penyedia jasa. Sesuai harapan. | Pass |
| C26-UT04 | `extractPerUserRatingFromBackendRow()` | Normal | Gunakan baris kontrak `Done` dengan `hasRating = true` dan satu rating dari `pelanggan-1` ke `mitra-1`, lalu panggil `extractPerUserRatingFromBackendRow(row, 'mitra-1')`; petakan juga baris dengan rating dari `mitra-1` ke `pelanggan-1` untuk sisi pelanggan. | Untuk penyedia: `hasRatedByMe = false`, `diterima.nilaiRating = 5`, `diberikan = null`; untuk pelanggan: tombol *Beri Rating* tetap tampil walaupun penyedia sudah menilai lebih dulu. | Penyedia: `hasRatedByMe = false`, `diterima.nilaiRating = 5`, `diberikan = null`; pelanggan: `hasRating = false` sehingga tombol *Beri Rating* tetap tampil. Sesuai harapan. | Pass |

### 4.2.19 Kelas RatingController

**ID Kelas:** C27  
**Nama Kelas:** RatingController  
**Tingkat:** *Mendalam*

Tabel 4.2.19. Hasil Pengujian Unit Kelas [C27]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C27-UT01 | `validateRatingValue()` | Normal | Panggil `validateRatingValue('pemberi-1', 'penerima-1', 'kontrak-1', skor)` untuk skor `1`, `2`, `3`, `4`, dan `5`. | Mengembalikan `true` untuk seluruh skor 1..5. | Mengembalikan `true` untuk kelima skor. Sesuai harapan. | Pass |
| C27-UT02 | `validateRatingValue()` | Batas & Negatif | Panggil dengan (a) skor `0` dan `6`; (b) salah satu ID wajib kosong atau hanya spasi. | Mengembalikan `false` pada seluruh kasus. | Mengembalikan `false` untuk skor `0`, `6`, `NaN`, dan ID kosong/spasi. Sesuai harapan. | Pass |
| C27-UT03 | `createRating()` | Normal | Pada kontrak berstatus `Done`: (a) Pelanggan mengirim rating untuk Penyedia Jasa; (b) Penyedia Jasa mengirim rating balik untuk Pelanggan pada kontrak yang sama. | Kedua rating berhasil disimpan (`201`) dan rata-rata rating masing-masing penerima diperbarui (*two-way rating*). | Kedua rating tersimpan dengan respons `201`; `akumulasiRating` penerima masing-masing menjadi `5` (penyedia) dan `4` (pelanggan). Sesuai harapan. | Pass |
| C27-UT04 | `createRating()` | Negatif | Pelanggan yang sudah memberi rating pada kontrak tertentu mengirim rating kedua untuk kontrak yang sama. | Ditolak `400` dengan pesan "Anda sudah memberikan rating untuk kontrak pekerjaan ini." dan tidak ada rating baru yang tersimpan. | Ditolak `400` dengan pesan "Anda sudah memberikan rating untuk kontrak pekerjaan ini.". Sesuai harapan. | Pass |
| C27-UT05 | `createRating()` | Negatif | Kirim rating untuk kontrak yang berstatus selain `Done` (mis. `On Progress`). | Ditolak `400` dengan pesan "Pekerjaan belum berstatus Done" dan tidak ada rating yang tersimpan. | Ditolak `400` dengan pesan "Pekerjaan belum berstatus Done". Sesuai harapan. | Pass |
| C27-UT06 | `getRatingsByUser()` | Normal & Negatif | Panggil `GET` rating pengguna dengan (a) ID pengguna valid yang memiliki rating; (b) ID kosong atau hanya spasi; (c) ID pengguna yang tidak terdaftar. | (a) `200` beserta `akumulasiRating`, `riwayatRating`, `totalRating`, dan daftar ulasan; (b) `400`; (c) `404`. | (a) `200` beserta `akumulasiRating`, `riwayatRating`, `totalRating`, dan daftar ulasan; (b) `400`; (c) `404`. Sesuai harapan. | Pass |

Tabel 4.2.19b. Ringkasan Cakupan Kelas [C27]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validateRatingValue()` |
| Operasi yang diuji | `validateRatingValue()`, serta tambahan `createRating()` dan `getRatingsByUser()` |
| ID Algoritma yang tercakup | ALGO-064 |
| Coverage (wajib ≥ 70%) | 88,63% baris / 84,37% cabang (Jest + Istanbul, `npx jest --coverage`; bukti pada 4.6) |

### 4.2.20 Kelas NotifikasiController

**ID Kelas:** C30  
**Nama Kelas:** NotifikasiController  
**Tingkat:** *Sedang*

Tabel 4.2.20. Hasil Pengujian Unit Kelas [C30]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C30-UT01 | `buatNotifikasi()` | Normal | Panggil `buatNotifikasi('user-1', 'Pesanan baru masuk!')` dengan `RealtimeEmitter` dan `PushGateway` tiruan. | Notifikasi tersimpan di DB dengan ID berawalan `NOTIF-` dan `statusBaca = false`; event Socket.IO `notification:new` terpancar ke `user-1`; `pushGateway.sendPush()` dipanggil dengan isi notifikasi. | Notifikasi tersimpan dengan ID `NOTIF-…`, `statusBaca = false`; `notification:new` terpancar ke `user-1`; `sendPush('user-1', 'Pesanan baru masuk!')` dipanggil. Sesuai harapan. | Pass |
| C30-UT02 | `buatNotifikasi()` | Negatif | Panggil `buatNotifikasi()` dengan (a) `idPenerima = ''`; (b) `isiNotifikasi = '   '` (hanya spasi). | Melempar error `400` (`INVALID_RECIPIENT` / `INVALID_NOTIFICATION_CONTENT`); tidak ada notifikasi yang tersimpan maupun terkirim. | (a) `400 INVALID_RECIPIENT`; (b) `400 INVALID_NOTIFICATION_CONTENT`. Sesuai harapan. | Pass |
| C30-UT03 | `tandaiSatuNotifikasiTerbaca()`, `tandaiSemuaNotifikasiTerbaca()` | Normal & Negatif | (a) Pengguna login menandai satu notifikasi miliknya, lalu menandai seluruh notifikasinya; (b) pengguna login menandai notifikasi milik pengguna lain; (c) menandai ID notifikasi yang tidak ada. | (a) `statusBaca` berubah menjadi `true` dan `updatedCount` sesuai jumlah notifikasi belum terbaca milik pengguna; (b) ditolak `403 FORBIDDEN` dan `statusBaca` notifikasi tidak berubah; (c) ditolak `404 NOTIFICATION_NOT_FOUND`. | (a) `statusBaca` menjadi `true` dan `updatedCount = 2`; (b) `403 FORBIDDEN`; (c) `404 NOTIFICATION_NOT_FOUND`. Sesuai harapan. | Pass |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Lingkungan pengujian integrasi: *backend* Express dijalankan pada `http://localhost:5000` dan terhubung ke basis data PostgreSQL 16 yang telah diisi *seed* (`npm run db:seed`, *password* bawaan `PasswordAman123`). Permintaan HTTP dikirim menggunakan Postman/`curl` dengan *header* `Authorization: Bearer <token>` hasil *login*, isi basis data diperiksa langsung melalui `psql`/Prisma Studio, dan *event* Socket.IO diamati menggunakan klien Socket.IO yang terhubung dengan `auth.userId` pengguna penerima. Antarmuka antarkomponen disusun berdasarkan komponen MVC pada Tabel 2.3 DPPL.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| I-01 | PenggunaController, PelangganController, PemberiJasaController | Pengguna, Pelanggan, PemberiJasa (Model) | Controller - Model | INT-TC01 |
| I-02 | KategoriJasaController, PemberiJasaController | KategoriJasa, PemberiJasa (Model) | Controller - Model | INT-TC02, INT-TC03 |
| I-03 | KomunikasiController | Komunikasi (Model) | Controller - Model | INT-TC04 |
| I-04 | KontrakPekerjaanController | KontrakPekerjaan, Pengguna, PemberiJasa (Model) | Controller - Model | INT-TC05, INT-TC06, INT-TC07 |
| I-05 | TiketLaporanController, LayananPelangganController | TiketLaporan, LayananPelanggan (Model) | Controller - Model | INT-TC08, INT-TC09 |
| I-06 | RatingController | Rating, KontrakPekerjaan, Pengguna (Model) | Controller - Model | INT-TC10 |
| I-07 | Seluruh *Model* (Prisma ORM) | PostgreSQL 16 | Aplikasi - Basis data | INT-TC01, INT-TC03, INT-TC06, INT-TC08, INT-TC10 |
| I-08 | NotifikasiController, KomunikasiController, KontrakPekerjaanController | Socket.IO (*RealtimeEmitter*) | Aplikasi - Sistem eksternal | INT-TC04, INT-TC05 |
| I-09 | PelangganUI (`useCatalogController`) | GPS perangkat (`expo-location`) | Aplikasi - Sistem eksternal | INT-TC03 |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | I-01, I-07 | Normal: registrasi dan *login* pelanggan | 1. Kirim `POST /api/auth/register/pelanggan` dengan `namaPengguna: "Naufal Hasbi"`, `username: "naufal_uji"`, `email: "naufal.uji@mail.com"`, `password: "PasswordAman123"`, `nomorTelpon: "081234567890"`.<br>2. Kirim `POST /api/auth/login` dengan email dan *password* yang sama.<br>3. Jalankan `SELECT email, password, role FROM pengguna WHERE email = 'naufal.uji@mail.com';`. | Registrasi mengembalikan `201` tanpa *field* `password`; *login* mengembalikan `200` beserta token JWT; baris pada tabel `pengguna` tersimpan dengan `role = 'PELANGGAN'` dan `password` berupa *hash* bcrypt (diawali `$2`), bukan teks asli. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC02 | I-02 | Normal: pendaftaran jasa memperbarui kategori dan data pemberi jasa | 1. *Login* sebagai akun INT-TC01 dan simpan tokennya.<br>2. Kirim `GET /api/services/categories` untuk memperoleh ID kategori `Perbaikan Elektronik & AC`.<br>3. Kirim `POST /api/services/register` dengan `idPemberiJasa: <id akun INT-TC01>`, `namaToko: "Rapi Servis Dago"`, `idKategoriJasa: <ID kategori>`, `jenisJasa: "Perbaikan Elektronik & AC"`, `deskripsiJasa: "Servis dan cuci AC rumah"`, `tarif: 75000`, `jamKerja: "08:00-17:00"`, dan `daerahKerja: "Coblong, Bandung"`.<br>4. Kirim `GET /api/services/<idPemberiJasa>`. | `GET /categories` mengembalikan `200` dengan daftar kategori terurut alfabetis; pendaftaran mengembalikan `201`, peran akun berubah menjadi `PEMBERI_JASA`, dan baris baru pada `pemberi_jasa` memuat `nama_toko = 'Rapi Servis Dago'`; detail jasa mengembalikan `200` dengan data yang sama. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC03 | I-02, I-07, I-09 | Normal: pencarian pemberi jasa terdekat berdasarkan lokasi GPS | 1. Aktifkan GPS perangkat/emulator dan atur lokasi ke sekitar ITB (`-6.8915, 107.6107`).<br>2. Masuk sebagai `budi@pelanggan.com`, lalu cari jasa dengan kata kunci `AC` dan filter "Terdekat".<br>3. Bandingkan dengan `GET /api/services/search?q=AC&lat=-6.8915&long=107.6107&sortBy=nearest`. | Aplikasi memperoleh koordinat dari GPS perangkat dan meneruskannya ke *backend*; daftar pemberi jasa diambil dari basis data, hanya memuat jasa yang sesuai kata kunci, terurut dari jarak terdekat, dan nilai jarak (km) pada aplikasi sama dengan respons API. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC04 | I-03, I-08 | Normal: pengiriman pesan *real-time* dan notifikasi | 1. Hubungkan klien Socket.IO dengan `auth.userId` milik `ahmad@cariuang.id`.<br>2. *Login* sebagai `budi@pelanggan.com`, lalu kirim `POST /api/chats` dengan `idPenerima: <id Ahmad>` dan `isiPesan: "Halo Pak, servis AC besok bisa?"`.<br>3. Periksa tabel `komunikasi` dan `notifikasi`.<br>4. *Login* sebagai Ahmad dan kirim `GET /api/chats/<id Budi>`. | Respons `201`; baris baru pada `komunikasi` tersimpan dengan `id_tiket` bernilai `NULL`; klien Socket.IO Ahmad menerima *event* `chat:new` dan `notification:new`; baris `notifikasi` untuk Ahmad tersimpan dengan `status_baca = false`; riwayat chat Ahmad memuat pesan tersebut. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC05 | I-04, I-08 | Normal: pembuatan dan persetujuan kontrak pekerjaan | 1. Hubungkan klien Socket.IO sebagai Ahmad.<br>2. Budi mengirim `POST /api/kontrak` dengan `idPemberiJasa: <id Ahmad>`, `detailPekerjaan: "Servis dan cuci AC 1 PK"`, `persetujuanHarga: 160000`, `expectedVersion: <version Ahmad saat ini>`, dan `kirimKeChat: true`.<br>3. Ahmad mengirim `PATCH /api/kontrak/<id>/terima`.<br>4. Periksa tabel `kontrak_pekerjaan` dan `pemberi_jasa`. | Pembuatan kontrak mengembalikan `201` dengan status `Menunggu`; klien Ahmad menerima *event* `kontrak:new`, `notification:new`, dan `chat:new`; persetujuan mengembalikan `200` dengan status `On Progress`; `status_ketersediaan` Ahmad menjadi `On Progress` dan `version` bertambah. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC06 | I-04, I-07 | Gagal: dua pelanggan memesan pemberi jasa yang sama secara bersamaan (*optimistic locking*) | 1. Catat `version` milik `siti@cariuang.id` pada tabel `pemberi_jasa`.<br>2. Kirim dua permintaan `POST /api/kontrak` hampir bersamaan dari Budi dan akun INT-TC01 ke Siti dengan `expectedVersion` yang sama.<br>3. Periksa tabel `kontrak_pekerjaan` dan `pemberi_jasa`. | Hanya satu permintaan yang berhasil (`201`), permintaan lainnya ditolak `409`; hanya ada satu kontrak berstatus `Menunggu` untuk Siti dan `version` Siti hanya bertambah satu kali. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC07 | I-04 | Normal: penyelesaian dan konfirmasi pekerjaan | 1. Gunakan kontrak `On Progress` dari INT-TC05.<br>2. Ahmad mengirim `PATCH /api/kontrak/<id>/selesai`.<br>3. Budi mengirim `PATCH /api/kontrak/<id>/konfirmasi`.<br>4. Periksa tabel `kontrak_pekerjaan`, `pemberi_jasa`, dan `notifikasi`. | Langkah 2 mengembalikan `200` dengan status `Menunggu Konfirmasi Pelanggan` dan notifikasi untuk Budi; langkah 3 mengembalikan `200` dengan status `Done`; `status_ketersediaan` Ahmad kembali `Available` dan notifikasi untuk Ahmad tersimpan. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC08 | I-05, I-07 | Normal: pembuatan tiket laporan dan penugasan otomatis ke CS | 1. Catat `jumlah_tiket_dipegang` setiap baris pada tabel `layanan_pelanggan`.<br>2. Budi mengirim `POST /api/tickets` (*multipart*) dengan `jenisTiket: "Laporan Pembayaran"`, `keteranganTiket: "Pembayaran sudah dilakukan tetapi status belum berubah"`, dan foto `bukti-transfer.jpg`.<br>3. Periksa tabel `tiket_laporan`, `layanan_pelanggan`, `notifikasi`, serta folder `uploads/`. | Respons `201` dengan nomor tiket berformat `A-xxxx`; tiket tersimpan berstatus `Open` dan `id_layanan_pelanggan` terisi CS dengan beban terkecil; `jumlah_tiket_dipegang` CS tersebut bertambah 1; notifikasi tiket baru untuk CS tersimpan; foto bukti tersimpan pada folder `uploads/`. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC09 | I-05 | Normal: CS membalas dan menutup tiket | 1. *Login* CS melalui `POST /api/auth/login/cs` (`cs@cariuang.id`).<br>2. Kirim `POST /api/cs/tickets/<id>/reply` dengan `text: "Laporan sudah kami terima, sedang kami cek."` untuk tiket INT-TC08.<br>3. Kirim `POST /api/cs/tickets/<id>/close`.<br>4. Budi mengirim `POST /api/tickets/<id>/messages` dengan `text: "Terima kasih"`. | Balasan tersimpan pada tabel `komunikasi` dengan `id_tiket` terisi dan status tiket berubah menjadi `Diproses`; penutupan mengubah status menjadi `Selesai` dan `jumlah_tiket_dipegang` CS berkurang 1; pesan pelapor setelah tiket ditutup ditolak `409`. | *[Hasil aktual]* | *Pass/Fail* |
| INT-TC10 | I-06, I-07 | Normal: rating dua arah dan perhitungan rata-rata | 1. Gunakan kontrak `Done` dari INT-TC07.<br>2. Budi mengirim `POST /api/ratings` dengan `idPenggunaPenerima: <id Ahmad>`, `idKontrakPekerjaan: <id>`, `nilaiRating: 5`.<br>3. Ahmad mengirim rating `4` untuk Budi pada kontrak yang sama.<br>4. Budi mengirim ulang rating untuk kontrak yang sama.<br>5. Kirim `GET /api/ratings/user/<id Ahmad>`. | Langkah 2 dan 3 mengembalikan `201`; tabel `rating` memuat dua baris dan `has_rating` kontrak bernilai `true`; `riwayat_rating` penerima bertambah dan `akumulasi_rating` dihitung ulang dengan pembulatan 2 desimal; langkah 4 ditolak `400`; langkah 5 mengembalikan `200` beserta `akumulasiRating`, `riwayatRating`, dan `totalRating`. | *[Hasil aktual]* | *Pass/Fail* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case Mendaftarkan jasa

**ID Use Case:** UC01  
**Nama Use Case:** Mendaftarkan jasa

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC01-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.2 Use Case Memilih jasa

**ID Use Case:** UC02  
**Nama Use Case:** Memilih jasa

Tabel 4.4.2. Hasil Pengujian Use Case [UC02]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC02-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC02-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.3 Use Case Menghubungi pemberi jasa

**ID Use Case:** UC03  
**Nama Use Case:** Menghubungi pemberi jasa

Tabel 4.4.3. Hasil Pengujian Use Case [UC03]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC03-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC03-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.4 Use Case Merespon pelanggan

**ID Use Case:** UC04  
**Nama Use Case:** Merespon pelanggan

Tabel 4.4.4. Hasil Pengujian Use Case [UC04]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC04-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC04-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.5 Use Case Memasukkan kesepakatan harga dan pekerjaan

**ID Use Case:** UC05  
**Nama Use Case:** Memasukkan kesepakatan harga dan pekerjaan

Tabel 4.4.5. Hasil Pengujian Use Case [UC05]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC05-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC05-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.6 Use Case Mengubah status pekerjaan menjadi selesai

**ID Use Case:** UC06  
**Nama Use Case:** Mengubah status pekerjaan menjadi selesai

Tabel 4.4.6. Hasil Pengujian Use Case [UC06]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC06-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC06-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.7 Use Case Mengonfirmasi status pekerjaan

**ID Use Case:** UC07  
**Nama Use Case:** Mengonfirmasi status pekerjaan

Tabel 4.4.7. Hasil Pengujian Use Case [UC07]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC07-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC07-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.8 Use Case Melaporkan masalah

**ID Use Case:** UC08  
**Nama Use Case:** Melaporkan masalah

Tabel 4.4.8. Hasil Pengujian Use Case [UC08]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC08-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC08-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.9 Use Case Merespon laporan masalah

**ID Use Case:** UC09  
**Nama Use Case:** Merespon laporan masalah

Tabel 4.4.9. Hasil Pengujian Use Case [UC09]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC09-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC09-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.10 Use Case Memberi rating

**ID Use Case:** UC10  
**Nama Use Case:** Memberi rating

Tabel 4.4.10. Hasil Pengujian Use Case [UC10]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC10-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC10-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.11 Use Case Memasuki akun dalam perangkat lunak

**ID Use Case:** UC11  
**Nama Use Case:** Memasuki akun dalam perangkat lunak

Tabel 4.4.11. Hasil Pengujian Use Case [UC11]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC11-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC11-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.12 Use Case Mendaftar akun ke perangkat lunak

**ID Use Case:** UC12  
**Nama Use Case:** Mendaftar akun ke perangkat lunak

Tabel 4.4.12. Hasil Pengujian Use Case [UC12]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC12-TC01* | *[KFXX]* | *Normal* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *UC12-TC02* | *[KFXX]* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| *UC01-TC01* | *[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]* |
| *UC01-TC02* | *[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]* |
| *KNF01-TC01* | *[Sisipkan bukti pengukuran parameter KNF01-TC01]* |
| *...* | *...* |

<br>

</div>

---
<div align="justify">

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |

</div>