<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## Cari Uang
### <img src="../M7/assets/diagram//cariuang.svg" width="100" height="100">

### Untuk: Agatha Tatianingseto

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | 3 |
| Kelompok | 9  |

| NIM | Nama |
|---|---|
| 13525120 | Naufal Hasbialhaq |
| 13525009 | Wimar Widiarto |
| 13525093 | Vinsensius Juan Setiady |
| 13525126 | Raymond Edson Sabajan |
| 13525048 | Yohanes Nicholas Setiawan |


## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | Dihapus method yang bernama `updateAkumulasiRating()` pada objek pengguna |
| *B* |  |
| *C* |  |
| ... |  |

---

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
Dokumen DPPL CariUang ini disusun secara runut untuk menjadi panduan perancangan teknis perangkat lunak, dimulai dari BAB 1 Pendahuluan yang menjelaskan tujuan, lingkup masalah, definisi istilah, aturan penomoran, referensi, serta ikhtisar dokumen; BAB 2 Perancangan Arsitektur yang membahas lingkungan implementasi, pemilihan style MVC (Model-View-Controller), identifikasi komponen/modul/subsistem, serta model arsitektur berupa Development View; BAB 3 Realisasi Use Case yang menjabarkan identifikasi kelas, sequence diagram untuk skenario normal dan alternatif, serta diagram kelas pada setiap use case; BAB 4 Diagram Kelas Keseluruhan yang menyajikan diagram kelas perancangan secara menyeluruh beserta daftar atribut dan metode/operasi seluruh kelas; dan BAB 5 Matriks Kerunutan yang memetakan keterkaitan antara kelas perancangan dengan use case terkait sebagai acuan implementasi dan penelusuran kebutuhan.

<br>

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
<img alt="Contoh Arsitektur MVC" src="../M7/assets/diagram//Diagram-MVC.png" width="40%">
</p>
<p align="center">
<i>Gambar 2.1 Arsitektur MVC</i>
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



### 2.4.1 Development View

Pemilihan *Development View* didasari oleh kebutuhan untuk mendeskripsikan organisasi statis kode perangkat lunak ke dalam *package*. Dengan memfokuskan perancangan pada manajemen perangkat lunak, penyusunan hierarki folder atau modul, dan pemetaan ketergantungan kode, arsitektur sistem dapat dipastikan selaras dengan implementasi teknis pada repositori proyek serta meminimalkan risiko ketergantungan sirkular antar modul.

Penerapan *package diagram* pada pandangan ini memberikan batasan aksesantar bagian sistem melalui aturan dependensi seperti pemakaian, pengimporan publik, maupun akses privat. Kejelasan struktur ini mempermudah pembagian alokasi kerja antarpengembang agar tidak saling berbenturan, mendukung pembagian tanggung jawab fitur, serta meningkatkan potensi penggunaan ulang kode program dan kemudahan pemeliharaan sistem secara berkelanjutan.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram//Development View.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 2.4.1 Model Development View</i>
</p>

<br>


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


- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC01" src="../M7/assets/diagram//sq-UC01-Mendaftarkan jasa-normal.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 1. Sequence Diagram UC01</i>
</p>

- **Skenario Alternatif 1: Verifikasi Input Gagal**

<p align="center">
<img alt="Sequence Diagram UC01 - Skenario 1" src="../M7/assets/diagram//sq-UC01-Mendaftarkan jasa-alt1.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 2. Sequence Diagram UC01 - Verifikasi Input Gagal</i>
</p>

### 3.1.3 Diagram Kelas


<p align="center">
<img alt="" src="../M7/assets/diagram//cd-UC01.drawio.png" width="35%">
</p>
<p align="center">
<i>Gambar 3. Diagram Kelas UC01 - Mendaftarkan Jasa</i>
</p>


## 3.2 Use Case Memilih Jasa

**ID Use Case:** UC02 
**Nama Use Case:** Memilih Jasa

## 3.2.1 Sequence Diagram

<p align="center">
<img alt="Sequence Diagram UC02" src="../M7/assets/diagram//sq-UC02-Memilih-jasa-normal.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 4. Sequence Diagram UC02</i>
</p>

- **Skenario Alternatif 1: Pemberi Jasa Tidak Ditemukan**

<p align="center">
<img alt="Sequence Diagram UC02 - Skenario 1" src="../M7/assets/diagram//sq-UC02-Memilih-jasa-alt1.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 5. Sequence Diagram UC02 - Pemberi Jasa Tidak Ditemukan</i>
</p>

## 3.2.2 Diagram Kelas

<p align="center">
<img alt="Sequence Diagram UC02 - Skenario 1" src="../M7/assets/diagram//cd UC02.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 6. Diagram Kelas UC02 </i>
</p>

## 3.3 Use Case 03

**ID Use Case:** UC03 
**Nama Use Case:** Menghubungi Pemberi Jasa

## 3.3.1 Sequence Diagram

<p align="center">
<img alt="Sequence Diagram UC02" src="../M7/assets/diagram//sq-UC03-Menghubungi-pemberi-jasa-Normal.drawio-2.png" width="50%">
</p>
<p align="center">
<i>Gambar 7. Sequence Diagram UC03</i>
</p>

- **Skenario Alternatif 1: Pesan tidak terkirim ke pemberi jasa**

<p align="center">
<img alt="Sequence Diagram UC03 - Skenario 1" src="../M7/assets/diagram//sq-UC03-Menghubungi-pemberi-jasa-alt1.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 8. Sequence Diagram UC03 - Pesan tidak terkirim ke pemberi jasa</i>
</p>

## 3.3.2 Class Diagram

<p align="center">
<img alt="" src="../M7/assets/diagram//CD UC03.drawio.png" width="35%">
</p>
<p align="center">
<i>Gambar 9. Diagram Kelas UC03 - Mendaftarkan Jasa</i>
</p>

<br>

## 3.4 Use Case 4
<b>ID Use Case: </b> UC04<br>
<b>Nama Use Case: </b> Merespon pelanggan

### 3.4.1 Identifikasi Kelas Use Case Memberi Rating
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan|
| C19 | Komunikasi | Merealisasikan fitur komunikasi |
| C20 | KomunikasiUI | Kelas yang mengatur penampilan halaman pada halaman komunikasi |
| C21 | KomunikasiController | Kelas yang mengatur logika program komunikasi |
| C28 | Notifikasi | Merealisasikan fitur notifikasi yang akan diberikan kepada PemberiJasa ketika jasanya dipesan | 
| C29 | NotifikasiUI | Kelas yang mengatur penampilan halaman notifikasi | 
| C30 | NotifikasiController | Kelas yang mengatur logika program notifikasi |  

### 3.4.2 Sequence Diagram
<ul>
    <li>Skenario Normal <br>
        <p align="center">
        <img src="../M7/assets/diagram//sequenceUC04.png" width="75%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC04</i>
        </p>
    
</ul>

### 3.4.3 Diagram Kelas


<p align="center">
<img src="../M7/assets/diagram//classDiagramUC03.png" width="75%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas UC04</i>
</p>

## 3.5 Use Case 5
<b>ID Use Case: </b> UC05<br>
<b>Nama Use Case: </b> Pelanggan memasukkan kesepakatan harga dan pekerjaan

### 3.5.1 Identifikasi Kelas Use Case Memberi Rating
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| 
| C16 | KontrakPekerjaan | Menyimpan data detail kesepakatan antara Pelanggan dan PemberiJasa, seperti harga, detail pekerjaan, status pekerjaan (On Progress/Done) | 
| C17 | KontrakPekerjaanUI | Kelas yang mengatur penampilan halaman pada kelas kontrak pekerjaan | 
| C18 | KontrakPekerjaanController | Kelas yang mengatur logika program kontrak pekerjaan |

### 3.5.2 Sequence Diagram
<ul>
    <li>Skenario Normal <br>
        <p align="center">
        <img src="../M7/assets/diagram//sequenceUC05.png" width="75%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC05</i>
        </p>
    
</ul>

### 3.5.3 Diagram Kelas


<p align="center">
<img src="../M7/assets/diagram//classDiagramUC05.png" width="75%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas UC05</i>
</p>

## 3.6 Use Case 6
<b>ID Use Case: </b> UC06<br>
<b>Nama Use Case: </b> Pemberi jasa telah selesai bekerja

### 3.6.1 Identifikasi Kelas Use Case Memberi Rating
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| 
| C16 | KontrakPekerjaan | Menyimpan data detail kesepakatan antara Pelanggan dan PemberiJasa, seperti harga, detail pekerjaan, status pekerjaan (On Progress/Done) | 
| C17 | KontrakPekerjaanUI | Kelas yang mengatur penampilan halaman pada kelas kontrak pekerjaan | 
| C18 | KontrakPekerjaanController | Kelas yang mengatur logika program kontrak pekerjaan |

