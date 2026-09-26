import { useMemo, useState } from 'react';
import { Badge } from '@/components/primitives/Badge';
import { EmptyState } from '@/components/primitives/States';
import type { Difficulty, Note } from '@/types/domain';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelect: (noteId: string) => void;
}

export const NotesList = ({ notes, selectedNoteId, onSelect }: NotesListProps) => {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');

  const subjects = useMemo(() => Array.from(new Set(notes.map((note) => note.subject))), [notes]);

  const filteredNotes = useMemo(() => {
    const term = search.toLowerCase();
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.tags.some((tag) => tag.toLowerCase().includes(term));
      const matchesSubject = subjectFilter === 'all' || note.subject === subjectFilter;
      const matchesDifficulty = difficultyFilter === 'all' || note.difficulty === difficultyFilter;
      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  }, [notes, search, subjectFilter, difficultyFilter]);

  return (
    <section>
      <h2>Notes</h2>
      <div className="filters" role="search">
        <input
          aria-label="Search notes"
          className="input"
          placeholder="Search notes, tags, or content"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select aria-label="Filter by subject" className="input" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by difficulty"
          className="input"
          value={difficultyFilter}
          onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | 'all')}
        >
          <option value="all">All difficulty levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyState title="No notes matched" detail="Try a different filter or create a new note." />
      ) : (
        <ul className="list-grid">
          {filteredNotes.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                className={`note-tile ${selectedNoteId === note.id ? 'selected' : ''}`}
                onClick={() => onSelect(note.id)}
              >
                <h3>{note.title}</h3>
                <p className="muted">{note.subject}</p>
                <p>{note.wordCount} words · {note.difficulty}</p>
                <div className="chip-wrap">
                  {note.tags.map((tag) => (
                    <Badge key={tag} label={tag} />
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
