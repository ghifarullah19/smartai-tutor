# Project Structure

```
src/
├── App.tsx                        # Root — just renders <RouterProvider>
├── main.tsx                       # ReactDOM.createRoot entry point
│
├── routes/
│   ├── index.tsx                  # Exports the router (createBrowserRouter)
│   ├── Route.tsx                  # RouteObject[] definitions — all routes live here
│   └── ProtectedRoute.tsx         # Auth guard: redirects to /login if no token
│
├── components/
│   ├── pages/                     # One folder per page/route
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── ListOrder/
│   │   ├── CreateOrder/
│   │   └── DetailOrder/
│   └── ui/                        # Reusable primitive components
│       ├── Button/
│       ├── Input/
│       └── Select/
│
├── services/                      # API calls — pure async functions, no side effects
│   ├── auth.service.ts
│   ├── menu.service.ts
│   └── orders.service.ts
│
├── types/                         # Shared TypeScript interfaces
│   ├── auth.ts                    # ILogin
│   └── order.ts                   # IMenu, ICart, IOrder
│
├── constants/
│   └── environment.ts             # Wraps import.meta.env variables
│
└── utils/
    ├── fetch.ts                   # Thin wrapper around native fetch
    └── storage.ts                 # getLocalStorage / setLocalStorage / removeLocalStorage
```

## Conventions

### Component folders
Each component (page or UI) lives in its own folder with a consistent file set:

```
ComponentName/
├── index.tsx              # Re-exports the component (allows clean imports)
├── ComponentName.tsx      # Implementation
└── ComponentName.module.css   # Scoped styles
```

Page components may also include a `ComponentName.constants.ts` for static data (e.g., filter lists, table options).

### Naming
- Components and their folders: `PascalCase`
- Functions, variables, props: `camelCase`
- CSS classes inside modules: `kebab-case`
- Service files: `*.service.ts`
- CSS module files: `*.module.css`
- Type/interface names: `PascalCase` prefixed with `I` for interfaces (e.g., `IOrder`, `IMenu`)

### Services
All API calls go through `src/services/`. Services import `fetchAPI` from `utils/fetch.ts` and `environment.API_URL` from `constants/environment.ts`. Auth-protected endpoints attach the JWT from `getLocalStorage("auth")` as a `Bearer` token in the `Authorization` header.

### Routing
Route definitions are centralized in `src/routes/Route.tsx`. Every protected route is wrapped in `<ProtectedRoute>`. The `ProtectedRoute` component checks `localStorage["auth"]` — falsy redirects to `/login`, and accessing `/login` while authenticated redirects to `/orders`.

### State
All state is local to page components using `useState`/`useEffect`. There is no global store. A `refetchOrder` boolean flag pattern is used in `ListOrder` to trigger re-fetches after mutations.
