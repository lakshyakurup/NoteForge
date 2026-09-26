import { useMemo, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { EmptyState, ErrorState, LoadingState } from '@/components/primitives/States';
import type { ConceptExplanation, Note } from '@/types/domain';

interface ConceptExplainerProps {
  notes: Note[];
  onExplain: (noteId: string, concept: string) => Promise<ConceptExplanation>;
}

export const ConceptExplainer = ({ notes, onExplain }: ConceptExplainerProps) => {
  const [noteId, setNoteId] = useState(notes[0]?.id ?? '');
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null);

  const selectedNote = useMemo(() => notes.find((note) => note.id === noteId), [notes, noteId]);

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    setExplanation(null);
    try {
      const result = await onExplain(noteId, concept);
      setExplanation(result);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Could not explain concept right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Concept Explainer" description="Get simple + deep explanations, analogies, and key takeaways.">
      <div className="inline-controls">
        <select className="input" value={noteId} onChange={(event) => setNoteId(event.target.value)} aria-label="Select note for concept explanation">
          {notes.map((note) => (
            <option key={note.id} value={note.id}>
              {note.title}
            </option>
          ))}
        </select>

        <select className="input" value={concept} onChange={(event) => setConcept(event.target.value)} aria-label="Select concept">
          <option value="">Select concept</option>
          {(selectedNote?.concepts ?? []).map((conceptOption) => (
            <option key={conceptOption} value={conceptOption}>
              {conceptOption}
            </option>
          ))}
        </select>

        <Button onClick={handleExplain} disabled={!concept || !noteId || loading}>
          Explain Concept
        </Button>
      </div>

      {loading ? <LoadingState label="Building layered explanation..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error && !explanation ? (
        <EmptyState title="No concept selected yet" detail="Pick a concept from a note to get an explanation." />
      ) : null}

      {explanation ? (
        <article className="explanation-grid">
          <section>
            <h4>Simple explanation</h4>
            <p>{explanation.simple}</p>
          </section>
          <section>
            <h4>Detailed explanation</h4>
            <p>{explanation.detailed}</p>
          </section>
          <section>
            <h4>Analogy</h4>
            <p>{explanation.analogy}</p>
          </section>
          <section>
            <h4>Key takeaways</h4>
            <ul>
              {explanation.takeaways.map((takeaway) => (
                <li key={takeaway}>{takeaway}</li>
              ))}
            </ul>
          </section>
        </article>
      ) : null}
    </Card>
  );
};
