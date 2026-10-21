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
| *B* |  |
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
Tuliskan dengan ringkas tujuan dokumen DPPL ini dibuat dan siapa saja yang akan menggunakan dokumen ini.

## 1.2 Lingkup Masalah
Tuliskan dengan ringkas nama aplikasi dan deskripsi singkatnya. Bagian ini maksimal berisi satu paragraf, dapat diambil dari SKPL.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *DPPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *UC* | *Singkatan dari Use Case.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya, jangan membuat pola baru di dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Uce Case* | *UCXX* | |
| *Kelas* | *CXX* | |
| *...* | *...* |

## 1.5 Referensi
Cantumkan dokumentasi P/L yang dirujuk oleh dokumen ini, **minimal dokumen SKPL dan APL**. Tambahkan buku, panduan, atau dokumentasi lain apabila digunakan.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut, dengan maksimal 1 paragraf.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

## 2.2 Style/Pattern Arsitektur Acuan

Tentukan *architectural style* atau *pattern* yang menjadi acuan aplikasi, misalnya *layered architecture*, *client-server*, *repository*, *pipe and filter*, atau MVC (*Model-View-Controller*).


Gunakan hasil **BAB 1 Style/Pattern Arsitektur Acuan pada dokumen APL**, termasuk alasan pemilihan dan gambar penerapannya pada P/L kelompok. Gunakan komponen aplikasi sendiri pada gambar, bukan hanya contoh pola umum.

<p align="center">
<img alt="Contoh Arsitektur MVC" src="./assets/diagram/contoh-arsitektur-mvc.webp" width="40%">
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
| *[Nama komponen/modul/subsistem]* | *[Jenis]* | *[Tanggung jawab komponen]* |
| *[Nama komponen/modul/subsistem]* | *[Jenis]* | *[Tanggung jawab komponen]* |
| *...* | *...* | *...* |

## 2.4 Model Arsitektur Perangkat Lunak

Buat model arsitektur dalam bentuk satu atau lebih *view* yang memperlihatkan interaksi dan kolaborasi komponen, modul, serta subsistem dalam menjalankan fungsi sistem. Pilih notasi yang sesuai. Contoh *view*: *Logical View*, *Process View*, *Development View*, dan *Physical View*.

Gunakan hasil **BAB 3 Model Arsitektur Perangkat Lunak pada dokumen APL**. 

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
<b>ID Use Case: </b> UC10
<b>Nama Use Case: </b> Memberi Rating

### 3.10.1 Identifikasi Kelas Use Case Memberi Rating
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan | 
| C02 | PenggunaUI | Kelas yang mengatur penampilkan halaman pengguna  | 
| C03 | PenggunaController | Kelas yang mengatur logika program untuk pengguna | 
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan|
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

### 3.1.3 Diagram Kelas


<p align="center">
<img src="./assets/diagram/DiagramClassUC10.png" width="35%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas UC10</i>
</p>



## 3.11 Use Case 11

## 3.12 Use Case 


---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-class_diargam.png" width="50%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan [Nama P/L]</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *[C01]* | *[Nama kelas]* | *[Daftar atribut]* | *[Daftar metode/operasi]* |
| *[C02]* | *[Nama kelas]* | *[Daftar atribut]* | *[Daftar metode/operasi]* |
| *[C03]* | *[Nama kelas]* | *[Daftar atribut]* | *[Daftar metode/operasi]* |
| *...* | *...* | *...* | *...* |

<br>

---

# BAB 5: Matriks Kerunutan

Petakan kelas perancangan dengan use case yang terkait. Gunakan **BAB 6 Traceability pada dokumen SKPL** sebagai acuan keterkaitan kelas analisis dan use case, lalu sesuaikan dengan realisasi use case dan kelas perancangan pada BAB 3–BAB 5 DPPL.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case]* |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case]* |
| C01 - Pengguna | UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C02 - PenggunaUI | UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C03 - PenggunaController | UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C04 - PemberiJasa | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa; UC04 - Merespon pelanggan; UC06 - Mengubah status pekerjaan menjadi selesai; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C05 - PemberiJasaUI | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa; UC04 - Merespon pelanggan; UC06 - Mengubah status pekerjaan menjadi selesai; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C06 - PemberiJasaController | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa; UC04 - Merespon pelanggan; UC06 - Mengubah status pekerjaan menjadi selesai; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C07 - Pelanggan | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC07 - Mengonfirmasi status pekerjaan; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C08 - PelangganUI | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC07 - Mengonfirmasi status pekerjaan; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C09 - PelangganController | UC02 - Memilih jasa; UC03 - Menghubungi pemberi jasa; UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC07 - Mengonfirmasi status pekerjaan; UC08 - Melaporkan masalah; UC10 - Memberi rating; UC11 - Memasuki akun dalam perangkat lunak; UC12 - Mendaftar akun ke perangkat lunak |
| C10 - LayananPelanggan | UC09 - Merespon laporan masalah |
| C11 - LayananPelangganUI | UC09 - Merespon laporan masalah |
| C12 - LayananPelangganController | UC09 - Merespon laporan masalah |
| C13 - KategoriJasa | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa |
| C14 - KategoriJasaUI | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa |
| C15 - KategoriJasaController | UC01 - Mendaftarkan jasa; UC02 - Memilih jasa |
| C16 - KontrakPekerjaan | UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC06 - Mengubah status pekerjaan menjadi selesai; UC07 - Mengonfirmasi status pekerjaan |
| C17 - KontrakPekerjaanUI | UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC06 - Mengubah status pekerjaan menjadi selesai; UC07 - Mengonfirmasi status pekerjaan |
| C18 - KontrakPekerjaanController | UC05 - Memasukkan kesepakatan harga dan pekerjaan; UC06 - Mengubah status pekerjaan menjadi selesai; UC07 - Mengonfirmasi status pekerjaan |
| C19 - Komunikasi | UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC09 - Merespon laporan masalah |
| C20 - KomunikasiUI | UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC09 - Merespon laporan masalah |
| C21 - KomunikasiController | UC03 - Menghubungi pemberi jasa; UC04 - Merespon pelanggan; UC09 - Merespon laporan masalah |
| C22 - TiketLaporan | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C23 - TiketLaporanUI | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C24 - TiketLaporanController | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C25 - Rating | UC10 - Memberi rating |
| C26 - RatingUI | UC10 - Memberi rating |
| C27 - RatingController | UC10 - Memberi rating |
| C28 - Notifikasi | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C29 - NotifikasiUI | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
| C30 - NotifikasiController | UC08 - Melaporkan masalah; UC09 - Merespon laporan masalah |
