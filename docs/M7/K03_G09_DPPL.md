<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>


# CariUang
### *[Logo Perangkat Lunak]*

### Untuk: Agatha Tatianingseto

Dipersiapkan oleh:

| Informasi | Keterangan |
| --- | --- |
| Kelas | K03 |
| Kelompok | 09 |
| Nama Kelompok | 9naga |

| NIM       | Nama               |
| --------- | ------------------ |
| 13525120 | Naufal Hasbialhaq |
| 13525009 | Wimar Widiarto |
| 13525093 | Vinsensius Juan Setiady |
| 13525126 | Raymond Edson Sabajan |
| 13525048 | Yohanes Nicholas Setiawan |

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | Menambahkan atribut baru dan method baru di kelas PemberiJasa, PemberiJasaController, KategoriJasa, KategoriJasaController, dan KategoriJasaUI |
| *B* | Mengubah dan menambahkan uc2 yang belum terdaftar pada class di traceability yang akan dipakai di matrix kerunutan |
| *C* |  |
| ... |  |

---

<br>

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini melanjutkan **Spesifikasi Kebutuhan Perangkat Lunak (SKPL)** dan **Arsitektur Perangkat Lunak (APL)**. Gunakan nama, ID, kebutuhan, dan use case yang konsisten dengan kedua dokumen tersebut. Contoh pola ID baru di bawah dapat disesuaikan dengan kesepakatan kelompok, ID yang sudah ada tetap dipertahankan.

<br>

---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen DPPL ini dibuat dengan tujuan mendeskripsikan perancangan teknis perangkat lunak kami, mulai dari mendeskripsikan realisasi use case, rancangan diagram kelas secara keseluruhan, matriks kerunutan antarkomponen, hingga memodelkan arsitektur dan subsistem yang diperlukan untuk membangun perangkat lunak tersebut. Dokumen ini akan digunakan oleh para pengembang perangkat lunak sebagai cetak biru atau panduan utama untuk mulai menulis kode dan mengimplementasikan sistem yang sudah dirancang di dokumen ini, serta oleh penguji perangkat lunak untuk memastikan alur program berjalan sesuai dengan rancangan teknis yang telah didefinisikan.

## 1.2 Lingkup Masalah
Nama perangkat lunak kami adalah CariUang, CariUang sendiri merupakan platform yang menghubungkan para pekerja2 di bidang informal, seperti tukang jahit keliling, tukang sol sepatu keliling, handyman, dan lain-lain. Mayoritas pekerja informal di Indonesia masih menghadapi kesulitan ekonomi akibat tidak adanya tarif standar dan jaminan sosial yang minimal. Di sisi lain, konsumen juga mengalami kesulitan menemukan tenaga kerja terdekat yang terpercaya dan terverifikasi karena solusi digital saat ini masih terbatas dan kurang mencakup seluruh segmen jasa. Oleh karena itu, diperlukan suatu platform digital yang mampu menghubungkan pekerja informal ini dengan konsumen untuk mendukung pengurangan kesenjangan sosial-ekonomi (SDG 10).

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| **P/L** | Perangkat Lunak, yaitu aplikasi atau program komputer yang sedang dikembangkan. |
| **DPPL** | Deskripsi Perancangan Perangkat Lunak, yaitu dokumen berisi rancangan teknis detail dari aplikasi yang akan dibuat. |
| **SKPL** | Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang berisi daftar kebutuhan dan fitur aplikasi. |
| **UC (*Use Case*)** | Skenario atau langkah-langkah yang menunjukkan bagaimana pengguna menggunakan fitur aplikasi. |
| **UI (*User Interface*)** | Tampilan visual aplikasi tempat pengguna melihat informasi dan menekan tombol. |
| **MVC** | *Model-View-Controller*, cara merancang aplikasi dengan membaginya menjadi 3 bagian: penyimpanan data (Model), tampilan (View), dan pengatur logika/proses (Controller). |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya, jangan membuat pola baru di dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Use Case* | *UCXX* | Menyatakan ID kasus yang mungkin terjadi di perangkat lunak|
| *Kelas* | *CXX* | Menyatakan ID kelas di perangkat lunak|

