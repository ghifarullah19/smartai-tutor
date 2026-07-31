# Design Document: Frontend API Integration

## Overview
Menghubungkan frontend React Vite dengan backend FastAPI baru yang berjalan di port 8000 lokal, serta menyesuaikannya agar mudah dikonfigurasi saat *deployment* ke Vercel via environment variable.

## Konfigurasi Global
- Pembuatan file baru `frontend/src/config.ts` untuk mengekspor konstan `API_URL`.
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
```
- Semua komponen yang melakukan panggilan ke API (`LoginForm.tsx`, `SignupForm.tsx`, `ProfileModal.tsx`, `chatStore.ts`) akan mengimpor `API_URL` ini sebagai penganti URL statis `http://localhost:5000`.

## Deployment
- Sebuah file `vercel.json` di *root* `frontend/` akan dibuat untuk memastikan navigasi React Router DOM pada Single Page Application (SPA) bisa berjalan baik dan tidak me-*return* error 404 ketika direfresh.
