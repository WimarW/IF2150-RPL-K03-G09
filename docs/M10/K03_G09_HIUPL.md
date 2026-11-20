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
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) CariUang ini disusun secara runut dalam lima bab, diawali oleh BAB 1 Pendahuluan yang menjelaskan tujuan penulisan dokumen, lingkup masalah, definisi istilah dan singkatan, aturan penomoran, referensi, serta ikhtisar dokumen. Dilanjutkan oleh BAB 2 Deskripsi Umum Perangkat Lunak yang memaparkan gambaran umum sistem (system overview), batasan dan keterkaitannya dengan sistem eksternal, serta pemodelan kasus penggunaan (use case). Kemudian BAB 3 Implementasi yang menjelaskan lingkungan implementasi beserta daftar modul/kelas, antarmuka pengguna, dan berkas pendukung lain yang telah dibangun. Berikutnya BAB 4 Hasil Pengujian yang melaporkan strategi dan kedalaman pengujian kelas, hasil pengujian unit, pengujian integrasi antarkomponen, pengujian use case, pengujian kebutuhan non-fungsional (KNF), serta bukti tangkapan layar hasil pengujian. Diakhiri oleh BAB 5 Traceability yang menyajikan matriks kerunutan antara kebutuhan fungsional dan non-fungsional terhadap use case, kelas perancangan, berkas implementasi, dan kasus uji sebagai sarana verifikasi pemenuhan spesifikasi perangkat lunak.
<br>

---

<div align="justify">

# BAB 2: Deskripsi Umum Perangkat Lunak
  
**CariUang** adalah perangkat lunak berbasis *mobile application* (dikembangkan dengan React Native/Expo untuk perangkat Android) yang berperan sebagai penghubung antara pekerja jasa sektor informal (**Pemberi Jasa**, seperti teknisi AC, tukang listrik, jasa kebersihan rumah, tukang ledeng, penjahit, dan tukang sol sepatu) dengan masyrakat yang membutuhkan layanan tersebut (**Pelanggan**), serta didukung oleh pihak **Layanan Pelanggan (*Customer Service*)** untuk menangani aduan dan mediasi kendala. Perangkat lunak ini dibangun untuk menjawab keterbatasan akses pemasaran pekerja informal, ketidakpastian pencarian tenaga kerja terdekat yang tepercaya, serta minimnya rekam jejak reputasi dan mekanisme penyelesaian sengketa.<br>
  
Secara garis besar, CariUang beroperasi dengan arsitektur *client-server* berpola **MVC (*Model-View-Controller*)** yang terdiri atas tiga komponen utama: <br>
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
| UC10 | Memberi rating | Pelanggan dan pemberi jasa saling memberikan skor penilaian (1-5) dan ulasan setelah kontrak selesai untuk memperbarui akumulasi rata-rata rating profil. | Pelanggan, Pemberi Jasa | KF19, KF20 |
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
| 1 | C01 | Pengguna | src/backend/src/models/Pengguna.ts<br>src/backend/prisma/schema.prisma (model Pengguna) | - |
| 2 | C02 | PenggunaUI | src/frontend/src/views/auth/RegisterCustomerView.tsx<br>src/frontend/src/views/profile/ProfileView.tsx<br>src/frontend/src/views/history/CustomerHistoryView.tsx<br>src/frontend/src/views/chat/ConversationListView.tsx<br>src/frontend/src/controllers/useAuthController.ts | - |
| 3 | C03 | PenggunaController | src/backend/src/controllers/PenggunaController.ts<br>src/backend/src/routes/auth.routes.ts<br>src/backend/src/routes/user.routes.ts<br>src/backend/src/middlewares/auth.middleware.ts | - |
| 4 | C04 | PemberiJasa | src/backend/src/models/PemberiJasa.ts<br>src/backend/prisma/schema.prisma (model PemberiJasa) | - |
| 5 | C05 | PemberiJasaUI | src/frontend/src/views/home/SearchResultView.tsx<br>src/frontend/src/components/MapViewCard.tsx<br>src/frontend/src/views/auth/RegisterProviderView.tsx<br>src/frontend/src/views/history/ProviderHistoryView.tsx<br>src/frontend/src/views/chat/ProviderChatView.tsx<br>src/frontend/src/views/auth/LoginView.tsx | - |
| 6 | C06 | PemberiJasaController | src/backend/src/controllers/PemberiJasaController.ts<br>src/backend/src/routes/services.routes.ts<br>src/backend/src/routes/auth.routes.ts<br>src/frontend/src/controllers/useCatalogController.ts | - |
| 7 | C07 | Pelanggan | src/backend/src/models/Pelanggan.ts | - |
| 8 | C08 | PelangganUI | src/frontend/src/views/auth/LoginView.tsx<br>src/frontend/src/views/auth/RegisterCustomerView.tsx<br>src/frontend/src/views/home/HomeView.tsx<br>src/frontend/src/views/home/SearchRecommendationView.tsx<br>src/frontend/src/views/chat/CustomerChatView.tsx<br>src/frontend/src/navigation/RootNavigator.tsx<br>src/frontend/src/navigation/MainTabNavigator.tsx | - |
| 9 | C09 | PelangganController | src/backend/src/controllers/PelangganController.ts<br>src/backend/src/routes/auth.routes.ts | - |
| 10 | C10 | LayananPelanggan | src/backend/src/models/LayananPelanggan.ts<br>src/backend/prisma/schema.prisma (model LayananPelanggan) | - |
| 11 | C11 | LayananPelangganUI | src/frontend/src/views/ticket/CSDashboardScreen.tsx<br>src/frontend/src/views/ticket/TicketDetailScreen.tsx<br>src/frontend/src/views/auth/LoginView.tsx | - |
| 12 | C12 | LayananPelangganController | src/backend/src/controllers/LayananPelangganCtrl.ts<br>src/backend/src/routes/cs.routes.ts<br>src/backend/src/routes/auth.routes.ts | - |
| 13 | C13 | KategoriJasa | src/backend/src/models/KategoriJasa.ts<br>src/backend/prisma/schema.prisma (model KategoriJasa) | - |
| 14 | C14 | KategoriJasaUI | src/frontend/src/views/service/ServiceRegistrationView.tsx<br>src/frontend/src/views/home/HomeView.tsx<br>src/frontend/src/views/home/SearchRecommendationView.tsx | - |
| 15 | C15 | KategoriJasaController | src/backend/src/controllers/KategoriJasaController.ts<br>src/backend/src/routes/services.routes.ts<br>src/frontend/src/controllers/useCatalogController.ts | - |
| 16 | C16 | KontrakPekerjaan | src/backend/src/models/KontrakPekerjaan.ts<br>src/backend/prisma/schema.prisma (model KontrakPekerjaan)<br>src/backend/src/workers/autoCancelKontrakWorker.ts | - |
| 17 | C17 | KontrakPekerjaanUI | src/frontend/src/components/chat/ContractCard.tsx<br>src/frontend/src/views/chat/CustomerChatView.tsx<br>src/frontend/src/views/chat/ProviderChatView.tsx<br>src/frontend/src/views/history/CustomerHistoryView.tsx<br>src/frontend/src/views/history/ProviderHistoryView.tsx<br>src/frontend/src/controllers/useContractController.ts<br>src/frontend/src/services/contractService.ts | - |
| 18 | C18 | KontrakPekerjaanController | src/backend/src/controllers/KontrakPekerjaanController.ts<br>src/backend/src/routes/kontrakRoutes.ts | - |
| 19 | C19 | Komunikasi | src/backend/src/models/Komunikasi.ts<br>src/backend/prisma/schema.prisma (model Komunikasi) | - |
| 20 | C20 | KomunikasiUI | src/frontend/src/views/ChatScreen.tsx<br>src/frontend/src/views/chat/ConversationListView.tsx<br>src/frontend/src/views/chat/CustomerChatView.tsx<br>src/frontend/src/views/chat/ProviderChatView.tsx<br>src/frontend/src/views/chat/ChatRoom.tsx<br>src/frontend/src/components/chat/ChatBubble.tsx<br>src/frontend/src/components/chat/MessageInput.tsx<br>src/frontend/src/components/chat/ChatHeader.tsx<br>src/frontend/src/components/chat/ConversationCard.tsx<br>src/frontend/src/components/chat/SearchField.tsx<br>src/frontend/src/controllers/useChatController.ts<br>src/frontend/src/services/chatService.ts | - |
| 21 | C21 | KomunikasiController | src/backend/src/controllers/KomunikasiController.ts<br>src/backend/src/routes/chats.routes.ts<br>src/backend/src/server.ts | - |
| 22 | C22 | TiketLaporan | src/backend/src/models/TiketLaporan.ts<br>src/backend/prisma/schema.prisma (model TiketLaporan)<br>src/backend/prisma/migrations/20261112100000_tiket_nomor_sequence/migration.sql | - |
| 23 | C23 | TiketLaporanUI | src/frontend/src/views/ticket/CreateTicketScreen.tsx<br>src/frontend/src/views/ticket/TicketDetailScreen.tsx<br>src/frontend/src/views/ticket/MyTicketsScreen.tsx<br>src/frontend/src/services/ticketService.ts | - |
| 24 | C24 | TiketLaporanController | src/backend/src/controllers/TiketLaporanController.ts<br>src/backend/src/routes/tickets.routes.ts<br>src/backend/src/middlewares/upload.middleware.ts | - |
| 25 | C25 | Rating | src/backend/src/models/Rating.ts<br>src/backend/prisma/schema.prisma (model Rating) | - |
| 26 | C26 | RatingUI | src/frontend/src/views/rating/RatingView.tsx<br>src/frontend/src/controllers/useRatingController.ts<br>src/frontend/src/services/ratingService.ts | - |
| 27 | C27 | RatingController | src/backend/src/controllers/RatingController.ts<br>src/backend/src/routes/ratings.routes.ts | - |
| 28 | C28 | Notifikasi | src/backend/src/models/Notifikasi.ts<br>src/backend/prisma/schema.prisma (model Notifikasi) | - |
| 29 | C29 | NotifikasiUI | src/frontend/src/views/chat/notifications/NotificationView.tsx<br>src/frontend/src/components/notifications/NotificationCard.tsx<br>src/frontend/src/controllers/useNotificationController.ts<br>src/frontend/src/services/notificationService.ts<br>src/frontend/src/context/UnreadContext.tsx<br>src/frontend/src/components/chat/UnreadBadge.tsx | - |
| 30 | C30 | NotifikasiController | src/backend/src/controllers/NotifikasiController.ts<br>src/backend/src/routes/notifications.routes.ts | - |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | UI-01 (I-01) | Login | src/frontend/src/views/auth/LoginView.tsx | - |
| 2 | UI-02 (I-02) | Buat Akun Pengguna | src/frontend/src/views/auth/RegisterCustomerView.tsx | - |
| 3 | UI-03 (I-03) | Buat Akun Pemilik Jasa | src/frontend/src/views/auth/RegisterProviderView.tsx | - |
| 4 | UI-04 (I-04) | Home / Beranda | src/frontend/src/views/home/HomeView.tsx | - |
| 5 | UI-05 (I-05) | Rekomendasi Pencarian | src/frontend/src/views/home/SearchRecommendationView.tsx | - |
| 6 | UI-06 (I-06) | Hasil Pencarian | src/frontend/src/views/home/SearchResultView.tsx<br>src/frontend/src/components/MapViewCard.tsx | - |
| 7 | UI-07 (I-07) | Daftar Pesan | src/frontend/src/views/chat/ConversationListView.tsx<br>src/frontend/src/views/ChatScreen.tsx | - |
| 8 | UI-08 (I-08) | Ruang Obrolan (Chat Channel) Pelanggan | src/frontend/src/views/chat/CustomerChatView.tsx<br>src/frontend/src/views/chat/ChatRoom.tsx<br>src/frontend/src/components/chat/ContractCard.tsx | - |
| 9 | UI-09 (I-09) | Ruang Obrolan (Chat Channel) Pemilik Jasa | src/frontend/src/views/chat/ProviderChatView.tsx<br>src/frontend/src/views/chat/ChatRoom.tsx<br>src/frontend/src/components/chat/ContractCard.tsx | - |
| 10 | UI-10 (I-10) | Riwayat (Pelanggan) | src/frontend/src/views/history/CustomerHistoryView.tsx<br>src/frontend/src/views/RiwayatScreen.tsx | - |
| 11 | UI-11 (I-11) | Beri Penilaian | src/frontend/src/views/rating/RatingView.tsx | - |
| 12 | UI-12 (I-12) | Riwayat Pekerjaan (Pemilik Jasa) | src/frontend/src/views/history/ProviderHistoryView.tsx<br>src/frontend/src/views/RiwayatScreen.tsx | - |
| 13 | UI-13 (I-13) | Notifikasi | src/frontend/src/views/chat/notifications/NotificationView.tsx<br>src/frontend/src/components/notifications/NotificationCard.tsx | - |
| 14 | UI-14 (I-14) | Profil | src/frontend/src/views/profile/ProfileView.tsx | - |
| 15 | UI-15 (I-15) | Buat Tiket Laporan | src/frontend/src/views/ticket/CreateTicketScreen.tsx | - |
| 16 | UI-16 (I-16) | Daftar Penyedia Jasa | src/frontend/src/views/service/ServiceRegistrationView.tsx<br>src/frontend/src/views/home/SearchResultView.tsx | - |
| 17 | UI-17 (I-17) | Home untuk CS | src/frontend/src/views/ticket/CSDashboardScreen.tsx<br>src/frontend/src/views/cs/CSHomeView.tsx | - |
| 18 | UI-18 (I-18) | Detail Tiket (Chat Channel CS & Pelapor) | src/frontend/src/views/ticket/TicketDetailScreen.tsx | - |
| 19 | UI-19 (I-19) | Tiket Saya | src/frontend/src/views/ticket/MyTicketsScreen.tsx | - |