## 1.5 Referensi
Dokumen ini merujuk pada dokumentasi-dokumentasi milestone sebelumnya, seperti dokumen Topic Brainstorming, Requirement Gathering, Use Case, Class Diagram, SKPL, APL.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut, dengan maksimal 1 paragraf.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

| Komponen | Spesifikasi |
| :--- | :--- |
| *Development Tools* | VS Code; Github; React native |
| *DBMS* | Postgresql 16 |
| *OS* | Android OS |
| *Filing System* | <pre>cariuang-project/<br>├── backend/<br>│   ├── src/<br>│   ├── database/<br>│   └── tests/<br>└── frontend/<br>    ├── android/<br>    ├── assets/<br>    ├── src/<br>    └── tests/</pre> |
| *Bahasa Pemrograman* | typescript |

## 2.2 Style/Pattern Arsitektur Acuan

CariUang menggunakan *style*: **MVC (*Model-View-Controller*)**. Komponen P/L dibagi menjadi tiga peran:

| Bagian | Peran |
| :--- | :--- | 
| ***View*** | Menampilkan halaman (login/registrasi, katalog jasa dan peta, kontrak pekerjaan, chat, tiket laporan, rating, notifikasi) dan meneruskan aksi pengguna ke *Controller*. *View* tidak menyimpan aturan bisnis. |
| ***Controller*** | Menerima permintaan dari *View*, memvalidasi input, menjalankan aturan bisnis (misalnya penguncian pemberi jasa, perubahan status 'On Progress' → 'Done', pembuatan tiket otomatis), lalu memanggil *Model*. |
| ***Model*** | Merepresentasikan data (Pengguna, KategoriJasa, KontrakPekerjaan, Komunikasi, TiketLaporan, Rating, Notifikasi), serta membaca dan menyimpan data ke basis data.|

Pemilihan MVC sebagai style yang dipilih karena MVC memisahkan antara bagaimana data diroses, bagaimana navigasinya berjalan dan bagaimana tampilannya. Jika ada perubahan logika bisa langsung tanpa merusak UI yang sudah ada. Selain itu, pengerjaan dari perangkat lunak ini juga dapat dilakukan secara paralel sehingga pengerjaan UI dan bagian controller serta model dapat dilakukan secara bersamaan.


<p align="center">
<img alt="Contoh Arsitektur MVC" src="./assets/diagram/Diagram-MVC.png" width="40%">
</p>
<p align="center">
<i>Gambar 1. Contoh Arsitektur MVC</i>
</p>

## 2.3 Identifikasi Komponen / Modul / Subsistem

Identifikasi komponen, modul, atau subsistem penyusun aplikasi berdasarkan *pattern* yang telah ditetapkan. Jelaskan tanggung jawab masing-masing komponen. Pengelompokan dapat mengikuti lapisan arsitektur atau fungsi/peran komponen dalam sistem.

Ambil dari **Tabel 2.1 dokumen APL**, lalu kelompokkan berdasarkan lapisan (Model/View/Controller). Kolom **Jenis** diisi sesuai pattern, misalnya View, Controller, Model, Service, Repository. Satu komponen merepresentasikan saatu tanggung jawab utama yang jelas,

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
 TiketLaporanUI | View | Menampilkan halaman pengajuan tiket laporan masalah bagi pelanggan dan pemberi jasa, serta meneruskan ke TiketLaporanController. |
