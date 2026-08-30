<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *Nama Perangkat Lunak*

### Untuk: Agatha

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K03 |
| Kelompok | 9  |

| NIM | Nama |
|---|---|
| *13525120* | *Naufal Hasbialhaq* |
| *13525009* | *Wimar Widiarto* |
| *13525093* | *Vinsensius Juan Setiady* |
| *13525126* | *Raymond Edson Sabajan* |
| *13525048* | *Yohanes Nicholas Setiawan* |
---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
Tuliskan deskripsi permasalahan yang kalian pilih secara naratif dan spesifik. Tambahkan keterkaitan permasalahan tersebut dengan Tujuan Pembangunan Berkelanjutan (SDGs) yang telah disepakati. Dukung argumen kalian dengan data yang kredibel, serta jelaskan urgensi mengapa masalah ini perlu dan layak untuk segera diselesaikan. 
<br>
jawaban sementara (berupa poin2):
<br>
-tingkat pengangguran yang tinggi karena lapangan pekerjaannya bisa dibilang tidak terlalu banyak pada pekerjaan2 ini(ada 7, kayak tukang potong tanaman, handyman, tukang sol sepatu, tukang jahit...)
<br>
-banyaknya permintaan jasa dari job ini tetapi akses yang didapat bisa dibilang lumayan sulit
<br>
-pekerja jasa Ini tidak dilindungi(maksudnya kayak pekerjaan ini ga punya jaminin income yang tetap)
<br>
-dokumen pendukung(jumlah pekerja aktif, permintaan pasar, dan lapangan pekerjaan yang ditawarkan)
<br>
-urgensi kenapa masalah ini wajib diselesaikan(dari segi lapangan pekerjaannya sendiri kurangnya akses pekerjaan ke pasar/platform yang jelas,  dan dari permasalahan: ...)


## 1.2 Analisis Kondisi Saat Ini
Lakukan analisis terhadap proses yang berjalan saat ini di dunia nyata, baik itu sistem lama ataupun solusi yang sudah ada. Soroti kesenjangan atau celah dari kondisi tersebut yang nantinya akan diselesaikan oleh perangkat lunak kalian.
<br>
masalah:
<br>
-kurangnya akses dan pelatihan pengetahuan digital dari sisi penjual jasa sehingga sedikitnya pemasaran dari jasa pekerjaan tersebut di internet/platform
<br>
-platform yang mencakup dan menyediakan jasa dari pekerjaan ini masih belum merata(khususnya tukang sol sepatu dan penjahit)
<br>
-konsumen kesulitan mencari penyedia jasa yang lokasinya dekat, karena tidak ada yang memiliki sistem berbasis lokasi yang spesifi pada jasa2 ini 


---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
Ketika pengguna membutuhkan suatu jasa spesifik yang bisa didapatkan dari para pekerja jasa informal (freelance), sering kali pengguna sulit mendapatkan informasi mengenai keberadaan para pekerja yang dapat membantunya. Sebaliknya, para pekerja jasa juga sering kali sulit untuk mendapatkan pelanggan karena ketidaktahuan pelanggan terhadap keberadaan para pekerja. Contohnya, seorang pengguna ingin menjahit pakaian mereka yang rusak namun tidak dapat menemukan lokasi penjahit yang dapat memperbaikinya. Oleh karena itu, kami ingin menghubungkan pengguna yang membutuhkan jasa dengan para pekerja yang membutuhkan pelanggan melalui sebuah platform aplikasi berbentuk mobile application. Platform mobile application dipilih karena perangkat mobile lebih mudah dijangkau oleh berbagai kalangan dan mudah bagi pekerja/pengguna jasa dalam melakukan mobilisasi.

Pelanggan: 
a. Mengunggah dan memilih jasa
b. Menghubungi pemilik jasa
c. menginput persetujuan pekerjaan ke aplikasi dan harga
d. Membayar pemilik jasa

Pemilik jasa:
a. Memberi estimasi harga
b. Menyutujui persetujuan dan harga
c. Melakukan pekerjaan

Layanan Pelanggan:
a. Membantu proses mediasi jika terdapat masalah baik dari pembayaran atau yang lainnya

## 2.2 Asumsi dan Batasan
Asumsi:
a. Pengguna dan pekerja jasa memiliki smartphone
b. Pemilik jasa mengaktifkan GPS setiap menerima layanan jasa (jika memiliki smartphone)

Batasan:
a. Terdapat pengguna atau pemilik jasa yang tidak memiliki smartphone
b. Pengguna atau pemilik jasa yang kurang memiliki literasi digital
c. Pemilik jasa tidak dapat melakukan jasa yang ditawarkan

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor | Deskripsi |
| :--- | :--- |
| Pemberi Jasa | Pengguna ini bertindak sebagai pihak penyedia jasa yang menerima pesanan, melakukan pekerjaan fisik di lokasi pelanggan, dan menyelesaikan tugas sesuai dengan persetujuannya dengan pelanggan.  |
|  Pelanggan| Pengguna ini berperan sebagai pihak yang memerlukan, memesan, dan membayar layanan jasa kasar. |
| Layanan Pelanggan | Pengguna ini sebagai pihak yang berjaga jaga apabila terdapat sebuah masalah pada sistem atau masalah pada pengguna lain |

| ... | ... |


## 3.2 Kebutuhan Pengguna Awal
Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format *User Story* (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Kasir* |  *Memindai barcode barang* | *Proses pembayaran berjalan cepat dan akurat* |
| US-02 | *[Nama Aktor]* | *[Kebutuhan pengguna]* | *[Tujuan yang dicapai pengguna]* |
| ... | ... | ... | ... |

## 3.3 Model Proses Bisnis
Buatlah *Activity Diagram* atau *Swimlane Diagram* yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/diagram-act-1.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Contoh Activity Diagram</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
