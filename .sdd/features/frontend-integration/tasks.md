# Implementation Plan: Frontend API Integration

## Tasks

- [x] 1. Buat file konfigurasi sentral API
  - Buat `frontend/src/config.ts`.
  - Ekspor konstanta `API_URL` yang merujuk pada `import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'`.
  - _Requirements: 1.1, 1.2_

- [x] 2. Update Komponen Form dan Modal
  - Edit `frontend/src/components/organisms/LoginForm/LoginForm.tsx` -> gunakan `API_URL`.
  - Edit `frontend/src/components/organisms/SignupForm/SignupForm.tsx` -> gunakan `API_URL`.
  - Edit `frontend/src/components/organisms/ProfileModal/ProfileModal.tsx` -> gunakan `API_URL`.
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Update State Management (Zustand)
  - Edit `frontend/src/store/chatStore.ts` -> ganti hardcode `BACKEND_URL` dengan import `API_URL` dari `config.ts`.
  - _Requirements: 2.4_

- [x] 4. Konfigurasi SPA Vercel
  - Buat `frontend/vercel.json` untuk *rewrites* React Router SPA.
  - _Requirements: 3.1, 3.2_
