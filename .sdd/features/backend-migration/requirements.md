# Requirements Document

## Introduction

Proyek ini bertujuan untuk melakukan migrasi arsitektur *backend* aplikasi PintarAI (sebuah AI Virtual Tutor) dari framework Flask (monolitik) menjadi arsitektur microservices berlapis (Layered Serverless Architecture) menggunakan FastAPI. Migrasi ini akan memungkinkan backend untuk dideploy sebagai *Serverless Functions* di Vercel secara mudah, meningkatkan performa melalui *asynchronous processing* (sangat berguna untuk pemanggilan API AI eksternal seperti Groq), serta memperjelas pemisahan logika (API routers, business services, database models, dan data validation schemas).

Alur utama aplikasi tetap sama:
1. Pengguna (siswa) melakukan registrasi atau login.
2. Pengguna dapat mengelola profil mereka.
3. Pengguna dapat membuat sesi obrolan baru dengan AI Tutor.
4. Pengguna dapat berinteraksi (mengirim dan menerima pesan) dalam sesi obrolan yang disimpan di database.

---

## Glossary

- **App**: Keseluruhan aplikasi PintarAI
- **FastAPI**: Framework web Python berkinerja tinggi yang akan menggantikan Flask
- **Pydantic**: Library Python untuk validasi data otomatis yang digunakan di FastAPI
- **SQLAlchemy**: ORM (Object Relational Mapper) untuk berinteraksi dengan database
- **JWT**: JSON Web Token yang digunakan untuk autentikasi pengguna
- **Groq_API**: Layanan API eksternal yang menyediakan *engine* LLM (menggantikan Gemini)
- **Serverless_Function**: Fungsi *backend* yang di-deploy di Vercel dan hanya dieksekusi saat ada *request* (stateless)
- **Router**: Komponen FastAPI (`APIRouter`) yang menangani *endpoint* spesifik (misal: rute terkait chat)
- **Service**: Class Python (OOP) yang berisi murni logika bisnis (contoh: mengambil data dari DB lalu memanggil AI)
- **Model**: Representasi tabel database menggunakan SQLAlchemy
- **Schema**: Validasi bentuk data masuk/keluar menggunakan Pydantic

---

## Requirements

### Requirement 1: Autentikasi Pengguna

**User Story:** Sebagai pengguna aplikasi, saya ingin bisa mendaftar dan masuk ke sistem dengan aman, sehingga saya memiliki profil pribadi dan histori obrolan saya tersimpan dengan aman.

#### Acceptance Criteria

1. THE `AuthRouter` SHALL menerima request POST di `/api/auth/register` dengan *payload* email, name, dan password.
2. WHEN email sudah terdaftar di database, THE `AuthService` SHALL mengembalikan error HTTP 400 dengan pesan "Email already registered".
3. THE `AuthService` SHALL mengenkripsi (hash) password pengguna sebelum menyimpannya ke database via `UserModel`.
4. THE `AuthRouter` SHALL menerima request POST di `/api/auth/login` dengan *payload* email dan password.
5. WHEN kredensial login valid, THE `AuthService` SHALL mengembalikan JWT Auth_Token yang berlaku selama batas waktu tertentu (misal: 24 jam).
6. IF kredensial login tidak valid, THEN THE `AuthService` SHALL mengembalikan error HTTP 401 dengan pesan "Invalid credentials".

---

### Requirement 2: Manajemen Profil Pengguna

**User Story:** Sebagai pengguna yang sudah login, saya ingin melihat dan memperbarui informasi profil saya (nama), sehingga identitas saya selalu akurat.

#### Acceptance Criteria

1. THE `UserRouter` SHALL memvalidasi Auth_Token di header (Bearer token) untuk semua *endpoint* profil.
2. WHEN request GET `/api/users/profile` diterima dengan Auth_Token valid, THE `UserService` SHALL mengembalikan data pengguna (email, name) tanpa menyertakan password_hash.
3. THE `UserRouter` SHALL menggunakan `UserResponseSchema` untuk memastikan `password_hash` tidak pernah bocor (tersaring) ke *frontend*.
4. WHEN request PUT `/api/users/profile` diterima, THE `UserService` SHALL memperbarui `name` pengguna di database dan mengembalikan data profil terbaru.
5. IF Auth_Token tidak valid atau kadaluarsa, THEN THE `UserRouter` SHALL mengembalikan error HTTP 401 Unauthorized.