### 3.6.2 Sequence Diagram
<ul>
    <li>Skenario Normal <br>
        <p align="center">
        <img src="../M7/assets/diagram//sequenceUC06.png" width="75%">
        </p>
        <p align="center">
        <i>Gambar X. Diagram Sequence UC06</i>
        </p>
    
</ul>

### 3.6.3 Diagram Kelas


<p align="center">
<img src="../M7/assets/diagram//classDiagramUC06.png" width="75%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas UC06</i>
</p>

## 3.7 Use Case 7

### 3.7.1 Identifikasi Kelas Use Case Pelanggan dan Pemberi Jasa Melaporkan Masalah
| ID Kelas | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| C04 | PemberiJasa | PemberiJasa | 
| C05 | PemberiJasaUI | PemberiJasaUI | 
| C06 | PemberiJasaController | PemberiJasaController | 
| C07 | Pelanggan | Pelanggan | 
| C08 | PelangganUI | PelangganUI | 
| C09 | PelangganController | PelangganController | 
| C22 | TiketLaporan | TiketLaporan | 
| C23 | TiketLaporanUI | TiketLaporanUI | 
| C24 | TiketLaporanController | TiketLaporanController | 
| C28 | Notifikasi | Notifikasi | 
| C29 | NotifikasiUI | NotifikasiUI | 
| C30 | NotifikasiController | NotifikasiController | 


### 3.7.2 Sequence Diagram
<ul>
    <p align="center">
    <img src="../M7/assets/diagram//sequence diagram 7.png" width="35%">
    </p>
    <p align="center">
    <i>Gambar 15. Diagram Sequence UC7</i>
    </p>
</ul>

### 3.7.3 Diagram Kelas
<p align="center">
<img src="../M7/assets/diagram//class diagram 7.png" width="35%">
</p>
<p align="center">
<i>Gambar 16. Diagram Kelas UC7</i>
</p>

## 3.8 Use Case 8

### 3.8.1 Identifikasi Kelas Use Case Pelanggan dan Pemberi Jasa Melaporkan Masalah
| ID Kelas | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| C04 | PemberiJasa | PemberiJasa | 
| C05 | PemberiJasaUI | PemberiJasaUI | 
| C06 | PemberiJasaController | PemberiJasaController | 
| C07 | Pelanggan | Pelanggan | 
| C08 | PelangganUI | PelangganUI | 
| C09 | PelangganController | PelangganController | 
| C22 | TiketLaporan | TiketLaporan | 
| C23 | TiketLaporanUI | TiketLaporanUI | 
| C24 | TiketLaporanController | TiketLaporanController | 
| C28 | Notifikasi | Notifikasi | 
| C29 | NotifikasiUI | NotifikasiUI | 
| C30 | NotifikasiController | NotifikasiController | 


### 3.8.2 Sequence Diagram
<ul>
    <p align="center">
    <img src="../M7/assets/diagram//sequence diagram 8.png" width="35%">
    </p>
    <p align="center">
    <i>Gambar 17. Diagram Sequence UC8</i>
    </p>
</ul>

### 3.8.3 Diagram Kelas
<p align="center">
<img src="../M7/assets/diagram//class diagram 8.png" width="35%">
</p>
<p align="center">
<i>Gambar 18. Diagram Kelas UC8</i>
</p>

## 3.9 Use Case 9

### 3.9.1 Identifikasi Kelas Use Case Layanan Pelanggan Merespon Pelanggan
| ID Kelas | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| C10 | LayananPelanggan | LayananPelanggan | 
| C11 | LayananPelangganUI | LayananPelangganUI | 
| C12 | LayananPelangganController | LayananPelangganController | 
| C19 | Komunikasi | Komunikasi | 
| C20 | KomunikasiUI | KomunikasiUI | 
| C21 | KomunikasiController | KomunikasiController |
| C22 | TiketLaporan | TiketLaporan | 
| C23 | TiketLaporanUI | TiketLaporanUI | 
| C24 | TiketLaporanController | TiketLaporanController | 
| C28 | Notifikasi | Notifikasi | 
| C29 | NotifikasiUI | NotifikasiUI | 
| C30 | NotifikasiController | NotifikasiController | 


### 3.9.2 Sequence Diagram
<ul>
    <p align="center">
    <img src="../M7/assets/diagram//sequence diagram 9.png" width="35%">
    </p>
    <p align="center">
    <i>Gambar 19. Diagram Sequence UC9</i>
    </p>
</ul>

### 3.9.3 Diagram Kelas
<p align="center">
<img src="../M7/assets/diagram//class diagram 9.png" width="35%">
</p>
<p align="center">
<i>Gambar 20. Diagram Kelas UC9</i>


## 3.10 Use Case 10
<b>ID Use Case: </b> UC10<br>
<b>Nama Use Case: </b> Memberi Rating

### 3.10.1 Identifikasi Kelas Use Case Memberi Rating
| ID Kelas | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| C01 | Pengguna | Pengguna |     
| C02 | PenggunaUI | PenggunaUI |     
| C03 | PenggunaController | PenggunaController |     
| C04 | PemberiJasa | PemberiJasa |    
| C07 | Pelanggan | Pelanggan |    
| C16 | KontrakPekerjaan | KontrakPekerjaan |    
| C18 | KontrakPekerjaanController | KontrakPekerjaanController |    
| C25 | Rating | Rating |    
| C26 | RatingUI | RatingUI |    
| C27 | RatingController | RatingController |    

### 3.10.2 Sequence Diagram
<ul>
    <li>Skenario Normal <br>
        <p align="center">
        <img src="../M7/assets/diagram//SequenceUC10.png" width="35%">
        </p>
        <p align="center">
        <i>Gambar 21. Diagram Sequence UC10</i>
        </p>
    <li>Skenario Alternatif 1: Penyedia Jasa atau pengguna menutup popup yang telah dimunculkan atau menutup aplikasi setelah proses transaksi selesai
        <p align="center">
        <img src="../M7/assets/diagram//SequenceUC10Alt1.png" width="75%">
        </p>
        <p align="center">
        <i>Gambar 22. Diagram Sequence UC10 Alternatif 1</i>
        </p>
</ul>

### 3.10.3 Diagram Kelas


<p align="center">
<img src="../M7/assets/diagram//DiagramClassUC10.png" width="35%">
</p>
<p align="center">
<i>Gambar 23. Diagram Kelas UC10</i>
</p>



## 3.11 Use Case 11
<b>ID Use Case: </b> UC11<br>
<b>Nama Use Case: </b> Memasuki akun dalam perangkat lunak

### 3.11.1 Identifikasi Kelas Use Case Memasuki akun dalam perangkat lunak
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C04 | PemberiJasa | PemberiJasa | 
| C05 | PemberiJasaUI | PemberiJasaUI | 
| C06 | PemberiJasaController | PemberiJasaController | 
| C07 | Pelanggan | Pelanggan | 
| C08 | PelangganUI | PelangganUI | 
| C09 | PelangganController | PelangganController | 
| C10 | LayananPelanggan | LayananPelanggan | 
| C11 | LayananPelangganUI | LayananPelangganUI | 
| C12 | LayananPelangganController | LayananPelangganController | 

### 3.11.2 Sequence Diagram
<ul>
    <li>Skenario Pelanggan 
        <p align="center">
        <img src="../M7/assets/diagram//DiagramUC11SkenarioPelanggan.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar 24. Diagram Sequence UC10 Skenario Pelanggan</i>
        </p>
    <li>Skenario Pemberi Jasa
        <p align="center">
        <img src="../M7/assets/diagram//DiagramUC11SeknarioPemberiJasa.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar 25. Diagram Sequence UC10 Skenario Pemberi Jasa</i>
        </p>
    <li> Skenario Layanan Pelanggan
        <p align="center">
        <img src="../M7/assets/diagram//DiagramUC11SkenarioLayananPelanggan.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar 26. Diagram Sequence UC10 Skenario Layanan Pelanggan</i>
        </p>
</ul>

### 3.11.3 Diagram Kelas
<p align="center">
<img src="../M7/assets/diagram//DiagramClassUC11.png" width="50%">
</p>
<p align="center">
<i>Gambar 27. Diagram Kelas UC11</i>
</p>


## 3.12 Use Case 

<b>ID Use Case: </b> UC11<br>
<b>Nama Use Case: </b> Memasuki akun dalam perangkat lunak

### 3.12.1 Identifikasi Kelas Use Case Memasuki akun dalam perangkat lunak
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Pengguna | 
| C02 | PenggunaUI | PenggunaUI | 
| C03 | PenggunaController | PenggunaController | 
| C04 | PemberiJasa | PemberiJasa | 
| C07 | Pelanggan | Pelanggan | 

