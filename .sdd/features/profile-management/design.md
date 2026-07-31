# Profile Management Design

## Architecture
- **Frontend State**: Managed via Zustand in `authStore.ts`. The state holds the current user's data (`user.name`, `user.email`). An `updateUser(userData)` action will be added.
- **Frontend Components**:
  - `ProfileMenu`: Will trigger `setIsProfileOpen(true)` in `authStore` or `chatStore`.
  - `ProfileModal`: A new modal component similar to `SettingsModal` that renders input fields for `name`, `email`, and `password`. It will also contain the "Hapus Akun" (Delete Account) button moved from `SettingsModal`.
- **Backend Routing**:
  - `PUT /account`: Protected by `@token_required`. Accepts JSON payload `{"name": "...", "email": "...", "password": "..."}`. Updates the current user's database record.

## Data Flow
1. User opens `ProfileModal`.
2. Component reads `name` and `email` from `useAuthStore().user` to populate input fields.
3. User edits fields and clicks "Simpan".
4. Frontend sends `PUT /account` to Flask backend with the modified fields.
5. Backend validates the input, hashes the password (if provided), and updates the DB.
6. Backend responds with success and the updated user object.
7. Frontend calls `updateUser` to sync the new data in the global Zustand state.

## Components Affected
- `frontend/src/store/authStore.ts` (State actions)
- `frontend/src/components/molecules/ProfileMenu/ProfileMenu.tsx` (Trigger button)
- `frontend/src/components/organisms/SettingsModal/SettingsModal.tsx` (Remove Delete Account button)
- `frontend/src/components/organisms/ProfileModal/ProfileModal.tsx` (New Component)
- `backend/app.py` (New `PUT /account` route)
