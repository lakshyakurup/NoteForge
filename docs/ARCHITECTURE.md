# NoteForge Architecture

## Overview

NoteForge is a **Next.js 15 App Router** application. All AI work runs server-side via `/api/generate`. Client state (history, profile, theme) lives in the browser.

## Request flow

1. User pastes notes or uploads a file (`FileUpload` → text).
2. Client POSTs `{ notes, mode }` to `/api/generate`.
3. Route validates body with **Zod**.
4. `lib/ai.ts` selects Gemini or OpenAI, enforces JSON-only responses.
5. Client renders `QuizPlayer` / concepts / `Flashcard` grid.
6. Session is written to **localStorage** history (full notes + result).

## Modes

| Mode | Function | Response shape |
|------|----------|----------------|
| `quiz` | `generateQuiz` | `{ questions: QuizQuestion[] }` |
| `concepts` | `generateConceptBreakdown` | `{ concepts: ConceptBreakdown[] }` |
| `revision` | `generateRevisionPack` | `RevisionPack` |

## Security notes

- API keys never leave the server (`process.env`).
- No user content is persisted on the server in v1.
- History is local-only; clearing browser data clears history.

## Future extensions

- Server-side auth (Auth.js / Clerk) + Postgres (`tools/sql/schema.sql`).
- Streaming AI responses.
- Multi-file batch upload.
- Real-time collaborative study rooms.
