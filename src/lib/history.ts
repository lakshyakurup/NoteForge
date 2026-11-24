export type HistoryEntry = {
  id: string;
  title: string;
  mode: "quiz" | "concepts" | "revision";
  notesPreview: string;
  /** Full notes text (may be truncated for very large pastes) */
  notes: string;
  result: any;
  createdAt: string;
};

const STORAGE_KEY = "noteforge_history";
const USER_KEY = "noteforge_user";
const MAX_NOTES_CHARS = 50_000; // keep localStorage under control

export function getUser(): { name: string; email?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: { name: string; email?: string } | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(
  entry: Omit<HistoryEntry, "id" | "createdAt" | "notesPreview"> & {
    notes: string;
  }
) {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const notes =
    entry.notes.length > MAX_NOTES_CHARS
      ? entry.notes.slice(0, MAX_NOTES_CHARS) + "\n\n…[truncated]"
      : entry.notes;

  const newEntry: HistoryEntry = {
    ...entry,
    notes,
    notesPreview: notes.slice(0, 120),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...history].slice(0, 50); // keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export function deleteHistoryItem(id: string) {
  if (typeof window === "undefined") return;
  const updated = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