---

### Requirement 3: Manajemen Sesi Obrolan (Chat Sessions)

**User Story:** Sebagai pengguna, saya ingin membuat obrolan baru dengan topik tertentu dan melihat daftar obrolan lama saya.

#### Acceptance Criteria

1. THE `ChatRouter` SHALL memvalidasi Auth_Token untuk semua *endpoint* terkait chat.
2. WHEN request POST `/api/chats/` diterima dengan *payload* subject dan grade, THE `ChatService` SHALL membuat `ChatSessionModel` baru di database yang terhubung dengan `user_id` dari Auth_Token.
3. THE `ChatService` SHALL mengembalikan ID sesi obrolan yang baru dibuat.
4. WHEN request GET `/api/chats/` diterima, THE `ChatService` SHALL mengembalikan daftar semua `ChatSessionModel` milik pengguna yang sedang login, diurutkan berdasarkan `created_at` (terbaru di atas).
5. WHEN request DELETE `/api/chats/{session_id}` diterima, THE `ChatService` SHALL menghapus sesi obrolan beserta seluruh pesannya (cascade delete) HANYA JIKA sesi tersebut milik pengguna yang sedang login.

---

### Requirement 4: Interaksi Pesan AI

**User Story:** Sebagai pengguna, saya ingin mengirim pertanyaan ke AI Tutor dan mendapatkan jawaban agar saya bisa belajar.

#### Acceptance Criteria

1. THE `ChatRouter` SHALL menerima request POST `/api/chats/{session_id}/messages` berisi teks pertanyaan dari pengguna.
2. WHEN pertanyaan diterima, THE `ChatService` SHALL menyimpan pesan tersebut ke tabel `MessageModel` dengan `sender="user"`.
3. THE `ChatService` SHALL mengambil riwayat obrolan (maksimal *N* pesan terakhir) dari `ChatSessionModel` untuk digunakan sebagai konteks.
4. THE `ChatService` SHALL memanggil `Groq_API` (secara *asynchronous*) dengan konteks riwayat obrolan dan pertanyaan terbaru.
5. IF panggilan ke `Groq_API` gagal (timeout/error), THEN THE `ChatService` SHALL mengembalikan error HTTP 502 Bad Gateway dan tidak menyimpan jawaban AI yang kosong.
6. WHEN `Groq_API` mengembalikan jawaban sukses, THE `ChatService` SHALL menyimpan jawaban tersebut ke tabel `MessageModel` dengan `sender="ai"`.
7. THE `ChatRouter` SHALL mengembalikan respon berformat JSON menggunakan `MessageResponseSchema` yang berisi teks jawaban AI.
8. WHEN request GET `/api/chats/{session_id}/messages` diterima, THE `ChatService` SHALL mengembalikan semua pesan dalam sesi tersebut secara kronologis.

---

### Requirement 5: Kompatibilitas Deployment Vercel Serverless

**User Story:** Sebagai pengembang (DevOps), saya ingin kode backend langsung siap di-deploy ke Vercel tanpa konfigurasi Docker yang rumit.

#### Acceptance Criteria

1. THE App SHALL memiliki file `vercel.json` di *root* direktori `backend/` yang mengonfigurasi Vercel Python Builder (`@vercel/python`).
2. THE App SHALL menggunakan `api/index.py` sebagai titik masuk (*entry point*) utama dari aplikasi FastAPI.
3. THE App SHALL menggunakan variabel lingkungan (*environment variables*) via `os.getenv` untuk mengakses `DATABASE_URL`, `JWT_SECRET`, dan `GROQ_API_KEY`.
4. THE App SHALL mengatur koneksi SQLAlchemy agar menggunakan parameter yang aman untuk *serverless connection pooling* (misal: membatasi pool_size atau menonaktifkannya jika menggunakan Pgbouncer).
