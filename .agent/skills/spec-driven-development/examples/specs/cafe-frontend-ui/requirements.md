# Requirements Document

## Introduction

Fitur ini mencakup tampilan frontend sederhana untuk aplikasi cafe WPU Cafe yang dibangun dengan React dan TypeScript (Vite). Aplikasi sudah memiliki halaman-halaman dasar (Home, Login, CreateOrder, DetailOrder, ListOrder) beserta layanan API yang terhubung ke backend. Tujuannya adalah memastikan seluruh tampilan UI berfungsi dengan baik, konsisten secara visual, dan memberikan pengalaman pengguna yang nyaman bagi kasir/staf cafe.

Alur utama aplikasi:
1. Pengguna membuka halaman Home dan diarahkan ke Login
2. Setelah login, pengguna diarahkan ke halaman daftar order
3. Dari daftar order, pengguna bisa membuat order baru, melihat detail order, dan menandai order selesai
4. Pengguna bisa logout dari halaman daftar order

---

## Glossary

- **App**: Aplikasi frontend WPU Cafe secara keseluruhan
- **Home_Page**: Halaman landing pertama yang dilihat pengguna
- **Login_Page**: Halaman autentikasi pengguna
- **ListOrder_Page**: Halaman daftar semua order yang ada
- **CreateOrder_Page**: Halaman untuk membuat order baru
- **DetailOrder_Page**: Halaman untuk melihat detail satu order
- **Auth_Token**: Token JWT yang disimpan di localStorage setelah login berhasil
- **Cart**: Kumpulan item menu yang dipilih sebelum order dibuat
- **Menu_Item**: Satu item makanan atau minuman yang tersedia di menu cafe
- **Order**: Satu transaksi pemesanan yang berisi informasi pelanggan, meja, dan item-item yang dipesan
- **Protected_Route**: Rute yang hanya bisa diakses oleh pengguna yang sudah login
- **Category_Filter**: Filter berdasarkan kategori menu (All, Food, Beverage, dll)

---

## Requirements

### Requirement 1: Halaman Home

**User Story:** Sebagai pengunjung, saya ingin melihat halaman selamat datang, sehingga saya tahu ini adalah aplikasi WPU Cafe dan bisa navigasi ke login.

#### Acceptance Criteria

1. THE Home_Page SHALL menampilkan elemen heading dengan teks persis "Welcome To WPU Cafe"
2. WHEN pengguna menekan tombol "Login", THE Home_Page SHALL menavigasi ke halaman `/login`
3. IF navigasi ke `/login` gagal, THEN THE Home_Page SHALL tetap menampilkan halaman saat ini tanpa crash
4. THE Home_Page SHALL menampilkan konten secara terpusat secara horizontal dan vertikal di dalam viewport

---

### Requirement 2: Halaman Login

**User Story:** Sebagai staf cafe, saya ingin login menggunakan email dan password, sehingga saya bisa mengakses fitur manajemen order.

#### Acceptance Criteria

1. THE Login_Page SHALL menampilkan form login dengan field email (placeholder "admin@wpucafe.com"), field password (placeholder "Admin123"), dan tombol "Login" untuk mempermudah akses portofolio/demo
2. WHEN pengguna menekan tombol "Login" dengan field email dan password tidak kosong, THE Login_Page SHALL mengirim request autentikasi ke API menggunakan kredensial yang dimasukkan
3. WHEN request autentikasi berhasil, THE Login_Page SHALL menyimpan Auth_Token yang diterima dari respons API ke localStorage lalu mengarahkan pengguna ke halaman `/orders`
4. IF request autentikasi gagal, THEN THE Login_Page SHALL menampilkan pesan error yang menginformasikan bahwa email atau password tidak valid, dan form tetap dapat diisi ulang tanpa me-refresh halaman
5. IF field email atau field password kosong saat tombol "Login" ditekan, THEN THE Login_Page SHALL menampilkan pesan validasi yang menginformasikan field mana yang belum diisi, dan tidak mengirim request autentikasi ke API
6. IF Auth_Token sudah ada di localStorage, THEN THE Protected_Route SHALL mengizinkan akses langsung ke halaman yang dilindungi tanpa melalui Login_Page
7. IF pengguna yang belum memiliki Auth_Token mencoba mengakses halaman yang dilindungi, THEN THE Protected_Route SHALL mengarahkan pengguna ke Login_Page

