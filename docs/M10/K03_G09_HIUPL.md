<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## *Nama Perangkat Lunak*
### *[Logo Perangkat Lunak]*

### Untuk: *[Nama Asisten]*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *\[Kelas\]* |
| Kelompok | *\[Nomor Kelompok\]*  |

| NIM | Nama |
|---|---|
| *[NIM 1]* | *[Nama Anggota 1]* |
| *[NIM 2]* | *[Nama Anggota 2]* |
| *[NIM 3]* | *[Nama Anggota 3]* |
| *[NIM 4]* | *[Nama Anggota 4]* |
| *[NIM 5]* | *[Nama Anggota 5]* |

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

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Tuliskan uraian ringkas mengenai isi dokumen, tujuan pembuatan dokumen HIUPL ini, dan siapa saja target pembacanya.

## 1.2 Lingkup Masalah
Tuliskan lingkup masalah, yaitu membangun perangkat lunak *[nama perangkat lunak]*. Jelaskan dengan singkat dan jelas deskripsi aplikasi serta keterkaitannya dengan perangkat lunak atau sistem lain (jika ada). Bagian ini maksimal berisi satu paragraf, dapat diambil dari SKPL/DPPL.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |
| *...* | *...* | *...* |

## 1.5 Referensi
Cantumkan daftar buku, panduan, atau dokumentasi lain yang dirujuk dalam pembuatan dokumen dan pengembangan P/L, **minimal dokumen SKPL, APL, DPPL, dan Implementasi (Tugas 9)**. Tambahkan dokumentasi *framework*/*library*/*testing tool* atau referensi lain apabila digunakan.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Bagian ini diisi dengan *System Overview*, dalam bentuk gambar dan narasi yang memberikan gambaran tentang aplikasi dan konteksnya. **Batasan dan keterkaitan** antara sistem yang dibangun dengan sistem lain di luarnya harus jelas. Deskripsi umum sistem perlu dilengkapi dengan pemodelan kasus yang dihadapi, seperti *use case diagram*. Berikan narasi yang jelas untuk setiap gambar yang ditampilkan.

Bagian ini dapat menyalin atau meringkas dari dokumen SKPL atau DPPL.

<p align="center">
<img alt="System Overview / Use Case Diagram" src="./assets/contoh-uc-diagram.webp" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram [Nama P/L]</i>
</p>

<br>

---

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

---

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

---

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