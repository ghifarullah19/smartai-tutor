# Tasks: React Migration and Curriculum Chat UI

- [x] 1. Backend Custom Prompt Update
  - Modify `backend/app.py` to extract `grade` and `subject` from the request JSON body.
  - If both `grade` and `subject` are present, create a system prompt explaining that the AI model is a virtual tutor specialized for a high school student in `{grade}` for `{subject}`.
  - Prepend this system instruction to the prompt context or configure the Gemini model's system instruction on generation.
  - Requirements: 3.1, 3.2


- [x] 2. Initialize React, Vite, TypeScript, and Tailwind CSS in `/frontend`
  - Backup existing native files (`index.html`, `script.js`, `style.css`) into a backup folder `/frontend_legacy/`.
  - Check Vite creation options using `npx -y create-vite@latest --help`.
  - Initialize Vite app inside `/frontend` with template `react-ts`.
  - Install dependencies: `zustand`, `lucide-react`, `katex`, `react-markdown`, `remark-math`, `rehype-katex`, `tailwindcss`, `postcss`, `autoprefixer`.
  - Initialize Tailwind CSS configuration file and setup `/frontend/src/index.css` with Tailwind directives.
  - Requirements: 1.1, 4.1

- [x] 3. Implement Zustand Store and Types
  - Create `src/types/chat.ts` with definitions for interfaces `IMessage` and `IChatSession` (applying the `I` naming prefix).
  - Create `src/store/chatStore.ts` using Zustand managing state interface `IChatState`.
  - Configure Zustand with `persist` middleware to automatically synchronize the chat sessions list to browser `localStorage` under key `pintarai-chats`.
  - Implement basic actions: `createNewChat`, `selectChat`, `deleteChat`, `setCurriculum`, `setSearchQuery`, `clearAllData`.
  - Requirements: 4.1, 4.2, 4.3, 4.4

- [x] 4. Build Atomic Components
  - Ensure each component is created in its own folder under `src/components/atoms/` containing `index.tsx` (re-export), `ComponentName.tsx` (implementation), and `ComponentName.module.css` (scoped styling):
    - `Button/` (styled button types: primary gradient, secondary outline, flat)
    - `Input/` (input styling, search inputs)
    - `Avatar/` (renders user profile avatar image/letter)
    - `Spinner/` (CSS animation thinking state indicator)
  - Ensure each molecule is created in its own folder under `src/components/molecules/` with matching folder layout:
    - `SearchBar/` (filters sidebar chats using the `Input` atom)
    - `OptionCard/` (cards for selecting single subject/grade)
    - `ChatBubble/` (renders message text, user/bot styles, using KaTeX and react-markdown)
  - Requirements: 1.1, 1.2, 1.3, 3.4

- [x] 5. Build Organisms Components
  - Ensure each organism is created in its own folder under `src/components/organisms/` with matching folder layout:
    - `Sidebar/` (includes "Chat Baru" button, search bar, list of past session items, and settings triggers)
    - `WelcomeForm/` (interactive grid using `OptionCard` molecules for grade/subject selections and "Mulai Belajar" launch buttons)
    - `ChatArea/` (manages chat message list, bottom chat text-area input, and typing indicators)
    - `SettingsModal/` (system configuration overlay with a button to wipe data)
  - Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.3, 4.4

- [x] 6. Build Templates and Pages
  - Ensure each template/page is created in its own folder with matching folder layout:
    - **Templates** in `src/components/templates/AppShell/` (responsive dashboard shell with a layout grid, managing sidebar slide-in overlay on mobile and main content container)
    - **Pages** in `src/pages/MainChatPage/` (concrete page rendering `AppShell` with connected Zustand state hooks, modal triggers, and optional `MainChatPage.constants.ts` for static curriculum lists)
  - Requirements: 1.1, 1.4, 4.1



- [x] 7. Verify Integration and Responsive Styling
  - Verify message histories are persistent in local storage.
  - Verify that when Grade & Subject are selected, backend Gemini output adjusts tone and scope to match high school curriculum.
  - Check layout response on mobile screens <=768px (ensure sidebar collapses and overlays properly).
  - Verify that clearing data clears all entries and resets the UI state.
  - Requirements: 3.1, 4.4

