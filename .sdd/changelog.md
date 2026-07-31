# AI Implementation Changelog

This document tracks all completed features, bug fixes, and refactoring efforts. AI agents must append their completed tasks to this file to preserve context for future sessions.

## Format

```markdown
### [YYYY-MM-DD] - [Type: Feature | BugFix | Refactor]
**Task/Objective:** ...
**Files Modified:**
- `path/to/file1`
- `path/to/file2`
**Summary of Changes:** 
- Added X
- Fixed Y
```

---

## Change History

*(Newest changes are added below)*

### [2026-07-30] - [Type: Feature | Refactor | BugFix]
**Task/Objective:** Migrasi Backend ke FastAPI, Integrasi Frontend React, Refactor Premium UI, dan Dukungan Supabase
**Files Modified:**
- `backend/` (Seluruh folder & subfolder: `api/`, `core/`, `models/`, `schemas/`, `services/`)
- `frontend/` (Seluruh folder & subfolder: `src/components/`, `src/store/`, `src/pages/`)
- `.sdd/` (Folder `features/` dan `steering/`)
**Summary of Changes:** 
- **[Feature] Backend Migration**: Berhasil melakukan migrasi backend secara penuh dari Flask ke **FastAPI** dengan arsitektur berlapis (layered architecture).
- **[Feature] Frontend Integration**: Membangun ulang frontend menggunakan **React + Vite** dipadukan dengan **Zustand** untuk manajemen state.
- **[Feature] Auth & User Management**: Mengimplementasikan sistem autentikasi (Login, Register, Logout, Hapus Akun) berbasis JWT (JSON Web Tokens).
- **[Feature] Chat Database & RAG**: Membuat persistensi data sesi percakapan menggunakan SQLAlchemy, serta mengintegrasikan *Langchain + Groq API* untuk model AI RAG (Retrieval-Augmented Generation) yang peduli dengan kurikulum (Kelas & Mata Pelajaran).
- **[Refactor] Premium UI Refactor**: Mengonversi komponen UI (seperti `LoginForm`, `SignupForm`, `ChatArea`) ke **Tailwind CSS** untuk menghadirkan desain modern (*glassmorphism*) yang responsif.
- **[Feature] Supabase / PostgreSQL Support**: Mengadopsi library `psycopg2-binary` dan logika deteksi URL pada SQLAlchemy untuk mendukung penggunakan Supabase sebagai database serverless utama.
- **[Feature] Global Theme**: Menambahkan *Global Theme Toggler* untuk mode Gelap/Terang yang persisten.
- **[BugFix] Data Isolation**: Mengatasi kebocoran data di mana riwayat obrolan akun lain terlihat (dengan mengimplementasikan pembersihan state lokal secara menyeluruh saat *logout* via `clearAllData()`).
- **[BugFix] Post-Login Flow**: Memperbaiki alur saat login pertama kali agar otomatis mengambil (*fetch*) riwayat chat akun yang baru masuk.
- **[BugFix] UI Layouting**: Memperbaiki z-index dan layout *Welcome Form* (onboarding kelas & mapel) agar Navbar tetap muncul di bagian atas layar.

### [2026-07-31] - [Type: BugFix]
**Task/Objective:** Fix Vercel Serverless Function Deployment Bundle Size Exceeded (>500MB Limit)
**Files Modified:**
- `backend/requirements.txt`
- `backend/rag.py`
**Summary of Changes:** 
- **[BugFix] Vercel Bundle Size Optimization**: Menghapus dependensi PyTorch (`torch`), `sentence-transformers`, `langchain-huggingface`, `chromadb`, `pandas`, dan `openpyxl` dari `requirements.txt` yang menyebabkan ukuran bundle membengkak hingga 5.14 GB.
- **[Refactor] Lightweight Groq Integration**: Mengubah `rag.py` untuk menggunakan API `ChatGroq` secara langsung tanpa memuat model embedding PyTorch lokal yang berat. Ukuran fungsi serverless sekarang turun drastis dari 5.14 GB menjadi ~30 MB (jauh di bawah batas Vercel 500 MB).

### [2026-07-31] - [Type: BugFix]
**Task/Objective:** Fix Navbar Layout Clipping and Profile Menu Z-Index Stacking Overlap Bugs
**Files Modified:**
- `frontend/src/App.tsx`
- `frontend/src/components/templates/AppShell/AppShell.tsx`
- `frontend/src/components/organisms/ChatArea/ChatArea.tsx`
- `frontend/src/components/organisms/WelcomeForm/WelcomeForm.tsx`
**Summary of Changes:** 
- **[BugFix] Responsive Viewport Height**: Mengganti `h-screen` dengan `h-[100dvh]` pada `AppShell` dan `App` untuk mencegah penumpukan/pemotongan navbar atas di berbagai perangkat (khususnya browser mobile).
- **[BugFix] Z-Index Stacking Context Fix**: Menambahkan `relative z-30` pada `<header>` di `ChatArea` dan `z-10` pada `WelcomeForm` sehingga menu dropdown `ProfileMenu` (`z-50`) dipastikan berada di lapisan paling atas dan tidak tertimpa lagi oleh kartu "Selamat Datang di PintarAI".

### [2026-07-31] - [Type: BugFix]
**Task/Objective:** Fix Root Cause of Navbar Clipping on Mobile — Global CSS `overflow: hidden` & Nested Viewport Lock Conflicts
**Files Modified:**
- `frontend/src/index.css`
- `frontend/src/pages/MainChatPage/MainChatPage.tsx`
- `frontend/src/components/templates/AppShell/AppShell.tsx`
- `frontend/src/components/organisms/Sidebar/Sidebar.tsx`
**Summary of Changes:** 
- **[BugFix] Remove Global `overflow: hidden`**: Menghapus `overflow: hidden` dari `html, body, #root` di `index.css` yang merupakan akar masalah utama pemotongan navbar. Properti ini memotong seluruh konten secara global sebelum Tailwind sempat bekerja. Diganti dengan `overflow-x: hidden` hanya pada `html` untuk mencegah scrollbar horizontal.
- **[BugFix] Single Viewport Lock Strategy**: Menetapkan `MainChatPage` sebagai satu-satunya kontainer viewport-lock (`h-screen h-[100dvh] overflow-hidden`). `AppShell` diubah dari `h-screen` menjadi `h-full` agar mewarisi tinggi dari parent, menghilangkan konflik nested viewport locks yang bertabrakan.
- **[BugFix] Sidebar Mobile Height**: Mengubah Sidebar dari `fixed top-0 bottom-0` menjadi `fixed inset-y-0 h-screen h-[100dvh]` saat posisi fixed (mobile), dan `md:h-full` saat relative (desktop) untuk konsistensi tinggi di semua perangkat.
- **[BugFix] Dynamic Viewport Height (`dvh`)**: Menambahkan `height: 100dvh` pada `index.css` global sebagai override dari `height: 100%` untuk browser modern yang mendukung dynamic viewport units.
