<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## Cari Uang
### <img src="./assets/diagram/cariuang.svg" width="100" height="100">

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

Dapat menyalin dari dokumen DPPL sebelumnya

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

## 3.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

### 3.1.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.1.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-sequence_diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Sequence Diagram [UC01]</i>
</p>

- **Skenario Alternatif [Nomor]: [Nama Skenario]**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-sequence_diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Sequence Diagram [UC01] - [Nama skenario alternatif]</i>
</p>

### 3.1.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh_class-diagram2.jpg" width="35%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas [Nama Uce Case]</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.

## 3.2 Use Case XX

Silahkan lanjutkan untuk  *use case* berikutnya dengan content yang sama dengan 3.1

<br>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-class_diargam.png" width="35%">
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

---

# BAB 5: Perancangan Rinci Kelas

Bagian ini diisi dengan daftar seluruh kelas dalam tabel berikut:

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| ... | *...* | *...* |

Untuk **setiap kelas**, identifikasi operasi berdasarkan tanggung jawab kelas beserta *visibility*-nya, serta atribut beserta *visibility* dan tipenya. Buat subbab tersendiri untuk setiap kelas.
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

Tabel 5.3.1. Operasi Kelas PemberiJasa
Tabel 5.3.1. Operasi Kelas PemberiJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `cekInfoLogin(input username: String, input password: String): Boolean` | public | Menjalankan query ke database untuk melihat apakah informasi login yang digunakan sesuai dengan informasi pada tabel pengguna |
| laporkanMasalah() | Public | Pemberi jasa melaporkan masalah kepada layanan pelanggan |

Tabel 5.3.2. Atribut Kelas PemberiJasa

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.3.1 Algoritma/Query

**Nama Kelas:** PemberiJasa
**Nama Operasi:** cekInfoLogin
**ID Algoritma:** Alg-XXX

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

Tabel 5.3.1 Query Operasi cekInfoLogin

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-XXX | `SELECT id_pengguna, nama_pengguna, username, password, email FROM pengguna WHERE username = $1;` | Mengambil data akun dan hash password dari tabel pengguna berdasarkan nama pengguna. |

### 5.3.2 Algoritma/Query

*[Ulangi pola 5.3.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.4 Kelas PemberiJasaController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.4.1. Operasi Kelas PemberiJasaController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| requestFormTiket() | Public | Meminta form tiket untuk diisi dan dikirimkan le layanan pelanggan |


Tabel 5.4.2. Atribut Kelas [Nama Kelas 4]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.4.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
```

Tabel 5.4.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |


### 5.4.2 Algoritma/Query

*[Ulangi pola 5.4.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.5 Kelas Pelanggan

**Nama Kelas:** *Pelanggan*  
**ID Kelas:** *C07*
**Nama Kelas:** Pelanggan <br> 
**ID Kelas:** C07

Tabel 5.5.1. Operasi Kelas Pelanggan
Tabel 5.5.1 Operasi Kelas Pelanggan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `cekInfoLogin(input username: String, input password: String): Boolean` | public | Menjalankan query ke database untuk melihat apakah informasi login yang digunakan sesuai dengan informasi pada tabel pengguna |

Tabel 5.5.2 Atribut Kelas Pelanggan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.5.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *Pelanggan*  
**Nama Operasi:** *laporkanMasalah()*  
**ID Algoritma:** *[Algo-001]*
**Nama Kelas:** Pelanggan 
**Nama Operasi:** cekInfoLogin
**ID Algoritma:** Alg-XXX

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

### 5.5.2 Algoritma/Query

*[Ulangi pola 5.5.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


## 5.6 Kelas PelangganController

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.6.1. Operasi Kelas [Nama Kelas 6]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.6.2. Atribut Kelas [Nama Kelas 6]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.6.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
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
**ID Algoritma:** Alg-XXX

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

**Nama Kelas:** *PelangganController*  
**ID Kelas:** *C09*

Tabel 5.9.1. Operasi Kelas PelangganController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |
| validasiInput(): Boolean | Public | Validasi input yang dikirim |


### 5.9.1 Algoritma/Query

**Nama Kelas:** *PelangganController* 
**Nama Operasi:** *validasiInput()*  
**ID Algoritma:** *[Algo-091]*

```text
public validasiInput()
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

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
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

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
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

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
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
**ID Algoritma:** Alg-XXX

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

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.20.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.20.2 Algoritma/Query

*[Ulangi pola 5.20.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*


<br>

---

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka [ID Layar 1]

Masukkan versi awal prototipe antarmuka, dimana untuk setiap antarmuka/layar, tuliskan spesifikasi rinci objek yang ditampilkan dan reaksi sistem terhadap interaksi pengguna.

**Antarmuka:** *[ID layar]*  
**Nama Layar:** *[Nama layar]*

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-design.png" width="50%">
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
| *[I-01]* | <img src="./assets/diagram/contoh-design.png" alt="Contoh Desain" width="400"> |
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
