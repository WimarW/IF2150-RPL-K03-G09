<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK (SKPL)
</h1>
<br>

## Cari Uang

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
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

<br>

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen SKPL ini dibuat dengan tujuan mendeskripsikan perangkat lunak yang bernama CariUang, mulai dari mendeskripsikan kebutuhan-kebutuhan yang diperlukan untuk membangun perangkat lunak tersebut, baik fungsional maupun non fungsional, batasan-batasan yang diterapkan pada perangkat lunak tersebut, hingga skenario-skenario yang mungkin terjadi di dalam perangkat lunak tersebut. Dokumen ini akan digunakan untuk seorang pengembang perangkat lunak mengimplementasikan hal-hal yang sudah dijelaskan di dokumen ini.

## 1.2 Lingkup Masalah
<p align="justify">Mayoritas pekerja informal di Indonesia masih menghadapi kesulitan ekonomi akibat tidak adanya tarif standar dan jaminan sosial yang minimal. Di sisi lain, konsumen juga mengalami kesulitan menemukan tenaga kerja terdekat yang terpercaya dan terverifikasi karena solusi digital saat ini masih terbatas dan kurang mencakup seluruh segmen jasa. Oleh karena itu, diperlukan suatu platform digital yang mampu menghubungkan pekerja informal ini dengan konsumen untuk mendukung pengurangan kesenjangan sosial-ekonomi (SDG 10).</p>

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *EARS* | *Easy Approach to Requirements Syntax, yaitu pola penulisan kebutuhan agar konsisten dan mudah diuji.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan* | *RXX* | Menyatakan ID kebutuhan dari perangkat lunak|
| *Kebutuhan Fungsional* | *KFXX* | Menyatakan ID kebutuhan fungsional dari perangkat lunak|
| *Kebutuhan Non-Fungsional* | *KNFXX* | Menyatakan ID kebutuhan non fungsional dari perangkat lunak |
| *Aktor* | *AXX* | Menyatakan ID aktor yang terlibat dalam perangkat lunak|
| *Use Case* | *UCXX* | Menyatakan ID kasus yang mungkin terjadi di perangkat lunak|
| *Kelas* | *CXX* | Menyatakan ID kelas di perangkat lunak|
| *...* | *...* |

## 1.5 Referensi
<!-- Dokumentasi P/L yang dirujuk oleh dokumen ini. Referensi dapat berupa buku, panduan, ataupun dokumentasi lain yang dipakai dalam pengembangan P/L ini. -->

Dokumen ini merujuk pada dokumentasi-dokumentasi milestone sebelumnya, seperti dokumen Topic Brainstorming, Requirement Gathering, Use Case, dan Class Diagram

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
<!-- Tuliskan sistematika pembahasan dokumen SKPL ini secara runut (misalnya: BAB 2 membahas deskripsi umum P/L, BAB 3 membahas kebutuhan fungsional dan non-fungsional, dst). -->

<h3>BAB 2 Deskripsi Perangkat Lunak:</h3>
<ul>
    <li>2.1 Deskripsi Umum Sistem</li>
    <li>2.2 Deskripsi Umum Perangkat Lunak</li>
    <li>2.3 Pengguna dan Kebutuhan Pengguna Perangkat Lunak</li>
    <li>2.4 Batasan Perangkat Lunak</li>
    <li>2.5 Lingkunan Operasi Perangkat Lunak</li>
</ul>
<br>
<h3>BAB 3 Deskripsi Kebutuhan Perangkat Lunak:</h3>
<ul>
    <li>3.1 Kebutuhan Fungsional</li>
    <li>3.2 Kebutuhan Non Fungsional</li>
</ul>
<br>
<h3>BAB 4 Pemodelan Use Case:</h3>
<ul>
    <li>4.1 Identifikasi Aktor</li>
    <li>4.2 Identifikasi Use Case</li>
    <li>4.3 Use Case Diagram</li>
    <li>4.4 Skenario Use Case</li>
</ul>
<br>
<h3>BAB 5 Pemodelan Kelas:</h3>
<ul>
    <li>5.1 Identifikasi Kelas</li>
    <li>5.2 Diagram Kelas per Use Case</li>
    <li>5.3 Diagram Kelas Keseluruhan</li>
</ul>
<br>
<h3>BAB 6 Tracebility Pemodelan Kelas:</h3>
<br>
<hr>
# BAB 2: Deskripsi Perangkat Lunak

## 2.1 Deskripsi Umum Sistem
### 2.1.1 Ekspektasi Pengguna Terhadap Sistem
<p align="justify">Sistem ini melibatkan 3 aktor yang memiliki ekspektasi masing-masing yang berbeda.</p>
<ol>
    <li>Pelanggan: Sistem mampu menyelesaikan masalah yang sedang dialami. </li>
    <li>Pemberi Jasa: Sistem dapat memfasilitasi proses penjualan jasa mereka</li>
    <li>Layanan Pelanggan: Sistem mampu menunjukkan permasalahan yang dialami antar pelanggan dan pemberi jasa sehingga dapat menyelesaikan masalahnya</li>
</ol>

### 2.1.2 Alur kerja Sistem
<ol>
    <li>Pelanggan mengunggah/mendaftarkan informasi kebutuhan jasa ke perangkat lunak </li>
    <li>Aplikasi memberikan rekomendasi pemberi jasa relevan untuk kebutuhan pelanggan </li>
    <li>Pelanggan dan pemberi jasa melakukan negosiasi harga untuk pekerjaan yang ingin dilakukan</li>
    <li>Jika disetujui, pelanggan menginput persetujuan ke dalam aplikasi</li>
    <li>Pemilik jasa melakukan dan menyelesaikan pekerjaan fisik sesuai dengan persetujuan</li>
    <li>Setelah pekerjaan selesai, pelanggan akan melakukan pembayaran sebesar harga yang ditetapkan</li>
    <li>Proses diakhiri dengan kedua pihak saling memberi penilaian terkait kinerja pemberi jasa dan perilaku pelanggan</li>
</ol>

### 2.1.3 Harapan Penerapan Solusi
<p align="justify">Penerapan sistem ini diharapkan dapat menjaga standar kualitas dan profesionalisme penggunanya melalui sistem penilaian. Dengan sistem ini, pihak pelanggan dan pemberi jasa diwajibkan memberikan pelayanan dan perilaku yang terbaik untuk menjaga penilaian mereka. Sistem juga diharapkan dapat memberikan rasa aman dengan menyediakan lyananan ticket aduan apabila terdapat keluhan yang tidak bisa diselesaikan antara kedua belah pihak.</p>

### 2.1.4 Model Proses Bisnis
<p align="center">
<img alt="Diagram Swimlane Pemakaian Aplikasi" src="assets/diagram/Swimlane.png" width="70%">
</p>
<p align="center">
<i>Gambar X. Diagram Swimlane Pemakaian Aplikasi</i>
</p>

## 2.2 Deskripsi Umum Perangkat Lunak
<p align="justify"> "CariUang" adalah suatu perangkat lunak berbasis *mobile application* pada sistem operasi Android yang menjadi jembatan antara pekerja jasa (freelance) dan pengguna yang ingin menggunakan jasa mereka. Perangkat lunak ini memungkinkan pengguna untuk mengunggah kebutuhan jasa dan memilih jasa mereka. Kemudian, pemilik jasa dapat terhubung dengan pengguna untuk memberikan estimasi harga. Jika harga disetujui, pengguna akan menginput persetujuan/deskripsi pekerjaan dan harga ke apikasi sebelum disetujui oleh pemilik jasa. Jika tidak disetujui, pengguna akan kembali memilih pemilik jasa yang lain. Setelah itu, pemilik jasa akan melakukan pekerjaan sesuai persetujuan/deskripsi pekerjaan. Setelah semua pekerjaan selesai, pengguna akan membayar harga yang telah ditetapkan sebelumnya. <br>