### 3.12.2 Sequence Diagram
<ul>
    <li>Skenario Pelanggan 
        <p align="center">
        <img src="../M7/assets/diagram//SequenceUC12SkenarioPelanggan.png" width="50%">
        </p>
        <p align="center">
        <i>Gambar 28. Diagram Sequence UC10 Skenario Pelanggan</i>
        </p>
    <li>Skenario Pemberi Jasa
        <p align="center">
        <img src="../M7/assets/diagram//SequenceUC12SkenarioPemberiJasa.png" width="50%">
        </p>
        <i>Gambar 29. Diagram Sequence UC10 Skenario Pelanggan</i>
        </p>


### 3.12.2 Diagram Kelas

<p align="center">
<img src="../M7/assets/diagram//DiagramClassUC12.png" width="50%">
</p>
<p align="center">
<i>Gambar 30. Diagram Kelas UC11</i>
</p>



# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram//class-diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan Cari Uang</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| Kode | Nama Class | Atribut | Metode |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | idPengguna<br>nomorTelpon<br>email<br>namaPengguna<br>username<br>password<br>akumulasiRating<br>riwayatRating | +getId()<br>+getNomor()<br>+getEmail()<br>+getNama()<br>+setNomor()<br>+setEmail()<br>+setNama()<br>+getAkumulasiRating()<br>+getRiwayatRating()<br>+addNewRatingRiwayat()<br>+konfirmasiPekerjaan()<br>+laporkanMasalah() |
| C02 | PenggunaUI | - | +showDaftarPekerjaanSelesai()<br>+pressBeriRating()<br>+tampilkanHalamanRegistrasi()<br>+showInformasiPekerjaanSelesai()<br>+pressRegister()<br>+pressBantuanLayanan()<br>+showInformasiPekerjaanSelesai() |
| C03 | PenggunaController | - | +triggerRating()<br>-verifikasiStatusPekerjaan()<br>+validasiInfoRegistrasi()<br>+requestKontrakPekerjaan()<br>+requestFormTiket() |
| C04 | PemberiJasa | jenisJasa<br>idKategoriJasa<br>-idPemberiJasa<br>-dataPemberiJasa | +getIDPemberiJasa()<br>+getIDKategoriJasa()<br>+setIDKategoriJasa()<br>+savePemberiJasa()<br>+makePemberiJasa()<br>+cekInfoLogin()<br>+laporkanMasalah()<br>+simpanKeDb()<br>+tampilkanSuksesRegistrasi()<br>+getPemberiJasaByID() |
| C05 | PemberiJasaUI | - | +tunjukkanHalamanLogin()<br>+pressLogin()<br>+pindahHalaman()<br>+pressPemberiJasa()<br>+pressChat()<br>+showPemberiJasaMap()<br>+pressBantuanLayanan()<br>+tampilkanError()<br>+showPemberiJasaKategori() |
| C06 | PemberiJasaController | - | +validatePemberiJasa()<br>+validasiInput()<br>+triggerQueryLogin()<br>+showPemberiJasaFromKategori()<br>+choosePemberiJasa()<br>+requestFormTiket()<br>+setInformasiPemberiJasa()<br>+fetchPemberiJasaById() |
| C07 | Pelanggan | - | +makePelanggan()<br>+cekInfoLogin()<br>+simpanKeDb() |
| C08 | PelangganUI | - | +tunjukkanHalamanLogin()<br>+pressLogin()<br>+pindahHalaman()<br>+tampilkanError()<br>+tampilkanSuksesRegistrasi() |
| C09 | PelangganController | - | +validasiInput()<br>+triggerQueryLogin() |
| C10 | LayananPelanggan | -idLayananPelanggan | +makeLayananPelanggan()<br>+cekInfoLogin()<br>+responTiket() |
| C11 | LayananPelangganUI | - | +tunjukkanHalamanLogin()<br>+pressLogin()<br>+pindahHalaman()<br>+showDaftarTiket()<br>+pressBukaTiket()<br>+tampilkanError() |
| C12 | LayananPelangganController | - | +validasiInput()<br>+triggerQueryLogin()<br>+requestTiketLaporan()<br>+teruskanBalasan() |
| C13 | KategoriJasa | idKategoriJasa<br>jenisJasa<br>tarif<br>jamKerja<br>daerahKerja<br>-dataKategoriJasa | +getIDKategoriJasa()<br>+getJenisJasa()<br>+getTarif()<br>+getJamKerja()<br>+getDaerahKerja()<br>+setTarif()<br>+setJamKerja()<br>+setDaerahKerja()<br>+saveKategoriJasa()<br>+getAllKategori()<br>+getKategoriById() |
| C14 | KategoriJasaUI | - | +pressOpenKategoriJasa()<br>+showFormKategoriJasa()<br>+pressSubmitKategoriJasa()<br>+inputDataKategoriJasa()<br>+showKategoriJasa()<br>+pressKategoriJasa()<br>+pressMenu()<br>+bukaHalamanKategoriJasa()<br>+isiFormJasa()<br>+showPendaftaranBerhasil()<br>+tampilkanPesanSukses()<br>+showAllKategoriJasa()<br>+showKategoriById() |
| C15 | KategoriJasaController | - | +validateKategoriJasa()<br>+submitFormKategoriJasa()<br>+filterKategoriJasa()<br>+showFormKategoriJasa()<br>+confirmDataTersimpan()<br>+updateDataPemberiJasa()<br>+showPendaftaranBerhasil()<br>+fetchAllKategoriJasa()<br>+fetchKategoriJasaById() |
| C16 | KontrakPekerjaan | idKontrakPekerjaan<br>detailPekerjaan<br>persetujuanHarga<br>statusPekerjaan<br>hasRating | +fetchKontrakPekerjaan()<br>+saveKontrak()<br>+getDetailPekerjaan()<br>+newKontrak()<br>+makeKontrak()<br>+statusUpdate()<br>+saveKontrak()<br>+addRating() |
| C17 | KontrakPekerjaanUI | - | +openHalamanKontrak()<br>+inputDetailPekerjaan()<br>+showKontrakForm()<br>+showDetailPekerjaan()<br>+pressPekerjaanSelesai()<br>+openDetailPekerjaan() |
| C18 | KontrakPekerjaanController | - | -getKontrakPekerjaan()<br>-statusUpdate()<br>-showKontrakForm()<br>-kirimInput() |
| C19 | Komunikasi | -idChat<br>-idPengguna<br>-isiPesan<br>-waktuTerkirim<br>-isChatTerbaca<br>-statusChat<br>-durasiChat<br>-dataChat | +simpanPesan()<br>+getPesan()<br>+getIDChat()<br>+getChatHistory()<br>+saveChat() |
| C20 | KomunikasiUI | - | +showChat()<br>+pressKirimBalasan()<br>+showChatChannel()<br>+inputMessage()<br>+pressSendChat()<br>+showMessage() |
| C21 | KomunikasiController | - | +kirimPesan()<br>+getRiwayatChat()<br>+loadChat()<br>+startChat()<br>+sendChat() |
| C22 | TiketLaporan | -idTiket<br>-idPengguna<br>-jenisTiket<br>-keteranganTiket<br>-tanggalTiket<br>-statusTiket | +getDetailTiket()<br>+updateStatusTiket() |
| C23 | TiketLaporanUI | - | +showDetailTiket()<br>+pressBalasTiket() |
| C24 | TiketLaporanController | - | +getTiketLaporan()<br>+balasTiket()<br>+tutupTiket() |
| C25 | Rating | idPenggunaPemberi<br>idPenggunaPenerima<br>idRating<br>idKontrakPekerjaan<br>nilaiRating<br>tanggalRating | +getIdPemberi()<br>+getIdPenerima()<br>+getIdKontrakPekerjaan()<br>+getIdRating()<br>+getRatingValue()<br>+updateRatingPengguna()<br>+makeRating()<br>+simpanKeDb() |
| C26 | RatingUI | - | +tampilkanRatingForm()<br>+tampilkanHasilRating()<br>+pressJumlahBintang()<br>+pressSubmitRating()<br>+pressBatalRating() |
| C27 | RatingController | - | +validateRatingValue() |
| C28 | Notifikasi | -idNotifikasi<br>-idPenerima<br>-isiNotifikasi<br>-waktuNotifikasi<br>-statusBaca | +getIsiNotifikasi()<br>+tandaiTerbaca()<br>+getLastMessage() |
| C29 | NotifikasiUI | - | -playSound()<br>-stopSound()<br>+showNotifikasi()<br>+closeNotifikasi()<br>+pressNotifikasi() |
| C30 | NotifikasiController | - | +buatNotifikasi()<br>+kirimNotifikasi() |

<br>



