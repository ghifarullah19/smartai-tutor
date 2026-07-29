# Design Document

## 1. Current architecture impact
- Tidak mengubah arsitektur utama.
- Penambahan fungsi middleware (decorator) di sisi backend untuk memproteksi rute yang membutuhkan autentikasi (seperti `DELETE /account`).

## 2. Component changes
- `frontend/src/App.tsx` (atau komponen penampung baru): Penambahan logika state lokal untuk melakukan *toggle* tampilan antara `LoginForm` dan `SignupForm`.
- `frontend/src/components/organisms/SettingsModal/SettingsModal.tsx`: Penambahan seksi "Manajemen Akun" yang berisi tombol Hapus Akun.

## 3. File structure changes
- (Baru) `backend/auth_middleware.py`: Modul untuk menyimpan dekorator `@token_required`.
- (Baru) `frontend/src/components/organisms/SignupForm/`: Direktori baru untuk komponen form pendaftaran.

## 4. Data flow
- **Signup**: Frontend mengisi form -> Kirim `POST /signup` -> Backend mengecek apakah email terdaftar -> Jika tidak, di-hash dan disimpan -> Response 201 Created -> Frontend mengubah tampilan kembali ke form Login.
- **Delete Account**: Frontend menampilkan konfirmasi -> Mengirim `DELETE /account` dengan header `Authorization: Bearer <token>` -> Backend mendekode JWT, mencari User ID, menghapus baris di tabel `User` -> Response 200 OK -> Frontend memanggil fungsi `logout()` untuk mereset *state* dan mengarahkan ke halaman login.

## 5. UI layout specification
- `SignupForm` identik dengan `LoginForm` secara tata letak, hanya saja memiliki satu field tambahan (Nama) dan teks tautan ke "Sudah punya akun? Masuk di sini".
- Tombol Hapus Akun diatur dengan *styling* danger (berwarna merah) untuk menandakan aksi destruktif.

## 6. Styling decisions
- Konsisten menggunakan variabel CSS yang ada (warna `danger` untuk penghapusan).
- Penggunaan komponen `Button` yang sudah ada.

## 7. Responsive behavior
- Mengikuti responsivitas modal dan kartu yang sudah terbangun sebelumnya.

## 8. Technical constraints
- Karena SQLite digunakan, tidak ada *foreign key checking* yang ketat saat ini. Jika di kemudian hari data relasional bertambah, metode *hard delete* pada `User` harus disesuaikan menjadi *soft delete* atau cascade manual.