---

### Requirement 3: Halaman Daftar Order

**User Story:** Sebagai staf cafe, saya ingin melihat semua order yang ada, sehingga saya bisa memantau dan mengelola status pesanan pelanggan.

#### Acceptance Criteria

1. WHEN halaman `/orders` dimuat, THE ListOrder_Page SHALL mengambil data order dari API dan menampilkannya dalam bentuk tabel dengan kolom: No, Customer Name, Table Number, Total, Status, dan Action
2. IF pengambilan data order dari API gagal, THEN THE ListOrder_Page SHALL menampilkan pesan error yang menginformasikan bahwa data tidak dapat dimuat
3. THE ListOrder_Page SHALL menampilkan tombol "Detail" pada setiap baris order yang mengarahkan ke halaman `/orders/:id` menggunakan id dari order tersebut
4. WHEN status order adalah "PROCESSING", THE ListOrder_Page SHALL menampilkan tombol "Completed" pada baris order tersebut
5. WHEN pengguna menekan tombol "Completed", THE ListOrder_Page SHALL menonaktifkan tombol tersebut selama request berlangsung, lalu mengirim request update status ke API, dan WHEN request berhasil SHALL memuat ulang daftar order
6. IF request update status order gagal, THEN THE ListOrder_Page SHALL menampilkan pesan error dan mengembalikan tombol "Completed" ke kondisi aktif tanpa mengubah data yang tampil
7. THE ListOrder_Page SHALL menampilkan tombol "Create Order" yang mengarahkan pengguna ke halaman `/create`
8. WHEN pengguna menekan tombol "Logout", THE ListOrder_Page SHALL menghapus Auth_Token dari localStorage dan mengarahkan pengguna ke halaman `/login`

---

### Requirement 4: Halaman Buat Order

**User Story:** Sebagai staf cafe, saya ingin membuat order baru dengan memilih menu dan mengisi data pelanggan, sehingga pesanan pelanggan dapat diproses.

#### Acceptance Criteria

1. WHEN halaman `/create` dimuat, THE CreateOrder_Page SHALL mengambil dan menampilkan daftar Menu_Item dari API
2. IF pengambilan daftar Menu_Item dari API gagal, THEN THE CreateOrder_Page SHALL menampilkan pesan error yang menginformasikan bahwa menu tidak dapat dimuat
3. THE CreateOrder_Page SHALL menampilkan filter Category_Filter berupa tombol-tombol kategori (minimal: All, dan kategori lainnya dari API)
4. WHEN pengguna memilih satu Category_Filter, THE CreateOrder_Page SHALL mengambil ulang daftar Menu_Item yang sesuai dengan kategori tersebut
5. WHEN kategori "All" dipilih atau tidak ada kategori yang dipilih, THE CreateOrder_Page SHALL menampilkan semua Menu_Item
6. THE CreateOrder_Page SHALL menampilkan setiap Menu_Item beserta gambar, nama, dan harga dalam format mata uang (simbol Rp diikuti angka dengan pemisah ribuan)
7. WHEN pengguna menekan "Add to Cart" pada satu Menu_Item, THE CreateOrder_Page SHALL menambahkan item tersebut ke Cart dengan quantity 1, atau menambah quantity jika sudah ada di Cart
8. WHEN pengguna menekan tombol "+" pada item di Cart, THE CreateOrder_Page SHALL menambah quantity item tersebut sebesar 1
9. WHEN pengguna menekan tombol "-" pada item di Cart dengan quantity lebih dari 1, THE CreateOrder_Page SHALL mengurangi quantity item tersebut sebesar 1
10. WHEN pengguna menekan tombol "-" pada item di Cart dengan quantity sama dengan 1, THE CreateOrder_Page SHALL menghapus item tersebut dari Cart
11. THE CreateOrder_Page SHALL menampilkan form yang meminta nama pelanggan dan nomor meja
12. WHEN Cart kosong, THE CreateOrder_Page SHALL menampilkan pesan "Your cart is empty" dan tidak menampilkan tombol "Order"
13. IF Cart tidak kosong namun field nama pelanggan atau nomor meja kosong saat tombol "Order" ditekan, THEN THE CreateOrder_Page SHALL menampilkan pesan validasi dan tidak mengirim request ke API
14. WHEN Cart tidak kosong dan semua field form telah diisi lalu pengguna menekan tombol "Order", THE CreateOrder_Page SHALL mengirim data order ke API dan WHEN request berhasil SHALL mengarahkan pengguna ke halaman `/orders`
15. IF request pembuatan order gagal, THEN THE CreateOrder_Page SHALL menampilkan pesan error, mempertahankan isi Cart dan data form yang sudah diisi
16. THE CreateOrder_Page SHALL menampilkan tombol "Cancel" yang mengarahkan pengguna kembali ke halaman `/orders`

