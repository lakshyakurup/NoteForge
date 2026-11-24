export type SessionProgress = {
  notesReady: boolean;
  summary: boolean;
  quiz: boolean;
  concepts: boolean;
  revision: boolean;
  tutorMessages: number;
  cardsKnown: number;
  cardsLearning: number;
  updatedAt: string;
};

const KEY = "noteforge_progress";

export function getProgress(): SessionProgress {
  if (typeof window === "undefined") {
    return empty();
  }
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

export function patchProgress(patch: Partial<SessionProgress>) {
  if (typeof window === "undefined") return;
  const next = { ...getProgress(), ...patch, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

function empty(): SessionProgress {
  return {
    notesReady: false,
    summary: false,
    quiz: false,
    concepts: false,
    revision: false,
    tutorMessages: 0,
    cardsKnown: 0,
    cardsLearning: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function progressPercent(p: SessionProgress): number {
  const bits = [p.notesReady, p.summary, p.quiz, p.concepts, p.revision, p.tutorMessages > 0];
  const done = bits.filter(Boolean).length;
  return Math.round((done / bits.length) * 100);
}
