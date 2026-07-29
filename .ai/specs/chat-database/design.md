# Chat Database Design

## Database Schema (SQLAlchemy)

**ChatSession**
- `id` (String/UUID or Integer, PK)
- `user_id` (Integer, FK -> User.id)
- `title` (String)
- `subject` (String, nullable)
- `grade` (String, nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Message**
- `id` (Integer, PK)
- `chat_id` (String/UUID or Integer, FK -> ChatSession.id)
- `sender` (String: 'user' or 'ai')
- `text` (Text)
- `timestamp` (DateTime)

## API Design

**Base path:** `/api`
- `GET /api/chats` -> Returns list of chats `[{id, title, subject, grade, updated_at}]`
- `POST /api/chats` -> Body: `{title, subject, grade}`. Returns new chat object.
- `GET /api/chats/<chat_id>/messages` -> Returns list of messages `[{id, sender, text, timestamp}]`
- `POST /api/chats/<chat_id>/ask` -> Body: `{question}`. 
  - Backend fetches previous messages for `chat_id` from DB.
  - Formats history for Gemini context.
  - Gets AI response.
  - Saves User message and AI message to DB.
  - Returns AI response.
- `DELETE /api/chats/<chat_id>` -> Deletes chat and cascades to messages.

## Frontend State Management (`chatStore.ts`)
- Remove `persist` middleware since data will live in the backend.
- State: `chats`, `activeChatId`, `messages` (for active chat), `isLoading`.
- Actions: `fetchChats()`, `createNewChat()`, `selectChat(id)`, `deleteChat(id)`, `sendMessage(text)`.
- When `selectChat` is called, it triggers `fetchMessages(id)`.

## Modifications Required
- `backend/models.py` (Add tables)
- `backend/app.py` (Add endpoints, modify `/ask`)
- `frontend/src/store/chatStore.ts` (Refactor to use fetch API)
- `frontend/src/components/organisms/Sidebar/Sidebar.tsx` (Update to use async fetch)
- `frontend/src/components/organisms/ChatArea/ChatArea.tsx` (Update to use async fetch and messages state)
