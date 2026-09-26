# NoteForge

NoteForge is a production-style local MVP for AI-assisted study workflows. It converts notes into deterministic mock-AI quizzes, concept explanations, and personalized revision actions without requiring external API keys.

## Features

- **Dashboard & landing**: study snapshot, streak, due revisions, quick actions, and recent activity.
- **Notes workflow**: searchable/filterable note list, detail view, create/edit form, tags, difficulty, subject, and word count.
- **Learning workflow**: generate quizzes from notes with multiple-choice, true/false, and short-answer questions; submit answers with scoring and explanations.
- **Concept explanations**: select concepts from a note and receive layered output (simple, detailed, analogy, takeaways) with loading/error states.
- **Personalized revision**: confidence-based revision queue with due items and completion actions.
- **Analytics**: streak, average score, mastery by subject, and recent quiz performance.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **State Management**: React context provider with typed domain actions
- **Data Layer**: in-memory repository/service modules with seed demo data
- **AI Abstraction**: deterministic `MockAIProvider` behind an `AIProvider` interface seam
- **Testing**: Vitest + Testing Library

## Project Structure

```text
src/
  components/
    analytics/
    concepts/
    dashboard/
    layout/
    learning/
    notes/
    primitives/
    revision/
  data/               # seed demo data
  repositories/       # in-memory note repository
  services/           # quiz/revision/dashboard + AI provider
  state/              # app-wide state context
  types/              # strict domain models
  utils/              # validation, analytics, text/date helpers
  test/               # test setup
```

## Scripts

```bash
npm install
npm run dev        # start local app
npm run lint       # lint with oxlint
npm run typecheck  # strict TypeScript checks
npm run test       # run unit/component tests
npm run build      # production build
```

## Architecture Notes

- Domain entities are explicitly typed (`Note`, `Quiz`, `QuizQuestion`, `QuizAttempt`, `RevisionItem`, `DashboardStats`, etc.).
- Components are split by product workflow and use shared UI primitives for consistency/accessibility.
- Form input is validated before note creation/update via `validateNoteInput`.
- Data access is routed through repository/services so a real API/database can replace the in-memory layer later.
- Mock AI outputs are deterministic, enabling stable local demos and tests.

## Future Integration Points

- Swap `MockAIProvider` with OpenAI/Gemini-backed provider implementation.
- Replace in-memory repositories with persistence (e.g., REST API + database).
- Add authentication and collaborative note sharing when needed.
