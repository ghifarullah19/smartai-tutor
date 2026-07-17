# Technical Steering

## Tech Stack
### Frontend
- **Language:** TypeScript 6
- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **State Management:** Zustand

### Backend
- **Language:** Python 3.x
- **Framework:** Flask
- **AI Engine:** Google Gemini API (via `google-generativeai`)

## Engineering Principles
1. **Component-Driven Frontend:** Use reusable, highly cohesive React components.
2. **Modern State Management:** Rely on Zustand for global states (e.g., user sessions, chat history) instead of complex prop-drilling or context providers.
3. **Strict Typing:** Enforce TypeScript rules aggressively to catch errors at compile-time.
4. **API Security:** API keys (Gemini) must reside only in the backend `.env` file. The frontend must never expose AI service credentials directly.
5. **Separation of Concerns:** The frontend strictly handles presentation and UI logic. All business logic, prompt engineering, and database/LLM interactions live in the backend API.
