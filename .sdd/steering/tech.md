# Technical Steering

## Tech Stack
### Frontend (Deployed to Vercel)
- **Language:** TypeScript 6
- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **State Management:** Zustand

### Backend (Serverless Microservices on Vercel)
- **Language:** Python 3.x
- **Framework:** FastAPI
- **AI Engine:** Groq API
- **API Gateway:** Vercel Rewrites / Edge Network
- **Tracing/Observability:** Vercel Runtime Logs (Phase 1), Sentry (Phase 2)
- **Database:** Supabase (PostgreSQL)
- **ORM:** SQLAlchemy (with psycopg2-binary driver)

## Engineering Principles
1. **Component-Driven Frontend:** Use reusable, highly cohesive React components.
2. **Modern State Management:** Rely on Zustand for global states (e.g., user sessions, chat history).
3. **Strict Typing:** Enforce TypeScript rules aggressively to catch errors at compile-time.
4. **API Security:** API keys (Groq) must reside only in the backend environment variables on Vercel. The frontend must never expose AI service credentials directly.
5. **Serverless Architecture:** The backend must be stateless. State and database persistence are managed by external serverless databases.
6. **Separation of Concerns:** The frontend strictly handles presentation. All business logic and AI interactions live in the FastAPI Serverless backend.
7. **RESTful Communication:** Frontend and backend communicate synchronously via strictly defined REST APIs.
