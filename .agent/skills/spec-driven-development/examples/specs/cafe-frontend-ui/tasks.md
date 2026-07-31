# Implementation Plan: cafe-frontend-ui

## Overview

Implementasi ini memperbaiki aplikasi WPU Cafe yang sudah ada agar semua requirement terpenuhi. Pekerjaan dibagi menjadi beberapa tahap: setup test framework, perbaikan UI primitives, penambahan error/loading state pada setiap halaman, lalu pengujian otomatis (unit test dan property-based test) untuk memverifikasi kebenaran setiap requirement.

Semua kode ditulis dalam **TypeScript** dengan **React 19 + Vite**. Test framework yang digunakan adalah **Vitest + @testing-library/react + fast-check**.

---

## Tasks

- [x] 1. Setup test framework dan konfigurasi lingkungan pengujian
  - Install dev dependencies: `vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom fast-check jsdom`
  - Buat `vite.config.ts` dengan konfigurasi `test.environment: "jsdom"`, `test.globals: true`, dan `test.setupFiles: "./src/test/setup.ts"`
  - Buat file `src/test/setup.ts` yang meng-import `@testing-library/jest-dom`
  - Tambahkan script `"test": "vitest --run"` dan `"test:watch": "vitest"` ke `package.json`
  - Buat file `src/test/arbitraries.ts` yang mengekspor fast-check arbitraries untuk `IMenu`, `ICart`, dan `IOrder` (dipakai ulang di semua property tests)
  - _Requirements: (infrastruktur pengujian untuk semua requirement)_

- [ ] 2. Perbarui komponen UI primitives agar mendukung semua use case
  - [ ] 2.1 Tambahkan prop `disabled` dan `aria-label` ke komponen Button
    - Di `Button.tsx`: tambahkan `disabled?: boolean` dan `"aria-label"?: string` ke interface `PropTypes`
    - Teruskan prop `disabled` ke elemen `<button>` (jangan andalkan spread `{...props}` karena `children` adalah string — hapus spread dan gunakan props eksplisit)
    - Terapkan styling visual berbeda saat `disabled={true}` di `Button.module.css` (opacity/cursor)
    - _Requirements: 3.5, 4.15, 2.2 (loading state untuk tombol)_
  - [ ] 2.2 Tambahkan controlled component support ke Input
    - Di `Input.tsx`: tambahkan `value?: string` dan `onChange?: (e: ChangeEvent<HTMLInputElement>) => void` ke interface `PropTypes`
    - Teruskan `value` dan `onChange` ke elemen `<input>` hanya jika diberikan (pertahankan kompatibilitas uncontrolled)
    - _Requirements: 7.2_
  - [ ] 2.3 Tambahkan controlled component support ke Select
    - Di `Select.tsx`: tambahkan `value?: string` dan `onChange?: (e: ChangeEvent<HTMLSelectElement>) => void` ke interface `PropTypes`
    - Teruskan `value` dan `onChange` ke elemen `<select>` hanya jika diberikan
    - _Requirements: 7.3_
  - [ ]* 2.4 Tulis property test untuk Button: warna berbeda menghasilkan className berbeda
    - **Property 12: Button dengan warna berbeda memiliki class CSS yang berbeda**
    - Render `<Button color="primary">X</Button>` dan `<Button color="secondary">X</Button>`, assert `className` keduanya berbeda
    - **Validates: Requirements 7.4**

- [ ] 3. Checkpoint — Jalankan `npm run build` dan pastikan tidak ada TypeScript error

- [ ] 4. Tambahkan error handling dan loading state ke Login
  - Di `Login.tsx`: tambahkan state `error: string | null` dan `isLoading: boolean`
  - Bungkus panggilan `login()` dalam try/catch; set `error` dengan pesan `"Email atau password tidak valid."` saat API gagal
  - Set `isLoading(true)` sebelum request dan `isLoading(false)` di blok `finally`
  - Teruskan `disabled={isLoading}` ke `<Button type="submit">`
  - Render pesan error di atas tombol submit saat `error !== null`
  - _Requirements: 2.4, 2.5_
  - [ ]* 4.1 Tulis property test: form login dengan kredensial valid selalu memanggil API
    - **Property 1: Submisi form login dengan kredensial valid selalu memanggil API**
    - Mock `login` dari `auth.service`; generate `fc.string({ minLength: 1 })` untuk email dan password; assert mock dipanggil sekali dengan nilai tersebut
    - **Validates: Requirements 2.2**
  - [ ]* 4.2 Tulis property test: token login tersimpan di localStorage
    - **Property 2: Token login tersimpan di localStorage**
    - Mock `login` agar mengembalikan `fc.string({ minLength: 1 })` sebagai token; assert `getLocalStorage("auth")` sama dengan token tersebut setelah login sukses
    - **Validates: Requirements 2.3**
  - [ ]* 4.3 Tulis property test: form kosong tidak memanggil API
    - **Property 3: Form kosong tidak mengirim request**
    - Generate kombinasi string kosong/whitespace untuk email atau password; assert mock `login` tidak pernah dipanggil
    - **Validates: Requirements 2.5**
  - [ ]* 4.4 Tulis unit test Login: pesan error tampil saat API gagal
    - Mock `login` agar throw Error; submit form; assert pesan error ada di DOM
    - _Requirements: 2.4_

