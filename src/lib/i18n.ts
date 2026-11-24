/**
 * Centralized UI strings — base English.
 * Swap `locale` later for full i18n without rewriting components.
 */

export type Locale = "en";

const en = {
  appName: "NoteForge",
  tagline: "AI-powered study companion",
  heroTitle: "Turn notes into mastery",
  heroSubtitle:
    "Upload a PDF or Markdown file, or paste notes — then generate interactive quizzes, concept breakdowns, and revision packs.",
  notesTitle: "Your Notes",
  notesHint: "Paste text or upload a .txt / .md / .pdf file.",
  generateQuiz: "Generate Quiz",
  generateConcepts: "Concept Breakdown",
  generateRevision: "Revision Pack",
  history: "History",
  signIn: "Sign in",
  exportPdf: "Export PDF",
  demoBanner: "Demo mode — sample content, no API calls.",
  emptyNotes: "Paste or upload some study notes first.",
} as const;

const dictionaries = { en } as const;

export function t(locale: Locale = "en") {
  return dictionaries[locale] ?? dictionaries.en;
}
