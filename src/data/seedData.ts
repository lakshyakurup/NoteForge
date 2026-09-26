import type { ActivityItem, Note, QuizAttempt, RevisionItem } from '@/types/domain';
import { countWords, extractConcepts } from '@/utils/text';

const now = new Date();

const createNote = (
  id: string,
  title: string,
  subject: string,
  difficulty: Note['difficulty'],
  tags: string[],
  content: string,
  daysAgo: number,
): Note => {
  const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return {
    id,
    title,
    subject,
    difficulty,
    tags,
    content,
    concepts: extractConcepts(content),
    wordCount: countWords(content),
    createdAt,
    updatedAt: createdAt,
  };
};

export const seedNotes: Note[] = [
  createNote(
    'note-1',
    'Cellular Respiration Fundamentals',
    'Biology',
    'intermediate',
    ['metabolism', 'ATP', 'mitochondria'],
    'Cellular respiration converts glucose into ATP through glycolysis, the Krebs cycle, and oxidative phosphorylation. Oxygen acts as the final electron acceptor in the electron transport chain, and proton gradients drive ATP synthase.',
    6,
  ),
  createNote(
    'note-2',
    'French Revolution Timeline',
    'History',
    'beginner',
    ['1789', 'politics', 'social change'],
    'The French Revolution started in 1789 due to economic crisis, social inequality, and political conflict. Key moments include the Storming of the Bastille, the Reign of Terror, and the rise of Napoleon Bonaparte.',
    10,
  ),
  createNote(
    'note-3',
    'Big O Notation Deep Dive',
    'Computer Science',
    'advanced',
    ['algorithms', 'complexity', 'optimization'],
    'Big O notation describes algorithm growth as input size increases. Common classes include O(1), O(log n), O(n), O(n log n), and O(n^2). Understanding time and space complexity helps choose scalable solutions.',
    3,
  ),
  createNote(
    'note-4',
    'Electric Fields and Potential',
    'Physics',
    'intermediate',
    ['electrostatics', 'coulomb', 'potential'],
    'Electric field strength depends on charge and distance according to Coulomb law. Electric potential energy relates to work done by the field, and equipotential surfaces are perpendicular to field lines.',
    1,
  ),
];

export const seedAttempts: QuizAttempt[] = [
  {
    id: 'attempt-1',
    quizId: 'quiz-seed-1',
    noteId: 'note-1',
    answers: {},
    score: 3,
    total: 4,
    completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'attempt-2',
    quizId: 'quiz-seed-2',
    noteId: 'note-3',
    answers: {},
    score: 2,
    total: 4,
    completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const seedRevisionItems: RevisionItem[] = [
  {
    id: 'rev-1',
    noteId: 'note-1',
    concept: 'Oxidative',
    confidence: 0.5,
    dueDate: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    status: 'due',
  },
  {
    id: 'rev-2',
    noteId: 'note-3',
    concept: 'Algorithm',
    confidence: 0.35,
    dueDate: new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString(),
    status: 'due',
  },
];

export const seedActivity: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'quiz',
    title: 'Completed quiz',
    detail: 'Scored 75% on Cellular Respiration Fundamentals',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-2',
    type: 'revision',
    title: 'Revision due',
    detail: 'Review Oxidative concept in Biology notes',
    timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-3',
    type: 'note',
    title: 'Added note',
    detail: 'Created Electric Fields and Potential',
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
