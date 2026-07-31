# Implementation Plan: backend-migration

## Overview

Implementasi ini berfokus pada refactoring total kode backend dari framework Flask menjadi FastAPI sambil mempertahankan logika bisnis dan interaksi dengan database (SQLAlchemy) serta LLM (Groq API). Struktur proyek akan diubah secara radikal menjadi arsitektur berlapis (*layered architecture*) yang terdiri dari Router, Service, Model, Schema, dan Core, untuk memastikan skalabilitas dan kompatibilitas 100% dengan pendelegasian Vercel Serverless.

Semua kode ditulis dalam **Python 3.x**. Dependensi baru yang akan digunakan meliputi **FastAPI**, **Pydantic**, **Uvicorn**, dan **Groq**.

---

## Tasks

- [x] 1. Inisialisasi struktur direktori baru dan dependensi
  - Buat folder `api`, `api/routers`, `core`, `models`, `schemas`, dan `services` di dalam direktori `backend/`.
  - Edit `backend/requirements.txt`: Hapus `Flask` dan ekstensi terkaitnya. Tambahkan `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic[email]`, `python-jose[cryptography]`, `passlib[bcrypt]`, `groq`, `python-dotenv`, `SQLAlchemy`.
  - Hapus (atau backup sementara) `app.py`, `auth_middleware.py`, dan `models.py` lama.
  - _Requirements: Infrastruktur dasar untuk semua requirement (Req 5.1)._

- [x] 2. Setup Core Application Logic (`core/`)
  - [x] 2.1 Konfigurasi Lingkungan (`core/config.py`)
    - Buat class `Settings` menggunakan `pydantic_settings` untuk memuat variabel `.env`: `DATABASE_URL`, `JWT_SECRET`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, dan `GROQ_API_KEY`.
    - _Requirements: 5.3_
  - [x] 2.2 Konfigurasi Database (`core/database.py`)
    - Definisikan `engine = create_engine(DATABASE_URL)` dan `SessionLocal = sessionmaker(...)`.
    - Buat fungsi *dependency injection* `get_db()` yang me-*yield* session database lalu menutupnya di blok `finally`.
    - _Requirements: 5.4_
  - [x] 2.3 Konfigurasi Keamanan (`core/security.py`)
    - Impor `passlib` untuk fungsi `verify_password` dan `get_password_hash`.
    - Buat fungsi `create_access_token` menggunakan `python-jose` untuk JWT encoding.
    - _Requirements: 1.3, 1.5_

- [x] 3. Pindahkan dan Pisahkan SQLAlchemy Models (`models/`)
  - [x] 3.1 Model User (`models/user_model.py`)
    - Ekstrak class `User` dari `models.py` lama. Pastikan mewarisi dari `Base` (dari `core.database`).
    - Pastikan relasi `chats` mengarah ke model `ChatSession`.
    - _Requirements: 1.3, 2.2_
  - [x] 3.2 Model Chat (`models/chat_model.py`)
    - Ekstrak class `ChatSession` dan `Message` dari `models.py` lama. Pastikan pewarisan dan relasi `ForeignKey` sudah benar.
    - _Requirements: 3.2, 4.2_

- [x] 4. Buat Pydantic Schemas (`schemas/`)
  - [x] 4.1 Schema User (`schemas/user_schema.py`)
    - Buat `UserCreate` (email, name, password) dan `UserResponse` (id, email, name). Set `from_attributes=True`.
    - _Requirements: 1.1, 2.3 (Mencegah kebocoran password)_
  - [x] 4.2 Schema Chat (`schemas/chat_schema.py`)
    - Buat `ChatCreate` (subject, grade).
    - Buat `MessageCreate` (text).
    - Buat `MessageResponse` (id, sender, text, timestamp).
    - _Requirements: 4.1, 4.7_
  - [x] 4.3 Schema Token (`schemas/token_schema.py`)
    - Buat `Token` (access_token, token_type).
    - _Requirements: 1.5_

- [x] 5. Implementasi Business Logic Services (`services/`)
  - [x] 5.1 Service Autentikasi (`services/auth_service.py`)
    - Buat class `AuthService` yang menerima `db: Session`.
    - Fungsi `register(user: UserCreate)`: Cek eksistensi email -> Hash password -> Simpan DB.
    - Fungsi `login(email, password)`: Cek password valid -> Hasilkan access_token JWT.
    - _Requirements: 1.2, 1.3, 1.5, 1.6_
  - [x] 5.2 Service Profil Pengguna (`services/user_service.py`)
    - Buat fungsi dependen `get_current_user(token, db)` untuk membaca isi JWT dan meretrieve `User`.
    - _Requirements: 2.1, 2.2, 2.5_
  - [x] 5.3 Service Chat & Groq (`services/chat_service.py`)
    - Fungsi `create_chat_session(user_id, subject, grade)`: Simpan `ChatSession` ke DB.
    - Fungsi `send_message(db, chat_id, text, sender)`: Simpan `Message` ke DB.
    - Fungsi `generate_ai_reply(db, chat_id)`: Ambil N pesan terakhir -> Format ke list dictionary Groq -> Panggil `groq_client.chat.completions.create` -> Tangkap response AI -> Simpan ke `Message`.
    - _Requirements: 3.2, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 6. Pembuatan Controller Routers (`api/routers/`)
  - [x] 6.1 Router Auth (`api/routers/auth_router.py`)
    - Definisikan `router = APIRouter()`.
    - `@router.post("/register", response_model=UserResponse)` injeksi DB, panggil `AuthService.register`.
    - `@router.post("/login", response_model=Token)` injeksi `OAuth2PasswordRequestForm` dan DB, panggil `AuthService.login`.
    - _Requirements: 1.1, 1.4_
  - [x] 6.2 Router User (`api/routers/user_router.py`)
    - `@router.get("/profile", response_model=UserResponse)` injeksi dependen `get_current_user`.
    - _Requirements: 2.2_
  - [x] 6.3 Router Chat (`api/routers/chat_router.py`)
    - `@router.post("/", response_model=ChatSessionResponse)`
    - `@router.get("/")`
    - `@router.post("/{session_id}/messages")` -> Panggil service simpan teks user -> Panggil service AI -> Return teks AI.
    - _Requirements: 3.1, 3.2, 4.1, 4.7_

- [x] 7. Inisialisasi Vercel Serverless Entry Point (`api/index.py`)
  - Import `FastAPI()`.
  - Tambahkan middleware CORS untuk mengizinkan *frontend*.
  - *Include* `auth_router`, `user_router`, dan `chat_router` ke dalam `app` dengan *prefix* `/api`.
  - _Requirements: 5.2_

- [x] 8. Konfigurasi Deployment Vercel (`backend/vercel.json`)
  - Definisikan `"builds": [{"src": "api/index.py", "use": "@vercel/python"}]`.
  - Definisikan `"routes": [{"src": "/(.*)", "dest": "api/index.py"}]`.
  - _Requirements: 5.1_

- [x] 9. Testing & Verifikasi Lokal
  - Jalankan `uvicorn api.index:app --reload` pada command prompt.
  - Verifikasi ke `http://127.0.0.1:8000/docs` (Swagger UI).
  - Lakukan pengujian manual untuk fitur register, login, profil, buat chat, dan balasan AI.
  - _Requirements: (Validasi integrasi keseluruhan sebelum produksi)_
