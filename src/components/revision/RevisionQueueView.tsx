import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/States';
import type { Note, RevisionItem } from '@/types/domain';
import { isDue } from '@/utils/date';

interface RevisionQueueViewProps {
  notes: Note[];
  revisions: RevisionItem[];
  onComplete: (itemId: string) => void;
}

export const RevisionQueueView = ({ notes, revisions, onComplete }: RevisionQueueViewProps) => {
  const dueItems = revisions.filter((item) => item.status === 'due' && isDue(item.dueDate));

  return (
    <Card title="Personalized Revision Queue" description="Due items are prioritized using recent quiz confidence.">
      {dueItems.length === 0 ? (
        <EmptyState title="No due items" detail="You're caught up. Complete a quiz to schedule the next review batch." />
      ) : (
        <ul className="list-grid">
          {dueItems.map((item) => {
            const note = notes.find((candidate) => candidate.id === item.noteId);
            return (
              <li key={item.id} className="revision-item">
                <h4>{item.concept}</h4>
                <p>{note?.title ?? 'Unknown note'}</p>
                <p className="muted">Confidence: {Math.round(item.confidence * 100)}%</p>
                <Button onClick={() => onComplete(item.id)}>Mark reviewed</Button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};
