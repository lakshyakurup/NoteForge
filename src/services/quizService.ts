import type { AIProvider } from '@/services/ai/AIProvider';
import type { Note, Quiz, QuizAttempt, QuizQuestion } from '@/types/domain';

export const createQuiz = async (provider: AIProvider, note: Note): Promise<Quiz> => {
  const questions = await provider.generateQuizQuestions(note);
  return {
    id: `quiz-${note.id}-${Date.now()}`,
    noteId: note.id,
    createdAt: new Date().toISOString(),
    questions,
  };
};

const isAnswerCorrect = (question: QuizQuestion, answer: string): boolean => {
  const normalizedAnswer = answer.trim().toLowerCase();
  const expected = question.correctAnswer.toLowerCase();

  if (question.type === 'short-answer') {
    return normalizedAnswer.includes(expected);
  }

  return normalizedAnswer === expected;
};

export const gradeQuiz = (quiz: Quiz, answers: Record<string, string>): QuizAttempt => {
  const score = quiz.questions.reduce((sum, question) => {
    const answer = answers[question.id] ?? '';
    return isAnswerCorrect(question, answer) ? sum + 1 : sum;
  }, 0);

  return {
    id: `attempt-${crypto.randomUUID()}`,
    quizId: quiz.id,
    noteId: quiz.noteId,
    answers,
    score,
    total: quiz.questions.length,
    completedAt: new Date().toISOString(),
  };
};