- [ ] 5. Tambahkan error handling dan loading state ke ListOrder
  - Di `ListOrder.tsx`: tambahkan state `isLoading: boolean`, `error: string | null`, `updateError: string | null`, `loadingOrderId: string | null`
  - Di `useEffect` untuk fetch: bungkus dalam try/catch; set `error` dengan `"Data order tidak dapat dimuat. Coba refresh halaman."` saat gagal; gunakan `finally` untuk `setIsLoading(false)`
  - Di `handleCompletedOrder`: set `loadingOrderId(id)` sebelum request, reset ke `null` di `finally`; set `updateError` dengan `"Gagal memperbarui status order. Coba lagi."` saat request gagal
  - Teruskan `disabled={loadingOrderId === order.id}` ke tombol "Completed" di setiap baris
  - Render blok error (untuk `error` dan `updateError`) di atas tabel saat nilainya tidak null
  - _Requirements: 3.2, 3.5, 3.6_
  - [ ]* 5.1 Tulis property test: semua order dari API tampil sebagai baris tabel
    - **Property 5: Semua order dari API tampil sebagai baris tabel**
    - Mock `getOrders`; generate `fc.array(orderArb)` dengan berbagai ukuran; assert jumlah `<tr>` di tbody = panjang array, setiap baris ada link ke `/orders/${id}`
    - **Validates: Requirements 3.1, 3.3**
  - [ ]* 5.2 Tulis property test: tombol "Completed" hanya muncul untuk order PROCESSING
    - **Property 6: Tombol "Completed" muncul hanya untuk order PROCESSING**
    - Generate array order dengan campuran status; assert hanya baris dengan `status === "PROCESSING"` yang memiliki tombol "Completed"
    - **Validates: Requirements 3.4**
  - [ ]* 5.3 Tulis unit test ListOrder: pesan error fetch tampil saat API gagal
    - Mock `getOrders` agar throw Error; assert pesan error ada di DOM
    - _Requirements: 3.2_
  - [ ]* 5.4 Tulis unit test ListOrder: klik Logout menghapus localStorage dan navigasi ke /login
    - Mock `removeLocalStorage`; klik tombol Logout; assert mock dipanggil dan router navigasi ke `/login`
    - _Requirements: 3.8_

- [ ] 6. Checkpoint — Jalankan `npm run test` dan pastikan semua test yang ada lulus

- [ ] 7. Tambahkan error handling dan loading state ke CreateOrder
  - Di `CreateOrder.tsx`: tambahkan state `menuError: string | null`, `orderError: string | null`, `isSubmitting: boolean`
  - Di `useEffect` fetch menu: bungkus dalam try/catch; set `menuError` dengan `"Daftar menu tidak dapat dimuat. Coba refresh halaman."` saat gagal
  - Di `handleOrder`: bungkus dalam try/catch; set `isSubmitting(true)` sebelum request; set `orderError` dengan `"Gagal membuat order. Coba lagi."` saat gagal; `isSubmitting(false)` di `finally`; navigasi ke `/orders` hanya saat berhasil
  - Teruskan `disabled={isSubmitting}` ke tombol "Order"
  - Perbaiki tampilan harga: ganti `$` dengan `Rp` dan format angka dengan `toLocaleString("id-ID")`
  - Render pesan error untuk `menuError` di atas daftar menu, dan `orderError` di atas form order
  - _Requirements: 4.2, 4.15, 4.6_
  - [ ]* 7.1 Tulis property test: semua menu item tampil dengan format harga yang benar
    - **Property 7: Semua menu item dari API tampil di daftar menu**
    - Mock `getMenus`; generate `fc.array(menuArb, { minLength: 1 })`; assert setiap item ada `alt` text = nama item dan harga diformat `Rp` + pemisah ribuan
    - **Validates: Requirements 4.1, 4.6**
  - [ ]* 7.2 Tulis property test: filter kategori memanggil API dengan parameter yang benar
    - **Property 8: Pemilihan kategori memanggil API dengan parameter kategori yang benar**
    - Mock `getMenus`; generate `fc.constantFrom("Coffee", "Non Coffee", "Pastries", "Desserts", "Sandwiches")`; klik tombol filter; assert `getMenus` dipanggil dengan nilai kategori tersebut. Klik "All": assert dipanggil tanpa argumen kategori (null)
    - **Validates: Requirements 4.4, 4.5**
  - [ ]* 7.3 Tulis unit test CreateOrder: pesan error menu tampil saat API gagal
    - Mock `getMenus` agar throw Error; assert pesan error ada di DOM
    - _Requirements: 4.2_

