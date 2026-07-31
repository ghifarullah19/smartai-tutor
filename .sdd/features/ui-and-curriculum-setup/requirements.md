# Requirements Document: React Migration and Curriculum Chat UI

## Introduction

### Project Context
PintarAI is an AI virtual tutor designed for high school students in rural ASEAN areas. The current MVP uses Vanilla HTML/CSS/JS. To support modular growth, better state management, and align with the project's steering guidelines, the frontend needs to be migrated to React 19, TypeScript 6, Tailwind CSS, React Router 7, and Zustand.

### Goal
The goal of this specification is to define the requirements for:
1. Migrating the frontend codebase to React 19 + TypeScript + Tailwind CSS + Zustand.
2. Building a modern chat UI with a collapsible/responsive sidebar containing chat history, search, and settings.
3. Adding a curriculum/session selector (Grade and Subject) before initiating a chat.

### Scope
- Rebuilding the frontend client under `frontend/` using Vite, React, TypeScript, Tailwind CSS, and Zustand.
- Adding a modern layout with a sidebar (New Chat, Search, Settings, Chat History) and main Chat Area.
- Implementing an onboarding/session setup modal or card in the Chat Area.
- Enhancing the backend Flask API to process and apply grade and subject contexts if provided.

### Limitations
- Must remain lightweight to run on older devices and slow internet connections.
- Backend hosting cost constraints mean no complex multi-user backend database; sessions will be managed via `localStorage` on the client.

---

## Glossary

- **PintarAI:** The AI virtual tutor application.
- **Zustand:** A lightweight state management library for React.
- **KaTeX:** A fast math typesetting library used to render LaTeX formulas.
- **Curriculum Config:** Grade (10/11/12) and Subject (Math/Physics/Chemistry/etc.) chosen by the user.

---

## Requirements

### Requirement 1: Sidebar Layout & App Shell
**User Story:**  
"As a student, I want to see my past chat history and have quick access to new chat creation and settings in a sidebar so that I can easily navigate my learning sessions."

**Acceptance Criteria:**
1. THE App Shell SHALL display a left-aligned sidebar and a main content area.
2. THE Sidebar SHALL contain:
   - "Chat Baru" button at the top to clear the active chat and open a fresh session.
   - "Cari Chat" text input to filter the chat history list by title/preview.
   - "Pengaturan" button to open settings (e.g., reset all data, change language).
   - "Riwayat Chat" list occupying the remaining vertical space.
3. THE Header SHALL display the app logo/title on the left and the user's profile avatar on the right.
4. THE Sidebar SHALL be responsive (collapsible on mobile screens <=768px).

### Requirement 2: Initial Chat Setup (Curriculum Selector)
**User Story:**  
"As a student starting a session, I want to choose my class grade and subject before chatting so that the AI tutor can customize the explanations to my school curriculum."

**Acceptance Criteria:**
1. WHEN a new chat session is created, THE Chat Area SHALL display a welcome card with two paths:
   - **Path A (Configured Chat):** Select Class (Kelas 10, Kelas 11, Kelas 12) and Subject (Matematika, Fisika, Kimia, Biologi, Bahasa Indonesia, Bahasa Inggris). Clicking "Mulai Belajar" starts the session with that configuration.
   - **Path B (Direct Chat):** Clicking "Langsung Chat" bypasses the selections and starts an unconfigured chat session.
2. THE selected Class and Subject SHALL be displayed in the Chat Area header once the session is active.
3. THE configurations SHALL be stored in the Zustand store and persisted in `localStorage` for the current chat session.

### Requirement 3: Chat Interactivity & Context Injection
**User Story:**  
"As a student, I want the AI tutor to explain academic concepts clearly based on my selected subject and grade, showing math formulas correctly."

**Acceptance Criteria:**
1. WHEN sending a message, THE client SHALL send `question`, `userId`, `grade`, and `subject` to the backend `/ask` endpoint.
2. IF `grade` and `subject` are provided, THE backend SHALL prepend a system prompt directing Gemini to tutor the student in that specific subject and grade level.
3. THE Chat Area SHALL show the user's message, followed by a "PintarAI sedang berpikir..." typing indicator.
4. THE bot response SHALL render markdown and math formulas correctly using KaTeX.

### Requirement 4: State Management & Persistence
**User Story:**  
"As a student, I want my chats to be saved automatically so that I can close the browser and resume my learning later."

**Acceptance Criteria:**
1. THE system SHALL use a Zustand store to manage active chat session, chat history list, and configuration states.
2. THE Zustand store SHALL persist chat history in the browser's `localStorage`.
3. Clicking a past chat in the sidebar SHALL load that chat session's history and configuration.
4. Clicking "Hapus Semua Data" in Settings SHALL clear all chat history from `localStorage` and reset the application state.
