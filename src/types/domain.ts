export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Note {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  tags: string[];
  content: string;
  concepts: string[];
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestionBase {
  id: string;
  prompt: string;
  type: QuestionType;
  explanation: string;
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface TrueFalseQuestion extends QuizQuestionBase {
  type: 'true-false';
  correctAnswer: 'true' | 'false';
}

export interface ShortAnswerQuestion extends QuizQuestionBase {
  type: 'short-answer';
  correctAnswer: string;
}

export type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export interface Quiz {
  id: string;
  noteId: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  noteId: string;
  answers: Record<string, string>;
  score: number;
  total: number;
  completedAt: string;
}

export interface ConceptExplanation {
  concept: string;
  simple: string;
  detailed: string;
  analogy: string;
  takeaways: string[];
}

export interface RevisionItem {
  id: string;
  noteId: string;
  concept: string;
  confidence: number;
  dueDate: string;
  status: 'due' | 'completed';
  lastReviewedAt?: string;
}

export interface SubjectMastery {
  subject: string;
  mastery: number;
}

export interface DashboardStats {
  totalNotes: number;
  weeklyQuizzes: number;
  currentStreak: number;
  dueRevisions: number;
  averageScore: number;
  masteryBySubject: SubjectMastery[];
}

export interface ActivityItem {
  id: string;
  type: 'note' | 'quiz' | 'revision';
  title: string;
  detail: string;
  timestamp: string;
}

export interface NoteInput {
  title: string;
  subject: string;
  difficulty: Difficulty;
  tags: string;
  content: string;
}
