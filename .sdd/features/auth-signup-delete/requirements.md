# Requirements Document

## Introduction
Spesifikasi ini mencakup fitur pendaftaran (Sign Up) untuk pengguna baru, dan fitur penghapusan akun (Delete Account) untuk pengguna lama dalam sistem PintarAI. Fitur ini dirancang untuk memberikan kemandirian pengguna dalam mengatur akun mereka.

## Glossary
- **Sign Up**: Proses pembuatan akun baru.
- **Delete Account**: Proses penghapusan data akun dari database secara permanen.
- **JWT**: JSON Web Token yang digunakan untuk autentikasi endpoint.

## Requirements

### Requirement 1: User Sign Up
User Story:
"Sebagai calon siswa, saya ingin bisa mendaftar dengan email dan kata sandi baru, sehingga saya dapat memiliki akun sendiri untuk belajar."

Acceptance Criteria:
1. THE Signup_Form SHALL meminta input email, nama, dan kata sandi.
2. WHEN pengguna men-submit form dengan email yang belum terdaftar, THE sistem SHALL membuat akun baru di database dan mengembalikan pesan sukses.
3. IF pengguna menggunakan email yang sudah ada, THEN THE sistem SHALL mengembalikan pesan error (400 Bad Request).

Functional Requirements:
- Backend: Endpoint `POST /signup` menerima JSON `{"email", "password", "name"}`.
- Frontend: Terdapat navigasi/tautan dari komponen Login untuk pindah ke form Signup (dan sebaliknya).

### Requirement 2: Delete Account
User Story:
"Sebagai siswa, saya ingin bisa menghapus akun saya, sehingga data saya tidak lagi tersimpan di sistem."

Acceptance Criteria:
1. THE Settings_Modal SHALL memiliki tombol "Hapus Akun".
2. WHEN tombol "Hapus Akun" ditekan, THE sistem SHALL menampilkan konfirmasi penghapusan kepada pengguna.
3. WHEN pengguna mengkonfirmasi, THE frontend SHALL memanggil API penghapusan dan kemudian melakukan logout otomatis.
4. THE Backend_API `DELETE /account` SHALL memvalidasi token dan menghapus data pengguna dari database.

Functional Requirements:
- Backend: Membutuhkan verifikasi token (JWT) untuk endpoint `DELETE /account`.
- Frontend: Aksi hapus akun memanggil fungsi `logout()` dari `authStore` setelah proses API selesai.
