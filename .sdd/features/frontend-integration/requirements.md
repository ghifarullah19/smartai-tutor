# Requirements Document: Frontend API Integration

## Introduction
Proyek ini bertujuan untuk menyesuaikan kode *frontend* React agar dapat berkomunikasi dengan backend FastAPI yang baru, sekaligus menyiapkan *frontend* untuk *deployment* di Vercel secara terpisah dari backend.

## Requirements

### Requirement 1: Sentralisasi Konfigurasi API URL
**User Story:** Sebagai developer, saya ingin *base URL* API tidak di-*hardcode* di setiap file, sehingga mudah diubah antara lingkungan lokal (port 8000) dan *production* (Vercel URL).

#### Acceptance Criteria
1. THE App SHALL menggunakan *environment variable* `VITE_API_URL` untuk menentukan URL backend.
2. THE App SHALL melakukan *fallback* ke `http://127.0.0.1:8000` jika `VITE_API_URL` tidak didefinisikan (untuk penggunaan lokal).

### Requirement 2: Refactoring Endpoint
**User Story:** Sebagai developer, saya ingin semua *API calls* yang menggunakan URL `localhost:5000` lama di-refactor menggunakan variabel global baru.

#### Acceptance Criteria
1. THE `LoginForm` component SHALL menggunakan variabel konfigurasi global (`API_URL`) untuk request `/login`.
2. THE `SignupForm` component SHALL menggunakan variabel konfigurasi global untuk request `/signup`.
3. THE `ProfileModal` component SHALL menggunakan variabel konfigurasi global untuk request `/account`.
4. THE `chatStore` SHALL menggunakan variabel konfigurasi global untuk seluruh request ke API.

### Requirement 3: Konfigurasi Deployment Vercel Frontend
**User Story:** Sebagai developer, saya ingin proyek React Vite saya siap di-*deploy* ke Vercel tanpa kendala *routing* (Single Page Application).

#### Acceptance Criteria
1. THE App SHALL memiliki file `vercel.json` di dalam folder `frontend/` untuk menangani *rewrites* jika menggunakan React Router.
2. THE App SHALL melakukan *rewrite* semua rute ke `/index.html`.