---

### Requirement 5: Halaman Detail Order

**User Story:** Sebagai staf cafe, saya ingin melihat detail lengkap satu order, sehingga saya bisa memverifikasi informasi pesanan pelanggan.

#### Acceptance Criteria

1. WHEN halaman `/orders/:id` dimuat, THE DetailOrder_Page SHALL mengambil data order berdasarkan id dari URL dan menampilkannya
2. IF pengambilan data order dari API gagal atau id tidak ditemukan, THEN THE DetailOrder_Page SHALL menampilkan pesan error yang sesuai
3. THE DetailOrder_Page SHALL menampilkan informasi: Order ID, nama pelanggan, nomor meja, status, dan total harga
4. THE DetailOrder_Page SHALL menampilkan daftar item dalam order beserta gambar, nama item, quantity, dan subtotal harga per item
5. WHEN pengguna menekan tombol "Back", THE DetailOrder_Page SHALL mengarahkan pengguna kembali ke halaman `/orders`

---

### Requirement 6: Autentikasi dan Proteksi Rute

**User Story:** Sebagai staf cafe, saya ingin halaman-halaman tertentu hanya bisa diakses setelah login, sehingga data order tidak bisa dilihat oleh sembarang orang.

#### Acceptance Criteria

1. THE Protected_Route SHALL memeriksa keberadaan Auth_Token di localStorage sebelum merender halaman yang dilindungi
2. IF Auth_Token tidak ditemukan di localStorage, THEN THE Protected_Route SHALL mengarahkan pengguna ke halaman `/login`
3. WHILE Auth_Token ada di localStorage, THE Protected_Route SHALL mengizinkan akses ke halaman `/orders`, `/orders/:id`, dan `/create`
4. THE App SHALL melindungi rute `/orders`, `/orders/:id`, dan `/create` menggunakan Protected_Route
5. IF pengguna yang sudah login mencoba mengakses `/login`, THEN THE App SHALL mengarahkan pengguna ke halaman `/orders`

---

### Requirement 7: Komponen UI yang Konsisten

**User Story:** Sebagai pengembang, saya ingin menggunakan komponen UI yang seragam di seluruh aplikasi, sehingga tampilan tetap konsisten dan mudah dirawat.

#### Acceptance Criteria

1. THE App SHALL menggunakan komponen Button untuk semua elemen tombol di seluruh halaman
2. THE App SHALL menggunakan komponen Input untuk semua field teks di seluruh form
3. THE App SHALL menggunakan komponen Select untuk semua dropdown di seluruh form
4. THE Button SHALL mendukung prop `variant` dengan nilai "primary" dan "secondary" yang menghasilkan tampilan visual berbeda
5. THE App SHALL menggunakan CSS Modules untuk styling setiap komponen dan halaman sehingga nama class CSS tidak dapat berbenturan antar komponen yang berbeda
6. WHEN komponen Button, Input, atau Select dirender, THE App SHALL memastikan komponen tersebut memiliki atribut aksesibilitas yang diperlukan (label atau aria-label)
