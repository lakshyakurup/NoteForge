import { Badge } from '@/components/primitives/Badge';
import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/States';
import type { Note } from '@/types/domain';

export const NoteDetail = ({ note }: { note: Note | undefined }) => {
  if (!note) {
    return <EmptyState title="Select a note" detail="Pick a note to view full details and concepts." />;
  }

  return (
    <Card title={note.title} description={`${note.subject} · ${note.difficulty}`}>
      <p>{note.content}</p>
      <p className="muted">Word count: {note.wordCount}</p>
      <h4>Tags</h4>
      <div className="chip-wrap">
        {note.tags.map((tag) => (
          <Badge key={tag} label={tag} />
        ))}
      </div>
      <h4>Extracted Concepts</h4>
      <div className="chip-wrap">
        {note.concepts.map((concept) => (
          <Badge key={concept} label={concept} />
        ))}
      </div>
    </Card>
  );
};
