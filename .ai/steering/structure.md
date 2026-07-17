# Project Structure Steering

The repository is divided into two primary subsystems: Client (Frontend) and Server (Backend).

## High-Level Directory Layout
```text
smartai-tutor/
├── .ai/              # Agent instruction and steering files
├── frontend/         # React SPA client
├── backend/          # Python Flask API
└── readme.md         # Project documentation
```

## Frontend Structure (Atomic Design)
The frontend application inside `/frontend` follows Atomic Design principles for organizing components:
- `src/components/atoms/` - Fundamental building blocks (e.g., buttons, inputs, avatars, icons, spinners).
- `src/components/molecules/` - Combinations of atoms (e.g., search bar, chat bubble, curriculum options).
- `src/components/organisms/` - Complex UI sections (e.g., sidebar history, chat message feed, settings panel, welcome/selection form).
- `src/components/templates/` - Page-level layouts and grid shells (e.g., AppShell layout).
- `src/pages/` - Concrete pages combining templates and data (e.g., MainChatPage).
- `src/store/` - Zustand store definitions.
- `src/utils/` - Helper functions and API fetch abstractions.
- `src/types/` - Shared TypeScript interfaces.

## Backend Structure
The backend application inside `/backend` follows a simple Flask monolithic structure:
- `app.py` - Application entry point and route definitions.
- `requirements.txt` - Python dependencies.
- `.env` - Environment variables (excluded from version control).

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


