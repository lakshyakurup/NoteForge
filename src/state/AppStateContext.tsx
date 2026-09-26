import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { seedActivity, seedAttempts, seedNotes, seedRevisionItems } from '@/data/seedData';
import { NoteRepository } from '@/repositories/noteRepository';
import { getDashboardStats } from '@/services/dashboardService';
import { MockAIProvider } from '@/services/ai/MockAIProvider';
import { createQuiz, gradeQuiz } from '@/services/quizService';
import { buildRevisionQueue, completeRevisionItem } from '@/services/revisionService';
import type {
  ActivityItem,
  ConceptExplanation,
  DashboardStats,
  Note,
  NoteInput,
  Quiz,
  QuizAttempt,
  RevisionItem,
} from '@/types/domain';

interface AppStateValue {
  notes: Note[];
  selectedNoteId: string | null;
  activities: ActivityItem[];
  attempts: QuizAttempt[];
  revisions: RevisionItem[];
  currentQuiz: Quiz | null;
  currentStreak: number;
  dashboardStats: DashboardStats;
  selectNote: (noteId: string) => void;
  createNote: (input: NoteInput) => Note;
  updateNote: (id: string, input: NoteInput) => Note | undefined;
  generateQuiz: (noteId: string) => Promise<Quiz | null>;
  submitQuiz: (quiz: Quiz, answers: Record<string, string>) => QuizAttempt;
  explainConcept: (noteId: string, concept: string) => Promise<ConceptExplanation>;
  completeRevision: (itemId: string) => void;
}

const noteRepository = new NoteRepository(seedNotes);
const aiProvider = new MockAIProvider();

const AppStateContext = createContext<AppStateValue | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(noteRepository.list());
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id ?? null);
  const [activities, setActivities] = useState<ActivityItem[]>(seedActivity);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(seedAttempts);
  const [revisions, setRevisions] = useState<RevisionItem[]>(seedRevisionItems);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentStreak, setCurrentStreak] = useState(5);

  const dashboardStats = useMemo(
    () => getDashboardStats(notes, attempts, revisions, currentStreak),
    [notes, attempts, revisions, currentStreak],
  );

  const createNoteHandler = (input: NoteInput): Note => {
    const note = noteRepository.create(input);
    const updatedNotes = noteRepository.list();
    setNotes(updatedNotes);
    setSelectedNoteId(note.id);
    setRevisions(buildRevisionQueue(updatedNotes, attempts));
    setActivities((prev) => [
      {
        id: `activity-${crypto.randomUUID()}`,
        type: 'note',
        title: 'Added note',
        detail: `Created ${note.title}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    return note;
  };

  const updateNoteHandler = (id: string, input: NoteInput): Note | undefined => {
    const note = noteRepository.update(id, input);
    if (!note) {
      return undefined;
    }

    const updatedNotes = noteRepository.list();
    setNotes(updatedNotes);
    setRevisions(buildRevisionQueue(updatedNotes, attempts));
    return note;
  };

  const generateQuizHandler = async (noteId: string): Promise<Quiz | null> => {
    const note = noteRepository.getById(noteId);
    if (!note) return null;
    const quiz = await createQuiz(aiProvider, note);
    setCurrentQuiz(quiz);
    return quiz;
  };

  const submitQuizHandler = (quiz: Quiz, answers: Record<string, string>): QuizAttempt => {
    const attempt = gradeQuiz(quiz, answers);
    const nextAttempts = [attempt, ...attempts];
    setAttempts(nextAttempts);
    setCurrentStreak((prev) => prev + 1);
    setRevisions(buildRevisionQueue(notes, nextAttempts));
    setActivities((prev) => [
      {
        id: `activity-${crypto.randomUUID()}`,
        type: 'quiz',
        title: 'Completed quiz',
        detail: `Scored ${Math.round((attempt.score / attempt.total) * 100)}% on ${
          noteRepository.getById(quiz.noteId)?.title ?? 'selected note'
        }`,
        timestamp: attempt.completedAt,
      },
      ...prev,
    ]);
    return attempt;
  };

  const explainConceptHandler = async (noteId: string, concept: string): Promise<ConceptExplanation> => {
    const note = noteRepository.getById(noteId);
    if (!note) {
      throw new Error('Note not found.');
    }
    return aiProvider.explainConcept(note, concept);
  };

  const completeRevisionHandler = (itemId: string) => {
    setRevisions((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) {
          return item;
        }
        return completeRevisionItem(item);
      }),
    );

    setActivities((prev) => [
      {
        id: `activity-${crypto.randomUUID()}`,
        type: 'revision',
        title: 'Completed revision',
        detail: 'Reviewed a due concept and updated confidence.',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const value: AppStateValue = {
    notes,
    selectedNoteId,
    activities,
    attempts,
    revisions,
    currentQuiz,
    currentStreak,
    dashboardStats,
    selectNote: setSelectedNoteId,
    createNote: createNoteHandler,
    updateNote: updateNoteHandler,
    generateQuiz: generateQuizHandler,
    submitQuiz: submitQuizHandler,
    explainConcept: explainConceptHandler,
    completeRevision: completeRevisionHandler,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateValue => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