- [ ] 8. Implementasikan dan uji logika cart di CreateOrder
  - Tidak ada perubahan logika cart yang diperlukan — logika `handleAddToCart` sudah benar
  - [ ]* 8.1 Tulis property test: cart increment/decrement mengubah quantity secara konsisten
    - **Property 9: Cart increment/decrement mengubah quantity secara konsisten**
    - Render CreateOrder dengan mock menu; generate `fc.array(menuArb, { minLength: 1 })` dan `fc.nat({ min: 1, max: 10 })` untuk initial quantity; klik "Add to Cart" lalu "+" dan "-"; assert: `+` menambah quantity 1, `-` pada qty>1 mengurangi 1, `-` pada qty=1 menghapus item
    - **Validates: Requirements 4.7, 4.8, 4.9, 4.10**
  - [ ]* 8.2 Tulis property test: submisi order valid memanggil API dengan data yang benar
    - **Property 10: Submisi order valid memanggil API dengan data yang benar**
    - Mock `createOrder`; generate cart non-kosong dan data pelanggan valid (nama non-kosong, nomor meja 1–5); submit form; assert `createOrder` dipanggil dengan `customerName`, `tableNumber`, dan `cart` yang sesuai
    - **Validates: Requirements 4.14**
  - [ ]* 8.3 Tulis unit test: cart kosong menampilkan "Your cart is empty" tanpa tombol Order
    - Render CreateOrder; assert pesan "Your cart is empty" ada dan tombol "Order" tidak ada di DOM
    - _Requirements: 4.12_

- [ ] 9. Tambahkan error handling dan loading state ke DetailOrder
  - Di `DetailOrder.tsx`: tambahkan state `error: string | null` dan `isLoading: boolean`
  - Di `useEffect` fetch order: bungkus dalam try/catch; set `error` dengan `"Data order tidak ditemukan atau tidak dapat dimuat."` saat gagal; `isLoading(false)` di `finally`
  - Render pesan error saat `error !== null`; render loading indicator saat `isLoading`
  - Perbaiki format subtotal: ganti `$` dengan `Rp` dan format harga dengan `toLocaleString("id-ID")`
  - _Requirements: 5.2, 5.4_
  - [ ]* 9.1 Tulis property test: detail order menampilkan semua field order
    - **Property 11: Detail order menampilkan semua field order**
    - Mock `getOrderById`; generate `fc.record(orderArb)` dengan cart yang bervariasi; assert DOM berisi `order.id`, `order.customer_name`, `order.table_number`, `order.status`, `order.total`; untuk setiap cart item assert nama item dan `price × quantity` ada di DOM
    - **Validates: Requirements 5.1, 5.3, 5.4**
  - [ ]* 9.2 Tulis unit test DetailOrder: pesan error tampil saat API gagal
    - Mock `getOrderById` agar throw Error; assert pesan error ada di DOM
    - _Requirements: 5.2_

- [ ] 10. Uji ProtectedRoute dan autentikasi
  - [ ]* 10.1 Tulis property test: ProtectedRoute mengarahkan berdasarkan status token
    - **Property 4: ProtectedRoute mengarahkan berdasarkan status token**
    - Mock `getLocalStorage`; generate `fc.option(fc.string({ minLength: 1 }))` untuk nilai auth; assert: null/undefined → render `<Navigate to="/login" />`; string non-kosong → render children
    - **Validates: Requirements 2.6, 6.1, 6.2, 6.3**
  - [ ]* 10.2 Tulis unit test: pengguna terotentikasi di `/login` diarahkan ke `/orders`
    - Render ProtectedRoute di path `/login` dengan auth ada; assert `<Navigate to="/orders" />` dirender
    - _Requirements: 6.5_
  - [ ]* 10.3 Tulis unit test Home: heading dan link Login ada
    - Assert teks "Welcome To WPU Cafe" ada; assert link ke `/login` ada di DOM
    - _Requirements: 1.1, 1.2_

- [ ] 11. Checkpoint akhir — Jalankan `npm run build` dan `npm run test`
  - Pastikan semua test lulus dan tidak ada TypeScript error
  - Pastikan semua 12 property test berjalan dengan minimum 100 iterasi (`numRuns: 100` di fast-check)
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan

---

## Notes

- Task yang ditandai `*` bersifat opsional dan bisa dilewati untuk MVP yang lebih cepat
- Setiap property test harus diberi komentar tag: `// Feature: cafe-frontend-ui, Property N: <teks property>`
- Semua property test dikonfigurasi dengan `fc.assert(fc.property(...), { numRuns: 100 })`
- Arbitraries yang digunakan ulang (`orderArb`, `menuArb`, `cartItemArb`) didefinisikan di `src/test/arbitraries.ts`
- Perubahan pada UI primitives (task 2) bersifat backward-compatible — tidak ada breaking change pada komponen yang sudah menggunakan Button/Input/Select
- Perbaikan format harga (`$` → `Rp` dengan pemisah ribuan) diperlukan di CreateOrder dan DetailOrder agar Property 7 dan 11 dapat diverifikasi
