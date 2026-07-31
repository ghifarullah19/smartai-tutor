# Requirements Document: Premium UI Refactor (Theme & Loaders)

## Introduction

### Project Context
To make PintarAI visually engaging and modern while maintaining a highly professional feel, the user interface needs a premium redesign. This refactor introduces dynamic light/dark mode support, a green/emerald dominant color scheme, Apple-inspired glassmorphism styles, pulsing skeleton loaders, and a full-screen app initialization splash screen.

### Goal
The goal is to implement:
1. Dynamic theme toggling (defaulting to Light Mode).
2. Sleek green/emerald glassmorphic theme across all components.
3. Component-level skeleton loaders to improve perceived performance during LLM generation.
4. App-level initialization loading screen (splash screen).

---

## Glossary
- **Glassmorphism:** A design style characterized by translucent backgrounds, thin border highlights, and backdrop-blur effects.
- **Skeleton Loader:** Mock elements resembling the layout of the content, which pulse to indicate loading.
- **Splash Screen:** An initial loading viewport shown while the app loads resources.

---

## Requirements

### Requirement 1: Light & Dark Theme Support
**User Story:**  
"As a student, I want to toggle between light and dark themes so that I can study comfortably during both day and night."

**Acceptance Criteria:**
1. THE application SHALL default to **Light Mode** on the first launch.
2. THE Settings Modal SHALL provide an option/switch to toggle between Light and Dark mode.
3. WHEN the theme is toggled, THE root DOM element (`document.documentElement`) SHALL update its classes to include `.dark` (for dark mode) or remove it (for light mode).
4. THE active theme selection SHALL be persisted in `localStorage` under key `pintarai-theme`.

### Requirement 2: Emerald Green & Glassmorphism Design
**User Story:**  
"As a student, I want a premium and clean interface with calm green accents so that my learning environment looks professional and is easy on the eyes."

**Acceptance Criteria:**
1. THE color theme of active items (primary buttons, active badges, active chat bubbles) SHALL be dominantly emerald/green.
2. ALL panels (Sidebar, Main Chat Area, Modals, Welcome Onboarding Card) SHALL apply Apple-style glassmorphism:
   - **Light Mode:** Translucent white background (`bg-white/70`), border blur (`backdrop-blur-md`), thin border (`border-white/20`), soft dark shadow.
   - **Dark Mode:** Translucent slate/gray background (`bg-slate-900/70`), border blur (`backdrop-blur-md`), thin border (`border-slate-800/30`), dark shadow.
3. THE text colors SHALL maintain high contrast against backgrounds (compliant with WCAG AA accessibility standards).

### Requirement 3: Component Skeleton Loaders
**User Story:**  
"As a student, I want to see a layout placeholder when waiting for AI responses so that I know the app is actively loading the answer."

**Acceptance Criteria:**
1. THE system SHALL display a bot chat bubble containing a pulsing layout skeleton when a message is pending (`isLoading === true`).
2. THE skeleton bubble SHALL render at least 3 pulsing horizontal lines representing mock paragraphs.
3. THE typing spinner SHALL be positioned below the skeleton loading block.

### Requirement 4: App Initialization Splash Screen
**User Story:**  
"As a student, I want to see a clean loading splash screen when the app opens so that I don't see half-loaded elements."

**Acceptance Criteria:**
1. WHEN the application starts, THE viewport SHALL render a full-screen loading screen (Splash Screen) blocking access to the rest of the application.
2. THE Splash Screen SHALL contain:
   - PintarAI logo.
   - A smooth loading indicator/spinner.
   - An initializing text ("Memuat PintarAI...").
3. THE Splash Screen SHALL disappear automatically once user ID initialization and chat history recovery from `localStorage` complete.
