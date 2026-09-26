import type { Note, QuizAttempt, RevisionItem } from '@/types/domain';
import { addDays } from '@/utils/date';

const computeConfidence = (attempts: QuizAttempt[]): number => {
  if (attempts.length === 0) return 0.2;
  const average = attempts.reduce((sum, attempt) => sum + attempt.score / attempt.total, 0) / attempts.length;
  return Math.max(0.1, Math.min(1, Number(average.toFixed(2))));
};

const confidenceToDays = (confidence: number): number => {
  if (confidence > 0.85) return 7;
  if (confidence > 0.65) return 4;
  if (confidence > 0.45) return 2;
  return 1;
};

export const buildRevisionQueue = (notes: Note[], attempts: QuizAttempt[]): RevisionItem[] => {
  return notes.flatMap((note) => {
    const noteAttempts = attempts.filter((attempt) => attempt.noteId === note.id);
    const confidence = computeConfidence(noteAttempts);
    const dueDate = addDays(new Date().toISOString(), confidenceToDays(confidence) - 2);

    return note.concepts.slice(0, 2).map((concept, index) => ({
      id: `rev-${note.id}-${index}`,
      noteId: note.id,
      concept,
      confidence,
      dueDate,
      status: 'due' as const,
    }));
  });
};

export const completeRevisionItem = (item: RevisionItem): RevisionItem => {
  const nextConfidence = Math.min(1, Number((item.confidence + 0.15).toFixed(2)));

  return {
    ...item,
    confidence: nextConfidence,
    dueDate: addDays(new Date().toISOString(), confidenceToDays(nextConfidence)),
    lastReviewedAt: new Date().toISOString(),
    status: 'completed',
  };
};
