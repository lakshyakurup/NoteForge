import { useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { ErrorState, LoadingState } from '@/components/primitives/States';
import type { Note, Quiz } from '@/types/domain';

interface QuizBuilderPanelProps {
  notes: Note[];
  onGenerateQuiz: (noteId: string) => Promise<Quiz | null>;
}

export const QuizBuilderPanel = ({ notes, onGenerateQuiz }: QuizBuilderPanelProps) => {
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const quiz = await onGenerateQuiz(selectedNoteId);
      if (!quiz) {
        setError('Could not generate quiz for this note.');
      }
    } catch {
      setError('Quiz generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Generate Quiz" description="Create deterministic mock-AI practice questions from a note.">
      <div className="inline-controls">
        <select
          aria-label="Choose note for quiz"
          className="input"
          value={selectedNoteId}
          onChange={(event) => setSelectedNoteId(event.target.value)}
        >
          {notes.map((note) => (
            <option key={note.id} value={note.id}>
              {note.title}
            </option>
          ))}
        </select>
        <Button onClick={handleGenerate} disabled={loading || !selectedNoteId}>
          Generate Quiz
        </Button>
      </div>
      {loading ? <LoadingState label="Generating quiz from note..." /> : null}
      {error ? <ErrorState message={error} /> : null}
    </Card>
  );
};
