# Requirements: Authentication (Login/Logout)

## User Stories
- Sebagai siswa, saya bisa masuk (login) ke dalam sistem menggunakan email dan kata sandi agar identitas dan sesi belajar saya tersimpan secara unik.
- Sebagai siswa, saya bisa keluar (logout) dari sistem setelah selesai belajar agar akun saya tidak digunakan oleh orang lain.

## Acceptance Criteria
- Terdapat halaman/modal Login di frontend.
- API Endpoint `POST /login` di backend memvalidasi kredensial pengguna.
- Jika kredensial valid, backend mengembalikan token autentikasi (JWT).
- Frontend menyimpan token JWT dan mampu menggunakannya untuk autentikasi permintaan (misalnya untuk interaksi AI nantinya).
- Tombol "Logout" di frontend akan menghapus token dan mengembalikan pengguna ke kondisi tidak terautentikasi (unauthenticated).
- Backend memiliki database lokal (SQLite) yang berisi tabel pengguna (User).

## Functional Requirements
- **Frontend:**
  - Komponen antarmuka form Login (Email, Password).
  - Penyimpanan status *authentication* secara global (Zustand state).
  - Penyimpanan token persisten (misal via `localStorage`).
  - Tombol Logout.
- **Backend:**
  - Setup database SQLite via SQLAlchemy.
  - Tabel `User` untuk menyimpan email, nama, dan hash kata sandi.
  - Implementasi *JSON Web Token* (JWT).
  - Endpoint `POST /login`.