# BAB 5: Perancangan Rinci Kelas

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait
| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| ... | *...* | *...* |


## 5.1 Kelas Pengguna

**Nama Kelas:** Pengguna <br>
**ID Kelas:** C01

Tabel 5.1.1. Operasi Kelas Pengguna

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `getId(): String` | public | Mengembalikan id unik pengguna |
| `getNomor(): String` | public | Mengembalikan nomor telepon pengguna |
| `getEmail(): String` | public | Mengembalikan email pengguna |
| `getNama(): String` | public | Mengembalikan nama pengguna |
| `setNomor(nomorBaru: String): Void`| public | Memperbarui nomor telepon pengguna |
| `setEmail(emailBaru: String): Void`| public | Membperbarui email pengguna | 
| `setNama(namaBaru: String): Void` | public | Memperbarui nama pengguna | 
| `getAkumulasiRating(): Float` | public | Mengembalikan rata-rata akumulasi rating pengguna |

 
Tabel 5.1.2. Atribut Kelas Pengguna

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idPengguna | private | String |
| nomorTelepon | private | String |
| email | private | String | 
| namaPengguna | private | String |
| akumulasiRating | private | Float |
| riwayatRating | private | Float[] | 
| username | private | String |
| passwordHash | private | String |

### 5.1.1 Algoritma/Query

**Nama Kelas:**  
**Nama Operasi:** 
**ID Algoritma:** 


```text

```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.1.1. Query Opersi [Nama Operasi]
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.1.2 Algoritma/Query

