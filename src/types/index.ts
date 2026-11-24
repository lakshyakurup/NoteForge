export type GenerationMode = "quiz" | "concepts" | "revision";

export type QuizQuestion = {
  type: "mcq" | "fill" | "short";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export type ConceptBreakdown = {
  title: string;
  summary: string;
  keyPoints: string[];
  analogies?: string[];
};

export type RevisionPack = {
  cheatSheet: string;
  flashcards: { front: string; back: string }[];
  highYield: string[];
};

export type GenerateRequest = {
  notes: string;
  mode: GenerationMode;
};

export type UserProfile = {
  name: string;
  email?: string;
};