| PenggunaUI | View | Menampilkan antarmuka umum akun pengguna dan meneruskan proses atau input pengguna ke PenggunaController. |
| PelangganUI | View | Menampilkan antarmuka beranda bagi pelanggan untuk mencari jasa, melihat peta lokasi pemberi jasa, memilih jasa, dan meneruskan  pemesanan ke PelangganController. |
| PemberiJasaUI | View | Menampilkan antarmuka bagi pemberi jasa untuk mengelola profil, menerima notifikasi pesanan masuk, dan meneruskan proses ke PemberiJasaController. |
| LayananPelangganUI | View | Menampilkan halaman bagi layanan pelanggan untuk memantau tiket kendala pengguna, merespons tiket laporan, dan meneruskannya ke LayananPelangganController. |
| KontrakPekerjaanUI | View | Menampilkan antarmuka pembuatan kesepakatan kontrak kerja, status pekerjaan, serta tombol konfirmasi penyelesaian kerja ke KontrakPekerjaanController. |
| KategoriJasaUI | View | Menampilkan halaman katalog kategori jasa dan daftar jenis jasa yang tersedia kepada pelanggan serta meneruskan aksi pemilihan kategori ke KategoriJasaController. |
| RatingUI | View | Menampilkan antarmuka pengisian skor penilaian (rating) dan ulasan dua arah setelah pekerjaan selesai serta meneruskan data ulasan ke RatingController. |
| NotifikasiUI | View | Menampilkan daftar pemberitahuan sistem dan notifikasi pesan baru atau tiket masuk kepada pengguna serta meneruskan interaksi notifikasi ke NotifikasiController. |
| KomunikasiUI | View | Menampilkan antarmuka obrolan (*chat*) interaktif antara pengguna (pelanggan–pemberi jasa untuk negosiasi atau pengguna–layanan pelanggan untuk mediasi) ke KomunikasiController. |
| TiketLaporanController | Controller | Memproses logika pembentukan tiket laporan serta memperbarui state pada Model TiketLaporan. |
| PenggunaController | Controller | Menangani logika akun pengguna (login dan registrasi), serta berinteraksi dengan Model Pengguna. |
| PelangganController | Controller | Mengatur logika interaksi pelanggan, validasi pemilihan jasa dan lokasi, inisiasi pesanan kerja, serta memperbarui state pada Model Pelanggan. |
| PemberiJasaController | Controller | Mengatur logika pendaftaran jasa, pemrosesan penerimaan/penolakan pesanan, penanganan batas waktu respons pesanan (30 menit), dan pembaruan state pada Model PemberiJasa. |
| LayananPelangganController | Controller | Mengatur logika penanganan tiket laporan, serta memperbarui state tindak lanjut tiket pada Model LayananPelanggan. |
| KontrakPekerjaanController | Controller | Mengatur logika kontrak kerja dan pembaruan state pada Model KontrakPekerjaan. |
| KategoriJasaController | Controller | Mengatur logika pengambilan dan pemfilteran data kategori serta jenis jasa dari Model KategoriJasa untuk ditampilkan ke pengguna. |
| RatingController | Controller | Memvalidasi masukan penilaian dua arah, menghitung akumulasi dan rata-rata rating pengguna, serta menyimpan hasil penilaian melalui Model Rating. |
| NotifikasiController | Controller | Memproses pembentukan notifikasi otomatis saat terjadi sebuah event dan mengelola data notifikasi melalui Model Notifikasi. |
| KomunikasiController | Controller | Mengatur pengiriman dan penerimaan pesan obrolan secara *real-time*, validasi isi pesan, dan pencatatan riwayat pesan ke Model Komunikasi. |
| TiketLaporan | Model | Merepresentasikan entitas data tiket laporan masalah serta membaca dan menyimpan data. |
| Pengguna | Model | Merepresentasikan entitas dasar data pengguna aplikasi serta membaca dan menyimpan data. |
| Pelanggan | Model | Merepresentasikan data profil khusus pelanggan dan preferensi pemesanan jasa serta mengelola status data pelanggan di basis data. |
| PemberiJasa | Model | Merepresentasikan data khusus pemberi jasa (keahlian, lokasi GPS, status ketersediaan, akumulasi rating, dan lain-lain) serta mengelola status data di basis data. |
| LayananPelanggan | Model | Merepresentasikan data profil layanan pelanggan serta. |
| KontrakPekerjaan | Model | Merepresentasikan data kesepakatan kerja. |
| KategoriJasa | Model | Merepresentasikan data kategori dan jenis jasa yang ditawarkan dalam sistem serta membaca dan menyimpan data. |
| Rating | Model | Merepresentasikan data evaluasi/penilaian kerja serta membaca dan menyimpan data. |
| Notifikasi | Model | Merepresentasikan data notifikasi sistem serta membaca dan menyimpan data. |
| Komunikasi | Model | Merepresentasikan data percakapan obrolan serta membaca dan menyimpan data. |
| PostgreSQL 16 | Database | Menyimpan seluruh sistem CariUang, melayani operasi *query*, dan manipulasi data dari lapisan Model. |

<p align="center">Tabel 2.1 Tabel Identifikasi Komponen / Modul / Subsistem</p>

## 2.4 Model Arsitektur Perangkat Lunak

