import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QuizAttemptView } from './QuizAttemptView';
import type { Quiz } from '@/types/domain';

const quiz: Quiz = {
  id: 'quiz-1',
  noteId: 'note-1',
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      type: 'true-false',
      prompt: 'Statement',
      correctAnswer: 'true',
      explanation: 'Because it is true.',
    },
  ],
};

describe('QuizAttemptView', () => {
  it('submits answers and shows score output', () => {
    const onSubmit = vi.fn(() => ({
      id: 'attempt-1',
      quizId: quiz.id,
      noteId: quiz.noteId,
      answers: { q1: 'true' },
      score: 1,
      total: 1,
      completedAt: new Date().toISOString(),
    }));

    render(<QuizAttemptView quiz={quiz} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByLabelText(/true/i));
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }));

    expect(onSubmit).toHaveBeenCalled();
    expect(screen.getByText(/score: 1\/1/i)).toBeInTheDocument();
  });
});
