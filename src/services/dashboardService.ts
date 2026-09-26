import type { DashboardStats, Note, QuizAttempt, RevisionItem } from '@/types/domain';
import { buildDashboardStats } from '@/utils/analytics';

export const getDashboardStats = (
  notes: Note[],
  attempts: QuizAttempt[],
  revisions: RevisionItem[],
  currentStreak: number,
): DashboardStats => buildDashboardStats(notes, attempts, revisions, currentStreak);