<p align="justify"> Jika pengguna bingung akan pekerja jasa mana yang memiliki performa terbaik mengenai salah satu pekerjaan spesifik, perangkat lunak ini memiliki sistem rekomendasi pemilik jasa yang dikelompokkan kepada berbagai kelompok pekerjaan. Pengguna kemudian dapat langsung menghubungi pemilik jasa untuk menggunakan jasa mereka.<br>

<p align="justify"> Di dalam perangkat lunak yang kami buat, terdapat sistem *rating* untuk memberi penilaian terhadap kinerja pemilik jasa dan perilaku pengguna jasa. Rating diberikan oleh pengguna kepada pemilik jasa dan begitupun sebaliknya, sehingga baik pengguna atau pemilik jasa harus memberikan pelayanan atau perilaku yang terbaik untuk menjaga rating mereka. Jika rating melewati batas bawah yang telah ditentukan, baik pemilik atau pengguna jasa akan mendapatkan sanksi tertentu. <br>

<p align="justify"> Jika pengguna atau pemilik jasa memiliki beberapa keluhan yang tidak dapat diselesaikan antara kedua belah pihak, pengguna dapat membuat aduan kepada pihak Customer Service untuk ditindaklanjuti. Pengguna dapat mengirim tiket laporan mengenai berbagai topik spesifik dengan cara mengisi suatu form yang terdapat di menu Laporan. Setelah tiket dikirim, pihak Customer Service kemudian akan meninjau laporan tersebut untuk mencari langkah penyelesaian yang paling baik. Setelah selesai, pihak Customer Service akan memberikan tanggapan kepada pelapor mengenai hal yang telah dilakukan atau tindakan lanjutan yang perlu dilakukan. <br>

<p align="justify"> <br>

## 2.3 Pengguna dan Kebutuhan Pengguna Perangkat Lunak
| Aktor | Deskripsi |
| :--- | :--- |
| Pemberi Jasa | Pengguna ini bertindak sebagai pihak penyedia jasa yang menerima pesanan, melakukan pekerjaan fisik di lokasi pelanggan, dan menyelesaikan tugas sesuai dengan persetujuannya dengan pelanggan.  |
|  Pelanggan| Pengguna ini berperan sebagai pihak yang memerlukan, memesan, dan membayar layanan jasa kasar. |
| Layanan Pelanggan | Pengguna ini sebagai pihak yang berjaga jaga apabila terdapat sebuah masalah pada sistem atau masalah pada pengguna lain |

## 2.4 Batasan Perangkat Lunak
### 2.4.1 Asumsi Pengguna
<ul>
    <li>Pengguna memiliki smartphone yang dapat mengoperasikan perangkat lunak </li>
    <li>Pengguna mengunggah kebutuhan jasa yang ril (bukan fiktif atau penipuan) </li>
    <li>Profil pengguna yang terdapat di aplikasi tidak bersifat fiktif </li>
    <li>Pengguna memiliki koneksi internet yang aktif </li>
</ul>

### 2.4.2 Asumsi Pemilik Jasa
<ul>
    <li>Pemilik jasa profesional dalam melakukan pekerjaannya </li>
    <li>Pemilik jasa mengaktifkan GPS setiap menerima layanan jasa (jika memiliki smartphone) </li>
    <li>Profil pemilik jasa yang terdapat di aplikasi tidak bersifat fiktif </li>
    <li>Pemilik jasa memiliki koneksi internet yang aktif </li>
</ul>

### 2.4.3 Batasan Pengguna 
<ul>
    <li>Terdapat pengguna atau pemilik jasa yang tidak memiliki smartphone </li>
    <li>Pengguna atau pemilik jasa yang kurang memiliki literasi digital </li>
    <li>Pemilik jasa tidak dapat melakukan jasa yang ditawarkan </li>
</ul>

### 2.4.4 Batasan Teknis
<ul>
    <li>Sistem operasi yang terbatas pada Android berdasarkan jumlah pengguna terbanyak </li>
    <li>Aplikasi hanya tersedia untuk Android versi terbaru </li>
    <li>Hanya mendukung sedikit bahasa (Indonesia) </li>
    <li>Skalabilitas arsitektur perangkat lunak terbatas </li>
</ul>


## 2.5 Lingkungan Operasi Perangkat Lunak

| Komponen | Spesifikasi |
| :--- | :--- |
| *Server* | NodeJS (v24 LTS) dengan framework Express.js |
| *Client* | Aplikasi andorid|
| *DBMS* | Postgresql 16 |
| *OS* | Android OS |
| *...* | *...* |

---

# BAB 3: Deskripsi Kebutuhan Perangkat Lunak

## 3.1 Kebutuhan Fungsional (KF)
Salin ulang **seluruh Kebutuhan Fungsional (KF)** versi terbaru dari BAB 2.1 dokumen *Class Diagram* (sudah versi final dan sudah memakai format EARS). Pastikan ID Kebutuhan (kolom "ID Kebutuhan") juga konsisten dengan ID pada tabel Pemetaan Kebutuhan di dokumen *Requirement Gathering*.

Tabel 3.1. Kebutuhan Fungsional

| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| KF01 | R01 | Perangkat lunak dapat menampilkan halaman utama berisi daftar kategori dan jasa yang tersedia ketika pelanggan membuka aplikasi. |
| KF02 | R03 | Perangkat lunak harus menyediakan fitur pemesanan jasa yang dapat digunakan pelanggan untuk memilih dan memesan jasa yang diinginkan. |
| KF03 | R05 | Perangkat lunak harus menampilkan lokasi (dalam bentuk peta) pemberi jasa beserta informasi jarak dari posisi pelanggan saat ini. |
| KF04 | R07 | Perangkat lunak harus menyediakan formulir pendaftaran bagi pemberi jasa untuk mengisi data diri dan jenis jasa yang akan ditawarkan. |
| KF05 | R09 | Perangkat lunak harus menyimpan seluruh data pemberi jasa yang telah mendaftar ke dalam basis data. |
| KF06 | R10 | Perangkat lunak harus menampilkan notifikasi pesanan yang masuk pada tampilan pemberi jasa agar dapat segera ditanggapi. |
| KF07 | R11 | Perangkat lunak membatalkan pesanan secara otomatis apabila pemberi jasa tidak menerima pesanan dalam rentang waktu 30 menit sejak notifikasi dikirim. |
| KF08 | R13 | Perangkat lunak menampilkan halaman detail yang memuat informasi lengkap mengenai jasa dan lokasi pemberi jasa kepada pelanggan. |
| KF09 | R15 | Perangkat lunak harus menyediakan fitur komunikasi antara pemberi jasa dan pelanggan untuk keperluan negosiasi harga sebelum pekerjaan dimulai. |
| KF10 | R18 | Perangkat lunak harus menyediakan form input bagi pelanggan untuk memasukkan detail kesepakatan pekerjaan dan harga yang telah disetujui bersama. |
| KF11 | R19 | Perangkat lunak harus menerima input kesepakatan pekerjaan dan harga, lalu mengubah status pekerjaan secara otomatis menjadi 'On Process'. |
| KF12 | R20 | Perangkat lunak harus menyediakan tombol atau fitur bagi pemberi jasa untuk melaporkan kepada pelanggan bahwa pekerjaan telah selesai dilaksanakan. |
| KF13 | R21 | Perangkat lunak harus menyediakan tombol konfirmasi bagi pelanggan untuk menerima laporan penyelesaian, melakukan pembayaran, dan mengubah status pekerjaan menjadi 'Done'. |
| KF14 | R23 | Perangkat lunak harus menyediakan fitur bagi pelanggan untuk melaporkan masalah yang dialami selama proses penggunaan jasa kepada layanan pengguna. |
| KF15 | R24 | Perangkat lunak harus membuat tiket laporan secara otomatis dan menyediakan ruang komunikasi antara pelanggan dan layanan pengguna untuk penyelesaian masalah. |
| KF16 | R25 | Perangkat lunak harus menyediakan fitur bagi pemberi jasa untuk melaporkan masalah yang dialami selama proses pengerjaan jasa kepada layanan pengguna. |
| KF17 | R26 | Perangkat lunak membuat tiket laporan secara otomatis dan menyediakan ruang komunikasi antara pemberi jasa dan layanan pengguna untuk penyelesaian masalah. |
| KF18 | R27 | Perangkat lunak harus mengirimkan notifikasi kepada layanan pelanggan setiap kali ada tiket laporan baru yang masuk dari pelanggan maupun pemberi jasa. |
| KF19 | R29 | Perangkat lunak harus menyediakan fitur penilaian dua arah yang memungkinkan pelanggan dan pemberi jasa saling memberikan rating setelah pekerjaan selesai. |
| KF20 | R31 | Perangkat lunak harus menyimpan data rating yang diberikan, mengakumulasikan seluruh nilai, dan menghitung rata-rata rating untuk ditampilkan pada profil masing-masing pengguna. |
| KF21 | R07 | Perangkat lunak menyediakan fitur pendaftaran dan login pada aplikasi untuk pelanggan, pemberi jasa, serta layanan pelanggan |

## 3.2 Kebutuhan Non-Fungsional (KNF)
Salin ulang Kebutuhan Non-Fungsional dari BAB 2.5 dokumen *Requirement Gathering*, sesuaikan ID Kebutuhan (kolom "ID Kebutuhan") apabila terjadi perubahan penomoran pada BAB 3.1 di atas.

Tabel 3.2. Kebutuhan Non-Fungsional

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R03* | *Reliability* | *Proses transaksi pembayaran harus memenuhi prinsip ACID untuk mencegah terjadinya data tersangkut (lost update) apabila terjadi kegagalan jaringan di tengah proses.* |
| *KNF02* | *R04* | *Security* | *Sistem harus mengenkripsi PIN atau password pengguna menggunakan algoritma SHA-256 sebelum data dikirimkan ke server, serta tidak menyimpannya dalam bentuk plain-text di database.* |
| *...* | *...* | *...* | *...* |


---

# BAB 4: Pemodelan Use Case

## 4.1 Identifikasi Aktor
Salin ulang daftar aktor final dari BAB 3.1 dokumen *Use Case & Scenario Use Case* atau *Class Diagram*. Tambahkan ID Aktor mengikuti Aturan Penomoran pada 1.4.

| ID Aktor | Aktor | Deskripsi |
| :--- | :--- | :--- |
| A01 | Pemberi Jasa | Pengguna ini bertindak sebagai pihak penyedia jasa yang menerima pesanan, melakukan pekerjaan fisik di lokasi pelanggan, dan menyelesaikan tugas sesuai dengan persetujuannya dengan pelanggan.  |
| A02 | Pelanggan | Pengguna ini berperan sebagai pihak yang memerlukan, memesan, dan membayar layanan jasa kasar. |
| A03 | Layanan Pelanggan | Pengguna ini sebagai pihak yang berjaga jaga apabila terdapat sebuah masalah pada sistem atau masalah pada pengguna lain |

## 4.2 Identifikasi Use Case
| ID UC | Nama Use Case | Deskripsi Singkat | Aktor | ID KF |
| :--- | :--- | :--- | :--- | :--- |
| UC01 | Mendaftarkan jasa | Pemberi jasa mendaftarkan diri pada aplikasi terkait jasa yang akan diberikan | Pemberi jasa | KF04, KF05 |
| UC02 | Memilih jasa | Pelanggan memilih jasa yang tersedia dan sesuai dengan kebutuhannya | Pelanggan | KF01 |
| UC03 | Menghubungi pemberi jasa  | Pelanggan mengirimkan pesan kepada pemberi jasa mengenai detail pekerjaannya dan harga awal yang ditawarkan | Pelanggan | KF09 |
| UC04 | Merespon pelanggan | Pemberi jasa merespon pelanggan, bisa berupa tawaran harga lain, menyetujui, atau menolak tawaran dari pelanggan  | Pemberi jasa | KF09 |
| UC05 | Memasukkan kesepakatan harga dan pekerjaan | Pelanggan memasukkan detail kesepakatan harga dan pekerjaan kepada aplikasi dan aplikasi merubah status pekerjaan menjadi 'On Progress'  | Pelanggan | KF10, KF11 |
| UC06 | Mengubah status pekerjaan menjadi selesai  | Pemberi jasa menekan tombol atau fitur lainnya pada aplikasi bahwa pekerjaan telah selesai dan menunggu konfirmasi dari pelanggan | Pemberi jasa | KF12 |
| UC07 | Mengonfirmasi status pekerjaan  | Pelanggan mengonfirmasi pemberi jasa mengenai status pekerjaan | Pelanggan | KF13 |
| UC08 | Melaporkan masalah  | Pelanggan dan pemberi jasa melaporkan ketika ada masalah kepada layanan pelanggan saat proses penggunaan jasa| Pelanggan, Pemberi jasa | KF14, KF15 |
| UC09 | Merespon laporan masalah  | Layanan pengguna merespon masalah yang diajukan pelanggan atau pemberi masalah | Layanan Pelanggan, Pelanggan, Pemberi jasa | KF15, KF18, KF17 |
| UC10 | Memberi rating  | Pelanggan dan pemberi jasa saling memberi rating satu sama lain | Pelanggan, Pemberi jasa | KF19, KF20 |
| UC11 | Memasuki akun dalam perangkat lunak  | Layanan pelanggan, pelanggan, pemberi jasa masuk ke perangkat lunak dengan akun yang sudah ada | Pelanggan, Pemberi Jasa, Layanan Pelanggan | KF21 |
| UC12 | Mendaftar akun ke perangkat lunak  | Pelanggan dan pemberi jasa dapat mendaftar ke perangkat lunak | Pelanggan, Pemberi Jasa, | KF21 |

## 4.3 Use Case Diagram
<br>
<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/USE-CASE-DIAGRAM.png" width="70%">
</p>
<p align="center">
<i>Gambar 2. Use Case Diagram</i>
</p>
<br>

## 4.4 Skenario Use Case

### 4.4.1 Skenario UC01

**Nama Use Case:** *Mendaftarkan jasa*

**Skenario Normal**

