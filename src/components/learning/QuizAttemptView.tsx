import { useMemo, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import type { Quiz, QuizAttempt } from '@/types/domain';

interface QuizAttemptViewProps {
  quiz: Quiz;
  onSubmit: (quiz: Quiz, answers: Record<string, string>) => QuizAttempt;
}

export const QuizAttemptView = ({ quiz, onSubmit }: QuizAttemptViewProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  const percentage = useMemo(() => {
    if (!attempt) return null;
    return Math.round((attempt.score / attempt.total) * 100);
  }, [attempt]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempt(onSubmit(quiz, answers));
  };

  return (
    <Card title="Practice Quiz">
      <form onSubmit={handleSubmit} className="form-grid">
        {quiz.questions.map((question) => (
          <fieldset key={question.id} className="question-block">
            <legend>{question.prompt}</legend>
            {question.type === 'multiple-choice'
              ? question.options.map((option) => (
                  <label key={option} className="option-line">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: event.target.value,
                        }))
                      }
                    />
                    {option}
                  </label>
                ))
              : null}

            {question.type === 'true-false' ? (
              <div className="inline-controls">
                {['true', 'false'].map((value) => (
                  <label key={value} className="option-line">
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: event.target.value,
                        }))
                      }
                    />
                    {value}
                  </label>
                ))}
              </div>
            ) : null}

            {question.type === 'short-answer' ? (
              <input
                className="input"
                type="text"
                aria-label={`Answer for ${question.prompt}`}
                value={answers[question.id] ?? ''}
                onChange={(event) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: event.target.value,
                  }))
                }
              />
            ) : null}
          </fieldset>
        ))}

        <Button type="submit">Submit Quiz</Button>
      </form>

      {attempt ? (
        <section aria-live="polite">
          <h4>
            Score: {attempt.score}/{attempt.total} ({percentage}%)
          </h4>
          <ul>
            {quiz.questions.map((question) => (
              <li key={question.id}>
                <strong>{question.prompt}</strong>
                <p>{question.explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Card>
  );
};
