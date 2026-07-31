# Tasks: Premium UI Refactor (Theme & Loaders)

- [x] 1. Update Zustand Store with Theme and Loading States
  - Modify `src/store/chatStore.ts` to add `theme` ('light' | 'dark') and `isAppLoading` (boolean) to `IChatState`.
  - Implement `toggleTheme` action to swap theme values, update `localStorage` under key `pintarai-theme`, and add/remove the class `dark` on `document.documentElement`.
  - Implement `setAppLoading` action to control initialization overlays.
  - Update `initUserId` to restore the theme preference from storage on load.
  - Requirements: 1.1, 1.3, 1.4

- [x] 2. Build Skeleton Atom Component
  - Create `src/components/atoms/Skeleton/index.tsx`, `Skeleton.tsx`, and `Skeleton.module.css`.
  - Style it to pulse dynamically using standard Tailwind `@apply animate-pulse bg-slate-200 dark:bg-slate-800`.
  - Requirements: 3.1, 3.2

- [x] 3. Build SplashScreen Organism Component
  - Create `src/components/organisms/SplashScreen/index.tsx`, `SplashScreen.tsx`, and `SplashScreen.module.css`.
  - Build a full-screen layout centered on the PintarAI logo with a green glow, a spinner loader, and a "Memuat PintarAI..." indicator.
  - Requirements: 4.1, 4.2

- [x] 4. Add Theme Switcher to SettingsModal
  - Modify `src/components/organisms/SettingsModal/SettingsModal.tsx` to add a theme selection interface (e.g., toggler or buttons for Mode Terang and Mode Gelap).
  - Connect the switcher UI to call the store's `toggleTheme()` action.
  - Apply the emerald/green design to buttons in the modal.
  - Requirements: 1.2, 2.1, 2.2

- [x] 5. Apply Emerald Accent and Glassmorphism Styles
  - Review and modify all `.tsx` and `.module.css` files to replace `violet`/`indigo` references with `emerald`/`green` colors:
    - `Button.module.css` (primary button style)
    - `Input.module.css` (focus ring coloring)
    - `Avatar.module.css` (gradient backgrounds)
    - `OptionCard.module.css` (active border outlines)
    - `ChatBubble.module.css` (user bubble backgrounds)
    - `Sidebar.module.css` (active list indicators)
    - `WelcomeForm.module.css` (header glow and buttons)
  - Apply Apple-style translucent layouts (`backdrop-filter: blur(...)`) to:
    - `Sidebar.module.css`
    - `WelcomeForm.module.css`
    - `ChatArea.module.css`
    - `SettingsModal.module.css`
    - `AppShell.module.css`
  - Ensure dark-mode overrides (`dark:`) are configured for each style.
  - Requirements: 2.1, 2.2, 2.3

- [x] 6. Integrate Splash Screen and Loading States
  - Update `src/pages/MainChatPage/MainChatPage.tsx` to read `isAppLoading` from the store and render `SplashScreen` instead of the main page if `isAppLoading` is true.
  - In `initUserId()` within `chatStore.ts`, set `isAppLoading = true` at start and reset to `false` after a brief delay (600ms) to ensure smooth transition overlays.
  - Update `src/components/organisms/ChatArea/ChatArea.tsx` to display a pulsing `Skeleton` block inside a mock bot chat bubble when `isLoading === true`, instead of the plain text indicator.
  - Requirements: 3.1, 3.2, 3.3, 4.3

- [x] 7. Bundle Build and Verification
  - Run `npm run build` to verify type-checking and Tailwind CSS v4 compiler resolution.
  - Verify that the theme toggles correctly, loads default Light mode first, and matches dark mode variants correctly.
  - Requirements: 1.1, 7.1
