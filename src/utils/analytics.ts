import type { DashboardStats, Note, QuizAttempt, RevisionItem, SubjectMastery } from '@/types/domain';
import { isDue } from './date';

const masteryForSubject = (notes: Note[], attempts: QuizAttempt[], subject: string): number => {
  const subjectNoteIds = notes.filter((note) => note.subject === subject).map((note) => note.id);
  const subjectAttempts = attempts.filter((attempt) => subjectNoteIds.includes(attempt.noteId));

  if (subjectAttempts.length === 0) {
    return 0;
  }

  const totalScore = subjectAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total, 0);
  return Math.round((totalScore / subjectAttempts.length) * 100);
};

export const buildSubjectMastery = (notes: Note[], attempts: QuizAttempt[]): SubjectMastery[] => {
  const subjects = Array.from(new Set(notes.map((note) => note.subject)));
  return subjects
    .map((subject) => ({
      subject,
      mastery: masteryForSubject(notes, attempts, subject),
    }))
    .sort((a, b) => b.mastery - a.mastery);
};

export const buildDashboardStats = (
  notes: Note[],
  attempts: QuizAttempt[],
  revisions: RevisionItem[],
  currentStreak: number,
): DashboardStats => {
  const averageScore =
    attempts.length === 0
      ? 0
      : Math.round(
          (attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length) * 10,
        ) / 10;

  return {
    totalNotes: notes.length,
    weeklyQuizzes: attempts.filter(
      (attempt) => Date.now() - new Date(attempt.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
    ).length,
    currentStreak,
    dueRevisions: revisions.filter((item) => item.status === 'due' && isDue(item.dueDate)).length,
    averageScore,
    masteryBySubject: buildSubjectMastery(notes, attempts),
  };
};