## 3.4 File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | src/docker-compose.yml | Konfigurasi kontainer Docker Compose untuk menjalankan DBMS PostgreSQL 16 secara lokal beserta volume penyimpanan. |
| 2 | src/backend/src/server.ts | Entrypoint server backend Express.js, konfigurasi CORS, routing REST API, inisialisasi Socket.IO (SocketIORealtimeEmitter), dan penjadwalan background worker. |
| 3 | src/backend/src/database/prisma.ts | Instansiasi singleton PrismaClient untuk koneksi aplikasi backend ke basis data PostgreSQL. |
| 4 | src/backend/src/utils/haversine.ts | Fungsi perhitungan jarak geografis (rumus Haversine) dalam satuan kilometer antara koordinat GPS pelanggan dan pemilik jasa. |
| 5 | src/backend/src/middlewares/auth.middleware.ts | Middleware autentikasi token JWT (authenticateJWT) dan otorisasi berbasis peran pengguna (authorizeRoles). |
| 6 | src/backend/src/middlewares/upload.middleware.ts | Middleware Multer (uploadFoto) untuk validasi dan penyimpanan unggahan gambar bukti tiket maupun lampiran chat (format JPG/PNG, maks. 5 MB). |
| 7 | src/backend/src/workers/autoCancelKontrakWorker.ts | Background worker yang berjalan periodik setiap 60 detik untuk membatalkan kontrak berstatus Menunggu yang telah melewati batas waktu 30 menit (expiresAt) serta membuka kunci penyedia jasa. |
| 8 | src/backend/src/routes/devAuth.routes.ts | Endpoint bantu pengembangan (POST /api/auth/dev-token) untuk menerbitkan token JWT per peran saat pengujian (aktif hanya jika ENABLE_DEV_TOKEN=true). |
| 9 | src/backend/prisma/schema.prisma | Definisi skema model basis data Prisma ORM (Pengguna, PemberiJasa, LayananPelanggan, KategoriJasa, KontrakPekerjaan, Komunikasi, TiketLaporan, Rating, Notifikasi) beserta enum dan indeks. |
| 10 | src/backend/prisma/migrations/*/migration.sql | Berkas migrasi SQL skema basis data PostgreSQL, termasuk pembuatan tabel, relasi, indeks, dan sequence nomor tiket seq_nomor_tiket (A-xxxx). |
| 11 | src/backend/prisma/seed.ts | Skrip pengisian data awal (database seeder) berisi akun uji Pelanggan, Pemberi Jasa, Layanan Pelanggan (CS), kategori jasa, serta sampel transaksi dan tiket. |
| 12 | src/backend/package.json<br>src/backend/tsconfig.json<br>src/backend/jest.config.js<br>src/backend/DockerFile | Konfigurasi dependensi, skrip npm, kompilator TypeScript, konfigurasi Jest, dan Dockerfile untuk sisi backend. |
| 13 | src/backend/tests/auth.test.ts<br>src/backend/tests/serviceCatalog.test.ts<br>src/backend/tests/komunikasi.test.ts<br>src/backend/tests/kontrakPekerjaan.test.ts<br>src/backend/tests/tiketLaporan.test.ts<br>src/backend/tests/rating.test.ts | Script pengujian unit dan integrasi backend menggunakan Jest dan Supertest. |
| 14 | src/frontend/index.ts<br>src/frontend/App.tsx<br>src/frontend/src/App.tsx | Titik masuk utama aplikasi mobile React Native (Expo) dan pembungkus konteks navigasi aplikasi. |
| 15 | src/frontend/src/navigation/RootNavigator.tsx<br>src/frontend/src/navigation/MainTabNavigator.tsx<br>src/frontend/src/navigation/BottomTabNavigation.tsx<br>src/frontend/src/navigation/types.ts | Konfigurasi navigasi stack dan bottom tab multi-peran beserta definisi tipe parameter rute layar. |
| 16 | src/frontend/src/services/api.ts<br>src/frontend/src/services/authService.ts<br>src/frontend/src/services/serviceCatalogService.ts<br>src/frontend/src/services/chatService.ts<br>src/frontend/src/services/contractService.ts<br>src/frontend/src/services/ticketService.ts<br>src/frontend/src/services/ratingService.ts<br>src/frontend/src/services/notificationService.ts | Modul layanan komunikasi HTTP REST API dari aplikasi mobile (frontend) ke server backend beserta pengelolaan token sesi. |
| 17 | src/frontend/src/components/Button.tsx<br>src/frontend/src/components/Header.tsx<br>src/frontend/src/components/InputField.tsx<br>src/frontend/src/components/common/KeyboardAwareView.tsx<br>src/frontend/src/components/common/Snackbar.tsx<br>src/frontend/src/components/chat/Avatar.tsx<br>src/frontend/src/components/chat/CSTag.tsx<br>src/frontend/src/components/chat/DateSeparator.tsx | Komponen antarmuka pengguna (reusable UI components) yang digunakan bersama di berbagai layar aplikasi. |
| 18 | src/frontend/src/config/chatConfig.ts<br>src/frontend/src/context/UnreadContext.tsx<br>src/frontend/src/theme/colors.ts<br>src/frontend/src/types/chat.ts<br>src/frontend/src/utils/chatUtils.ts | Konfigurasi interval polling chat/notifikasi, React Context penghitung pesan/notifikasi belum dibaca, palet warna tema, tipe data chat, dan fungsi utilitas format waktu/pesan. |
| 19 | src/frontend/package.json<br>src/frontend/app.json<br>src/frontend/tsconfig.json<br>src/frontend/Dockerfile | Konfigurasi proyek Expo React Native, dependensi frontend, TypeScript, dan kontainerisasi frontend. |
| 20 | src/frontend/tests/catalogHelpers.test.ts<br>src/frontend/tests/contractHelpers.test.ts<br>src/frontend/tests/ratingUI.test.ts | Berkas pengujian unit logika bantu dan validasi pada sisi frontend menggunakan Jest. |

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
| C13 | KategoriJasa | Sedang | Kelas entitas kategori jasa yang berisi *getter/setter* (`ALGO-022`-`ALGO-029`) serta operasi penyimpanan dan pengurutan alfabetis via Prisma (`ALGO-031`, `Q-015`). | C13-UT01 s.d. C13-UT03, INT-TC02 |
| C14 | KategoriJasaUI | Tidak perlu | Lapisan *View* React Native (form pendaftaran jasa & daftar kategori beranda) tanpa logika bisnis; teruji melalui `UC01`, `UC02`. | - |
| C15 | KategoriJasaController | Mendalam | Memuat validasi input pendaftaran jasa (`validateKategoriJasa()`, `ALGO-033`), transaksi penyimpanan kategori & pembaruan peran penyedia (`ALGO-034`, `ALGO-035`), dan pemfilteran kategori (`filterKategoriJasa()`). | C15-UT01 s.d. C15-UT06, INT-TC02 |
| C16 | KontrakPekerjaan | Mendalam | Memuat aturan transisi status pekerjaan (`VALID_TRANSITIONS`, `KNF22`), *optimistic locking* pemesanan (`KNF04`, `KNF19`), konstruksi/validasi kontrak (`ALGO-036`-`ALGO-040`), dan *worker* *auto-cancel* 30 menit (`KNF11`). | C16-UT01 s.d. C16-UT07, INT-TC05, INT-TC06, INT-TC07 |
| C17 | KontrakPekerjaanUI | Sedang | Mencakup *hook* `useContractController` di sisi klien yang menjalankan sanitasi/validasi form kontrak, pemetaan status kartu, filter tab riwayat, dan aturan visibilitas tombol aksi. | C17-UT01 s.d. C17-UT04 |
| C18 | KontrakPekerjaanController | Mendalam | Mengatur seluruh siklus bisnis kontrak (`kirimInput`, `konfirmasiPersetujuanPenyedia`, `selesaikanPekerjaan`, `konfirmasiPekerjaan`, `ALGO-041`-`ALGO-043`), larangan *self-contract*, serta integrasi notifikasi & chat. | C18-UT01 s.d. C18-UT07, INT-TC05, INT-TC07 |
| C19 | Komunikasi | Mendalam | Memuat inisialisasi pesan, isolasi dan pengurutan riwayat percakapan dua arah (`ALGO-044`-`ALGO-048`), penandaan pesan terbaca, dan agregasi daftar percakapan serta jumlah belum terbaca (`unreadCount`). | C19-UT01 s.d. C19-UT05, INT-TC04 |
| C20 | KomunikasiUI | Tidak perlu | Lapisan *View* React Native (daftar percakapan & ruang obrolan) tanpa logika bisnis internal; teruji melalui `UC03`, `UC04`. | - |
| C21 | KomunikasiController | Mendalam | Memuat validasi pesan (anti-*self-message*, batas 1000 karakter, anti-*spoofing* pengirim), kontrol akses riwayat chat (`ALGO-049`-`ALGO-052`), pemancaran *Socket.IO*, dan pemicuan notifikasi aman. | C21-UT01 s.d. C21-UT06, INT-TC04 |
| C22 | TiketLaporan | Sedang | Mengelola operasi persistensi tiket, penomoran `A-xxxx`, statistik status, dan pengambilan/penambahan pesan mediasi via Prisma (`Q-008`). | C22-UT01 s.d. C22-UT03, INT-TC08, INT-TC09 |
| C23 | TiketLaporanUI | Tidak perlu | Lapisan *View* React Native (buat tiket, daftar tiket saya, detail mediasi) tanpa logika bisnis internal; teruji melalui `UC08`, `UC09`. | - |
| C24 | TiketLaporanController | Mendalam | Memuat validasi form aduan (`validasiFormTiket()`, `ALGO-053`), transaksi pembuatan tiket + penugasan otomatis CS (`ALGO-013`, `ALGO-054`), notifikasi non-blokir (`ALGO-055`), dan kontrol akses pelapor. | C24-UT01 s.d. C24-UT06, INT-TC08, INT-TC09 |
| C25 | Rating | Mendalam | Memuat sanitasi *ulasan* & *tags* (`makeRating()`, `ALGO-057`), validasi nilai batas 1-5 (`ALGO-056`), serta kalkulasi rata-rata array PostgreSQL dengan pembulatan 2 desimal (`updateRatingPengguna()`, `ALGO-058`). | C25-UT01 s.d. C25-UT06, INT-TC10 |
| C26 | RatingUI | Sedang | Mencakup *hook* `useRatingController` di sisi klien yang mengelola label predikat bintang (1-5), multi-pilih *tag* per peran, aktivasi tombol kirim, dan logika visibilitas tombol *Beri Rating* dua arah. | C26-UT01 s.d. C26-UT04 |
| C27 | RatingController | Mendalam | Memuat validasi parameter rating (`validateRatingValue()`, `ALGO-064`), penegakan status kontrak wajib `Done`, pencegahan rating ganda per kontrak, dan pengambilan riwayat rating pengguna. | C27-UT01 s.d. C27-UT06, INT-TC10 |
| C28 | Notifikasi | Tidak perlu | Kelas model akses data murni Prisma ORM tanpa aturan bisnis (terdokumentasi langsung di `Notifikasi.ts`); teruji tidak langsung melalui `C30` dan pengujian integrasi. | - |
| C29 | NotifikasiUI | Tidak perlu | Lapisan *View* React Native (daftar notifikasi & *badge* belum dibaca) tanpa logika bisnis internal; teruji melalui `UC04`, `UC08`, `UC09`. | - |
| C30 | NotifikasiController | Sedang | Mengoordinasikan pembuatan notifikasi (`buatNotifikasi()`, `ALGO-067`), pemancaran *Socket.IO*, pemanggilan `ExpoPushGateway`, dan penandaan notifikasi terbaca. | C30-UT01 s.d. C30-UT03, INT-TC04, INT-TC05, INT-TC08 |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada seluruh kelas bertingkat **Mendalam** (13 kelas) dan **Sedang** (7 kelas). Kelas **Mendalam** diuji pada seluruh operasi `public` dengan kasus *Normal*, *Batas* (*Boundary*), dan *Negatif* serta memenuhi *coverage* ≥ 70%. Kelas **Sedang** diuji minimal dengan satu kasus *Normal* dan satu kasus *Negatif/Gagal* pada operasi `public` utama. Kelas bertingkat **Tidak perlu** (10 kelas) tidak diuji secara unit terpisah karena tidak memuat logika bisnis internal dan diverifikasi melalui pengujian *use case* pada Subbab 4.4.

Cara menjalankan unit test:
- **Backend:** `cd src/backend && npx jest --verbose --coverage`
- **Frontend:** `cd src/frontend && npx jest --verbose --coverage`

Lokasi file test:
- **Backend:** `src/backend/tests/` (`auth.test.ts`, `serviceCatalog.test.ts`, `komunikasi.test.ts`, `kontrakPekerjaan.test.ts`, `tiketLaporan.test.ts`, `rating.test.ts`, `notifikasi.test.ts`)
- **Frontend:** `src/frontend/tests/` (`catalogHelpers.test.ts`, `contractHelpers.test.ts`, `ratingUI.test.ts`)

---

### 4.2.1 Kelas Pengguna

**ID Kelas:** C01  
**Nama Kelas:** Pengguna  
**Tingkat:** Sedang

Tabel 4.2.1. Hasil Pengujian Unit Kelas C01

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C01-UT01 | `addNewRatingRiwayat()` | Normal | Inisialisasi `new Pengguna({ idPengguna: 'u-local-1' })`, lalu panggil berurutan `addNewRatingRiwayat(5)`, `addNewRatingRiwayat(4)`, dan `addNewRatingRiwayat(4)` | `getRiwayatRating()` mengembalikan `[5, 4, 4]` dan `getAkumulasiRating()` mengembalikan `4.33` (rata-rata 2 desimal) | `getRiwayatRating()` menghasilkan `[5, 4, 4]` dan `getAkumulasiRating()` menghasilkan `4.33` (`tests/rating.test.ts`) | Pass |
| C01-UT02 | `addNewRatingRiwayat()` | Batas | Panggil `addNewRatingRiwayat(1)` (batas bawah) dan `addNewRatingRiwayat(5)` (batas atas) pada `new Pengguna({ idPengguna: 'u-local-batas' })` | Kedua nilai diterima tanpa *error*, `getRiwayatRating()` = `[1, 5]`, dan `getAkumulasiRating()` = `3` | Nilai `1` dan `5` diterima, `riwayatRating` = `[1, 5]` dan `akumulasiRating` = `3` (`tests/rating.test.ts`) | Pass |
| C01-UT03 | `addNewRatingRiwayat()` | Negatif | Panggil `addNewRatingRiwayat(0)` dan `addNewRatingRiwayat(6)` pada objek `Pengguna` | Melempar *error* `'Nilai rating harus berada dalam rentang 1 hingga 5.'` | Kedua pemanggilan melempar *error* sesuai pesan validasi rentang (`tests/rating.test.ts`) | Pass |
| C01-UT04 | `konfirmasiPekerjaan()` | Normal & Negatif | (1) Panggil `konfirmasiPekerjaan(idKontrak)` saat kontrak masih berstatus `'Menunggu'`; (2) Panggil saat kontrak berstatus `'Menunggu Konfirmasi Pelanggan'` milik `'cust-1'` | (1) Mengembalikan `false`; (2) Mengembalikan `true` dan mengubah status kontrak menjadi `'Done'` | (1) Mengembalikan `false`; (2) Mengembalikan `true` dan status berubah menjadi `'Done'` (`tests/kontrakPekerjaan.test.ts`) | Pass |

---

### 4.2.2 Kelas PenggunaUI

**ID Kelas:** C02  
**Nama Kelas:** PenggunaUI  
**Tingkat:** Tidak perlu

Tidak dilakukan pengujian unit terpisah karena kelas ini merupakan lapisan antarmuka (*View* React Native untuk registrasi, profil, dan riwayat) tanpa logika bisnis internal. Pengujian dilakukan secara tidak langsung melalui pengujian *use case* (`UC10`, `UC11`, `UC12`) pada Subbab 4.4.

---

### 4.2.3 Kelas PenggunaController

**ID Kelas:** C03  
**Nama Kelas:** PenggunaController  
**Tingkat:** Mendalam

Tabel 4.2.3. Hasil Pengujian Unit Kelas C03

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C03-UT01 | `validasiInfoRegistrasi()` | Normal | Kirim payload valid dengan spasi tepi pada `namaPengguna`/`username`/`email` huruf kapital serta alias `nomorTelpon`/`nomorTelepon` | Mengembalikan `valid: true` dengan data sudah di-*trim* dan email diubah ke *lowercase* | Mengembalikan `valid: true` dan `sanitizedData` terformat sesuai harapan (`tests/auth.test.ts`) | Pass |
| C03-UT02 | `validasiInfoRegistrasi()` | Batas | Uji batas panjang password (`7` vs `8` karakter) dan panjang nomor telepon (`9`, `10`, `15`, `16` digit) | Password ≥ 8 karakter dan nomor `10-15` digit lolos; di luar batas ditolak (`valid: false`) | Password 7 karakter serta nomor 9 & 16 digit ditolak; batas 8 karakter & 10-15 digit lolos (`tests/auth.test.ts`) | Pass |
| C03-UT03 | `validasiInfoRegistrasi()` | Negatif | Kirim field wajib kosong/spasi (`namaPengguna`, `username`, `password`, `email`, `nomorTelpon`), format email invalid (`budi@`, `@example.com`), serta nomor non-angka/`+62` | Semua masukan tidak valid ditolak dengan `valid: false` dan pesan error deskriptif | Seluruh 14 variasi kasus negatif ditolak dengan `valid: false` (`tests/auth.test.ts`) | Pass |
| C03-UT04 | `cekInfoLogin()` | Normal | Panggil dengan `username` valid (`'pelanggan1'`) dan `email` valid (`'pelanggan1@cariuang.id'`) beserta password benar | Mengembalikan `authenticated: true`, token JWT valid, `role` terresolusi, dan tanpa field `password` | Autentikasi berhasil untuk username & email, JWT terverifikasi, field `password` dihapus (`tests/auth.test.ts`) | Pass |
| C03-UT05 | `cekInfoLogin()` | Negatif | Panggil dengan akun tidak ditemukan dan dengan akun ada tetapi password salah | Mengembalikan `authenticated: false` (tetap menjalankan `bcrypt.compare` ke *dummy hash* saat akun tidak ada) | Kedua kasus mengembalikan `authenticated: false` dan *dummy bcrypt* dijalankan (`tests/auth.test.ts`) | Pass |
| C03-UT06 | `login()` | Normal & Negatif | Panggil handler `POST /api/auth/login` dengan input kosong, password salah, dan kredensial benar | Mengembalikan `400` untuk kosong, `401` untuk salah, dan `200` + JWT untuk benar | Handler mengembalikan `400`, `401`, dan `200` beserta token JWT (`tests/auth.test.ts`) | Pass |
| C03-UT07 | `validasiUpdateProfil()`, `getProfile()`, `updateProfile()` | Normal & Negatif | Uji validasi profil (valid & invalid), `getProfile` (401 unauth, 404 tidak ada, 200 untuk 3 peran), dan `updateProfile` (401, 400 validasi, 404, 400 email duplikat, 200 sukses) | Setiap kondisi mengembalikan kode status HTTP dan payload respons yang sesuai | Seluruh cabang `401`, `400`, `404`, dan `200` (termasuk update `avatarUrl`) berjalan sesuai harapan (`tests/auth.test.ts`) | Pass |
| C03-UT08 | `verifikasiStatusPekerjaan()`, `triggerRating()` | Normal & Negatif | Uji `verifikasiStatusPekerjaan` (kosong, tidak ada, `On Progress`, `Done`) dan `triggerRating` (`401`, `400` kosong/belum Done/sudah dinilai, `403` bukan peserta, `404`, `200` Pelanggan & Mitra) | Hanya kontrak `Done` milik peserta yang belum menilai yang mengembalikan `true` / `200` (`canRate: true`) | Seluruh cabang `false`/`true` dan HTTP `401`, `400`, `403`, `404`, `200` sesuai harapan (`tests/auth.test.ts`) | Pass |

Tabel 4.2.3b. Ringkasan Cakupan Kelas C03

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiInfoRegistrasi()`, `validasiUpdateProfil()`, `cekInfoLogin()`, `login()`, `getProfile()`, `updateProfile()`, `verifikasiStatusPekerjaan()`, `triggerRating()` |
| Operasi yang diuji | `validasiInfoRegistrasi()`, `validasiUpdateProfil()`, `cekInfoLogin()`, `login()`, `getProfile()`, `updateProfile()`, `verifikasiStatusPekerjaan()`, `triggerRating()` |
| ID Algoritma yang tercakup | `ALGO-001`, `ALGO-017` |
| Coverage (wajib ≥ 70%) | **94,77% Lines / 84,52% Branch / 100% Funcs** (`src/backend/src/controllers/PenggunaController.ts`, Jest `--coverage`, bukti pada Subbab 4.6) |

---

### 4.2.4 Kelas PemberiJasa

**ID Kelas:** C04  
**Nama Kelas:** PemberiJasa  
**Tingkat:** Mendalam

Tabel 4.2.4. Hasil Pengujian Unit Kelas C04

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C04-UT01 | `calculateHaversineDistance()` | Batas | Hitung jarak antara dua titik koordinat identik `(-6.8915, 107.6107)` | Mengembalikan jarak tepat `0` km | Mengembalikan `0` km (`tests/serviceCatalog.test.ts`) | Pass |
| C04-UT02 | `calculateHaversineDistance()` | Normal | Hitung jarak GPS antara titik ITB Ganesha, Cisitu, dan Buah Batu | Mengembalikan jarak numerik akurat sesuai formula *Haversine* (Cisitu lebih dekat dari Buah Batu) | Jarak terhitung akurat sesuai jarak geografis (`tests/serviceCatalog.test.ts`) | Pass |
| C04-UT03 | `searchPemberiJasa()` | Normal | Cari penyedia jasa dengan pengurutan terdekat (*Haversine*), *Rating Terbaik* (`DESC`), dan *Termurah* (`tarif ASC`) | Daftar penyedia terurut sesuai kriteria yang diminta | Urutan hasil sesuai untuk ketiga mode pengurutan (`tests/serviceCatalog.test.ts`) | Pass |
| C04-UT04 | `getPemberiJasaByID()`, `getPemberiJasaByKategori()` | Normal & Negatif | Ambil detail penyedia berdasarkan `PJ_AHMAD_ID`, ambil berdasarkan kategori `KAT_AC_ID`, dan uji ID tidak ditemukan | Mengembalikan objek detail lengkap/daftar penyedia untuk ID valid, dan `null` untuk ID tidak ditemukan | Detail lengkap & daftar per kategori kembali akurat; ID tidak dikenal menghasilkan `null` (`tests/serviceCatalog.test.ts`) | Pass |
| C04-UT05 | `makePemberiJasa()`, `simpanKeDb()`, `savePemberiJasa()` | Normal | Buat dan simpan penyedia jasa baru lengkap dengan `idKategoriJasa`, `jenisJasa`, `namaToko`, dan koordinat | Data tersimpan di `pengguna` (`role = PEMBERI_JASA`) dan `pemberi_jasa` dengan password ter-*hash* | Data tersimpan konsisten pada kedua entitas (`tests/auth.test.ts`, `tests/serviceCatalog.test.ts`) | Pass |
| C04-UT06 | *Getter/Setter* atribut (`setIDPemberiJasa`, `setIDKategoriJasa`, `setJenisJasa`, `setNamaToko`, `setLatitude`, `setLongitude`, `setStatusKetersediaan`, `setIsOnline`, `setJarakKm`) | Normal | Inisialisasi `new PemberiJasa(...)`, perbarui seluruh atribut melalui *setter*, lalu baca kembali via *getter* | Seluruh *getter* mengembalikan nilai terbaru yang disetel | Seluruh 11 *getter/setter* mengembalikan nilai yang tepat (`tests/serviceCatalog.test.ts`) | Pass |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C04

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getIDPemberiJasa()`, `setIDPemberiJasa()`, `getIDKategoriJasa()`, `setIDKategoriJasa()`, `getJenisJasa()`, `setJenisJasa()`, `savePemberiJasa()`, `makePemberiJasa()`, `simpanKeDb()`, `getPemberiJasaByID()`, `getPemberiJasaByKategori()`, `searchPemberiJasa()`, serta *getter/setter* lokasi & ketersediaan |
| Operasi yang diuji | `getIDPemberiJasa()`, `setIDPemberiJasa()`, `getIDKategoriJasa()`, `setIDKategoriJasa()`, `getIdKategoriJasa()`, `getJenisJasa()`, `setJenisJasa()`, `getNamaToko()`, `setNamaToko()`, `getLatitude()`, `setLatitude()`, `getLongitude()`, `setLongitude()`, `getStatusKetersediaan()`, `setStatusKetersediaan()`, `getIsOnline()`, `setIsOnline()`, `getJarakKm()`, `setJarakKm()`, `getDataPemberiJasa()`, `makePemberiJasa()`, `simpanKeDb()`, `savePemberiJasa()`, `getPemberiJasaByID()`, `getPemberiJasaByKategori()`, `searchPemberiJasa()` |
| ID Algoritma yang tercakup | `ALGO-002`, `ALGO-003`, `ALGO-004`, `ALGO-005`, `ALGO-006`, `ALGO-012` |
| Coverage (wajib ≥ 70%) | **85,10% Lines / 53,92% Branch / 86,11% Funcs** (`PemberiJasa.ts`) dan **100% Lines / 100% Branch** (`haversine.ts`, Jest `--coverage`, bukti pada Subbab 4.6) |

---

### 4.2.5 Kelas PemberiJasaUI

**ID Kelas:** C05  
**Nama Kelas:** PemberiJasaUI  
**Tingkat:** Tidak perlu

Tidak dilakukan pengujian unit terpisah karena kelas ini merupakan lapisan antarmuka (*View* React Native untuk hasil pencarian, kartu peta, registrasi penyedia, dan riwayat pekerjaan) tanpa logika bisnis internal. Pengujian dilakukan melalui pengujian *use case* (`UC01`, `UC02`, `UC04`, `UC06`, `UC11`) pada Subbab 4.4.

---

### 4.2.6 Kelas PemberiJasaController

**ID Kelas:** C06  
**Nama Kelas:** PemberiJasaController  
**Tingkat:** Mendalam

Tabel 4.2.6. Hasil Pengujian Unit Kelas C06

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C06-UT01 | `registrasiPemberiJasa()` | Normal | Kirim payload registrasi penyedia jasa valid lengkap (`idKategoriJasa`, `jenisJasa`, `namaToko`, koordinat) | Mengembalikan `201`, role `PEMBERI_JASA`, password ter-*hash* bcrypt, tanpa field `password` | Mengembalikan `201`, data tersimpan di `pengguna` & `pemberiJasa` (`tests/auth.test.ts`) | Pass |
| C06-UT02 | `registrasiPemberiJasa()` | Negatif | Kirim payload dengan `idKategoriJasa` kosong, `jenisJasa` kosong, format email/telepon salah, atau `username` duplikat | Mengembalikan `400` dengan pesan error validasi/duplikasi | Seluruh kasus negatif ditolak dengan status `400` (`tests/auth.test.ts`) | Pass |
| C06-UT03 | `validatePemberiJasa()`, `fetchPemberiJasaById()`, `choosePemberiJasa()`, `getServiceByIdHandler()` | Normal & Negatif | Uji ID valid (`PJ_AHMAD_ID`/`PJ_SITI_ID`), ID kosong/spasi (`""`, `"   "`), ID tidak dikenal, dan error DB (`500`) | ID valid mengembalikan `true`/detail (`200`); kosong mengembalikan `false`/`null`/`400`; tidak ada mengembalikan `404`; error DB `500` | Seluruh cabang `true`/`false`/`null` dan HTTP `200`, `400`, `404`, `500` sesuai harapan (`tests/serviceCatalog.test.ts`) | Pass |
| C06-UT04 | `showPemberiJasaFromKategori()`, `getServicesByCategoryHandler()` | Normal & Negatif | Panggil dengan `KAT_AC_ID`, string kosong `""`, dan simulasi error DB | `KAT_AC_ID` mengembalikan 1 penyedia (`200`), string kosong `[]`, error DB `500` | Mengembalikan `[]`, `200` (`count: 1`), dan `500` saat error (`tests/serviceCatalog.test.ts`) | Pass |
| C06-UT05 | `searchServices()`, `searchServicesHandler()` | Normal & Negatif | Panggil pencarian dengan koordinat user (urut terdekat, rating terbaik, termurah) serta simulasi error DB (`500`) | Mengembalikan daftar terurut sesuai `sortBy` (`200`) dan `500` saat gagal | Ketiga mode pengurutan menghasilkan urutan tepat (`200`) dan error DB mengembalikan `500` (`tests/serviceCatalog.test.ts`) | Pass |
| C06-UT06 | `searchServices()`, `buildSearchQuery()` | Batas | Uji filter batas `radiusKm = 2` dari ITB Ganesha serta `buildSearchQuery` dengan parameter kosong, `NaN`, dan `radiusKm = 0` | Hanya penyedia dengan `jarakKm <= 2` yang lolos; parameter tidak valid/batas `0` diabaikan pada *query string* | Filter `radiusKm <= 2` tepat dan `buildSearchQuery` menghasilkan `"?q=servis&long=107.6107&sortBy=terdekat"` (`tests/serviceCatalog.test.ts`, `tests/catalogHelpers.test.ts`) | Pass |
| C06-UT07 | `isProviderAvailable()`, `filterAvailableProviders()` | Normal & Batas | Uji status `'Available'`, `' available '` (*case-insensitive* + spasi), dan `'On Progress'` | `'Available'` & `' available '` mengembalikan `true`; `'On Progress'` mengembalikan `false` dan tersaring keluar | Hasil filter hanya memuat penyedia berstatus *available* (`tests/catalogHelpers.test.ts`) | Pass |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C06

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `registrasiPemberiJasa()`, `validatePemberiJasa()`, `setInformasiKategoriJasa()`, `fetchPemberiJasaById()`, `showPemberiJasaFromKategori()`, `choosePemberiJasa()`, `searchServices()`, `searchServicesHandler()`, `getServiceByIdHandler()`, `getServicesByCategoryHandler()` |
| Operasi yang diuji | Seluruh 10 operasi public backend di atas serta *helper* `useCatalogController` (`buildSearchQuery`, `isProviderAvailable`, `filterAvailableProviders`) |
| ID Algoritma yang tercakup | `ALGO-007`, `ALGO-008`, `ALGO-009`, `ALGO-010`, `ALGO-011`, `ALGO-012` |
| Coverage (wajib ≥ 70%) | **91,15% Lines / 80,76% Branch / 100% Funcs** (`src/backend/src/controllers/PemberiJasaController.ts`, Jest `--coverage`, bukti pada Subbab 4.6) |

---

### 4.2.7 Kelas Pelanggan

**ID Kelas:** C07  
**Nama Kelas:** Pelanggan  
**Tingkat:** Tidak perlu

Tidak dilakukan pengujian unit terpisah karena kelas ini merupakan subkelas *entity/DTO* murni dari `Pengguna` tanpa aturan bisnis tambahan (hanya konstruksi `makePelanggan()`, serialisasi `toResponse()`, dan persistensi `simpanKeDb()`). Kelas ini teruji secara tidak langsung melalui `C09 PelangganController` (`auth.test.ts`, *coverage* `Pelanggan.ts` tercatat **100% Lines**) dan pengujian *use case* (`UC12`).

---

### 4.2.8 Kelas PelangganUI

**ID Kelas:** C08  
**Nama Kelas:** PelangganUI  
**Tingkat:** Tidak perlu

Tidak dilakukan pengujian unit terpisah karena kelas ini merupakan lapisan antarmuka (*View* React Native untuk login, beranda, rekomendasi pencarian, dan obrolan pelanggan) tanpa logika bisnis internal. Pengujian dilakukan melalui pengujian *use case* (`UC02`, `UC03`, `UC05`, `UC07`, `UC11`, `UC12`) pada Subbab 4.4.

---

### 4.2.9 Kelas PelangganController

**ID Kelas:** C09  
**Nama Kelas:** PelangganController  
**Tingkat:** Sedang

Tabel 4.2.9. Hasil Pengujian Unit Kelas C09

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C09-UT01 | `registrasiPelanggan()` | Normal | Kirim payload registrasi pelanggan valid lengkap (`namaPengguna`, `username`, `password`, `email`, `nomorTelpon`) | Mengembalikan `201`, role `PELANGGAN`, password tersimpan sebagai *hash bcrypt*, dan respons tanpa field `password` | Mengembalikan `201`, `bcrypt.compare` bernilai `true`, dan field `password` tidak dikembalikan (`tests/auth.test.ts`) | Pass |
| C09-UT02 | `registrasiPelanggan()` | Negatif | Kirim payload dengan password 3 karakter, email `'salah'`, dan nomor telepon `'0812'` | Mengembalikan `400`, `success: false`, dan tidak menyimpan data ke basis data | Mengembalikan `400` dan `mockStore.pengguna.size === 0` (`tests/auth.test.ts`) | Pass |
| C09-UT03 | `registrasiPelanggan()` | Negatif | Kirim payload dengan `username` atau `email` yang sudah terdaftar sebelumnya | Mengembalikan `400` dengan pesan `'Username sudah terdaftar'` atau `'Email sudah terdaftar'` | Kedua percobaan duplikasi mengembalikan `400` dengan pesan yang sesuai (`tests/auth.test.ts`) | Pass |

---

### 4.2.10 Kelas LayananPelanggan

**ID Kelas:** C10  
**Nama Kelas:** LayananPelanggan  
**Tingkat:** Mendalam

Tabel 4.2.10. Hasil Pengujian Unit Kelas C10

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C10-UT01 | `cariLayananKosong()` | Normal | Sediakan beberapa staf CS berstatus `Available` dengan beban tiket berbeda (`cs-1`: 3, `cs-2`: 1), lalu panggil `cariLayananKosong(tx)` | Mengembalikan ID staf CS dengan `jumlahTiketDipegang` terkecil (`cs-2`) | Mengembalikan `'cs-2'` yang memiliki beban terkecil (`tests/tiketLaporan.test.ts`) | Pass |
| C10-UT02 | `cariLayananKosong()` | Batas & Negatif | Atur seluruh staf CS tidak memenuhi syarat (`status !== 'Available'` dan `jumlahTiketDipegang >= 5`), lalu panggil `cariLayananKosong(tx)` | Mengembalikan `null` karena tidak ada staf CS yang tersedia | Mengembalikan `null` (`tests/tiketLaporan.test.ts`) | Pass |
| C10-UT03 | `tambahBeban()` | Normal & Batas | (1) Panggil `tambahBeban(tx, 'cs-2')` dari beban `1`; (2) Panggil `tambahBeban(tx, 'cs-boundary')` dari batas beban `4` berstatus `'Available'` | (1) Beban naik menjadi `2`; (2) Beban naik menjadi `5` dan status otomatis berubah menjadi `'Busy'` | Beban bertambah `+1` dan pada batas `5` status berubah menjadi `'Busy'` (`tests/tiketLaporan.test.ts`) | Pass |
| C10-UT04 | `kurangiBeban()` | Normal & Batas | (1) Panggil `kurangiBeban(tx, 'cs-boundary')` dari beban `5` (`'Busy'`); (2) Panggil saat beban sudah `0` | (1) Beban turun menjadi `4` dan status kembali `'Available'`; (2) Beban tetap `0` (tidak negatif) | Beban turun ke `4` (`'Available'`) dan pada beban `0` tetap `0` (`tests/tiketLaporan.test.ts`) | Pass |
| C10-UT05 | Konstruktor, `getStatus()`, `getJumlahTiketDipegang()`, `toJSON()` | Normal | Inisialisasi `new LayananPelanggan(...)` dengan `status: 'Available'` dan `jumlahTiketDipegang: 4`, lalu panggil *getter* dan `toJSON()` | Mengembalikan `'Available'`, `4`, dan objek JSON lengkap berisi `idLayananPelanggan`, `status`, dan `jumlahTiketDipegang` | Seluruh *getter* dan `toJSON()` mengembalikan nilai sesuai harapan (`tests/tiketLaporan.test.ts`) | Pass |

Tabel 4.2.10b. Ringkasan Cakupan Kelas C10

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getStatus()`, `getJumlahTiketDipegang()`, `cariLayananKosong()`, `tambahBeban()`, `kurangiBeban()`, `toJSON()` |
| Operasi yang diuji | `getStatus()`, `getJumlahTiketDipegang()`, `cariLayananKosong()`, `tambahBeban()`, `kurangiBeban()`, `toJSON()` |
| ID Algoritma yang tercakup | `ALGO-019` (`Q-013`) |
| Coverage (wajib ≥ 70%) | **100% Lines / 77,77% Branch / 100% Funcs** (`src/backend/src/models/LayananPelanggan.ts`, Jest `--coverage`, bukti pada Subbab 4.6) |

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
| UC01-TC01 | KF04, KF05 | Normal | 1. Login ke aplikasi menggunakan akun pengguna yang belum terdaftar sebagai penyedia jasa.<br>2. Dari halaman **Beranda**, tekan banner *"Cari jasa, dapatkan penghasilan tambahan!"* untuk membuka formulir **Daftar Penyedia Jasa**.<br>3. Isi seluruh kolom formulir dengan data valid.<br>4. Tekan tombol **"Ajukan Pendaftaran"**.<br>5. Pada dialog sukses, tekan **"Lihat Riwayat Pekerjaan"**. | Akun pengguna yang sudah login<br>Nama Toko: `Berkah Teknik Bandung`<br>Jenis Jasa: `Servis`<br>Deskripsi Jasa: `Layanan servis AC, kulkas, dan mesin cuci panggilan bandung`<br>Estimasi Tarif Dasar: `85000`<br>Jam Mulai: `08:00`<br>Jam Selesai: `17:00`<br>Wilayah / Lokasi Kerja: `Coblong, Dago, Bandung` | Sistem menampilkan formulir pendaftaran jasa, memvalidasi seluruh masukan, menyimpan data layanan ke basis data, menampilkan modal **"Pendaftaran Berhasil"** dengan pesan `"Berkah Teknik Bandung" kini terdaftar sebagai penyedia jasa Servis. Kamu siap menerima pesanan!`, dan mengarahkan pengguna ke halaman **Riwayat Pekerjaan** setelah dikonfirmasi. | Formulir pendaftaran tampil dan menerima seluruh masukan valid. Setelah tombol **"Ajukan Pendaftaran"** ditekan, data berhasil disimpan dan muncul modal **"Pendaftaran Berhasil"** dengan pesan `"Berkah Teknik Bandung" kini terdaftar sebagai penyedia jasa Servis. Kamu siap menerima pesanan!` beserta tombol **"Lihat Riwayat Pekerjaan"** (bukti pada Subbab 4.6). | Pass |
| UC01-TC02 | KF04 | Alternatif 1: Verifikasi Input Gagal | 1. Buka formulir **Daftar Penyedia Jasa**.<br>2. Pilih **Jenis Jasa** dan isi kolom formulir lainnya dengan data tidak valid (deskripsi terlalu pendek, tarif di bawah batas minimum, jam selesai lebih awal dari jam mulai, dan wilayah kerja terlalu pendek).<br>3. Tekan tombol **"Ajukan Pendaftaran"**.<br>4. Amati penandaan dan pesan kesalahan pada kolom yang tidak valid agar pengguna dapat mengisi ulang. | Jenis Jasa: `Servis`<br>Deskripsi Jasa: `Servis AC` (9 karakter, < 20 karakter)<br>Estimasi Tarif Dasar: `99` (< Rp1.000)<br>Jam Mulai: `17:00`<br>Jam Selesai: `08:00` (≤ jam mulai)<br>Wilayah / Lokasi Kerja: `Bd` (< 3 karakter) | Sistem menolak pengiriman data, menandai tiap kolom yang tidak valid dengan garis merah serta menampilkan pesan kesalahan spesifik pada masing-masing kolom, dan mengembalikan fokus ke kolom yang salah. | Pengiriman ditolak; setiap kolom yang tidak valid ditandai merah beserta pesan kesalahan: `"Deskripsi minimal 20 karakter agar pelanggan memahami jasamu"`, `"Tarif minimal Rp1.000"`, `"Jam selesai harus setelah jam mulai"`, dan `"Wilayah kerja minimal 3 karakter"` (bukti pada Subbab 4.6). | Pass |

### 4.4.2 Use Case Memilih jasa

**ID Use Case:** UC02  
**Nama Use Case:** Memilih jasa

Tabel 4.4.2. Hasil Pengujian Use Case [UC02]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC02-TC01 | KF01, KF02, KF03, KF08 | Normal | 1. Login sebagai Pelanggan hingga masuk ke halaman **Beranda**.<br>2. Pilih kategori **"Servis"** pada bagian **Kategori Populer** untuk membuka halaman **Hasil Pencarian**.<br>3. Amati daftar penyedia jasa yang tersedia (dengan filter **Terdekat**).<br>4. Tekan kartu penyedia jasa **Ahmad Jaya AC & Elektronik** untuk melihat detail informasinya.<br>5. Tekan tombol **"Chat Sekarang"** pada panel detail penyedia jasa. | Akun Pelanggan yang sudah login<br>Kategori/kata kunci: `Servis`<br>Penyedia dipilih: `Ahmad Jaya AC & Elektronik` | Halaman **Hasil Pencarian** menampilkan daftar penyedia jasa yang tersedia; ketukan pada penyedia jasa membuka panel detail (nama toko, status Online, rating, jarak, estimasi tarif, jenis jasa, deskripsi layanan, jam operasional, dan daerah kerja); menekan **"Chat Sekarang"** membuka ruang obrolan dengan penyedia jasa tersebut. | Pencarian `"Servis"` menampilkan penyedia **Ahmad Jaya AC & Elektronik** (`Ahmad Teknik`, Online). Panel detail tampil lengkap (Rating `4.9`, Jarak `18 km`, Estimasi Tarif `Rp120.000`, Jenis Jasa `Perbaikan Elektronik & AC`, Jam Operasional `09:00 - 20:00`, Daerah Kerja `Seluruh Kota Bandung`), dan tombol **"Chat Sekarang"** berhasil membuka ruang obrolan dengan **Ahmad Jaya AC & Elektronik** (bukti pada Subbab 4.6). | Pass |
| UC02-TC02 | KF01, KF03 | Alternatif 1: Pemberi jasa tidak ditemukan | 1. Login sebagai Pelanggan dan buka halaman **Beranda**.<br>2. Pilih kategori **"Jahit"** (kategori yang tidak memiliki penyedia jasa tersedia).<br>3. Amati pesan yang ditampilkan sistem pada halaman **Hasil Pencarian**.<br>4. Tekan tombol **"Pilih Jasa Lain"** untuk kembali memilih jasa yang tersedia.<br>5. Pilih kategori **"Kebersihan"**, amati peta lokasi dan daftar penyedia jasa yang muncul, lalu tekan **"Chat"**. | Kategori pertama (kosong): `Jahit`<br>Kategori ulang: `Kebersihan` | Sistem menampilkan pesan `"Tidak ada yang sedang bersedia untuk memberi jasa ini"` beserta tombol **"Pilih Jasa Lain"**. Setelah memilih ulang kategori `"Kebersihan"`, sistem menampilkan peta lokasi penyedia jasa dan daftar penyedia yang tersedia beserta tombol **"Chat"**. | Pada pencarian `"Jahit"`, sistem menampilkan pesan `"Tidak ada yang sedang bersedia untuk memberi jasa ini"` dengan tombol **"Pilih Jasa Lain"**. Setelah memilih ulang `"Kebersihan"`, peta lokasi Google Maps (`1 penyedia di sekitarmu`) dan kartu **Kinclong Home Cleaning** (Rating `4.7`, Jarak `18 km`, `Jasa Kebersihan Rumah`) beserta tombol **"Chat"** tampil sesuai harapan (bukti pada Subbab 4.6). | Pass |

### 4.4.3 Use Case Menghubungi pemberi jasa

**ID Use Case:** UC03  
**Nama Use Case:** Menghubungi pemberi jasa

Tabel 4.4.3. Hasil Pengujian Use Case [UC03]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC03-TC01 | KF09 | Normal | 1. Login sebagai Pelanggan (`Budi Santoso`), lalu buka ruang obrolan dengan **Ahmad Jaya AC & Elektronik**.<br>2. Ketik pesan penawaran detail pekerjaan dan harga awal pada kolom `"Ketik pesan..."`.<br>3. Tekan tombol **kirim** (ikon pesawat kertas).<br>4. Login sebagai Pemberi Jasa (`Ahmad Jaya AC & Elektronik`), lalu buka ruang obrolan dari **Budi Santoso** untuk memverifikasi pesan masuk. | Pengirim: Pelanggan (`Budi Santoso`)<br>Penerima: `Ahmad Jaya AC & Elektronik`<br>Isi pesan: `"Halo Pak Ahmas, bisa cuci 2 unit AC besok jam 10.00 di Dago, harga awal saya 150.000"` | Pesan tampil sebagai *chat bubble* keluar pada ruang obrolan pelanggan dengan stempel waktu, tersimpan ke basis data, dan diterima/tampil pada ruang obrolan sisi pemberi jasa. | Pesan `"Halo Pak Ahmas, bisa cuci 2 unit AC besok jam 10.00 di Dago, harga awal saya 150.000"` tampil pada ruang obrolan pelanggan dengan stempel waktu `18:03`, dan diterima secara identik pada ruang obrolan pemberi jasa dari **Budi Santoso** dengan stempel waktu `18:03` (bukti pada Subbab 4.6). | Pass |
| UC03-TC02 | KF09 | Alternatif 1: Pesan tidak terkirim ke pemberi jasa | 1. Login sebagai Pelanggan (`Budi Santoso`) dan buka ruang obrolan dengan **Ahmad Jaya AC & Elektronik**.<br>2. Aktifkan **Mode Pesawat** pada perangkat uji agar koneksi internet terputus.<br>3. Ketik pesan penawaran pada kolom `"Ketik pesan..."`, lalu tekan tombol **kirim**.<br>4. Amati notifikasi kesalahan yang muncul pada ruang obrolan.<br>5. Nonaktifkan kembali Mode Pesawat untuk mengirim ulang pesan. | Pengirim: Pelanggan (`Budi Santoso`)<br>Penerima: `Ahmad Jaya AC & Elektronik`<br>Kondisi: Mode Pesawat aktif (koneksi jaringan terputus)<br>Aksi: Mengirim pesan penawaran saat perangkat *offline* | Pengiriman gagal dan sistem menampilkan pesan kesalahan `"Pesan tidak terkirim. Periksa koneksimu lalu coba lagi."` sehingga pelanggan dapat mencoba mengirim ulang setelah koneksi kembali normal. | Saat Mode Pesawat aktif dan pesan dikirim, pengiriman gagal dan sistem menampilkan *snackbar* kesalahan bertuliskan `"Pesan tidak terkirim. Periksa koneksimu lalu coba lagi."` pada bagian bawah ruang obrolan (bukti pada Subbab 4.6). | Pass |

### 4.4.4 Use Case Merespon pelanggan

**ID Use Case:** UC04  
**Nama Use Case:** Merespon pelanggan

Tabel 4.4.4. Hasil Pengujian Use Case [UC04]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC04-TC01 | KF09 | Normal | 1. Login sebagai Pemberi Jasa (`Ahmad Teknik`), lalu buka tab **Pesan** dan ketuk percakapan dari **Budi Santoso**.<br>2. Baca pesan penawaran yang dikirim pelanggan (`"150rb oke nggak pak"`).<br>3. Ketik pesan balasan persetujuan pada kolom `"Ketik pesan..."`, lalu tekan tombol **kirim** (ikon pesawat kertas).<br>4. Login sebagai Pelanggan (`Budi Santoso`) dan buka ruang obrolan bersama **Ahmad Teknik** untuk memverifikasi balasan masuk. | Pengirim: Pemberi Jasa (`Ahmad Teknik`)<br>Penerima: Pelanggan (`Budi Santoso`)<br>Isi balasan: `"Oke saya setuju"` | Sistem menampilkan pesan masuk dari pelanggan, mengirim serta menampilkan pesan balasan pemberi jasa sebagai *chat bubble* keluar dengan stempel waktu, menyimpannya ke basis data, dan meneruskannya ke ruang obrolan pelanggan. | Pesan penawaran pelanggan (`"150rb oke nggak pak"`, `18:17`) tampil di ruang obrolan pemberi jasa. Balasan `"Oke saya setuju"` tampil sebagai *chat bubble* keluar di sisi pemberi jasa pukul `18:37`, dan diterima secara identik pada ruang obrolan pelanggan bersama **Ahmad Teknik** pukul `18:37` (bukti pada Subbab 4.6). | Pass |
| UC04-TC02 | KF09 | Alternatif 1: Pesan tidak terkirim ke pelanggan | 1. Login sebagai Pemberi Jasa (`Ahmad Teknik`) dan buka ruang obrolan bersama **Budi Santoso**.<br>2. Aktifkan **Mode Pesawat** pada perangkat uji agar koneksi internet terputus.<br>3. Ketik pesan balasan pada kolom `"Ketik pesan..."`, lalu tekan tombol **kirim**.<br>4. Amati perubahan status *bubble* pesan, tombol kirim ulang, dan notifikasi kesalahan yang muncul.<br>5. Nonaktifkan kembali Mode Pesawat agar pemberi jasa dapat menekan tombol **"Kirim ulang"**. | Pengirim: Pemberi Jasa (`Ahmad Teknik`)<br>Penerima: Pelanggan (`Budi Santoso`)<br>Kondisi: Mode Pesawat aktif (koneksi jaringan terputus)<br>Isi balasan: `"Saya berangkat 19.00"` | Pengiriman gagal; *bubble* pesan ditandai gagal disertai keterangan `"Pesan tidak terkirim"` dan tombol **"Kirim ulang"**, serta muncul *snackbar* `"Pesan tidak terkirim. Periksa koneksimu lalu coba lagi."` agar pemberi jasa dapat mengirim ulang balasan setelah koneksi pulih. | Saat Mode Pesawat aktif dan pesan `"Saya berangkat 19.00"` dikirim (`18:39`), *bubble* pesan berubah berbingkai merah disertai keterangan `"Pesan tidak terkirim"`, tombol **"Kirim ulang"**, dan *snackbar* `"Pesan tidak terkirim. Periksa koneksimu lalu coba lagi."` di bagian bawah layar (bukti pada Subbab 4.6). | Pass |

### 4.4.5 Use Case Memasukkan kesepakatan harga dan pekerjaan

**ID Use Case:** UC05  
**Nama Use Case:** Memasukkan kesepakatan harga dan pekerjaan

Tabel 4.4.5. Hasil Pengujian Use Case [UC05]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC05-TC01 | KF10, KF11 | Normal | 1. Pelanggan membuka layar Ruang Obrolan Pelanggan (UI-08) dengan pemberi jasa. <br><br>2. Pelanggan memeriksa kartu form Buat Kontrak (UI-08-04) yang tampil di bagian atas ruang obrolan.<br><br>3. Pelanggan mengisi kolom Jasa, Deskripsi, dan Total Harga, lalu menekan tombol Buat Kontrak (UI-08-05).<br><br>4. Pemberi jasa membuka layar Ruang Obrolan Penyedia Jasa (UI-09) dan menekan tombol Terima (UI-09-09) pada kartu Kontrak Pekerjaan (UI-09-06). | - Jasa: "Bersih-bersih Rumah"<br>- Deskripsi: "Bersihin rumah wimar"<br>- Total Harga: 100000 (Rp 100.000)<br>- Aksi Penyedia Jasa: Tekan Terima | 1. Sistem menampilkan kartu form Buat Kontrak (UI-08-04).<br><br>2. Saat pelanggan menekan Buat Kontrak, sistem menyimpan kontrak baru (POST /api/kontrak) berstatus awal Menunggu, mengunci ketersediaan pemberi jasa (optimistic locking), menampilkan kartu Detail Kontrak (UI-08-09) ber-badge Menunggu, dan mengirim notifikasi pesanan baru ke pemberi jasa.<br><br>3. Saat pemberi jasa menekan Terima, sistem mengubah status kartu menjadi Diterima dan memperbarui statusPekerjaan menjadi On Progress (PATCH /api/kontrak/:id/persetujuan), menampilkan banner "Status Pekerjaan: On Progress", mencatat pesanan ke layar Riwayat (UI-10 dan UI-12), serta mengirim notifikasi ke pelanggan. | Kartu form Buat Kontrak tampil pada UI-08. Setelah dikirim, kartu Detail Kontrak tampil dengan badge Menunggu dan notifikasi masuk ke pemberi jasa. Setelah pemberi jasa menekan Terima pada UI-09, badge kartu berubah menjadi Diterima, banner "Status Pekerjaan: On Progress" tampil, dan kontrak masuk ke daftar Riwayat (UI-10 & UI-12) dengan status On Progress. Sesuai harapan. | Pass |
| UC05-TC02 | KF10, KF11 | 	Alternatif 1: Input form kesepakatan tidak valid (kolom kosong / harga tidak valid) | 1. Pelanggan membuka layar Ruang Obrolan Pelanggan (UI-08).<br>2. Pelanggan mengosongkan kolom Deskripsi (atau Jasa) pada kartu form Buat Kontrak (UI-08-04).<br>3. Pelanggan menekan tombol Buat Kontrak (UI-08-05). | - Jasa: "Bersih-bersih Rumah"<br>- Deskripsi: "" (kosong/hanya spasi)<br>- Total Harga: 100000 | Sistem menolak pengiriman kontrak, menandai kolom yang tidak valid dengan pesan kesalahan "Deskripsi pekerjaan tidak boleh kosong.", tidak mengirim permintaan pembuatan kontrak ke basis data, dan status pekerjaan tidak berubah menjadi On Progress. | Kolom Deskripsi ditandai garis merah, pesan kesalahan "Deskripsi pekerjaan tidak boleh kosong." tampil pada kartu form dan snackbar, serta tidak ada kontrak baru yang tersimpan di basis data. Sesuai harapan. | Pass |
| UC05-TC03 | KF11 | 	Alternatif 2: Pemberi jasa menolak kesepakatan kontrak | 1. Pelanggan mengirim form Buat Kontrak (UI-08-05) dengan data valid sehingga kartu kontrak berstatus Menunggu.<br>2. Pemberi jasa membuka layar Ruang Obrolan Penyedia Jasa (UI-09) dan melihat kartu Kontrak Pekerjaan (UI-09-06) ber-badge Menunggu (UI-09-07).<br>3. Pemberi jasa menekan tombol Tolak (UI-09-08). | - Jasa: "Servis Elektronik"<br>- Deskripsi: "Perbaikan kompresor AC"<br>- Total Harga: 150000<br>- Aksi Penyedia Jasa: Tekan Tolak | Sistem memperbarui status kontrak menjadi Ditolak (PATCH /api/kontrak/:id/persetujuan dengan disetujui = false), menampilkan badge Ditolak beserta keterangan "Kontrak ditolak oleh penyedia jasa", membuka kembali kunci ketersediaan pemberi jasa menjadi Available, dan mengirimkan notifikasi penolakan kepada pelanggan. | Badge pada kartu kontrak berubah menjadi Ditolak, banner "Kontrak ditolak oleh penyedia jasa" tampil, tombol Terima/Tolak disembunyikan, status ketersediaan pemberi jasa di basis data kembali Available, dan pelanggan menerima notifikasi penolakan. Sesuai harapan. | Pass |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.6 Use Case Mengubah status pekerjaan menjadi selesai

**ID Use Case:** UC06  
**Nama Use Case:** Mengubah status pekerjaan menjadi selesai

Tabel 4.4.6. Hasil Pengujian Use Case [UC06]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC06-TC01 | KF12 | Normal | 1. Pemberi jasa masuk ke layar Riwayat Pekerjaan (UI-12) dan memilih filter On Progress (UI-12-03).<br>2. Pemberi jasa menekan kartu pekerjaan yang sedang berjalan (UI-12-04) untuk melihat detail pekerjaan (jenis/rincian pekerjaan, nama pelanggan, waktu, dan total pembayaran).<br>3. Pemberi jasa menekan tombol Pekerjaan Telah Selesai (UI-12-07). | - Kontrak aktif berstatus On Progress (mis. "Bersihin rumah wimar", harga Rp 100.000)<br>- Aksi: Tekan tombol Pekerjaan Telah Selesai | 1. Sistem menampilkan detail pekerjaan beserta nominal pembayaran dan status On Progress.<br>2. Saat tombol Pekerjaan Telah Selesai ditekan, sistem memanggil PATCH /api/kontrak/:id/selesai dan mengubah statusPekerjaan di basis data dari On Progress menjadi Menunggu Konfirmasi Pelanggan.<br>3. Tombol Pekerjaan Telah Selesai pada kartu menghilang dan digantikan label indikator Menunggu Konfirmasi (UI-12-07), banner informasi tampil, serta notifikasi penyelesaian dikirim kepada pelanggan. | Modal Detail Pekerjaan menampilkan rincian pekerjaan dan biaya Rp 100.000. Setelah tombol Pekerjaan Telah Selesai ditekan, status kontrak di basis data berubah menjadi Menunggu Konfirmasi Pelanggan, kartu menampilkan label Menunggu Konfirmasi beserta banner "Pekerjaan telah dilaporkan selesai. Menunggu konfirmasi dari pelanggan.", dan notifikasi terkirim ke pelanggan. Sesuai harapan. | Pass |
| UC06-TC02 | KF12 | Alternatif 1: Pekerjaan belum berstatus On Progress atau sudah dilaporkan selesai | 1. Pemberi jasa membuka layar Riwayat Pekerjaan (UI-12) dan mengamati kartu pekerjaan yang sudah berstatus Menunggu Konfirmasi Pelanggan atau Done (Selesai).<br>2. Kirim permintaan penyelesaian ulang ke endpoint PATCH /api/kontrak/:id/selesai untuk kontrak yang tidak berstatus On Progress. | ID Kontrak dengan status Menunggu Konfirmasi Pelanggan atau Done | Pada antarmuka UI-12, tombol Pekerjaan Telah Selesai tidak ditampilkan pada kartu pekerjaan tersebut. Pada sisi server, permintaan PATCH /api/kontrak/:id/selesai ditolak dengan kode 400 Bad Request (INVALID_STATE_TRANSITION) dan status kontrak tidak berubah. | Tombol Pekerjaan Telah Selesai tidak tampil pada kartu yang sudah berstatus Menunggu Konfirmasi Pelanggan maupun Selesai, serta pemanggilan ulang endpoint mengembalikan HTTP 400 INVALID_STATE_TRANSITION tanpa mengubah data di basis data. Sesuai harapan. | Pass |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.7 Use Case Mengonfirmasi status pekerjaan

**ID Use Case:** UC07  
**Nama Use Case:** Mengonfirmasi status pekerjaan

Tabel 4.4.7. Hasil Pengujian Use Case [UC07]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC07-TC01 | KF13 | Normal | 1. Pelanggan membuka layar Riwayat (UI-10) melalui bottom navigation (UI-10-07).<br>2. Pelanggan menekan tombol Lihat Detail (UI-10-05) pada kartu transaksi yang telah dilaporkan selesai oleh pemberi jasa (memiliki keterangan "Penyedia jasa telah melaporkan pekerjaan ini selesai").<br>3. Pelanggan menutup modal detail lalu menekan tombol Konfirmasi Selesai pada kartu transaksi tersebut. | - Kontrak berstatus Menunggu Konfirmasi Pelanggan (mis. "Bersih-bersih Rumah", penyedia "Budi Wijaya", biaya Rp 100.000)<br>- Aksi: Tekan tombol Konfirmasi Selesai | 1. Sistem menampilkan modal Detail Transaksi berisi informasi pekerjaan, penyedia jasa, waktu, status Menunggu Konfirmasi Pelanggan, dan total biaya.<br>2. Saat tombol Konfirmasi Selesai ditekan, sistem mengirim PATCH /api/kontrak/:id/konfirmasi, mengubah statusPekerjaan di basis data menjadi Done, dan memperbarui badge kartu (UI-10-04) menjadi Selesai (hijau).<br>3. Sistem membuka kembali ketersediaan pemberi jasa menjadi Available, mengirimkan notifikasi konfirmasi ke pemberi jasa, serta menampilkan dialog Beri Penilaian (UI-11) dan tombol Beri Rating (UI-10-06). | Modal Detail Transaksi menampilkan detail kontrak dengan benar. Setelah Konfirmasi Selesai ditekan, status kontrak berubah menjadi Done (badge Selesai), statusKetersediaan pemberi jasa kembali Available, notifikasi terkirim ke pemberi jasa, dan modal Beri Penilaian (UI-11) langsung muncul di layar pelanggan. Sesuai harapan. | Pass |
| UC07-TC02 | KF13 | Alternatif 1: Konfirmasi ulang pada pekerjaan yang sudah berstatus Done atau belum dilaporkan selesai | . Pelanggan melihat kartu transaksi yang sudah berstatus Selesai (Done) pada layar Riwayat (UI-10).<br>2. Kirim permintaan konfirmasi ke endpoint PATCH /api/kontrak/:id/konfirmasi untuk kontrak yang masih berstatus Menunggu atau yang sudah berstatus Done. | 	ID Kontrak dengan status Done atau Menunggu | Pada antarmuka UI-10, tombol Konfirmasi Selesai tidak ditampilkan pada kartu yang sudah berstatus Selesai (hanya menampilkan tombol Lihat Detail dan Beri Rating / indikator Telah Dinilai). Pada sisi server, permintaan konfirmasi ditolak dengan kode 400 Bad Request dan status kontrak tidak berubah. | ombol Konfirmasi Selesai tidak lagi tampil pada kartu transaksi yang sudah Selesai, dan permintaan konfirmasi tidak valid ke server ditolak dengan HTTP 400 tanpa mengubah status kontrak. Sesuai harapan. | Pass |
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
| UC11-TC01 | KF21 | Normal | 1. Buka halaman **Login**.<br>2. Masukkan email dan password akun terdaftar.<br>3. Tekan **"Lanjut →"**.<br>4. Ulangi untuk peran Pelanggan, Pemberi Jasa, dan CS. | CS: `cs@cariuang.id` / `PasswordAman123`<br>Pemberi Jasa: `ahmad@cariuang.id` / `PasswordAman123`<br>Pelanggan: `budi@pelanggan.com` / `PasswordAman123` | Login berhasil dan pengguna diarahkan ke beranda sesuai perannya. | Ketiga akun berhasil login: CS masuk ke **Beranda CS**, sedangkan Ahmad dan Budi masuk ke **Beranda** sesuai akun masing-masing (bukti pada 4.6). | Pass |
| UC11-TC02 | KF21 | Alternatif 1: Verifikasi data login yang invalid | 1. Buka halaman **Login**.<br>2. Masukkan username/email dan password yang tidak valid.<br>3. Tekan **"Lanjut →"**. | Email/Username: `naufalhasbialhaq`<br>Password: password tidak valid | Login ditolak dan muncul pesan kesalahan kredensial di halaman **Login**. | Muncul banner merah `"Username/email atau password salah."` dan tetap di halaman **Login** (bukti pada 4.6). | Pass |

### 4.4.12 Use Case Mendaftar akun ke perangkat lunak

**ID Use Case:** UC12  
**Nama Use Case:** Mendaftar akun ke perangkat lunak

Tabel 4.4.12. Hasil Pengujian Use Case [UC12]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC12-TC01 | KF21 | Normal | 1. Buka halaman **Buat akun pengguna** lewat **"Daftar sekarang"**.<br>2. Isi seluruh kolom valid dan centang Ketentuan Layanan.<br>3. Tekan **"Buat Akun →"**. | Nama: `Rina Uji Coba`<br>Email: `rina.uji@gmail.com`<br>Password & Konfirmasi: `PasswordAman123`<br>Ketentuan Layanan: dicentang | Akun tersimpan dan pengguna langsung masuk ke halaman **Beranda**. | Akun berhasil dibuat dan langsung diarahkan ke **Beranda** (`Halo, Rina!`, avatar `RU`) (bukti pada 4.6). | Pass |
| UC12-TC02 | KF21 | Alternatif 1: Verifikasi data yang invalid pada daftar | 1. Buka halaman **Buat akun pengguna**.<br>2. Uji input format salah (email, password < 8 karakter, konfirmasi berbeda).<br>3. Uji input valid dengan email yang sudah terdaftar, lalu tekan **"Buat Akun →"**. | **Uji 1:** `Rina Uji`, `rinatanpaat`, `12335`, konfirmasi `123456`<br>**Uji 2:** `Budi Duplikat`, `budi@pelanggan.com`, `PasswordAman123` (ketentuan dicentang) | Uji 1 menampilkan error validasi instan dan tombol tetap nonaktif; Uji 2 ditolak server karena email sudah terdaftar. | Uji 1 menampilkan error format email, password min. 8 karakter, dan konfirmasi tidak cocok (tombol nonaktif); Uji 2 menampilkan banner `"Email sudah terdaftar. Silakan gunakan alamat email lain."` (bukti pada 4.6). | Pass |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- |
| KNF01-TC01 | KNF01 | Response time | Daftar jasa tampil < 2 detik (2000 ms) | Script Node.js (`fetch` + `perf_hooks`), 5 kali ukur paralel `GET /api/services/categories` & `GET /api/services/search` | Rata-rata 15,52 ms (min 8,47 ms, maks 39,14 ms); 6 kategori & 6 jasa tampil (`200 OK`). | Pass |
| KNF02-TC01 | KNF02 | Ergonomy | Daftar jasa dikelompokkan per kelompok jasa dalam bentuk kolom | Inspeksi `GET /api/services/categories` & tampilan `HomeView.tsx` | API `200 OK` mengembalikan 6 kelompok kategori terurut; `HomeView.tsx` menampilkan grid kolom per kategori.  | Pass |
| KNF03-TC01 | KNF03 | Response time | Informasi pemilik jasa & tombol pesan tampil < 1 detik (1000 ms) | Script Node.js, 5 kali ukur `GET /api/services/:id` (Ahmad Jaya AC & Elektronik) | Rata-rata 6,61 ms (min 5,13 ms, maks 7,76 ms); respons `200 OK`. | Pass |
| KNF04-TC01 | KNF04 | Reliability | >1 pelanggan pesan 1 penyedia bersamaan: 1 berhasil, lainnya ditolak dengan Optimistic Locking | 2 request `POST /api/kontrak` bersamaan (`Promise.all`) dengan `expectedVersion = 1` + cek PostgreSQL | Status HTTP `[201, 409]` (`OPTIMISTIC_LOCK_CONFLICT`); `pemberi_jasa.version` naik `1 → 2`, status `On Progress`, hanya `1` kontrak aktif di DB. | Pass |
| KNF05-TC01 | KNF05 | Response time | Daftar penyedia jasa dalam radius GPS tampil ≤ 2 detik (2000 ms) | Script Node.js, 5 kali ukur `GET /api/services/search?lat=-6.8915&long=107.6107&sortBy=nearest` | Rata-rata 7,23 ms (min 6,22 ms, maks 8,96 ms); 6 hasil terurut menaik (`0; 0; 0,06; 0,22; 0,79 km`). | Pass |
| KNF06-TC01 | KNF06 | Reliability | Akurasi GPS < radius 50 meter | Inspeksi kode `useCatalogController.ts` + pengukuran `coords.accuracy` di perangkat fisik | Belum terverifikasi di perangkat fisik. Pada `useCatalogController.ts:462` digunakan `Location.Accuracy.Balanced` (target akurasi ~100 m), bukan `Location.Accuracy.High` (~10 m). | Fail / Belum Terverifikasi. Alasan: konfigurasi akurasi masih `Balanced` dan butuh uji perangkat Android fisik. Rencana: ubah ke `Location.Accuracy.High` dan ukur `coords.accuracy` di HP. |
| KNF07-TC01 | KNF07 | Availability | Formulir pendataan pelanggan tersedia 24 jam | Polling `/health` (10 kali) & uji `POST /api/auth/register/pelanggan` pada lingkungan Docker lokal | `10/10` HTTP `200` pada `/health` (uptime sesi `372,83 detik`), endpoint registrasi aktif (`100%` sukses selama pengamatan). Uji soak 24 jam penuh belum dilakukan karena keterbatasan lingkungan lokal. | Pass (Terbatas).  Rencana: deploy ke cloud server dengan auto-restart & uptime monitoring 24 jam. |
| KNF08-TC01 | KNF08 | Security | Validasi input sisi server & pencegahan SQL Injection | Kirim payload SQLi (`' OR '1'='1`, `; DROP TABLE pengguna;--`), password < 8 karakter ke `/api/auth/login` & `/api/auth/register/pelanggan` + cek tabel `pengguna` | Login SQLi ditolak `401`; email SQLi `400`; telepon SQLi `400`; password pendek `400`; tabel `pengguna` utuh (17 baris); password tersimpan sebagai hash bcrypt (`$2b$10$...`). | Pass |
| KNF08b-TC01 (KNF09) | KNF08 (baris ke-2 di SKPL) | Response time | Validasi input formulir ≤ 2 detik (2000 ms) | Script Node.js, 5 kali ukur input tidak valid & 5 kali registrasi valid (termasuk hashing bcrypt) pada `POST /api/auth/register/pelanggan` | Validasi input ditolak: rata-rata 4,79 ms (maks 6,18 ms). Registrasi valid + bcrypt + insert DB: rata-rata 99,14 ms (min 97,51 ms, maks 101,82 ms). | Pass |
| KNF10-TC01 | KNF10 | Response time | Pembaruan database < 1 detik (1000 ms) setelah penyedia jasa unggah form | Script Node.js, 5 kali ukur `POST /api/services/register` + cek DB `pemberi_jasa` | Rata-rata 28,31 ms (min 21,39 ms, maks 32,55 ms); `5/5` HTTP `201`; `nama_toko` di DB terbarui (`Toko Uji KNF10 Update 5`). | Pass |
| KNF11-TC01 | KNF11 | Ergonomy | Auto-cancel jika tidak disetujui dalam 30 menit & buka kunci penyedia jasa | Buat kontrak `Menunggu`, cek `expires_at`, ubah `expires_at` mundur > 30 menit di DB, pantau `autoCancelKontrakWorker` server aktif | `expires_at` otomatis diset tepat `created_at + 30 menit`; setelah kedaluwarsa, worker membatalkan kontrak (`Menunggu → Dibatalkan`) dan membuka kunci penyedia (`On Progress → Available`) dalam `46,81 detik` (interval tick 60 detik). | Pass |
| KNF12-TC01 | KNF12 | Response time | Notifikasi ke penyedia jasa < 1 detik (1000 ms) setelah pemesanan | Script Node.js + klien WebSocket Socket.IO (`notification:new`), 5 kali ukur `POST /api/kontrak` + cek tabel `notifikasi` | Waktu terima `notification:new`: rata-rata 15,36 ms (min 13,31 ms, maks 17,29 ms); HTTP `POST /api/kontrak` rata-rata 16,44 ms (maks 18,47 ms); seluruh notifikasi tersimpan di DB. | Pass |
| KNF13-TC01 | KNF13 | Ergonomy | Informasi pekerjaan & lokasi pelanggan tampil setelah disetujui penyedia jasa | `PATCH /api/kontrak/:id/terima` lalu cek respons `GET /api/kontrak/:id` & skema tabel `kontrak_pekerjaan` | `detailPekerjaan` & `persetujuanHarga` tampil (`200 OK`), namun tabel `kontrak_pekerjaan` belum memiliki kolom khusus lokasi/koordinat pelanggan (lokasi hanya muncul bila ditulis manual di `detailPekerjaan`/chat). | Fail (Sebagian). Alasan: skema kontrak belum menyimpan alamat/koordinat pelanggan terpisah. Rencana: tambah field `alamatPelanggan`/`lat`/`lng` pada form kontrak & tampilkan pada kartu detail penyedia. |
| KNF14-TC01 | KNF14 | Security | Pesan chat dienkripsi dengan End-to-End Encryption (E2EE) | Kirim pesan via `POST /api/chats`, lalu inspeksi langsung kolom `komunikasi.isi_pesan` di PostgreSQL | Pesan `"Rahasia KNF14 E2EE Check knf2_mwoxxow9"` tersimpan identik dalam bentuk plaintext di `komunikasi.isi_pesan` (tidak terenkripsi). | Fail (Belum Diimplementasikan). Alasan: fitur E2EE belum dibangun pada fase ini. Rencana: terapkan pertukaran kunci (public/private key) di sisi client dan enkripsi AES-GCM sebelum pesan dikirim ke server. |
| KNF15-TC01 | KNF15 | Response time | Pesan sampai ke penerima dalam waktu ≤ 1 detik (1000 ms) | Script Node.js + klien WebSocket Socket.IO (`chat:new`), 5 kali ukur `POST /api/chats` + inspeksi `chatConfig.ts` | Pengiriman realtime backend (Socket.IO `chat:new`): rata-rata 8,18 ms (min 7,12 ms, maks 10,02 ms); HTTP `POST /api/chats` rata-rata 12,56 ms. Catatan: frontend mobile masih memakai polling `CHAT_CONFIG.POLL_CHAT_ROOM_MS = 3000 ms` (3 detik). | Pass (Backend) / Fail (UI Mobile). Rencana: sambungkan klien `socket.io-client` langsung di `ChatRoom.tsx` agar end-to-end UI ≤ 1 detik. |
| KNF16-TC01 | KNF16 | Reliability | Menangani hingga 1000 percakapan serentak tanpa masalah | Load test Node.js: kirim 1000 request `POST /api/chats` serentak (`Promise.all`) + verifikasi jumlah baris di PostgreSQL | 1000/1000 sukses HTTP `201` (`0` HTTP error, `0` network error); 1000/1000 baris tersimpan di `komunikasi`; total durasi 3.637,77 ms (throughput 274,89 req/s); latensi rata-rata 2.343,37 ms (p95 3.064,09 ms, maks 3.252,91 ms). | Pass |
| KNF17-TC01 | KNF17 | Ergonomy | Menampilkan formulir input kesepakatan harga dan pekerjaan | Uji `GET /api/kontrak/form` sebagai Pelanggan & inspeksi `ContractCard.tsx` | Respons `200 OK` mengembalikan template field `detailPekerjaan`, `persetujuanHarga`, `idPemberiJasa`; form dirender di `ContractCard.tsx`. | Pass  |
| KNF18-TC01 | KNF18 | Security | Verifikasi input formulir kesepakatan valid & cegah serangan | Kirim XSS (`<script>alert("xss")</script>`), SQLi (`; DROP TABLE kontrak_pekerjaan; --`), harga `-50000`, harga `0`, dan detail kosong ke `POST /api/kontrak` | Seluruh 5 skenario serangan/input tidak valid ditolak dengan HTTP `400 Bad Request`; tidak ada data rusak di DB. | Pass |
| KNF19-TC01 | KNF19 | Reliability | Kesepakatan disimpan di DB, status penyedia `On Progress`, terkunci dari pemesan lain | `PATCH /api/kontrak/:id/terima`, cek DB, lalu pelanggan ke-2 coba `POST /api/kontrak` ke penyedia yang sama | Respons `200 OK`; DB `kontrak_pekerjaan.status_pekerjaan = 'On Progress'`; `pemberi_jasa.status_ketersediaan = 'On Progress'`; pemesanan pelanggan ke-2 ditolak `409 Conflict`. | Pass |
| KNF20-TC01 | KNF20 | Ergonomy | Notifikasi ke pelanggan saat pekerjaan selesai | `PATCH /api/kontrak/:id/selesai` sambil pantau Socket.IO pelanggan & tabel `notifikasi` | Respons `200 OK` (status `Menunggu Konfirmasi Pelanggan`); event `notification:new` diterima pelanggan dalam 38,74 ms dan tersimpan di tabel `notifikasi`.  | Pass |
| KNF21-TC01 | KNF21 | Reliability | Kirim konfirmasi ke pengguna & ubah status menjadi `Done` | `PATCH /api/kontrak/:id/konfirmasi` sebagai Pelanggan + cek DB `kontrak_pekerjaan` & `pemberi_jasa` | Respons `200 OK`; `status_pekerjaan` berubah menjadi `Done`; `pemberi_jasa.status_ketersediaan` kembali `Available`. | Pass |
| KNF22-TC01 | KNF22 | Reliability | Validasi transisi status (hanya dari status aktif menuju `Done`) | Coba `PATCH /api/kontrak/:id/konfirmasi` saat status `Menunggu`, saat valid, dan ulang saat sudah `Done` | Dari `Menunggu` ditolak `400`; transisi valid berhasil `200` (`Done`); konfirmasi ulang dari `Done` ditolak `400`. | Pass |
| KNF23-TC01 | KNF23 | Availability | Fitur pemberian tiket aktif 24 jam tanpa kendala | Polling `GET /api/tickets/mine` (10 kali) & `GET /api/cs/stats` pada lingkungan Docker lokal | `10/10` HTTP `200` pada `/api/tickets/mine` dan `200 OK` pada `/api/cs/stats` (`100%` sukses selama pengamatan). Uji soak 24 jam penuh belum dilakukan di lokal. | Pass (Terbatas). Rencana: deploy ke cloud dengan monitoring & auto-restart. |
| KNF24-TC01 | KNF24 | Reliability | Tabel terpisah di database untuk menyimpan tiket | Query `information_schema.columns` pada PostgreSQL | Tabel terpisah `tiket_laporan` tersedia dengan 8 kolom (`id_tiket`, `id_pengguna`, `id_layanan_pelanggan`, `jenis_tiket`, `keterangan_tiket`, `bukti_foto_url`, `tanggal_tiket`, `status_tiket`). | Pass |
| KNF25-TC01 | KNF25 | Response time | Tiket terkirim < 1 detik (1000 ms) + notifikasi dikirim ke CS | Script Node.js + Socket.IO CS (`notification:new`), 5 kali ukur `POST /api/tickets` (multipart) | HTTP `POST /api/tickets`: rata-rata 32,52 ms (min 22,21 ms, maks 68,13 ms), `5/5` HTTP `201` & ter-assign ke CS; notifikasi Socket.IO CS: rata-rata 31,02 ms (min 20,61 ms, maks 66,88 ms) & tersimpan di DB. (Catatan: jika seluruh CS mencapai beban maks 5 tiket/`Busy`, tiket masuk antrean tanpa penugasan awal) | Pass |
| KNF26-TC01 | KNF26 | Reliability | Kanal komunikasi khusus user–CS selama tiket aktif, ditutup otomatis saat selesai | Kirim pesan pelapor (`POST /api/tickets/:id/messages`), balas CS (`POST /api/cs/tickets/:id/reply`), tutup tiket (`POST /api/cs/tickets/:id/close`), lalu coba kirim pesan lagi | Pesan saat aktif `201`; balasan CS `201` (status `Diproses`, 2 pesan tercatat di `komunikasi` dengan `id_tiket`); tutup tiket `200` (status `Selesai`); pesan setelah tutup ditolak `409` (`"Tiket sudah ditutup."`). | Pass |
| KNF27-TC01 | KNF27 | Ergonomy | Fitur rating dua arah hanya tersedia setelah status terverifikasi `Done` | Uji `POST /api/ratings` sebelum `Done`, `GET /api/ratings/verify/:idKontrak` & rating dua arah setelah `Done`, serta rating duplikat | Sebelum `Done` ditolak `400`; verifikasi `200`; rating pelanggan→penyedia `201` & penyedia→pelanggan `201`; rating duplikat ditolak `400`. | Pass |
| KNF28-TC01 | KNF28 | Reliability | Data rating rata-rata pelanggan & penyedia tersimpan di database | Inspeksi langsung tabel `pengguna` (`akumulasi_rating`, `riwayat_rating`) di PostgreSQL setelah rating dikirim | DB mencatat penyedia: `akumulasi_rating = 5`, `riwayat_rating = [5]`; pelanggan: `akumulasi_rating = 4`, `riwayat_rating = [4]`. | Pass |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| C03, C04, C06, C10, C12, C15, C16, C18, C19, C21, C24, C25, C27 (coverage)| <img src="./assets/coverage-mendalam.png" > |
| C03-UT01 - C03-UT08, C06-UT01 - C06-UT02, C09-UT01 - C09-UT03, C12-UT01 | <img src="./assets/ut-auth.png"> |
| C04-UT01 - C04-UT06, C06-UT03 - C06-UT06, C13-UT01 - C13-UT03, C15-UT01 - C15-UT05 | <img src="./assets/ut-serviceCatalog.png">  | 
| C19-UT01 - C19-UT05, C21-UT01 - C21-UT06 | <img src="./assets/ut-komunikasi.png"> |
| C01-UT04, C16-UT01 - C16-UT07, C18-UT01 - C18-UT07 | <img src="./assets/ut-kontrak.png"> |
| C10-UT01 - C10-UT05, C12-UT02 - C12-UT06, C22-UT01 - C22-UT03, C24-UT01 - C24-UT06| <img src="./assets/ut-tiket.png"> |
| C01-UT01 - C01-UT03, C25-UT01 - C25-UT06, C27-UT01 - C27-UT06 | <img src="./assets/ut-rating.png"> |
| C30-UT01 - C30-UT03| <img src="./assets/ut-notifikasi.png"> |
| C06-UT06 - C06-UT07, C15-UT06 | <img src="./assets/ut-fe-katalog.png"> |
| C17-UT01 - C17-UT04 | <img src="./assets/ut-fe-kontrak.png"> |
| C26-UT01 - C26-UT04 | <img src="./assets/ut-fe-rating.png"> |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| UC01-TC01 | <img src="./assets/UC01-TestNormal-1.png.jpeg" width="240"> <img src="./assets/UC01-TestNormal-2.png.jpeg" width="240"> |
| UC01-TC02 | <img src="./assets/UC01-TestAlt1-1.png.jpeg" width="240"> |
| UC02-TC01 | <img src="./assets/UC02-TestNormal-1.png.jpeg" width="240"> <img src="./assets/UC02-TestNormal-2.png.jpeg" width="240"> |
| UC02-TC02 | <img src="./assets/UC02-TestAlt1-1.png.jpeg" width="240"> <img src="./assets/UC02-TestAlt1-2.png.jpeg" width="240"> |
| UC03-TC01 | <img src="./assets/UC03-TestNormal-1.png.jpeg" width="240"> <img src="./assets/UC03-TestNormal-2.png.jpeg" width="240"> |
| UC03-TC02 | <img src="./assets/UC03-TestAlt1-1.png.jpeg" width="240"> |
| UC04-TC01 | <img src="./assets/UC04-TestNormal-1.png.jpeg" width="240"> <img src="./assets/UC04-TestNormal-2.png.jpeg" width="240"> |
| UC04-TC02 | <img src="./assets/UC04-TestAlt1-1.png.jpeg" width="240"> <img src="./assets/UC04-TestAlt1-2.png.jpeg" width="240"> |
| UC11-TC01 | <img src="./assets/UC11-NormalTest-1.png.jpeg" width="220"> <img src="./assets/UC11-NormalTest-2.png.jpeg" width="220"> <img src="./assets/UC11-NormalTest-3.png.jpeg" width="220"> |
| UC11-TC02 | <img src="./assets/UC11-NormalAlt1-1.png.jpeg" width="240"> |
| UC12-TC01 | <img src="./assets/UC12-TestNormal-1.png.jpeg" width="240"> <img src="./assets/UC12-TestNormal-2.png.jpeg" width="240"> |
| UC12-TC02 | <img src="./assets/UC12-TestAlt1-1.png.jpeg" width="240"> <img src="./assets/UC12-TestAlt1-2.png.jpeg" width="240"> |
| KNF01-TC01, KNF03-TC01, KNF05-TC01, KNF08-TC01, KNF10-TC01, KNF12-TOC01, KNF25-TC01, KNF08-TC01, KNF14-TC01, KNF04-TC01, KNF16-TC01, KNF19-TC01, KNF21-TC01, KNF22-TC01, KNF24-TC01, KNF26-TC01, KNF28-TC01, KNF11-TC11| [Test Script Result](../../src/backend/tests/knf-results.log) |
| KNF02-TC01 | <img src="./assets/knf2.jpeg"> |
| KNF17-TC01 | <img src="./assets/knf-17.jpeg"> |
| KNF20-TC01 | <img src="./assets/knf20.jpeg"> |
| KNF27-TC01 | <img src="./assets/knf27.jpeg">


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