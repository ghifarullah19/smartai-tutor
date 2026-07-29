# Chat Database Requirements

## User Stories
1. As a user, I want my chat sessions and messages to be saved in the database so I can access them from any device.
2. As a user, I want the AI to remember the context of my current chat session so I can have a continuous conversation.
3. As a user, I want to be able to create new chats, view old chats, and delete chats from the sidebar.

## Acceptance Criteria
- [ ] Database contains `ChatSession` and `Message` tables linked to the `User` table.
- [ ] Backend provides REST API endpoints:
  - `GET /api/chats` (List all chats for current user)
  - `POST /api/chats` (Create a new chat)
  - `GET /api/chats/<id>/messages` (Get messages for a chat)
  - `DELETE /api/chats/<id>` (Delete a chat)
  - `POST /api/chats/<id>/ask` (Send a message, get AI response, and save both to DB)
- [ ] Frontend `chatStore.ts` is refactored to fetch and mutate data via the backend REST API instead of `localStorage`.
- [ ] The AI retains memory of the current chat context by retrieving past messages from the database before generating a response.
