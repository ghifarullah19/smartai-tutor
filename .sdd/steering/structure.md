# Project Structure Steering

The repository is divided into two primary subsystems: Client (Frontend) and Serverless API (Backend). Both are optimized for Vercel deployment.

## High-Level Directory Layout
```text
smartai-tutor/
├── .sdd/             # Agent instruction and steering files
├── frontend/         # React SPA client (Vercel Project 1)
├── backend/          # Python FastAPI Serverless Microservices (Vercel Project 2)
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
- `vercel.json` - Used for API Gateway rewrites to the backend.

## Backend Structure (FastAPI Serverless)
The backend application inside `/backend` follows a layered serverless microservices approach suitable for Vercel deployment:
- `api/` - Directory containing serverless function endpoints.
  - `index.py` - Main FastAPI application entry point.
  - `routers/` - Contains endpoint routers (e.g., `auth_router.py`, `user_router.py`, `chat_router.py`).
- `core/` - Shared business logic, configuration, database connection, and security.
- `models/` - SQLAlchemy Class definitions (Database Table representation).
- `schemas/` - Pydantic Class definitions (Data validation for Request/Response).
- `services/` - Business logic Classes (OOP), e.g., `user_service.py`, `chat_service.py`.
- `requirements.txt` - Python dependencies (FastAPI, uvicorn, groq, pydantic, etc.).
- `vercel.json` - Serverless deployment configuration for Vercel.

## Conventions

### Component folders
Each component (page or UI) lives in its own folder with a consistent file set:

```text
ComponentName/
├── index.tsx              # Re-exports the component (allows clean imports)
├── ComponentName.tsx      # Implementation
└── ComponentName.module.css   # Scoped styles
```

Page components may also include a `ComponentName.constants.ts` for static data.

### Naming
- Components and their folders: `PascalCase`
- Functions, variables, props: `camelCase`
- CSS classes inside modules: `kebab-case`
- Service files: `*.service.ts`
- CSS module files: `*.module.css`
- Type/interface names: `PascalCase` prefixed with `I` for interfaces (e.g., `IOrder`, `IMenu`)
- Python API routes/files: `snake_case` (e.g., `chat_history.py`)
