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
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# Bab 1: Pendahuluan
## 1.1 Tujuan Penulisan Dokumen
<p align="justify">Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun untuk mendokumentasikan hasil realisasi implementasi serta hasil pengujian perangkat lunak **CariUang**. Isi dokumen mencakup gambaran umum perangkat lunak, rincian lingkungan implementasi beserta daftar modul, antarmuka, dan berkas pendukung yang telah dibangun, hasil pengujian pada tingkat unit kelas, integrasi antarkomponen, *use case*, dan kebutuhan non-fungsional (KNF) beserta bukti pengujiannya, hingga matriks kerunutan (*traceability*) antara spesifikasi kebutuhan, implementasi, dan kasus uji. Tujuan pembuatan dokumen ini adalah memverifikasi dan membuktikan secara terukur bahwa perangkat lunak **CariUang** telah diimplementasikan sesuai dengan rancangan pada dokumen DPPL serta memenuhi kebutuhan fungsional dan non-fungsional pada dokumen SKPL. Dokumen ini ditujukan bagi dosen dan asisten mata kuliah IF2150 Rekayasa Perangkat Lunak sebagai bahan evaluasi dan penilaian, tim pengembang sebagai dokumentasi acuan untuk pemeliharaan maupun perbaikan lanjutan, serta penguji perangkat lunak untuk menelusuri cakupan dan hasil pengujian sistem.</p>

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
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

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

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C02* | *Pesanan* | *Mendalam* | *Memuat `hitungTotal()` dan transisi status pembayaran* | *C02-UT01 s.d. C02-UT08* |
| *C03* | *Keranjang* | *Sedang* | *Delegasi sederhana ke Produk dan Pesanan* | *C03-UT01 s.d. C03-UT03, INT-TC02* |
| *C01* | *Pelanggan* | *Tidak perlu* | *Hanya menyimpan data akun, tanpa logika* | *-* |
| *[CXX]* | *[Nama kelas]* | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |
| *...* | *...* | *...* | *...* | *...* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: *[tuliskan perintah, mis. `pytest src/tests/`]*.

Lokasi file test: *[path, mis. `src/tests/`]*.

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

### 4.2.17 Kelas KontrakPekerjaanUI

**ID Kelas:** C17  
**Nama Kelas:** KontrakPekerjaanUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.17. Hasil Pengujian Unit Kelas [C17]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C17-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C17-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C17-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.17b. Ringkasan Cakupan Kelas [C17]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.18 Kelas KontrakPekerjaanController

**ID Kelas:** C18  
**Nama Kelas:** KontrakPekerjaanController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.18. Hasil Pengujian Unit Kelas [C18]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C18-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C18-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C18-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.18b. Ringkasan Cakupan Kelas [C18]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.19 Kelas Komunikasi

**ID Kelas:** C19  
**Nama Kelas:** Komunikasi  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.19. Hasil Pengujian Unit Kelas [C19]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C19-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C19-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C19-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.19b. Ringkasan Cakupan Kelas [C19]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.20 Kelas KomunikasiUI

**ID Kelas:** C20  
**Nama Kelas:** KomunikasiUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.20. Hasil Pengujian Unit Kelas [C20]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C20-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C20-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C20-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.20b. Ringkasan Cakupan Kelas [C20]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.21 Kelas KomunikasiController

**ID Kelas:** C21  
**Nama Kelas:** KomunikasiController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.21. Hasil Pengujian Unit Kelas [C21]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C21-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C21-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C21-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.21b. Ringkasan Cakupan Kelas [C21]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.22 Kelas TiketLaporan

**ID Kelas:** C22  
**Nama Kelas:** TiketLaporan  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.22. Hasil Pengujian Unit Kelas [C22]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C22-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C22-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C22-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.22b. Ringkasan Cakupan Kelas [C22]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.23 Kelas TiketLaporanUI

**ID Kelas:** C23  
**Nama Kelas:** TiketLaporanUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.23. Hasil Pengujian Unit Kelas [C23]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C23-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C23-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C23-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.23b. Ringkasan Cakupan Kelas [C23]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.24 Kelas TiketLaporanController

**ID Kelas:** C24  
**Nama Kelas:** TiketLaporanController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.24. Hasil Pengujian Unit Kelas [C24]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C24-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C24-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C24-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.24b. Ringkasan Cakupan Kelas [C24]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.25 Kelas Rating

**ID Kelas:** C25  
**Nama Kelas:** Rating  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.25. Hasil Pengujian Unit Kelas [C25]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C25-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C25-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C25-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.25b. Ringkasan Cakupan Kelas [C25]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.26 Kelas RatingUI

**ID Kelas:** C26  
**Nama Kelas:** RatingUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.26. Hasil Pengujian Unit Kelas [C26]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C26-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C26-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C26-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.26b. Ringkasan Cakupan Kelas [C26]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.27 Kelas RatingController

**ID Kelas:** C27  
**Nama Kelas:** RatingController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.27. Hasil Pengujian Unit Kelas [C27]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C27-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C27-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C27-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.27b. Ringkasan Cakupan Kelas [C27]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.28 Kelas Notifikasi

**ID Kelas:** C28  
**Nama Kelas:** Notifikasi  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.28. Hasil Pengujian Unit Kelas [C28]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C28-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C28-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C28-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.28b. Ringkasan Cakupan Kelas [C28]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.29 Kelas NotifikasiUI

**ID Kelas:** C29  
**Nama Kelas:** NotifikasiUI  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.29. Hasil Pengujian Unit Kelas [C29]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C29-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C29-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C29-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.29b. Ringkasan Cakupan Kelas [C29]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.30 Kelas NotifikasiController

**ID Kelas:** C30  
**Nama Kelas:** NotifikasiController  
**Tingkat:** *[Mendalam/Sedang/Tidak perlu]*

Tabel 4.2.30. Hasil Pengujian Unit Kelas [C30]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C30-UT01* | *`[operasi()]`* | *Normal* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C30-UT02* | *`[operasi()]`* | *Batas* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *C30-UT03* | *`[operasi()]`* | *Negatif* | *[Prosedur/masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.30b. Ringkasan Cakupan Kelas [C30]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| *I-01* | *KeranjangController* | *Keranjang (Model)* | *Controller - Model* | *INT-TC01, INT-TC02* |
| *I-02* | *Pesanan (Model)* | *Database* | *Aplikasi - Basis data* | *INT-TC03* |
| *I-03* | *PaymentGatewayAdapter* | *Payment Gateway (dummy)* | *Aplikasi - Sistem eksternal* | *INT-TC04, INT-TC05* |
| *[I-XX]* | *[Komponen asal]* | *[Komponen tujuan]* | *[Jenis batas]* | *[ID test case]* |
| *...* | *...* | *...* | *...* | *...* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC01* | *I-01* | *Normal: tambah item ke keranjang* | *Panggil `tambahItem()` melalui KeranjangController dengan produk valid* | *Item tersimpan pada Keranjang dan tampil pada daftar item* | *[Hasil aktual]* | *Pass/Fail* |
| *INT-TC03* | *I-02* | *Normal: simpan pesanan* | *Buat pesanan, lalu baca ulang langsung dari basis data* | *Baris pesanan ada dengan nilai total dan status yang sama* | *[...]* | *Pass/Fail* |
| *INT-TC05* | *I-03* | *Gagal: gateway mengembalikan status gagal* | *Kirim otorisasi dengan saldo dummy tidak cukup* | *Status pesanan tidak berubah menjadi "Lunas", pesan gagal diteruskan ke pengguna* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

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