| No | Aksi Aktor (pemberi jasa) | Perangkat Lunak |
| :--- | :--- | :--- | 
| 1 | *Pemberi jasa menekan tombol daftar jasa* | *Sistem menampilkan formulir untuk mendaftarkan jasa* |
| 2 | *Pemberi jasa mengisi formulir* | |
| 3 | *Pemberi jasa mengunggah formulir pendaftaran jasa* | *Sistem memverifikasi data yang dikirimkan dan memperbarui data pemberi jasa* |


<br>

**Skenario Alternatif 1: Verifikasi Input Gagal**


| No | Aksi Aktor (pemberi jasa) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- | 
| 1 | *Pemberi jasa menekan tombol daftar jasa dan mengisi formulir (pemberi jasa)* | *Sistem menampilkan formulir untuk mendaftarkan jasa* |
| 2 | *Pemberi jasa mengisi formulir* | |
| 3 | *Pemberi jasa mengunggah formulir pendaftaran jasa* | *Sistem memverifikasi data yang dikirimkan dan menerima verifikasi gagal* |
| 4 | *Pemberi jasa mengisi formulir ulang* | *(1) Sistem menandai field atau jawaban yang salah, (2) sistem memberi error message pada field tersebut, (3) sistem kembali kepada field tersebut* |

### 4.4.2 Skenario UC02

**Nama Use Case:** *Memilih jasa*

**Skenario Normal**

