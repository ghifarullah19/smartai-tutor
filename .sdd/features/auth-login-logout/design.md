# Design: Authentication (Login/Logout)

## Architecture
Sistem akan diperluas dengan menambahkan lapisan *database* relasional sederhana (SQLite) menggunakan *library* SQLAlchemy di sisi Flask backend.
Proses autentikasi klien dan peladen menggunakan pola *Token-based Authentication* (JSON Web Tokens / JWT) yang lazim digunakan untuk arsitektur SPA (React) + API.

## Data Flow
### 1. Login
1. Pengguna memasukkan alamat email dan kata sandi di UI Login.
2. Frontend mengirim `POST /login` dengan muatan (*payload*) JSON.
3. Backend mencari pengguna berdasarkan email di SQLite.
4. Jika ditemukan, backend membandingkan kata sandi dengan *password hash* di database.
5. Jika valid, backend meracik JWT yang berisi `user_id` dan tanggal kedaluwarsa, lalu merespons dengan token tersebut.
6. Frontend menerima JWT, menyimpannya di `localStorage` dan mengalihkan status Zustand `authStore` menjadi `isAuthenticated = true`.

### 2. Logout
1. Pengguna menekan tombol "Logout" di frontend.
2. Frontend menghapus JWT dari `localStorage` dan mereset Zustand `authStore`.
3. Pengguna diarahkan ulang ke layar *login* atau halaman beranda publik.
*(Catatan: Token invalidation secara sejati di backend tidak dilakukan untuk versi ini demi kesederhanaan, hanya di tingkat sisi klien)*

## Components Affected
- `backend/app.py`: Menambahkan inisialisasi *database*, JWT, dan rute baru.
- `backend/models.py` (Baru): Mendefinisikan skema tabel `User`.
- `backend/requirements.txt`: Menambahkan `Flask-SQLAlchemy`, `bcrypt` (atau `werkzeug.security`), dan library JWT (misal `PyJWT`).
- `frontend/src/store/authStore.ts` (Baru): Manajemen *state* untuk sesi pengguna.
- `frontend/src/components/organisms/` (Baru): Komponen form *login*.

## Implementation Decisions
- **Database:** Memilih SQLite yang merupakan file-based database bawaan Python. Hal ini selaras dengan arsitektur awal (*framework* simpel untuk pedesaan) yang tidak membebani server dengan instalasi DBMS terpisah.
- **Bootstrapping/Testing:** Karena fitur Signup (Pendaftaran) dibuat di *spec* yang terpisah, kita akan perlu membuat skrip *seeder* kecil (atau membuat user fiktif pertama kali otomatis) di dalam kode saat tabel di-*create* agar fitur *login* bisa diuji.