Pemilihan *Development View* didasari oleh kebutuhan untuk mendeskripsikan organisasi statis kode perangkat lunak ke dalam *package*. Dengan memfokuskan perancangan pada manajemen perangkat lunak, penyusunan hierarki folder atau modul, dan pemetaan ketergantungan kode, arsitektur sistem dapat dipastikan selaras dengan implementasi teknis pada repositori proyek serta meminimalkan risiko ketergantungan sirkular antar modul.

Penerapan *package diagram* pada pandangan ini memberikan batasan aksesantar bagian sistem melalui aturan dependensi seperti pemakaian, pengimporan publik, maupun akses privat. Kejelasan struktur ini mempermudah pembagian alokasi kerja antarpengembang agar tidak saling berbenturan, mendukung pembagian tanggung jawab fitur, serta meningkatkan potensi penggunaan ulang kode program dan kemudahan pemeliharaan sistem secara berkelanjutan.

### 2.4.1 View [Nama View]

Tuliskan secara singkat model arsitektur yang dipilih dan alasan model tersebut cocok untuk aplikasi.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-logical-view.webp" width="50%">
</p>
<p align="center">
<i>Gambar 2. Contoh Logical View pada P/L E-Commerce</i>
</p>

### 2.4.X View [Nama View]
*[Lakukan hal yang sama dengan bagian sebelumnya]*

<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case Mendaftarkan Jasa

**ID Use Case:** UC01 
**Nama Use Case:** Mendaftarkan jasa

### 3.1.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case Mendaftarkan Jasa

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C06 | PemberiJasaController | Kelas yang mengatur logika program untuk pemberi jasa | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C13 | KategoriJasa | Menyimpan data spesifik jasa yang ditawarkan oleh PemberiJasa | UC01, UC02 |
| C14 | KategoriJasaUI | Kelas yang mengatur penampilan halaman pada kategori jasa | UC01, UC02 |
| C15 | KategoriJasaController | Kelas yang mengatur logika program kategori jasa | UC01, UC02 |

### 3.1.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC01" src="./assets/diagram/sq-UC01-Mendaftarkan jasa-normal.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 1. Sequence Diagram UC01</i>
</p>

- **Skenario Alternatif 1: Verifikasi Input Gagal**

<p align="center">
<img alt="Sequence Diagram UC01 - Skenario 1" src="./assets/diagram/sq-UC01-Mendaftarkan jasa-alt1.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 2. Sequence Diagram UC01 - Verifikasi Input Gagal</i>
</p>

### 3.1.3 Diagram Kelas


<p align="center">
<img alt="" src="./assets/diagram/cd-UC01.drawio.png" width="35%">
</p>
<p align="center">
<i>Gambar 2. Diagram Kelas UC01 - Mendaftarkan Jasa</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.

## 3.2 Use Case Memilih Jasa

Silahkan lanjutkan untuk  *use case* berikutnya dengan content yang sama dengan 3.1

## 3.2.1 Sequence Diagram

## 3.2.2 Diagram Kelas


## 3.3 Use Case 03

Silahkan lanjutkan untuk  *use case* berikutnya dengan content yang sama dengan 3.1

## 3.3.1 Use Case 03

## 3.3.2 Use Case 03
<br>

## 3.10 Use Case 10
<b>ID Use Case: </b> UC10<br>
<b>Nama Use Case: </b> Memberi Rating

### 3.10.1 Identifikasi Kelas Use Case Memberi Rating
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan | 
| C02 | PenggunaUI | Kelas yang mengatur penampilkan halaman pengguna  | 
| C03 | PenggunaController | Kelas yang mengatur logika program untuk pengguna | 
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan|
| C16 | KontrakPekerjaan | Menyimpan data detail kesepakatan antara Pelanggan dan PemberiJasa, seperti harga, detail pekerjaan, status pekerjaan (On Progress/Done) |
| C18 | KontrakPekerjaanController | Kelas yang mengatur logika program kontrak pekerjaan |
| C25 | Rating | Merealisasikan fitur rating |
| C26 | RatingUI | Kelas yang mengatur penampilan halaman rating |
| C27 | RatingController | Kelas yang mengatur logika program rating |