| No | Aksi Aktor (pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- | 
| 1 | *Pelanggan menekan tombol menu untuk mencari jasa* | *Sistem menampilkan daftar jasa yang tersedia* |
| 2 | *Pelanggan menekan jasa yang ingin dipesan* | *Sistem menampilkan peta yang menunjukkan lokasi dari pemberi jasa* |
| 3 | *Pelanggan me-klik pemberi jasa yang tersedia* | *Sistem menampilkan informasi mengenai pemberi jasa* |
| 4 | *Pelanggan menekan tombol chat* | *Sistem menampilkan kanal komunikasi antara pelanggan dan pemberi jasa* |


<br>

**Skenario Alternatif 1: Pemberi jasa tidak ditemukan**

| No | Aksi Aktor (pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- | 
| 1 | *Pelanggan menekan tombol menu untuk mencari jasa* | *Sistem menampilkan daftar jasa yang tersedia* |
| 2 | *Pelanggan memilih jasa yang ingin dipesan* | *Sistem menampilkan pesan "Tidak ada yang sedang bersedia untuk memberi jasa ini" |
| 3 | *Pelanggan memilih ulang jasa yang ingin dipesan* | *Sistem kembali menampilkan daftar jasa yang tersedia* |
| 4 | *Pelanggan menekan jasa yang ingin dipesan* | *Sistem menampilkan peta yang menunjukkan lokasi dari pemberi jasa* |
| 5 | *Pelanggan me-klik pemberi jasa yang tersedia* | *Sistem menampilkan informasi mengenai pemberi jasa* |
| 6 | *Pelanggan menekan tombol chat* | *Sistem menampilkan kanal komunikasi antara pelanggan dan pemberi jasa* |

### 4.4.3 Skenario UC03

**Nama Use Case: Menghubungi Pemberi jasa**

**Skenario Normal**

| No | Aksi Aktor (pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pelanggan mengirimkan penawaran pekerjaan dan harga kepada pemberi jasa* | *Sistem mengirimkan pesan kepada pemberi jasa* |

<br>

**Skenario Alternatif 1: Pesan tidak terkirim ke pemberi jasa**

| No | Aksi Aktor (pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pelanggan mengirimkan penawaran pekerjaan dan harga kepada pemberi jasa* | *(1)Sistem gagal mengirimkan pesan kepada pemberi jasa, (2) Sistem mengirimkan error message berupa "Pesan tidak terkirim"* |
| 2 | *Pelanggan kembali mengirim penawaran* | *Sistem kembali mencoba mengirim pesan kepada pemberi jasa*|

### 4.4.4 Skenario UC04

**Nama Use Case: Merespon Pelanggan**

**Skenario Normal**
| No | Aksi Aktor (pemberi jasa) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pemberi jasa menerima pesan yang dikirimkan pelanggan* | *Sistem menampilkan pesan yang dikirim pelanggan kepada pemberi jasa* |
| 2 | *Pemberi jasa merespon pesan yang dikirimkan pelanggan* | *Sistem mengirimkan pesan kepada pelanggan* |

**Skenario Alternatif 1: Pesan tidak terkirim ke pelanggan**
| No | Aksi Aktor (pemberi jasa) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pemberi jasa mengirimkan resspon kepada pelanggan* | *(1) Sistem gagal mengirimkan pesan kepada pelanggan, (2) Sistem mengirimkan error message berupa "Pesan tidak terkirim"* |
| 2 | *Pemberi kembali mengirim penawaran* | *Sistem kembali mencoba mengirim pesan kepada pelanggan* |


### 4.4.5 Skenario UC05

**Nama Use Case:** Pelanggan memasukkan kesepakatan harga dan pekerjaan

**Skenario Normal**

| No | Aksi Aktor(Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pelanggan menekan tombol kesepakatan | Sistem menampilkan bagian form pengisian detail harga dan pekerjaan |
| 2 | Pelanggan mengisi form kesepakatan hingga selesai | Sistem menyimpan data kesepakatan dan membuat status pekerjaan menjadi "on progress" |

<br>


### 4.4.6 Skenario UC06

**Nama Use Case:** Pemberi jasa telah selesai bekerja

**Skenario Normal**

| No | Aksi Aktor (Pemberi jasa) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pemberi jasa menekan bagian pekerjaan | Sistem menampilkan detail pekerjaan yang sedang dilakukan (pembayaran dan jenis pekerjaan) |
| 2 | Pemberi jasa menekan tombol pekerjaan telah selesai | Sistem mengubah status pekerjaan "on progress" menjadi "menunggu konfirmasi Pelanggan" |

<br>

### 4.4.7 Skenario UC07

**Nama Use Case:** 	Pelanggan mengonfirmasi pekerjaan

**Skenario Normal**

| No | Aksi Aktor (Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pelanggan menekan tombol pekerjaan | Sistem menampilkan detail pekerjaan |
| 2 | Pelanggan menekan tombol konfirmasi pekerjaan | Sistem mengubah status pekerjaan menjadi selesai |

<br>

### 4.4.8 Skenario UC08

**Nama Use Case:** Pelanggan dan pemberi jasa melaporkan masalah

**Skenario Normal**

| No | Aksi Aktor (Pelanggan dan Pemberi jasa) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pemberi jasa atau pelanggan menekan tombol bantuan layanan pengguna | Sistem menampilkan form tiket pengajuan bantuan |
| 2 | Pemberi jasa atau pelanggan mengisi form dengan kriteria yang tertera di form | Sistem mencatat semua data dari form yang diisi |
| 3 | Pemberi jasa atau pelanggan menekan tombol kirim pada bagian bawah form yang sudah diisi tadi | Sistem mengirim form yang telah diisi tadi ke layanan pengguna |

<br>

### 4.4.9 Skenario UC9
**Nama Use Case:** Layanan pelanggan merespon pelanggan

**Skenario Normal**

| No | Aksi Aktor (Layanan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Layanan Pelanggan menerima sebuah notifikasi dan membuka notifikasi tersebut | Sistem menampilkan tiket layanan yang telah diisi oleh penyedia jasa |
| 2 | Layanan Pelanggan mengisi form balasan terkait masalah yang dihadapi oleh penyedia jasa | Sistem menyimpan data dari form yang diisi oleh layanan pelanggan |
| 3 | Layanan Pelanggan mengirim form yang telah diisi tadi | Sistem mengirim form yang telah diisi oleh layanan pelanggan dan memberikan notifikasi kepada penyedia jasa yang melaporkan masalahnya |

<br>

### 4.4.10 Skenario UC10
**Nama Use Case:** Pemberi jasa dan pelanggan saling memberi rating

**Skenario Normal**

| No | Aksi Aktor (Penyedia jasa dan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Penyedia Jasa maupun pelanggan mengisi sebuah form berbentuk popup yang muncul ketika penyedia jasa telah mengonfirmasi bahwa biaya jasa telah dibayarkan | Sistem menyimpan data dari rating yang diisi pengguna |
| 2 | Penyedia jasa maupun pelanggan menekan tombol kirim | Sistem menyimpan data di dalam database |

<br>

**Skenario Alternatif 1: Penyedia Jasa atau pengguna menutup popup yang telah dimunculkan atau menutup aplikasi setelah proses transaksi selesai**

| No | Aksi Aktor (Penyedia jasa dan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penyedia Jasa maupun pelanggan menekan tombol close pada popup yang telah dimunculkan atau menutup aplikasi* | *Sistem menutup popup dan menampilkannya kembali pada halaman aktivitas/riwayat pesanan* |

<br>

### 4.4.11 Skenario UC11
**Nama Use Case:** Memasuki akun dalam perangkat lunak

**Skenario Normal**

| No | Aksi Aktor (Layanan Pelanggan, Penyedia jasa, dan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Layanan pelanggan, pelanggan dan pemberi jasa mengisi email dan password jika sudah memiliki akun | Sistem menyimpan data yang diinput pengguna kemudian mencocokan data tersebut dari data base |
| 2 | Layanan pelanggan, pelanggan dan pemberi jasa mengklik tombol masuk | Sistem memvalidasi email dan password yang diisi dan mendirect ke dashboard aplikasi |

<br>

**Skenario Alternatif 1: verifikasi data login yang invalid**

| No | Aksi Aktor (Layanan Pelanggan, Penyedia jasa, dan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Layanan pelanggan, pelanggan dan pemberi jasa mengisi email dan password jika sudah memiliki akun | Sistem menyimpan data yang diinput pengguna kemudian mencocokan data tersebut dari data base |
| 2 | Layanan pelanggan, pelanggan dan pemberi jasa mengklik tombol masuk | Sistem memvalidasi email dan password yang diisi dan terdapat kesalahan password atau email yang dimasukan pengguna kemudian Sistem memberikan notifikasi di laman bahwa password atau email salah |

<br>

### 4.4.12 Skenario UC12
**Nama Use Case:** Mendaftar akun ke perangkat lunak

**Skenario Normal**

| No | Aksi Aktor (Penyedia jasa dan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pelanggan dan pemberi jasa mengklik daftar  | Sistem mendirect laman aplikasi ke laman daftar |
| 2 | Pelanggan dan pemberi jasa mengisi form kebutuhan yang dibutuhkan untuk membuat akun | Sistem menyimpan semua data yang diisi oleh pengguna kemudian memberikan notifikasi ke layanan peanggan untuk memverifikasi data pengguna |
| 3 | Layanan pelanggan memverifikasi data penting pengguna apakah sudah dipakai atau belum dan mengecek validitas dari data tersebut | Sistem notifiikasi dan data yang akan diverifikasi oleh layanan pelanggan |

<br>

**Skenario Alternatif 1: verifikasi data yng invalid pada daftar**

| No | Aksi Aktor (Penyedia jasa dan Pelanggan) | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pelanggan dan pemberi jasa mengklik daftar  | Sistem mendirect laman aplikasi ke laman daftar |
| 2 | Pelanggan dan pemberi jasa mengisi form kebutuhan yang dibutuhkan untuk membuat akun | Sistem menyimpan semua data yang diisi oleh pengguna kemudian memberikan notifikasi ke layanan peanggan untuk memverifikasi data pengguna |
| 3 | Layanan pelanggan memverifikasi data penting pengguna apakah sudah dipakai atau belum dan mengecek validitas dari data tersebut | Sistem notifiikasi dan data yang akan diverifikasi oleh layanan pelanggan |
| 4 | Layanan pelanggan menemukan kejanggalan pada data pengguna yang baru diinput seperti ktp orang yang tidak cocok dengan nama pengguna dll, kemudian layanan pelanggan membuat sebuah laporan terkait data yang invalid kepada pengguna | Sistem memberikan sebuah notifikasi dan laporan dari layanan pelanggan kepada pengguna yang memiliki data yang invalid |

<br>
---

# BAB 5: Pemodelan Kelas

## 5.1 Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas | ID Use Case |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan | UC10, UC11, UC12 |
| C02 | PenggunaUI | Kelas yang mengatur penampilkan halaman pengguna  | UC10, UC11, UC12 |
| C03 | PenggunaController | Kelas yang mengatur logika program untuk pengguna | UC10, UC11, UC12 |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C05 | PemberiJasaUI | Kelas yang mengatur penampilan halaman pemberi jasa | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C06 | PemberiJasaController | Kelas yang mengatur logika program untuk pemberi jasa | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C08 | PelangganUI | Kelas yang mengatur penampilan halaman pelanggan | UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C09 | PelangganController | Kelas yang mengatur logika program pelanggan | UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C10 | LayananPelanggan | Bertanggung jawab dalam proses merespon tiket masalah atau laporan dari pemberi jasa dan pelanggan  | UC09 |
| C11 | LayananPelangganUI | Kelas yang mengatur penampilan halaman pengguna  | UC09 |
| C12 | LayananPelangganController | Kelas yang mengatur logika program untuk pengguna  | UC09 |
| C13 | KategoriJasa | Menyimpan data spesifik jasa yang ditawarkan oleh PemberiJasa | UC01, UC02 |
| C14 | KategoriJasaUI | Kelas yang mengatur penampilan halaman pada kategori jasa | UC01, UC02 |
| C15 | KategoriJasaController | Kelas yang mengatur logika program kategori jasa | UC01, UC02 |
| C16 | KontrakPekerjaan | Menyimpan data detail kesepakatan antara Pelanggan dan PemberiJasa, seperti harga, detail pekerjaan, status pekerjaan (On Progress/Done) | UC05, UC06, UC07, UC10 |
| C17 | KontrakPekerjaanUI | Kelas yang mengatur penampilan halaman pada kelas kontrak pekerjaan | UC05, UC06, UC07, UC10 |
| C18 | KontrakPekerjaanController | Kelas yang mengatur logika program kontrak pekerjaan | UC05, UC06, UC07, UC10 |
| C19 | Komunikasi | Merealisasikan fitur komunikasi | UC03, UC04, UC09|
| C20 | KomunikasiUI | Kelas yang mengatur penampilan halaman pada halaman komunikasi | UC03, UC04, UC09|
| C21 | KomunikasiController | Kelas yang mengatur logika program komunikasi | UC03, UC04, UC09|
| C22 | TiketLaporan | Merealisasikan fitur tiket antrian dari laporan yang diberikan Pelanggan dan PemberiJasa | UC08, UC09|
| C23 | TiketLaporanUI | Kelas yang mengatur penampilan halaman pada halaman tiket laporan | UC08, UC09|
| C24 | TiketLaporanController | Kelas yang mengatur logika program tiket laporan | UC08, UC09|
| C25 | Rating | Merealisasikan fitur rating | UC10 |
| C26 | RatingUI | Kelas yang mengatur penampilan halaman rating | UC10 |
| C27 | RatingController | Kelas yang mengatur logika program rating | UC10 |
| C28 | Notifikasi | Merealisasikan fitur notifikasi yang akan diberikan kepada PemberiJasa ketika jasanya dipesan | UC08, UC09 |
| C29 | NotifikasiUI | Kelas yang mengatur penampilan halaman notifikasi | UC08, UC09 |
| C30 | NotifikasiController | Kelas yang mengatur logika program notifikasi | UC08, UC09 |

## 5.2 Diagram Kelas per Use Case
Salin ulang diagram kelas untuk setiap use case dari BAB 4.2 dokumen *Class Diagram*, lengkap dengan tabel atribut dan metode/operasinya.

### 5.2.1 Use Case UC01

**Nama Use Case:** *Mendaftarkan Jasa*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *PemberiJasa* | *Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian* |
| *C13* | *Database* | *Tempat penyimpanan data perangkat lunak* |
| *C30* | *FormJasaController* | *Mengatur pengisian formulir untuk jenis jasa* |
| *C31* | *FormJasaUI* | *Menampilkan formulir jenis jasa ke layar* |


#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/Diagram-Class-UC01.jpeg" width="70%">
</p>
<p align="center">
<i>Gambar 3. Diagram Kelas Use Case UC01</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *PemberiJasa* | *jenisJasa* | *-* |
| *C13* | *Database* | *-* | *simpanJasa()* |
| *C30* | *FormJasaController* | *databaseHandler* | *+isiJenisJasa(), +sendJasaToDatabase()* |
| *C31* | *FormJasaUI* | *-* | *+tampilkanFormJasa()* |


### 5.2.2 Use Case UC02

**Nama Use Case:** *Memilih jasa*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *PemberiJasa* | *Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian* |
| *C03* | *Pelanggan* | *Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan* |
| *C10* | *NotifikasiController* | *Mengatur pengiriman notifikasi kepada pemberi jasa atau pengguna* |
| *C13* | *Database* | *tempat penyimpanan data perangkat lunak* |
| *C15* | *NotifikasiUI* | *Menampilkan notifikasi pada layar pemberi jasa atau pengguna* | 
| *C17* | *ListJasaController* | *Mengatur pengambilan data list jasa yang tersedia* |
| *C18* | *ListJasaUI* | *Menampilkan daftar jenis jasa yang tersedia ke layar* |
| *C34* | *Notifikasi* | *Menyimpan data notifikasi* |


#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/Diagram-Class-UC02.jpeg" width="70%">
</p>
<p align="center">
<i>Gambar 4. Diagram Kelas Use Case UC02</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *PemberiJasa* | *jenisJasa* | *-* |
| *C03* | *Pelanggan* | *-* | *-* |
| *C13* | *Database* | *databaseHandler* | |
| *C15* | *NotifikasiUI | *-playSound(), -stopSound(), +showNotifikasi(), closeNotifikasi()* |
| *C17* | *ListJasaController* | *databaseHandler* | *+getListJasa()* |
| *C18* | *ListJasaUI* | - | *+showListJasa()* |
| *C34* | *Notifikasi* | *idPengguna, idChat, idNotifikasi, statusNotifikasi, durasiNotifikasi, teksNotifikasi, sound* | *-* |

### 5.2.3 Use Case UC03

**Nama Use Case:** *Menghubungi Pemberi Jasa*

### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C03* | *Pelanggan* | *Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan* |
| *C13* | *Database* | *Tempat penyimpanan data perangkat lunak* |
| *C07* | *Komunikasi* | *Menyimpan data-data yang diperlukan mengenai pesan yang dikirim atau kanal yang diinisiasi* |
| *C28* | *KomunikasiController* | *Mengontrol jalannya komunikasi antarpengguna* |
| *C29* | *KomunikasiUI* | *Menampilkan pesan yang dikirim pengguna* |


#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/Diagram-Class-UC03.jpeg" width="70%">
</p>
<p align="center">
<i>Gambar 5. Diagram Kelas Use Case UC03</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C03* | *Pelanggan* | *idPengguna* | *+getUserId(), +bukaLamanKomunikasi()* |
| *C13* | *Database* | *databaseHandler* | *+getPesan(), +savePesan()* |
| *C07* | *Komunikasi* | *-* |
| *C28* | *KomunikasiController* | *databaseHandler* | *+lihatPesan()<br>+kirimPesan()<br>+ubahStatus()<br>+bukaTutupChat()<br>+sendChatToDatabase()* |
| C29 | *KomunikasiUI* | - | *tampilkanPesan*() |


### 5.2.4 Use Case UC04
**Nama Use Case:** Merespon Pelanggan


#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *PemberiJasa* | *Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan* |
| *C13* | *Database* | *Tempat penyimpanan data perangkat lunak* |
| *C07* | *Komunikasi* | *Menyimpan data-data yang diperlukan mengenai pesan yang dikirim atau kanal yang diinisiasi* |
| *C28* | *KomunikasiController* | *Mengontrol jalannya komunikasi antarpengguna* |
| *C29* | *KomunikasiUI* | *Menampilkan pesan yang dikirim pengguna* |


#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/Diagram-Class-UC04.jpeg" width="70%">
</p>
<p align="center">
<i>Gambar 6. Diagram Kelas Use Case UC04</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C04* | *Pelanggan* | *idPengguna* | *+getUserId(), +bukaLamanKomunikasi()* |
| *C13* | *Database* | *databaseHandler* | *+getPesan(), +savePesan()* |
| *C07* | *Komunikasi* | *-* |
| *C28* | *KomunikasiController* | *databaseHandler* | *+lihatPesan()<br>+kirimPesan()<br>+ubahStatus()<br>+bukaTutupChat()<br>+sendChatToDatabase()* |
| C29 | *KomunikasiUI* | - | *tampilkanPesan*() |


### 5.2.5 Use Case UC05
**Nama Use Case:** Pelanggan memasukkan kesepakatan harga dan pekerjaan


#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C03 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan |
| C06 | KontrakPekerjaan | Menyimpan data detail kesepakatan antara Pelanggan dan PemberiJasa, seperti harga, detail pekerjaan, status pekerjaan (On Progress/Done)|
| C13 | Database | Tempat penyimpanan data perangkat lunak|
| C23 | FormKontrakUI | Menampilkan form pengisian kontrak pekerjaan |
| C25 | KontrakPekerjaanController | Menjembatani antara KontrakPekerjaan dengan FormKontrakUI dan FormPekerjaanUI serta database |

#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC10" src="./assets/diagram/Diagram-Class-UC05.png" width="70%">
</p>
<p align="center">
<i>Gambar 7. Diagram Kelas Use Case UC05</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C03 | Pelanggan | - | - |
| C06 | KontrakPekerjaan | detailPekerjaan, persetujuanHarga, idKontrak, statusPekerjaan | +simpanBayaran() +updateStatus() |
| C13 | Database | databaseHandler | +saveDataKontrak() |
| C23 | FormKontrakUI | inputHarga inputDetailPekerjaan | +tampilkanForm() |
| C25 | KontrakPekerjaanController | databaseHandler | +buatKontrak() +validasiData() +simpanData() +ubahStatus() +simpanDatabase |

### 5.2.6 Use Case UC06
**Nama Use Case:** Pemberi jasa telah selesai bekerja


#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan | 


#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC10" src="./assets/diagram/Diagram-Class-UC06.png" width="70%">
</p>
<p align="center">
<i>Gambar 8. Diagram Kelas Use Case UC06</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C03 | PemberiJasa | - | - |
| C06 | KontrakPekerjaan | detailPekerjaan, persetujuanHarga, idKontrak, statusPekerjaan | +simpanBayaran() +simpanDatabase() +updateStatus() |
| C13 | Database | databaseHandler | +getDataKontrak() |
| C23 | FormPekerjaanUI | inputHarga inputDetailPekerjaan | +tampilkanForm() |
| C25 | KontrakPekerjaanController | databaseHandler | +buatKontrak() +validasiData() +simpanData() +ubahStatus() +simpanDatabase() |


### 5.2.7 Use Case UC7
**Nama Use Case:** Pelanggan mengonfirmasi pekerjaan

#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C03 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan |
| C06 | KontrakPekerjaan | Menyimpan data detail kesepakatan antara Pelanggan dan PemberiJasa, seperti harga, detail pekerjaan, status pekerjaan (On Progress/Done) |
| C13 | Database | Tempat penyimpanan data perangkat lunak |
| C25 | KontrakPekerjaanController | Menjembatani KontrakPekerjaanUI, database, dan KontrakPekerjaan (status) |
| C26 | KontrakPekerjaanUI | Halaman ketika pekerjaan sudah selesai |


#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC07" src="./assets/diagram/Diagram-Class-UseCase07.jpeg" width="70%">
</p>
<p align="center">
<i>Gambar 9. Diagram Kelas Use Case UC07</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C03 | Pelanggan | idPelanggan | - |
| C06 | KontrakPekerjaan | detailPekerjaan, persetujuanHarga, idKontrak, statusPekerjaan | simpanBayaran()<br>simpanDatabase()<br>updateStatus() |
| C13 | Database | riwayatPekerjaan | +simpanriwayat() |
| C25 | KontrakPekerjaanController | databaseHandler | -buatKontrak()<br>-validasiData()<br>-simpanData()<br>-ubahStatus() |
| C26 | KontrakPekerjaanUI | - | +showkontrakpekerjaan() |

### 5.2.8 Use Case UC8
**Nama Use Case:** Pelanggan dan pemberi jasa melaporkan masalah

#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan |
| C02 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian |
| C03 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan |
| C08 | TiketLaporan | Merealisasikan fitur tiket antrian dari laporan yang diberikan Pelanggan dan PemberiJasa |
| C21 | FormTiket | Menyimpan data form pengajuan tiket laporan yang diisi pengguna sebelum menjadi TiketLaporan resmi |
| C22 | FormTiketUI | Halaman tampilan form pengisian tiket laporan |
| C27 | FormTiketController | Menjembatani FormTiketUI, FormTiket, dan TiketLaporan |



#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC08" src="./assets/diagram/Diagram-Class-UseCase08.png" width="70%">
</p>
<p align="center">
<i>Gambar 10. Diagram Kelas Use Case UC08</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | idPengguna, email, noTelpon | - |
| C02 | PemberiJasa | jenisJasa | - |
| C03 | Pelanggan | - | - |
| C08 | TiketLaporan | idTiket, idTugas | +simpanantrean() |
| C21 | FormTiket | idTiket, idPengguna, jenisTiket, keteranganTiket, tanggalTiket | - |
| C22 | FormTiketUI | - | +tampilkanTiket() |
| C27 | FormTiketController | databaseHandler | +buatTiket()<br>+balasTiket()<br>+tutupTiket() |


### 5.2.9 Use Case UC9
**Nama Use Case:** Layanan pelanggan merespon pelanggan

#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan |
| C02 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan |
| C03 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, melaporkan masalah, dan memberikan rating kepada pemberi jasa |
| C04 | LayananPelanggan | Bertanggung jawab dalam proses merespon tiket masalah atau laporan dari pemberi jasa dan pelanggan |
| C07 | Komunikasi | Merealisasikan fitur chat langsung antara Pelanggan, PemberiJasa, ataupun LayananPelanggan |
| C27 | FormTiketController | Menjembatani FormTiketUI, FormTiket, TiketLaporan, dan Notifikasi |
| C33 | TiketLaporanController | Menjebatani ke FormTiketLaporan |

#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC09" src="./assets/diagram/Diagram-Class-UseCase09.jpeg" width="70%">
</p>
<p align="center">
<i>Gambar 11. Diagram Kelas Use Case UC09</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | idPengguna | - |
| C02 | PemberiJasa | jenisJasa | - |
| C03 | Pelanggan | - | - |
| C04 | LayananPelanggan | idLayananPelanggan | - |
| C07 | Komunikasi | idChat, idPengguna, waktuTerkirim, isChatTerbaca,  statusChat, durasiChat | - |
| C33 | TiketLaporanController | databasehandler, idTiket | +getTiketLaporan()<br>+teruskanKeFormTiket( |
| C27 | FormTiketController | databaseHandler | +buatTiket()<br>+balasTiket()<br>+tutupTiket() |

### 5.2.10 Use Case UC10
**Nama Use Case:** Memberi rating


#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan | 
| C02 | PenggunaUI | Kelas yang mengatur penampilkan halaman pengguna  | 
| C03 | PenggunaController | Kelas yang mengatur logika program untuk pengguna | 
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C25 | Rating | Merealisasikan fitur rating |
| C26 | RatingUI | Kelas yang mengatur penampilan halaman rating |
| C27 | RatingController | Kelas yang mengatur logika program rating |



#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC10" src="./assets/diagram/Diagram-kelas-UC10.png?v=1" width="60%">
</p>
<p align="center">
<i>Gambar 12. Diagram Kelas Use Case UC10</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | idPenggguna<br>nomorTelpon <br>email<br>namaPengguna<br>username<br>password <br>akumulasiRating<br>riwayatRating | +getAkumulasiRating()<br>+getRiwayatRating()<br>+addNewRatingRiwayat()<br>+getPekerjaanSelesai() |
| C02 | PenggunaUI | - | +showDaftarPekerjaanSelesai()<br>+pressBeriRating() |
| C03 | PenggunaController | - | +requestPekerjaanSelesai()<br>|
| C04 | PemberiJasa | jenisJasa | - |
| C07 | Pelanggan | - | - |
| C25 | Rating | idPenggunaPemberi<br>idPenggunaPenerima<br>idRating<br>idKontrakPekerjaan<br>nilaiRating<br>tanggalRating | +getIdPemberi()<br>+getIdPenerima()<br>+getIdKontrakPekerjaan()<br>+getIdRating()<br>+getRatingValue()<br>+updateRatingPengguna() | 
| C26 | RatingUI | | +tampilkanRatingForm()<br>+tampilkanHasilRating()<br>+pressJumlahBintang()<br>+pressSubmitRating()<br>+pressBatalRating()|
| C27 | RatingController | - | +saveRating()<br>+validateRatingValue() |

### 5.2.11 Use Case UC11
**Nama Use Case:** Memasuki akun dalam perangkat lunak

#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C05 | PemberiJasaUI | Kelas yang mengatur penampilan halaman pemberi jasa | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C06 | PemberiJasaController | Kelas yang mengatur logika program untuk pemberi jasa | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 |
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C08 | PelangganUI | Kelas yang mengatur penampilan halaman pelanggan | UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C09 | PelangganController | Kelas yang mengatur logika program pelanggan | UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 |
| C10 | LayananPelanggan | Bertanggung jawab dalam proses merespon tiket masalah atau laporan dari pemberi jasa dan pelanggan  | UC09 |
| C11 | LayananPelangganUI | Kelas yang mengatur penampilan halaman pengguna  | UC09 |
| C12 | LayananPelangganController | Kelas yang mengatur logika program untuk pengguna  | UC09 |



#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC11" src="./assets/diagram/Diagram-kelas-UC11.png" width="70%">
</p>
<p align="center">
<i>Gambar 13. Diagram Kelas Use Case UC11</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C04 | PemberiJasa | jenisJasa<br>username<br>password | +cekInfoLogin() |
| C05 | PemberiJasaUI | - | +tunjukkanHalamanLogin()<br>+pressLogin()<br>+pindahHalaman() |
| C06 | PemberiJasaController | - | +validasiInput()<br>+triggerQueryLogin() | 
| C07 | Pelanggan | username<br>password | +cekInfoLogin() |
| C08 | PelangganUI | - | +tunjukkanHalamanLogin()<br>+pressLogin()<br>+pindahHalaman() | 
| C09 | PelangganController | - | +validasiInput()<br>+triggerQueryLogin() |
| C10 | LayananPelanggan | username<br>password | +cekInfoLogin() |
| C11 | LayananPelangganUI | - | +tunjukkanHalamanLogin()<br>+pressLogin()<br>+pindahHalaman() |
| C12 | LayananPelangganController | - |+validasiInput()<br>+triggerQueryLogin() | 


### 5.2.12 Use Case UC12
**Nama Use Case:** Mendaftar akun ke perangkat lunak

#### Identifikasi Kelas
| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| C01 | Pengguna | Kelas abstrak yang menyimpan data-data para pengguna aplikasi, seperti pelanggan, pemberi jasa, dan layanan pelanggan |
| C02 | PenggunaUI | Kelas yang mengatur penampilkan halaman pengguna  |
| C03 | PenggunaController | Kelas yang mengatur logika program untuk pengguna |
| C04 | PemberiJasa | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pekerjaan, memberi rating, memberi laporan kepada layanan pelanggan. Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, deskripsi keahlian | 
| C07 | Pelanggan | Turunan dari kelas Pengguna yang bertanggung jawab dalam proses pemesanan jasa, memasukkan input kesepakatan harga dan pekerjaan dan mengonfirmasi selesainya pekerjaan, melaporkan masalah, dan memberikan rating kepada pemberi jasa. Selain itu, menyimpan data akumulasi rating dan data Pelanggan| 



#### Diagram Kelas
<p align="center">
<img alt="Class Diagram UC12" src="./assets/diagram/Diagram-kelas-UC12.png" width="70%">
</p>
<p align="center">
<i>Gambar 14. Diagram Kelas Use Case UC12</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | idPengguna<br>nomorTelpon <br>email<br>namaPengguna <br>username<br>password | +getId()<br>+getNomor()<br>+getEmail()<br>+getNama()<br>+setNomor()<br>+setEmail()<br>+setNama() |
| C02 | PenggunaUI | - | +tampilkanHalamanRegistrasi()<br>+pressRegister() | 
| C03 | PenggunaController | - | +validasiInfoRegistrasi() |
| C04 | PemberiJasa | jenisJasa | +makePemberiJasa() | 
| C07 | Pelanggan  | - | +makePelanggan() |

## 5.3 Diagram Kelas Keseluruhan
<p align="center">
<img alt="Class Diagram Keseluruhan" src="./assets/diagram/class-diagram.png" width="70%">
</p>
<p align="center">
<i>Gambar 15. Diagram Kelas Keseluruhan</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *Pelanggan* | *idPelanggan, nama, email* | *lihatRiwayatPesanan()* |
| *C02* | *Pesanan* | *idPesanan, total, status* | *hitungTotal(), perbaruiStatus()* |
| *C03* | *Keranjang* | *daftarItem* | *tambahItem(), checkout()* |
| *C04* | *MetodePembayaran* | *-* | *kirimKePaymentGatewayDummy()* |
| *C05* | *Kartu* | *nomorKartu, masaBerlaku* | *kirimKePaymentGatewayDummy()* |
| *C06* | *EWallet* | *saldo, idAkun* | *cekSaldo(), kirimKePaymentGatewayDummy()* |
| *C07* | *RiwayatTransaksi* | *idTransaksi, waktu, status* | *catatTransaksi(), tampilkanNotifikasi()* |
| *...* | *...* | *...* | *...* |

---

# BAB 6: Traceability

| ID Kelas | ID Use Case | ID KF |
| :--- | :--- | :--- |
| C01 | UC08, UC10, UC11, UC12 | KF14, KF16, KF19, KF20, KF21 |
| C02 | UC01, UC02, UC04, UC06, UC08, UC10, UC11, UC12 | KF02, KF03, KF04, KF05, KF06, KF07, KF08, KF09, KF12, KF16, KF17, KF19, KF20, KF21 |
| C03 | UC02, UC03, UC05, UC07, UC08, UC10, UC11, UC12 | KF01, KF02, KF03, KF08, KF09, KF10, KF11, KF13, KF14, KF15, KF19, KF20, KF21 |
| C04 | UC09, UC11 | KF15, KF17, KF18, KF21 |
| C05 | UC01, UC02 | KF01, KF02, KF04, KF05, KF08 |
| C06 | UC05, UC06, UC07, UC10 | KF10, KF11, KF12, KF13, KF19 |
| C07 | UC03, UC04, UC09 | KF09, KF15, KF17 |
| C08 | UC08, UC09 | KF14, KF15, KF16, KF17, KF18 |
| C09 | UC10 | KF19, KF20 |
| C10 | UC02, UC04, UC08, UC09 | KF06, KF18 |
| C11 | UC10 | KF19 |
| C12 | UC10 | KF19, KF20 |
| C13 | UC01, UC03, UC07, UC10, UC11, UC12 | KF05, KF09, KF13, KF20, KF21 |
| C14 | UC11 | KF21 |
| C16 | UC11 | KF21 |
| C17 | UC02 | KF01, KF02, KF03 |
| C18 | UC02 | KF01, KF02, KF03, KF08 |
| C19 | UC12 | KF21 |
| C20 | UC12 | KF21 |
| C21 | UC08 | KF14, KF16 |
| C22 | UC08 | KF14, KF16 |
| C23 | UC05 | KF10 |
| C24 | UC06 | KF12 |
| C25 | UC05, UC06, UC07 | KF10, KF11, KF12, KF13 |
| C26 | UC07 | KF13 |
| C27 | UC08 | KF14, KF16 |
| C28 | UC03, UC04 | KF09 |
| C29 | UC03, UC04 | KF09 |
| C30 | UC01 | KF04, KF05 |
| C31 | UC01 | KF04 |
| C32 | UC09 | KF15, KF17, KF18 |
| C33 | UC09 | KF15, KF17, KF18 |
| C34 | UC02, UC06, UC08, UC09, UC12 | KF06, KF07, KF12, KF18, KF21 |

---

# Referensi
- Diagram UML: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)
