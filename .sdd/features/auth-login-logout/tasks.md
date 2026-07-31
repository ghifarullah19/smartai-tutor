# Tasks: Authentication (Login/Logout)

## Implementation Steps

- [x] 1. **Setup Backend Dependencies**
  - Perbarui `requirements.txt` dengan library baru: `Flask-SQLAlchemy`, `PyJWT`, `bcrypt`.
  - Jalankan proses instalasi *library*.

- [x] 2. **Setup Database & Model (`backend/models.py`)**
  - Buat file `models.py` berisi model `User` (id, email, name, password_hash).
  - Konfigurasi koneksi SQLite di `app.py`.
  - Buat instruksi inisialisasi basis data (misal fungsi untuk `db.create_all()`).

- [x] 3. **Seed Dummy User (Untuk Testing)**
  - Karena fitur pendaftaran belum ada, buat fungsi *seeder* otomatis yang dijalankan saat server menyala untuk memasukkan satu akun *dummy* (misal: `siswa@pintarai.com` / `password123`) jika database masih kosong.

- [x] 4. **Implement API Endpoint (`backend/app.py`)**
  - Buat rute `POST /login` yang membaca JSON (email, password).
  - Lakukan pengecekan hash dari database.
  - Buat dan kembalikan token JWT jika verifikasi sukses.

- [x] 5. **Setup Frontend Store (`frontend/src/store/authStore.ts`)**
  - Buat *store* menggunakan Zustand.
  - Simpan struktur data `user`, `token`, serta status `isAuthenticated`.
  - Sinkronisasikan dengan `localStorage` (bisa menggunakan *persist middleware* Zustand).

- [x] 6. **Create UI Components**
  - Buat antarmuka login (misalnya `LoginForm.tsx` di `components/organisms`).
  - Tambahkan fungsi aksi `login` yang memanggil API.
  - Tambahkan tombol `Logout` sederhana (misal di sidebar).

- [x] 7. **Testing**
  - Jalankan backend dan frontend.
  - Uji proses *login* menggunakan akun dummy seeder.
  - Uji apakah token tersimpan, lalu uji aksi *logout*.
