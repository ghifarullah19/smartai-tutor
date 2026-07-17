# Design Document: Premium UI Refactor (Theme & Loaders)

## 1. Architectural Impact & Store Updates

We will expand the Zustand store `IChatState` ([chatStore.ts](file:///C:/Users/ghifa/Documents/code/smartai-tutor/frontend/src/store/chatStore.ts)) with theme state and app loading states:

### State Updates
```typescript
export interface IChatState {
  // Existing state...
  theme: 'light' | 'dark';
  isAppLoading: boolean;
  
  // Actions
  toggleTheme: () => void;
  setAppLoading: (loading: boolean) => void;
  // Existing actions...
}
```

### Theme Sync Logic
In the store initialization (`initUserId`):
- Read `pintarai-theme` from `localStorage`.
- Default to `'light'` if not found.
- Apply theme class directly to the root DOM:
  ```typescript
  const root = window.document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  ```

---

## 2. Glassmorphism Tokens & Style Theme (Tailwind CSS v4)

We will switch the core color accent from **Violet/Indigo** to **Emerald/Green** and implement responsive light/dark glass effects.

### Accent Palette
- Light mode accent: `from-emerald-500 to-green-600` / `bg-emerald-600`
- Dark mode accent: `from-emerald-600 to-green-700` / `bg-emerald-700`

### CSS Glassmorphic Rules (composed in `.module.css` files)
- **Light Mode Glass:**
  ```css
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.04);
  ```
- **Dark Mode Glass:**
  ```css
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  ```

---

## 3. Component Structure & Changes

We will create and modify the following files:

```text
src/
├── components/
│   ├── atoms/
│   │   └── Skeleton/          # Pulsing placeholder loader (NEW)
│   │       ├── index.tsx
│   │       ├── Skeleton.tsx
│   │       └── Skeleton.module.css
│   ├── organisms/
│   │   ├── SplashScreen/      # Fullscreen initialization screen (NEW)
│   │   │   ├── index.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── SplashScreen.module.css
│   │   ├── SettingsModal.tsx  # Add theme switcher UI (MODIFIED)
│   │   └── ChatArea.tsx       # Render skeleton during load states (MODIFIED)
│   └── templates/
│       └── AppShell.tsx       # Update layout background (MODIFIED)
├── pages/
│   └── MainChatPage.tsx       # Bind splash screen loader (MODIFIED)
```

### Skeleton Component Design
Props for `Skeleton.tsx`:
```typescript
export interface ISkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}
```
Inside the CSS:
```css
.skeleton {
  @apply animate-pulse rounded-md bg-slate-200 dark:bg-slate-800;
}
.circle {
  @apply rounded-full;
}
```

### Splash Screen Design
A sleek viewport displaying:
- A pulsing emerald gradient circular glow.
- App logo: "PintarAI" in bold gradient text.
- Clean text loader: "Menuat PintarAI...".
