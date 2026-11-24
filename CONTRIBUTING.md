# Contributing to NoteForge

Thanks for helping build a better study tool for students worldwide.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Guidelines

1. **TypeScript strict** — no `any` unless justified.
2. **Components** — keep UI in `src/components`, logic in `src/lib`.
3. **Tests** — add Vitest coverage for pure functions in `src/lib`.
4. **Commits** — prefer conventional messages: `feat:`, `fix:`, `docs:`.
5. **PRs** — describe what / why; link issues when relevant.

## Code of conduct

Be respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
