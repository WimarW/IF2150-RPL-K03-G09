# Form Asistensi

## Tugas Besar IF2150 - Rekayasa Perangkat Lunak

| Informasi | Keterangan |
| --- | --- |
| **Hari** | *\[Selasa\]* |
| **Tanggal** | *\[22/09/2026\]* |
| **Kelas** | *\[K3\]* |
| **Nomor Kelompok** | *\[9\]*  |
| **Nama Kelompok** | *\[9Naga\]*  |
| **Nama Perangkat Lunak** | *\[Cari Uang\]*  |
| **Dokumen** | *\[K03_G09_CD\]*  |

### Anggota Kelompok

| NIM | Nama |
| --- | --- |
| 13525120 | Naufal Hasbialhaq |
| 13525009 | Wimar Widiarto |
| 13525093 | Vinsensius Juan Setiady |
| 13525126 | Raymond Edson Sabajan |
| 13525048 | Yohanes Nicholas Setiawan |

### Catatan

| Catatan |

3 Jenis Class
1. Entity: Objek-Objek dalam aplikasi.
-> Bisa user, db, kontrakKerja, dll
2. View/Interface: Interface yang ingin ditampilkan ke user (frontend)
-> Basically FrontEnd
3. Controller: Jembatan antara view dengan backend 
-> Bagian yang Hubungin Aksi di FrontEnd ke BackEnd
- Perlu nambah class jenis Interface&Controller
- Identifikasi atribut dari setiap kelas untuk mempermudah penentuan struktur database nanti dipake buat implementasi

- (Bagian 4.2)
Untuk table atribut dan metode, jangan ngulang atribut yang ada di parent classnya karena di hubungan inheritance udh termausk. Include yang unik ke kelas itu aja. 
   
- Untuk table atribut metode setiap UC, tulis semua atribut dan metode yang digunakan

- Untuk atribut tentukan atribut mana yang public, private, dan protected

- Gabung laynanJasa dan KategoriJasa karena ada tumpeng tindih fungsi.

- Pekerjaan --> Bisa diganti jadi KontrakPekerjaan biarin ngga ambigu. Ada atribut status

- Setiap UC itu tidak harus ada 3 jenis classnya nanti tergantung abstraksi, definisi atribut, dan cara implementasi kita
-> Fitur Chat

- UseCase diagram, bisa buat actor baru yang merupakan generalisasi dari kedua actor Utama agar tidak dobel oval di diagramnya nanti. Hubungan generalisasinya dinyatakan kyk hubungan generaluisasi di class diagram

- Skenario UC nanti bisa dikasi row kosong buat ngasi Waktu buat aksi P/L (kyknya gtw, aku nangkepnya kyk gini, tanya king juan aja nanti dia ngerti)

**Notes for this section:**  
*Catatan dapat dituliskan dalam bentuk paragraf atau poin-poin, disesuaikan saja.* 

## Dokumentasi

<!-- ![](./assets/foto-asistensi.jpg) -->
<p align="center">
  <img src="./assets/foto-asistensi.jpeg" width="100%">
</p>

<p align="center">
  <i>Gambar 1. Dokumentasi kegiatan asistensi.</i>
</p>
