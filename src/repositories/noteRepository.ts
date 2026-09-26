import type { Note, NoteInput } from '@/types/domain';
import { normalizeTags, countWords, extractConcepts } from '@/utils/text';

export class NoteRepository {
  private notes: Note[];

  constructor(seedNotes: Note[]) {
    this.notes = [...seedNotes];
  }

  list(): Note[] {
    return [...this.notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getById(id: string): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  create(input: NoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: `note-${crypto.randomUUID()}`,
      title: input.title.trim(),
      subject: input.subject.trim(),
      difficulty: input.difficulty,
      tags: normalizeTags(input.tags),
      content: input.content.trim(),
      concepts: extractConcepts(input.content),
      wordCount: countWords(input.content),
      createdAt: now,
      updatedAt: now,
    };

    this.notes = [note, ...this.notes];
    return note;
  }

  update(id: string, input: NoteInput): Note | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const updated: Note = {
      ...existing,
      title: input.title.trim(),
      subject: input.subject.trim(),
      difficulty: input.difficulty,
      tags: normalizeTags(input.tags),
      content: input.content.trim(),
      concepts: extractConcepts(input.content),
      wordCount: countWords(input.content),
      updatedAt: new Date().toISOString(),
    };

    this.notes = this.notes.map((note) => (note.id === id ? updated : note));
    return updated;
  }
}