*[Ulangi pola 5.1.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.2 Kelas PenggunaController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.2.1. Operasi Kelas [Nama Kelas 2]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.2.2. Atribut Kelas [Nama Kelas 2]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.2.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.2.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.2.2 Algoritma/Query

*[Ulangi pola 5.2.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.3 Kelas PemberiJasa
## 5.3 Kelas PemberiJasa

**Nama Kelas:** PemberiJasa  
**ID Kelas:** C04
**Nama Kelas:** *PemberiJasa*  
**ID Kelas:** *C04*

Tabel 5.3.1 Operasi Kelas PemberiJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `cekInfoLogin(input username: String, input password: String): Boolean` | public | Menjalankan query ke database untuk melihat apakah informasi login yang digunakan sesuai dengan informasi pada tabel pengguna |
| `makePelanggan(input idPengguna: String, input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String): Pelanggan` | public | Memverifikasi bahwa informasi unik dan tidak ada di database kemudian membuat objek pelanggan dengan informasi tersebut | 
| `simpanKeDb(): void`| public | Menyimpan objek ke database |
| laporkanMasalah() | Public | Pemberi jasa melaporkan masalah kepada layanan pelanggan |

Tabel 5.3.2 Atribut Kelas PemberiJasa

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.3.1 Algoritma/Query

**Nama Kelas:** PemberiJasa <br>
**Nama Operasi:** cekInfoLogin <br>
**ID Algoritma:** Algo-XXX

```text
public function cekInfoLogin(input username:String, input password:String)
KAMUS LOKAL
correctPassword: Boolean
userRecord: Row Table Pengguna

ALGORITMA
    if (username.strip = "" or password.strip = "") then
        --> false
    userRecord <- execute_query(Q-XXX, [trim(username)])
    
    if (userRecord = NUL) then
        {Mensimulasikan proses check hasing}
        verify_hash(password, "algoritma_hashing(data_dummy)")
        return false
    isPasswordValid <-- verify_hash(password, userRecord.passwordHash)
    if not(isPasswordValid) then
        --> false
    {Insialisasi Objek lokal jika kredensial valid}
    this.idPengguna <- userRecord.id_pengguna
    this.username <- userRecord.username
    this.email <- userRecord.email
    this.namaPengguna <- userRecord.nama_pengguna
    --> true

```

### 5.3.2 Algoritma/Query

**Nama Kelas:** PemberiJasa
**Nama Operasi:** getPemberiJasaByID()
**ID Algoritma:** Algo-XXX
```text
PRIVATE dataPemberiJasa : Object
PUBLIC function getPemberiJasaByID(idPemberiJasa : String) -> Object
    rows : Object
    rows <- // execute query data Pemberi Jasa berdasarkan ID

    this.dataPemberiJasa <- rows
    -> this.dataPemberiJasa
```

### 5.3.3 Algoritma/Query

**Nama Kelas:** PemberiJasa
**Nama Operasi:** getPemberiJasaByKategori()
**ID Algoritma:** Algo-XXX
```text
PRIVATE idPemberiJasa : String
PUBLIC  idKategoriJasa : String
PUBLIC  jenisJasa : String
PUBLIC function getPemberiJasaByKategori(idKategoriJasa : String) -> List<Object>
    rows : List <Object>
    rows <- // execute querydaftar Pemberi Jasa yang tersedia berdasarkan ID Kategori Jasa 
    -> rows
```

Tabel 5.3.3 Query Operasi cekInfoLogin

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `SELECT id_pengguna, nama_pengguna, username, password, email FROM pengguna WHERE username = $1;` | Mengambil data akun dan hash password dari tabel pengguna berdasarkan nama pengguna. |

### 5.3.2 Algoritma/Query
**Nama Kelas:** PemberiJasa <br>
**Nama Operasi:** makePemberiJasa <br>
**ID Algoritma:** Algo-XXX


```text
public function makePelanggan(input idPengguna: String, input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String, input idKategoriJasa: String,   input jenisJasa: String) -> PemberiJasa
KAMUS LOKAL
record: SQL query row result
pemberijasa: PemberiJasa

ALGORITMA
    if (trim(username) = "" or trim(namaPengguna) = "" or trim(idPengguna) = "")
        --> false
    if (not(validEmail(email))) then
        --> false
    if (not isNumericString(nomorTelpon) or length(nomorTelpon) < 10) then
        --> false

    {Check if info is in db}
    record <- execute_query(Q-XXX, [trim(username), trim(email)])
    if (isExist is not null) then
        --> false

    pemberijasa.idPengguna <- idPengguna
    pemberijasa.namaPengguna <- namaPengguna
    pemberijasa.username <- trim(username)
    pemberijasa.password <- password
    pemberijasa.email <- trim(email)
    pemberijasa.nomorTelpon <- nomorTelpon
    pemberijasa.akumulasiRating <- 0.0
    pemberijasa.riwayatRating <- []

    pemberijasa.idKategoriJasa <- idKategoriJasa
    pemberijasa.jenisJasa <- jenisJasa
    --> pemberijasa
```
Tabel 5.3.4 Query Operasi makePemberiJasa

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `SELECT id_pengguna FROM pengguna WHERE username = $1 OR email = $2;` | Mencari sebuah entry dengan username dan pengguna |

### 5.3.3 Algoritma/Query
**Nama Kelas:** PemberiJasa <br>
**Nama Operasi:** simpanKeDb() <br>
**ID Algoritma:** Algo-XXX

```text
public function simpanKeDb() -> void
execute_query(Q-XXX, [
            this.idPengguna,
            this.namaPengguna,
            this.username,
            this.password,
            this.email,
            this.nomorTelpon
        ])
execute_query(Q-XXX, this.idPengguna, this.idKategoriJasa,this.jenisJasa)
```
Tabel 5.3.5 Query Operasi simpanKeDb

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `INSERT INTO pengguna (id_pengguna, nama_pengguna, username, password, email, nomor_telpon, akumulasi_rating, riwayat_rating) VALUES ($1, $2, $3, $4, $5, $6, 0.0, '{}'); | Menyimpan objek pelanggan dalam database | 
| Q-XXX | `INSERT INTO pemberi_jasa (id_pengguna, id_kategori_jasa, jenis_jasa) VALUES ($1, $2, $3)` | |


## 5.4 Kelas PemberiJasaController

**Nama Kelas:** PemberiJasaController
**ID Kelas:** C06

Tabel 5.4.1. Operasi Kelas PemberiJasaController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| requestFormTiket() | Public | Meminta form tiket untuk diisi dan dikirimkan le layanan pelanggan |


### 5.4.1 Algoritma/Query

**Nama Kelas:** PemberiJasaController
**Nama Operasi:** validatePemberiJasa(idPemberiJasa : String)  
**ID Algoritma:** [Algo-001]

```text
PUBLIC function validatePemberiJasa(idPemberiJasa : String) -> Boolean
    IF (isEmpty(idPemberiJasa)) THEN
        -> FALSE
    -> TRUE
```
### 5.4.2 Algoritma/Query
**Nama Kelas:** PemberiJasaController
**Nama Operasi:** setInformasiKategoriJasa(idKategoriJasa : String)  
**ID Algoritma:** [Algo-001]

```text
PUBLIC procedure setInformasiKategoriJasa(idKategoriJasa : String)
    this.pemberiJasa.idKategoriJasa <- idKategoriJasa
```
### 5.4.3 Algoritma/Query
**Nama Kelas:** PemberiJasaController
**Nama Operasi:** fetchPemberiJasaById(idPemberiJasa : String)
**ID Algoritma:** [Algo-001]

```text
PRIVATE pemberiJasaUI : PemberiJasaUI
PUBLIC procedure fetchPemberiJasaById(idPemberiJasa : String)
    IF (not isEmpty(idPemberiJasa)) THEN
        dataPemberiJasa <- this.pemberiJasa.getPemberiJasaByID(idPemberiJasa)
        this.pemberiJasaUI.showPemberiJasaKategori(dataPemberiJasa)
```
### 5.4.4 Algoritma/Query
**Nama Kelas:** PemberiJasaController
**Nama Operasi:** showPemberiJasaFromKategori(idKategoriJasa : String)
**ID Algoritma:** [Algo-001]

```text
PRIVATE pemberiJasa : PemberiJasa
PUBLIC function showPemberiJasaFromKategori(idKategoriJasa : String) -> List<Object>
    -> this.pemberiJasa.getPemberiJasaByKategori(idKategoriJasa)
```
### 5.4.5 Algoritma/Query
**Nama Kelas:** PemberiJasaController
**Nama Operasi:** choosePemberiJasa(idPemberiJasa : String)
**ID Algoritma:** [Algo-001]

```text
PRIVATE pemberiJasa : PemberiJasa
PUBLIC function choosePemberiJasa(idPemberiJasa : String) -> Object
    -> this.pemberiJasa.getPemberiJasaByID(idPemberiJasa)
```

| validasiInfoRegistrasi(input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String): Boolean | public | Memvalidasi input yang digunakan user dalam registrasi |

### 5.4.6 Algoritma/Query
**Nama Kelas:** PemberiJasaController  
**Nama Operasi:** validasiInfoRegistrasi
**ID Algoritma:** Algo-XXX

```text
public function validasiInfoRegistrasi(input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String): Boolean

ALGORITMA
    if (trim(namaPengguna) = "" or trim(username) = "" or trim(password) = "" or trim(email) = "" or trim(nomorTelpon) = "") then
        --> false
    if (length(password) < 8) then
        --> false
    if (not isValidEmailFormat(email)) then
        --> false
    if (not isNumericString(nomorTelpon) or length(nomorTelpon) < 10 or length(nomorTelpon) > 15) then
        --> false
    --> true
```

## 5.5 Kelas Pelanggan

**Nama Kelas:** *Pelanggan*  
**ID Kelas:** *C07*
**Nama Kelas:** Pelanggan <br> 
**ID Kelas:** C07

Tabel 5.5.1 Operasi Kelas Pelanggan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `cekInfoLogin(input username: String, input password: String): Boolean` | public | Menjalankan query ke database untuk melihat apakah informasi login yang digunakan sesuai dengan informasi pada tabel pengguna |
| `simpanKeDb(): void`| public | Menyimpan objek ke database |
| `laporkanMasalah(idTiket: String, jenisTiket: String, keteranganTiket: String):Boolean` | public | fungsi untuk membuat tiket masalah yang terjadi |

### 5.5.1 Algoritma/Query
**Nama Kelas:** *Pelanggan*  
**Nama Operasi:** *laporkanMasalah()*  
**ID Algoritma:** *[Algo-001]*

```text
public function laporkanMasalah(input idTiket: String,input jenisTiket: String,input keteranganTiket: String)-> Boolean

ALGORITMA
    if (trim(idTiket) == "" or trim(jenisTiket) == "" or trim(keteranganTiket) == "") then
        --> false
    if (trim(this.idPengguna) == "") then
        --> false
    execute_query(Q-Tiket-001, [
            idTiket,
            this.idPengguna,
            jenisTiket,
            keteranganTiket
        ])
    --> true
```
Tabel 5.3.5 Query Operasi laporkanMasalah

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `INSERT INTO tiket_laporan (id_tiket, id_pengguna, jenis_tiket, keterangan_tiket, tanggal_tiket, status_tiket) VALUES ($1, $2, $3, $4, NOW(), 'Open');` | Menyimpan objek tiket dalam database | 


### 5.5.2 Algoritma/Query
**Nama Kelas:** Pelanggan 
**Nama Operasi:** cekInfoLogin
**ID Algoritma:** Algo-XXX

```text
public function cekInfoLogin(input username:String, input password:String)
KAMUS LOKAL
correctPassword: Boolean
userRecord: Row Table Pengguna

ALGORITMA
    if (username.strip = "" or password.strip = "") then
        --> false
    userRecord <- execute_query(Q-XXX, [trim(username)])
    
    if (userRecord = NUL) then
        {Mensimulasikan proses check hasing}
        verify_hash(password, "algoritma_hashing(data_dummy)")
        return false
    isPasswordValid <-- verify_hash(password, userRecord.passwordHash)
    if not(isPasswordValid) then
        --> false
    {Insialisasi Objek lokal jika kredensial valid}
    this.idPengguna <- userRecord.id_pengguna
    this.username <- userRecord.username
    this.email <- userRecord.email
    this.namaPengguna <- userRecord.nama_pengguna
    --> true
```

Tabel 5.5.3 Query Operasi cekInfoLogin

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `SELECT id_pengguna, nama_pengguna, username, password, email FROM pengguna WHERE username = $1;` | Mengambil data akun dan hash password dari tabel pengguna berdasarkan nama pengguna. |

### 5.5.3 Algoritma/Query
**Nama Kelas:** Pelanggan <br>
**Nama Operasi:** makePelanggan <br>
**ID Algoritma:** Algo-XXX

```text
public function makePelanggan(input idPengguna: String, input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String) -> Pelanggan
KAMUS LOKAL
record: SQL query row result
pelanggan: Pelanggan

ALGORITMA
    if (trim(username) = "" or trim(namaPengguna) = "" or trim(idPengguna) = "")
        --> false
    if (not(validEmail(email))) then
        --> false
    if (not isNumericString(nomorTelpon) or length(nomorTelpon) < 10) then
        --> false

    {Check if info is in db}
    record <- execute_query(Q-XXX, [trim(username), trim(email)])
    if (isExist is not null) then
        --> false

    pelanggan.idPengguna <- idPengguna
    pelanggan.namaPengguna <- namaPengguna
    pelanggan.username <- trim(username)
    pelanggan.password <- password
    pelanggan.email <- trim(email)
    pelanggan.nomorTelpon <- nomorTelpon
    pelanggan.akumulasiRating <- 0.0
    pelanggan.riwayatRating <- []
    --> pelanggan
```
Tabel 5.5.4 Query Operasi makePelanggan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `SELECT id_pengguna FROM pengguna WHERE username = $1 OR email = $2;` | Mencari sebuah entry dengan username dan pengguna |

### 5.5.4 Algoritma/Query
**Nama Kelas:** Pelanggan <br>
**Nama Operasi:** simpanKeDb() <br>
**ID Algoritma:** Algo-XXX

```text
public function simpanKeDb() -> void
execute_query(Q-Reg-001, [
            this.idPengguna,
            this.namaPengguna,
            this.username,
            this.password,
            this.email,
            this.nomorTelpon
        ])
```
Tabel 5.5.5 Query Operasi simpanKeDb

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `INSERT INTO pengguna (id_pengguna, nama_pengguna, username, password, email, nomor_telpon, akumulasi_rating, riwayat_rating) VALUES ($1, $2, $3, $4, $5, $6, 0.0, '{}'); | Menyimpan objek pelanggan dalam database | 


## 5.6 Kelas PelangganController

**Nama Kelas:** PelangganController
**ID Kelas:** C09

Tabel 5.6.1. Operasi Kelas [Nama Kelas 6]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| validasiInfoRegistrasi(input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String): Boolean | public | Memvalidasi input yang digunakan user dalam registrasi |

### 5.6.1 Algoritma/Query
**Nama Kelas:** PelangganController  
**Nama Operasi:** validasiInfoRegistrasi
**ID Algoritma:** Algo-XXX

```text
public function validasiInfoRegistrasi(input namaPengguna: String, input username: String, input password: String, input email: String, input nomorTelpon: String): Boolean

ALGORITMA
    if (trim(namaPengguna) = "" or trim(username) = "" or trim(password) = "" or trim(email) = "" or trim(nomorTelpon) = "") then
        --> false
    if (length(password) < 8) then
        --> false
    if (not isValidEmailFormat(email)) then
        --> false
    if (not isNumericString(nomorTelpon) or length(nomorTelpon) < 10 or length(nomorTelpon) > 15) then
        --> false
    --> true
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.6.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.6.2 Algoritma/Query

*[Ulangi pola 5.6.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.7 Kelas LayananPelanggan

**Nama Kelas:** LayananPelanggan  
**ID Kelas:** C10

Tabel 5.7.1 Operasi Kelas LayananPelanggan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `cekInfoLogin(input username: String, input password: String): Boolean` | public | Menjalankan query ke database untuk melihat apakah informasi login yang digunakan sesuai dengan informasi pada tabel pengguna |

Tabel 5.7.2 Atribut Kelas LayananPelanggan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.7.1 Algoritma/Query

**Nama Kelas:** LayananPelanggan  
**Nama Operasi:** cekInfoLogin
**ID Algoritma:** Algo-XXX

```text
public function cekInfoLogin(input username:String, input password:String)
KAMUS LOKAL
correctPassword: Boolean
userRecord: Row Table Pengguna

ALGORITMA
    if (username.strip = "" or password.strip = "") then
        --> false
    userRecord <- execute_query(Q-XXX, [trim(username)])
    
    if (userRecord = NUL) then
        {Mensimulasikan proses check hasing}
        verify_hash(password, "algoritma_hashing(data_dummy)")
        return false
    isPasswordValid <-- verify_hash(password, userRecord.passwordHash)
    if not(isPasswordValid) then
        --> false
    {Insialisasi Objek lokal jika kredensial valid}
    this.idPengguna <- userRecord.id_pengguna
    this.username <- userRecord.username
    this.email <- userRecord.email
    this.namaPengguna <- userRecord.nama_pengguna
    --> true
```
Tabel 5.7.3 Query Operasi cekInfoLogin

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `SELECT id_pengguna, nama_pengguna, username, password, email FROM pengguna WHERE username = $1;` | Mengambil data akun dan hash password dari tabel pengguna berdasarkan nama pengguna. |

### 5.7.2 Algoritma/Query

*[Ulangi pola 5.7.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.8 Kelas LayananPelangganController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.8.1. Operasi Kelas [Nama Kelas 8]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.8.2. Atribut Kelas [Nama Kelas 8]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.8.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.8.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.8.2 Algoritma/Query

*[Ulangi pola 5.8.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.9 Kelas KategoriJasa

**Nama Kelas:** *KategoriJasa*  
**ID Kelas:** *C09*

Tabel 5.9.1. Operasi Kelas PelangganController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |
| validasiInput(): Boolean | Public | Validasi input yang dikirim |


### 5.9.1 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *getIDKategoriJasa()*  
**ID Algoritma:** *[Algo-091]*

```text
PRIVATE  idKategoriJasa   : String
PUBLIC funtion getIDKategoriJasa() -> String
    -> this.idKategoriJasa
```


### 5.9.2 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *getJenisJasa()*  
**ID Algoritma:** *[Algo-091]*

```text
PUBLIC function getJenisJasa() -> String
    -> this.jenisJasa
```

### 5.9.3 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *getTarif()*  
**ID Algoritma:** *[Algo-091]*

```text
PUBLIC function getTarif() -> Float
    -> this.tarif
```

### 5.9.4 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *getJamKerja()*  
**ID Algoritma:** *[Algo-091]*

```text
PRIVATE jamKerja         : String
PUBLIC function getJamKerja() -> String
    -> this.jamKerja
```

### 5.9.5 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *getDaerahKerja()*  
**ID Algoritma:** *[Algo-091]*

```text
PRIVATE daerahKerja      : String
PUBLIC function getDaerahKerja() -> String
    RETURN this.daerahKerja
```


### 5.9.6 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *setTarif()*  
**ID Algoritma:** *[Algo-091]*

```text
PRIVATE tarif : Integer
PUBLIC procedure setTarif(tarifBaru : Float)
    this.tarif <- tarifBaru
```

### 5.9.7 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *setJamKerja()*  
**ID Algoritma:** *[Algo-091]*

```text
PRIVATE jamKerja : Integer
PUBLIC procedure setJamKerja(jamKerjaBaru : String)
    this.jamKerja <- jamKerjaBaru
```

### 5.9.8 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *setDaerahKerja()*  
**ID Algoritma:** *[Algo-091]*

```text
PRIVATE daerahKerja : String
PUBLIC procedure setDaerahKerja(daerahKerjaBaru : String)
    this.daerahKerja <- daerahKerjaBaru
```

### 5.9.9 Algoritma/Query

**Nama Kelas:** *KategoriJasa* 
**Nama Operasi:** *saveKategoriJasa(dataJasa : Object)*  
**ID Algoritma:** *[Algo-091]*

```text
PUBLIC  idKategoriJasa   : String
PRIVATE jenisJasa        : String
PRIVATE deskripsiJasa    : String
PRIVATE tarif            : Integer
PRIVATE jamKerja         : String

PUBLIC procedure saveKategoriJasa(dataJasa : Object)
    this.idKategoriJasa   <- GenerateID()
    this.jenisJasa        <- dataJasa.jenisJasa
    this.deskripsiJasa    <- dataJasa.deskripsiJasa
    this.tarif            <- dataJasa.tarif
    this.jamKerja         <- dataJasa.jamKerja
    this.daerahKerja      <- dataJasa.daerahKerja
    this.dataKategoriJasa <- dataJasa

    // EXECUTE SQL QUERY
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.9.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


## 5.10 Kelas KategoriJasaController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.10.1. Operasi Kelas [Nama Kelas 10]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.10.2. Atribut Kelas [Nama Kelas 10]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.10.1 Algoritma/Query


**Nama Kelas:** *KategoriJasaController*  
**Nama Operasi:** *showFormKategoriJasa()*  
**ID Algoritma:** *[Algo-001]*

```text
PRIVATE kategoriJasaUI : KategoriJasaUI
PRIVATE kategoriJasa : KategoriJasa
PRIVATE pemberiJasaController : PemberiJasaController

PUBLIC procedure showFormKategoriJasa() :
    dataKosong <- {
        jenisJasa     : "",
        deskripsiJasa : "",
        tarif         : 0,
        jamKerja      : "",
        daerahKerja   : ""
    }
    this.kategoriJasaUI.showFormKategoriJasa(dataKosong)
```
### 5.10.2 Algoritma/Query


**Nama Kelas:** *KategoriJasaController*  
**Nama Operasi:** *validateKategoriJasa(Object: dataJasa)*  
**ID Algoritma:** *[Algo-001]*
```text
PUBLIC function validateKategoriJasa(Object: dataJasa) -> Boolean
        IF(dataJasa = NULL) THEN
            -> False
        ELSE IF (NOT isNumber(dataJasa.tarif) or dataJasa.tarif < 0 ) THEN
            -> False
        ELSE
            -> isEmpty(dataJasa.jenisJasa) AND isEmpty(dataJasa.deskripsiJasa) AND isEmpty(dataJasa.tarif) AND isEmpty(jamKerja) AND isEmpty(daerahKerja)
        -> TRUE
```

### 5.10.3 Algoritma/Query


**Nama Kelas:** *KategoriJasaController*  
**Nama Operasi:** *submifFormKategoriJasa(dataJasa: Object)*  
**ID Algoritma:** *[Algo-001]*
```text
PUBLIC procedure submifFormKategoriJasa(dataJasa: Object)
    IF(this.validateKategoriJasa(dataJasa)) THEN
        this.kategoriJasa.saveKategoriJasa(dataJasa)
        this.updateDataPemberiJasa(dataJasa.idKategoriJasa)
```

### 5.10.4 Algoritma/Query


**Nama Kelas:** *KategoriJasaController*  
**Nama Operasi:** *updateDataPemberiJasa(idKategoriJasa: String)*  
**ID Algoritma:** *[Algo-001]*
```text
PUBLIC procedure updateDataPemberiJasa(idKategoriJasa: String)
    this.pemberiJasaController.setInformasiKategoriJasa(idKategoriJasa)
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.10.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.10.2 Algoritma/Query

*[Ulangi pola 5.10.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.11 Kelas KontrakPekerjaan

**Nama Kelas:** *KontrakPekerjaan*  
**ID Kelas:** *C16*

Tabel 5.11.1. Operasi Kelas KontrakPekerjaan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| fetchKontrakPekerjaan() : KontrakPekerjaan | Public | Mengambil data kontrak pekerjaan |
| saveKontrak() : Boolean | Public | Menyimpan data kontrak pekerjaan |
| statusUpdate() : Boolean

Tabel 5.11.2. Atribut Kelas [Nama Kelas 11]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.11.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.11.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.11.2 Algoritma/Query

*[Ulangi pola 5.11.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.12 Kelas KontrakPekerjaanController

**Nama Kelas:** *KontrakPekerjaanController*  
**ID Kelas:** *C18*

Tabel 5.12.1. Operasi Kelas [Nama Kelas 12]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| getKontrakPekerjaan() : KontrakPekerjaan | Public | Mengambil data kontrak pekerjaan |
| kirimInput() | Public | Mengirim input kontrak pekerjaan |
| konfirmasiPekerjaan(kontrak KontrakPekerjaan) : Boolean | Public | Mengonfirmasi pekerjaan yang telah selesai |

Tabel 5.12.2. Atribut Kelas [Nama Kelas 12]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.12.1 Algoritma/Query

**Nama Kelas:** *KontrakPekerjaanController* 
**Nama Operasi:** *requestKontrakPekerjaan()*  
**ID Algoritma:** *[Algo-092]*

```text
public getKontrakPekerjaan(idKontrakPekerjaan : Integer) -> KontrakPekerjaan {

    KontrakPekerjaan temp = KontrakPekerjaan.fetchKontrakPekerjaan(idKontrakPekerjaan)

    return temp
}
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.9.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |

### 5.12.2 Algoritma/Query

**Nama Kelas:** *KontrakPekerjaanController* 
**Nama Operasi:** *konfirmasiPekerjaan()*  
**ID Algoritma:** *[Algo-093]*

```text
public konfirmasiPekerjaan(idKontrak : Integer) -> Boolean {
    KontrakPekerjaan kontrak = getKontrakPekerjaan(idKontrak)
    boolean isUpdated = kontrak.statusUpdate("Done")
    if (isUpdated) {
        return True
    }
    output("Gagal mengonfirmasi pekerjaan")
    return False
}
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.9.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |



## 5.13 Kelas Komunikasi

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.13.1. Operasi Kelas [Nama Kelas 13]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.13.2. Atribut Kelas [Nama Kelas 13]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.13.1 Algoritma/Query


**Nama Kelas:** *Komunikasi*  
**Nama Operasi:** *constructor(dataChat : Object)*  
**ID Algoritma:** *[Algo-001]*

```text
PRIVATE idChat        : String
PRIVATE idPengguna    : String
PRIVATE idPenerima    : String
PRIVATE isiPesan      : String
PRIVATE waktuTerkirim : Timestamp
PRIVATE isChatTerbaca : Boolean
PRIVATE statusChat    : String
PRIVATE durasiChat    : Float 
PRIVATE dataChat      : Object

PUBLIC constructor(dataChat : Object)
    this.idChat        <- GenerateID()
    this.idPengguna    <- dataChat.idPengirim
    this.idPenerima    <- dataChat.idPenerima
    this.isiPesan      <- dataChat.isiPesan
    this.waktuTerkirim <- CURRENT_TIMESTAMP()
    this.isChatTerbaca <- FALSE
    this.statusChat    <- "SENT"
    this.durasiChat    <- 0
    this.dataChat      <- dataChat
```

### 5.13.2 Algoritma/Query


**Nama Kelas:** *Komunikasi*  
**Nama Operasi:** *saveChat()*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC procedure saveChat()
    result <- execute query untuk simpan chat
```

### 5.13.3 Algoritma/Query


**Nama Kelas:** *Komunikasi*  
**Nama Operasi:** *getIDChat()*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC function getIDChat() -> String
    -> this.idChat
```

### 5.13.4 Algoritma/Query


**Nama Kelas:** *Komunikasi*  
**Nama Operasi:** *getPesan(idChat : String)*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC funtion getPesan(idChat : String) -> Object
    rows <- // execute query untuk mengambil chat berdasarkan id
    -> rows
```



### 5.13.5 Algoritma/Query


**Nama Kelas:** *Komunikasi*  
**Nama Operasi:** *getChatHistory(idPengguna1 : String, idPengguna2 : String)*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC function getChatHistory(idPengguna1 : String, idPengguna2 : String) -> List<Object>
    rows <- // execute query untuk mengambil seluruh chat history
    -> rows
```






Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.13.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.13.2 Algoritma/Query

*[Ulangi pola 5.13.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.14 Kelas KomunikasiController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.14.1. Operasi Kelas [Nama Kelas 14]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.14.2. Atribut Kelas [Nama Kelas 14]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.14.1 Algoritma/Query


**Nama Kelas:** *KomunikasiController*  
**Nama Operasi:** *sendChat(dataChat : Object)*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC procedure sendChat(dataChat : Object)
    pesanBaru <- NEW Komunikasi(dataChat)
    pesanBaru.saveChat()
    this.notifikasiController.buatNotifikasi(dataChat.idPenerima, "Pesan baru: " + dataChat.isiPesan)
```

### 5.14.2 Algoritma/Query


**Nama Kelas:** *KomunikasiController*  
**Nama Operasi:** *getRiwayatChat(idPengguna1 : String, idPengguna2 : String)*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC function getRiwayatChat(idPengguna1 : String, idPengguna2 : String) -> List<Object>
    -> this.komunikasi.getChatHistory(idPengguna1, idPengguna2)
```

### 5.14.3 Algoritma/Query


**Nama Kelas:** *KomunikasiController*  
**Nama Operasi:** *loadChat(idPelanggan : String, idPemberiJasa : String)*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC function loadChat(idPelanggan : String, idPemberiJasa : String) -> List<Object>
    -> this.getRiwayatChat(idPelanggan, idPemberiJasa)
```

### 5.14.4 Algoritma/Query


**Nama Kelas:** *KomunikasiController*  
**Nama Operasi:** *startChat(idPelanggan : String, idPemberiJasa : String)*  
**ID Algoritma:** *[Algo-001]*

```text
PUBLIC startChat(idPelanggan : String, idPemberiJasa : String) -> List<Object>
    -> this.getRiwayatChat(idPelanggan, idPemberiJasa)
```


Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.14.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.14.2 Algoritma/Query

*[Ulangi pola 5.14.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.15 Kelas TiketLaporan

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.15.1. Operasi Kelas [Nama Kelas 15]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.15.2. Atribut Kelas [Nama Kelas 15]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.15.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.15.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.15.2 Algoritma/Query

*[Ulangi pola 5.15.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.16 Kelas TiketLaporanController

**Nama Kelas:** *TiketLaporanController*  
**ID Kelas:** *C24*

Tabel 5.16.1. Operasi Kelas TiketLaporanController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| validasiFormTiket() : Boolean | Public | Memvalidasi input yang dimasukkan ke dalam form tiket |
| buatTiket(new TiketLaporan) : Boolean | Public | Mengatur pembuatan dan pengisian data tiket laporan |

Tabel 5.16.2. Atribut Kelas [Nama Kelas 16]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.16.1 Algoritma/Query

**Nama Kelas:** *TiketLaporanController*  
**Nama Operasi:** *validasiFormTiket()*  
**ID Algoritma:** *[Algo-001]*

```text
public validasiFormTiket(tiket : TiketLaporan) -> Boolean {
    if (jenisTiket = NULL or keteranganTiket = NULL) {
        return False
    }
    return True
}
```


### 5.16.2 Algoritma/Query

**Nama Kelas:** *TiketLaporanController*  
**Nama Operasi:** *buatTiket()*  
**ID Algoritma:** *[Algo-001]*

```text
public buatTiket(idPengguna : Integer, jenisTiket : String, keteranganTiket : String) -> Boolean{
    if (not(validasiFormTiket(jenisTiket, keteranganTiket))) {
        -> False
    }

    {Generator id untuk tiket}
    idTiket = {Generator id untuk tiket}
    tanggal = {ambil tanggal saat itu}

    TiketLaporan new 
    new.idTiket = idTiket
    new.idPengguna = idPengguna
    new.jenisTiket = jenisTiket
    new.keteranganTiket = keteranganTiket
    new.tanggalTiket = tanggal
    new.statusTiket = "Submitted"

    isSaved = TiketLaporan.simpanAntrian(new)
    if (isSaved) {
        teruskanKeNotifikasi(new)
        output("Tiket telah tersubmit")
        -> True
    }
    output("Tiket gagal disubmit")
    -> False
}
```
### 5.16.2 Algoritma/Query

**Nama Kelas:** *TiketLaporanController*  
**Nama Operasi:** *teruskanKeNotifikasi()*  
**ID Algoritma:** *[Algo-001]*

```text
public teruskanKeNotifikasi()
}
```


## 5.17 Kelas Rating

**Nama Kelas:** Rating <br>  
**ID Kelas:** C25

Tabel 5.17.1 Operasi Kelas Rating
| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `getIdRating(): String` | public | Mengembalikan id rating |
| `getIdPemberi(): String` | public | Mengembalikan id pengguna yang memberikan rating |
| `getIdPenerima(): String` | public | Mengembalikan id pengguna yang menerima rating |
| `getIdKontrakPekerjaan(): String` | public | Mengembalikan id kontrak pekerjaan yang dinilai |
| `getRatingValue(): String` | public | Mengembalikan nilai rating yang diberikan |
| `makeRating(idRating: String, idPemberi: String, idPenerima: String, idKontrak: String, nilaiRating: Float): Rating` | public | Membuat objek Rating baru dengan atribut yang ditentukan |
| `simpanKeDb(rating: Rating): boolean` | public | Menyimpan data transaksi penilaian ke database |
| `updateRatingPengguna(): boolean` | public | Memperbarui riwayat dan akumulasi nilai rating pada profil pengguna penerima |


Tabel 5.17.2 Atribut Kelas Rating

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idRating | private | String |
| idPemberi | private | String |
| idPenerima | private | String |
| idKontrakPekerjaan | private | String |
| nilaiRating | private | float | 
| tanggalRating | private | Date | 

### 5.17.1 Algoritma/Query

**Nama Kelas:** Rating <br>
**Nama Operasi:** simpanKeDb <br>
**ID Algoritma:** Algo-XXX

```text
public function simpanKeDb() -> boolean
KAMUS LOKAL
isSucces : Boolean

ALGORITMA

validateRatingValue(this.nilaiRating)

{Buat Entry Rating Baru pada database}
execute_query(Q-XXX, [
            this.idRating,
            this.idPenggunaPemberi,
            this.idPenggunaPenerima,
            this.idKontrakPekerjaan,
            this.nilaiRating
        ])

{Update bool hasRating di kontrakPekerjaan}
execute_query(Q-XXX, [this.idKontrakPekerjaan])

```
Tabel 5.17.3 Query Operasi simpanKeDb

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `INSERT INTO rating (id_rating, id_pengguna_pemberi, id_pengguna_penerima, id_kontrak_pekerjaan, nilai_rating, tanggal_rating) VALUES ($1, $2, $3, $4, $5, NOW());` | Menambah entry rating baru pada tabel rating |
| Q-XXX | `UPDATE kontrak_pekerjaan SET has_rating = TRUE WHERE id_kontrak_pekerjaan = $1;` | Memperbarui status kontrak kerja menjadi telah dinilai |


### 5.17.2 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** makeRating <br>
**ID Algoritma:** Algo-XXX

```text
public function makeRating(idRating: String, idPemberi: String, idPenerima: String, idKontrak: String, nilaiRating: Float) -> Rating
KAMUS LOKAL
rating: Rating

ALGORITMA

    rating.idRating <- idRating
    rating.idPembero <- idPemberi
    rating.idPenerima <- idPenerima
    rating.idKontrak <- idKontrak
    
    if validateRatingValue(nilaiRating)
        rating.nilaiRating <- nilaiRating
    else 
        rating.nilaiRating <- -1
    --> rating
```

### 5.17.3 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** updateRatingPengguna <br>
**ID Algoritma:** Algo-XXX

```text
public function updateRatingPengguna() -> Boolean
KAMUS LOKAL

ALGORITMA
execute_query(Q-XXX, [
            this.nilaiRating,
            this.idPenggunaPenerima
        ])

```

Tabel 5.17.4 Query Operasi updateRatingPengguna

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `UPDATE pengguna SET riwayat_rating = array_append(riwayat_rating, $1), akumulasi_rating = (SELECT ROUND(AVG(val)::numeric, 2) FROM unnest(array_append(riwayat_rating, $1)) AS val) WHERE id_pengguna = $2;` | Menambahkan skor ulasan ke riwayat rating sekaligus menghitung ulang rata-rata akumulasi rating pengguna tujuan |

### 5.17.4 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** getIdRating <br>
**ID Algoritma:** Algo-XXX

```text
public function getIdRating() -> String
ALGORITMA
    --> this.idRating
```

### 5.17.5 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** getIdPemberi <br>
**ID Algoritma:** Algo-XXX

```text
public function getIdPemberi() -> String
ALGORITMA
    --> this.idPemberi
```

### 5.17.6 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** getIdPenerima <br>
**ID Algoritma:** Algo-XXX

```text
public function getIdPenerima() -> String
ALGORITMA
    --> this.idPenerima
```
### 5.17.7 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** getIdKontrakPekerjaan <br>
**ID Algoritma:** Algo-XXX

```text
public function getIdKontrakPekerjaan() -> String
ALGORITMA
    --> this.idKontrakPekerjaan
```

### 5.17.8 Algoritma/Query
**Nama Kelas:** Rating <br>
**Nama Operasi:** getIdKontrakPekerjaan <br>
**ID Algoritma:** Algo-XXX

```text
public function getRatingValue() -> String
ALGORITMA
    --> this.nilaiRating
```


## 5.18 Kelas RatingController

**Nama Kelas:** RatingController  
**ID Kelas:** C27

Tabel 5.18.1. Operasi Kelas [Nama Kelas 18]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| `validateRatingValue(val: Integer): Boolean` | public | Memvalidasi nilai rating yang diberikan |

### 5.18.1 Algoritma/Query

**Nama Kelas:** RatingController <br>
**Nama Operasi:** validateRatingValue <br> 
**ID Algoritma:** Algo-XXX

```text
public function validateRatingValue(input val: Integer) -> Boolean
ALGORITMA
if (this.nilaiRating < 1 or this.nilaiRating > 5) then
    --> return false
if (this.idRating = "" or this.idPenggunaPemberi = "" or this.idPenggunaPenerima = "") then
    --> false
--> true
```


## 5.19 Kelas Notifikasi

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.19.1. Operasi Kelas [Nama Kelas 19]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.19.2. Atribut Kelas [Nama Kelas 19]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.19.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.19.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.19.2 Algoritma/Query

*[Ulangi pola 5.19.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.20 Kelas NotifikasiController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.20.1. Operasi Kelas [Nama Kelas 20]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.20.2. Atribut Kelas [Nama Kelas 20]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.20.1 Algoritma/Query

**Nama Kelas:** *NotifikasiController*  
**Nama Operasi:** *buatNotifikasi*  
**ID Algoritma:** *[Algo-001]*

```text
PRIVATE notifikasiUI : NotifikasiUI

PUBLIC procedure buatNotifikasi(idPenerima : String, isiNotifikasi : String) 
    notifBaru <- NEW Notifikasi(idPenerima, isiNotifikasi)
    notifBaru.simpanNotifikasi()
    this.kirimNotifikasi(notifBaru)
```
### 5.20.2 Algoritma/Query
**Nama Kelas:** *NotifikasiController*  
**Nama Operasi:** *kirimNotifikasi(notif: Notifikasi)*  
**ID Algoritma:** *[Algo-001]*
```text
PUBLIC kirimNotifikasi(notif : Notifikasi) : void
    this.notifikasiUI.showNotifikasi(notif.getIsiNotifikasi())
```


Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.20.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |



<br>

---

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka [ID Layar 1]

Masukkan versi awal prototipe antarmuka, dimana untuk setiap antarmuka/layar, tuliskan spesifikasi rinci objek yang ditampilkan dan reaksi sistem terhadap interaksi pengguna.

**Antarmuka:** *[ID layar]*  
**Nama Layar:** *[Nama layar]*

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram//contoh-design.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka [ID Layar] - [Nama Layar]</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka [ID Layar]

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *[ID objek]* | *[Jenis objek, misalnya Button, RTF Box, dll]* | *[String yang tampil pada layar]* | *[Reaksi sistem, layar tujuan, tautan, atau ID algoritma yang dijalankan]* |
| *[ID objek]* | *[Jenis objek]* | *[Konten yang ditampilkan]* | *[Reaksi sistem atau nama file terkait beserta deskripsi ringkasnya]* |
| *...* | *...* | *...* | *...* |


## 6.X Rancangan Antarmuka [ID Layar X]

*[Ulangi pola 6.1 untuk layar berikutnya sampai semua layar teridentifikasi]*

## 6.Y Rancangan Antarmuka Keseluruhan

Tuliskan daftar gambar seluruh antarmuka. Berikan ID unik untuk setiap tampilan dan gunakan ID yang sama pada subbab perancangan antarmuka masing-masing.

Tabel 6.Y. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| :--- | :--- |
| *[I-01]* | <img src="../M7/assets/diagram//contoh-design.png" alt="Contoh Desain" width="400"> |
| *[I-02]* | *[Sisipkan gambar antarmuka I-02]* |
| *[I-XX]* | *[Sisipkan gambar antarmuka berikutnya]* |

<br>

---

# BAB 7: Matriks Kerunutan

Petakan kelas perancangan dengan use case yang terkait. Gunakan **BAB 6 Traceability pada dokumen SKPL** sebagai acuan keterkaitan kelas analisis dan use case, lalu sesuaikan dengan realisasi use case dan kelas perancangan pada BAB 3–BAB 5 DPPL.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case; tuliskan seluruh use case terkait]* |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case]* |
| *...* | *...* |