### 3.10.2 Sequence Diagram
<ul>
    <li>Skenario Normal <br>
        <p align="center">
        <img src="./assets/diagram/SequenceUC10.png" width="35%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC10</i>
        </p>
    <li>Skenario Alternatif 1: Penyedia Jasa atau pengguna menutup popup yang telah dimunculkan atau menutup aplikasi setelah proses transaksi selesai
        <p align="center">
        <img src="./assets/diagram/SequenceUC10Alt1.png" width="75%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC10 Alternatif 1</i>
        </p>
</ul>

### 3.10.3 Diagram Kelas


<p align="center">
<img src="./assets/diagram/DiagramClassUC10.png" width="35%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas UC10</i>
</p>



## 3.11 Use Case 11
<b>ID Use Case: </b> UC11<br>
<b>Nama Use Case: </b> Memasuki akun dalam perangkat lunak

### 3.11.1 Identifikasi Kelas Use Case Memasuki akun dalam perangkat lunak
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian |
| C05 | PemberiJasaUI | Kelas yang mengatur penampilan halaman pemberi jasa |
| C06 | PemberiJasaController | Kelas yang mengatur logika program untuk pemberi jasa |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan|
| C08 | PelangganUI | Kelas yang mengatur penampilan halaman pelanggan | 
| C09 | PelangganController | Kelas yang mengatur logika program pelanggan | 
| C10 | LayananPelanggan | Bertanggung jawab dalam proses merespon tiket masalah atau laporan dari pemberi jasa dan pelanggan  | 
| C11 | LayananPelangganUI | Kelas yang mengatur penampilan halaman pengguna  | 
| C12 | LayananPelangganController | Kelas yang mengatur logika program untuk pengguna  | 

### 3.11.2 Sequence Diagram
<ul>
    <li>Skenario Pelanggan 
        <p align="center">
        <img src="./assets/diagram/DiagramUC11SkenarioPelanggan.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC10 Skenario Pelanggan</i>
        </p>
    <li>Skenario Pemberi Jasa
        <p align="center">
        <img src="./assets/diagram/DiagramUC11SeknarioPemberiJasa.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC10 Skenario Pemberi Jasa</i>
        </p>
    <li> Skenario Layanan Pelanggan
        <p align="center">
        <img src="./assets/diagram/DiagramUC11SkenarioLayananPelanggan.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC10 Skenario Layanan Pelanggan</i>
        </p>
</ul>

### 3.11.3 Diagram Kelas
<p align="center">
<img src="./assets/diagram/DiagramClassUC11.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas UC11</i>
</p>


## 3.12 Use Case 

<b>ID Use Case: </b> UC11<br>
<b>Nama Use Case: </b> Memasuki akun dalam perangkat lunak

### 3.11.1 Identifikasi Kelas Use Case Memasuki akun dalam perangkat lunak
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan |
| C02 | PenggunaUI | Kelas yang mengatur penampilkan halaman pengguna  |
| C03 | PenggunaController | Kelas yang mengatur logika program untuk pengguna |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian | 
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| 






# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/class-diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan Cari Uang</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| **C01** | Pengguna | - idPengguna<br>- nomorTelpon<br>- email<br>- namaPengguna<br>- username<br>- password<br>- akumulasiRating<br>- riwayatRating | + getId()<br>+ getNomor()<br>+ getEmail()<br>+ getNama()<br>+ setNomor()<br>+ setEmail()<br>+ setNama()<br>+ getAkumulasiRating()<br>+ getRiwayatRating()<br>+ addNewRatingRiwayat()<br>+ konfirmasiPekerjaan()<br>+ laporkanMasalah() |
| **C02** | PenggunaUI | - | + showDaftarPekerjaanSelesai()<br>+ pressBeriRating()<br>+ tampilkanHalamanRegistrasi()<br>+ pressRegister()<br>+ pressBantuanLayanan() |
| **C03** | PenggunaController | - | + triggerRating()<br>- verifikasiStatusPekerjaan()<br>+ validasiInfoRegistrasi()<br>+ requestKontrakPekerjaan()<br>+ requestFormTiket() |
| **C04** | PemberiJasa | - jenisJasa<br>- idKategoriJasa | + getIDPemberiJasa()<br>+ getIDKategoriJasa()<br>+ setIDKategoriJasa()<br>+ savePemberiJasa()<br>+ makePemberiJasa()<br>+ cekInfoLogin()<br>+ laporkanMasalah() |
| **C05** | PemberiJasaUI | - | + tunjukkanHalamanLogin()<br>+ pressLogin()<br>+ pindahHalaman()<br>+ pressPemberiJasa()<br>+ pressChat()<br>+ showPemberiJasaMap()<br>+ pressBantuanLayanan() |
| **C06** | PemberiJasaController | - | + validatePemberiJasa()<br>+ validasiInput()<br>+ triggerQueryLogin()<br>+ showPemberiJasaFromKategori()<br>+ choosePemberiJasa()<br>+ requestFormTiket() |
| **C07** | Pelanggan | - | + makePelanggan()<br>+ cekInfoLogin() |
| **C08** | PelangganUI | - | + tunjukkanHalamanLogin()<br>+ pressLogin()<br>+ pindahHalaman() |
| **C09** | PelangganController | - | + validasiInput()<br>+ triggerQueryLogin() |
| **C10** | LayananPelanggan | - idLayananPelanggan | + makeLayananPelanggan()<br>+ cekInfoLogin()<br>+ responTiket() |
| **C11** | LayananPelangganUI | - | + tunjukkanHalamanLogin()<br>+ pressLogin()<br>+ pindahHalaman()<br>+ showDaftarTiket()<br>+ pressBukaTiket() |
| **C12** | LayananPelangganController | - | + validasiInput()<br>+ triggerQueryLogin()<br>+ requestTiketLaporan()<br>+ teruskanBalasan() |
| **C13** | KategoriJasa | - idKategoriJasa<br>- jenisJasa<br>- tarif<br>- jamKerja<br>- daerahKerja | + getIDKategoriJasa()<br>+ getJenisJasa()<br>+ getTarif()<br>+ getJamKerja()<br>+ getDaerahKerja()<br>+ setTarif()<br>+ setJamKerja()<br>+ setDaerahKerja()<br>+ saveKategoriJasa() |
| **C14** | KategoriJasaUI | - | + pressOpenKategoriJasa()<br>+ showFormKategoriJasa()<br>+ pressSubmitKategoriJasa()<br>+ inputDataKategoriJasa()<br>+ showKategoriJasa()<br>+ pressKategoriJasa()<br>+ pressMenu() |
| **C15** | KategoriJasaController | - | + validateKategoriJasa()<br>+ submitFormKategoriJasa()<br>+ filterKategoriJasa() |
| **C16** | KontrakPekerjaan | - idKontrakPekerjaan<br>- detailPekerjaan<br>- persetujuanHarga<br>- statusPekerjaan<br>- statusKontrak | + getIdPelanggan()<br>+ getIdPemberiJasa()<br>+ setHarga()<br>+ setDetailPekerjaan()<br>+ setIdKontrakPekerjaan()<br>+ setStatusPekerjaan()<br>+ getDetailPekerjaan() |
| **C17** | KontrakPekerjaanUI | - | + showKontrakForm()<br>+ inputDetailPekerjaan()<br>+ klikKirimKontrak()<br>+ showDetailPekerjaan()<br>+ klikPekerjaanSelesai() |
| **C18** | KontrakPekerjaanController | - | + validasiInput()<br>+ saveKontrak() |
| **C19** | Komunikasi | - idChat<br>- idPengguna<br>- isiPesan<br>- waktuTerkirim<br>- isChatTerbaca<br>- statusChat<br>- durasiChat | + simpanPesan()<br>+ getPesan()<br>+ getIDChat()<br>+ getChatHistory()<br>+ saveChat() |
| **C20** | KomunikasiUI | - | + showChat()<br>+ pressKirimBalasan()<br>+ showChatChannel()<br>+ inputMessage()<br>+ pressSendChat() |
| **C21** | KomunikasiController | - | + kirimPesan()<br>+ getRiwayatChat()<br>+ loadChat()<br>+ startChat() |
| **C22** | TiketLaporan | - idTiket<br>- idPengguna<br>- jenisTiket<br>- keteranganTiket<br>- tanggalTiket<br>- statusTiket | + getDetailTiket()<br>+ updateStatusTiket() |
| **C23** | TiketLaporanUI | - | + showDetailTiket()<br>+ pressBalasTiket() |
| **C24** | TiketLaporanController | - | + getTiketLaporan()<br>+ balasTiket()<br>+ tutupTiket() |
| **C25** | Rating | - idRating<br>- idPenggunaPemberi<br>- idPenggunaPenerima<br>- idKontrakPekerjaan<br>- nilaiRating<br>- tanggalRating | + getIdPemberi()<br>+ getIdPenerima()<br>+ getIdKontrakPekerjaan()<br>+ getIdRating()<br>+ getRatingValue()<br>+ updateRatingPengguna() |
| **C26** | RatingUI | - | + tampilkanRatingForm()<br>+ tampilkanHasilRating()<br>+ pressJumlahBintang()<br>+ pressSubmitRating()<br>+ pressBatalRating() |
| **C27** | RatingController | - | + saveRating()<br>+ validateRatingValue() |
| **C28** | Notifikasi | - idNotifikasi<br>- idPenerima<br>- isiNotifikasi<br>- waktuNotifikasi<br>- statusBaca | + getIsiNotifikasi()<br>+ tandaiTerbaca()<br>+ getLastMessage() |
| **C29** | NotifikasiUI | - | - playSound()<br>- stopSound()<br>+ showNotifikasi()<br>+ closeNotifikasi()<br>+ pressNotifikasi() |
| **C30** | NotifikasiController | - | + buatNotifikasi()<br>+ kirimNotifikasi() |

