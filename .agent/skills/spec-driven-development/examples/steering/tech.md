# Tech Stack

## Core

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript ~6.0 |
| Build tool | Vite 8 |
| Routing | React Router v7 (`createBrowserRouter`) |
| Styling | CSS Modules (`*.module.css`) — no CSS-in-JS, no utility framework |
| State management | Local component state only (`useState`, `useEffect`) — no Redux, Zustand, or Context |
| HTTP | Native `fetch` wrapped in `src/utils/fetch.ts` |
| Storage | `localStorage` helpers in `src/utils/storage.ts` |

## Dev Dependencies

- `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` for linting
- No test framework is set up yet (Vitest + Testing Library is the planned stack per design spec)

## Environment

Runtime config lives in `.env.local`:

```
VITE_API_URL=https://wpu-cafe.vercel.app/api
```

Accessed via `src/constants/environment.ts` using `import.meta.env.VITE_API_URL`.

## Common Commands

```bash
# Start development server
npm run dev

# Type-check + production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

## Notes

- No `vite.config.ts` is present — Vite uses its defaults with `@vitejs/plugin-react`.
- There is no global state management library. State is colocated in page components.
- CSS class names use kebab-case inside `.module.css` files and are accessed via the `styles` object (e.g., `styles['button-primary']`).
