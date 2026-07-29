# Tasks: Sign Up & Delete Account

## Implementation Steps

- [x] 1. **Buat JWT Middleware di Backend**
  - Buat file `backend/auth_middleware.py` berisi dekorator `@token_required` untuk memverifikasi token JWT dari header HTTP `Authorization`.
  - Impor dan siapkan agar bisa digunakan di *routes* yang butuh proteksi.

- [x] 2. **Implement API Endpoints (`backend/app.py`)**
  - Buat rute `POST /signup` yang memproses JSON (nama, email, password), memvalidasi keberadaan email, melakukan *hash* kata sandi, dan menyimpannya.
  - Buat rute `DELETE /account` dengan dekorator `@token_required` untuk menghapus pengguna dari *database* berdasarkan `user_id` di dalam token JWT.

- [x] 3. **Buat Komponen UI SignupForm**
  - Buat folder `frontend/src/components/organisms/SignupForm` beserta komponen dan *styling*.
  - Integrasikan mekanisme *toggle* di `App.tsx` agar pengguna bisa beralih dari mode Login ke Signup.

- [x] 4. **Integrasikan Tombol Hapus Akun di UI**
  - Modifikasi `frontend/src/components/organisms/SettingsModal/SettingsModal.tsx` dengan menambahkan tombol "Hapus Akun" (*danger variant*).
  - Tambahkan fungsi peringatan konfirmasi (*confirmation dialog*).
  - Panggil API `DELETE /account` dan jalankan aksi `logout` dari `authStore` jika berhasil.

- [ ] 5. **Testing**
  - Lakukan pendaftaran akun baru, masuk (login) dengan akun tersebut.
  - Lakukan penghapusan akun dari panel *Settings*.
  - Verifikasi bahwa pengguna dialihkan kembali ke layar *Login* dan tidak bisa *login* lagi dengan kredensial yang telah dihapus.