<br>

---

# BAB 5: Matriks Kerunutan

Petakan kelas perancangan dengan use case yang terkait. Gunakan **BAB 6 Traceability pada dokumen SKPL** sebagai acuan keterkaitan kelas analisis dan use case, lalu sesuaikan dengan realisasi use case dan kelas perancangan pada BAB 3–BAB 5 DPPL.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| C01 - Pengguna | UC10 - Memberi rating; UC12 - Mendaftar akun ke perangkat lunak |
| C02 - PenggunaUI | UC10 - Memberi rating; UC12 - Mendaftar akun ke perangkat lunak |
| C03 - PenggunaController | UC10 - Memberi rating; UC12 - Mendaftar akun ke perangkat lunak |
| C04 - PemberiJasa | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC06 - Mengubah status pekerjaan menjadi selesai; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C05 - PemberiJasaUI | UC02 - Memilih jasa; UC08 - Melaporkan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C06 - PemberiJasaController | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa; UC08 - Melaporkan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C07 - Pelanggan | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC07 - Mengonfirmasi status pekerjaan; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C08 - PelangganUI | UC07 - Mengonfirmasi status pekerjaan; UC08 - Melaporkan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C09 - PelangganController | UC02 - Memilih jasa; UC07 - Mengonfirmasi status pekerjaan; UC08 - Melaporkan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C10 - LayananPelanggan | UC09 - Merespon laporan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C11 - LayananPelangganUI | UC09 - Merespon laporan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C12 - LayananPelangganController | UC09 - Merespon laporan masalah; UC11 - Memasuki akun dalam perangkat lunak |
| C13 - KategoriJasa | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa |
| C14 - KategoriJasaUI | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa |
| C15 - KategoriJasaController | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa |
| C16 - KontrakPekerjaan | UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC06 - Mengubah status pekerjaan menjadi selesai; UC07 - Mengonfirmasi status pekerjaan |
| C17 - KontrakPekerjaanUI | UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC06 - Mengubah status pekerjaan menjadi selesai; UC07 - Mengonfirmasi status pekerjaan |
| C18 - KontrakPekerjaanController | UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC06 - Mengubah status pekerjaan menjadi selesai; UC07 - Mengonfirmasi status pekerjaan |
| C19 - Komunikasi | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC09 - Merespon laporan masalah |
| C20 - KomunikasiUI | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC09 - Merespon laporan masalah |
| C21 - KomunikasiController | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC09 - Merespon laporan masalah |
| C22 - TiketLaporan | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C23 - TiketLaporanUI | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C24 - TiketLaporanController | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C25 - Rating | UC10 - Memberi rating |
| C26 - RatingUI | UC10 - Memberi rating |
| C27 - RatingController | UC10 - Memberi rating |
| C28 - Notifikasi | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C29 - NotifikasiUI | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C30 - NotifikasiController | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
