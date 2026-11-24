"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportQuizPdf } from "@/lib/export-pdf";

export type QuizQuestion = {
  type: "mcq" | "fill" | "short";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

type Props = {
  questions: QuizQuestion[];
};

export function QuizPlayer({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  if (!questions?.length) {
    return <p className="text-muted-foreground text-sm">No questions generated.</p>;
  }

  const q = questions[current];
  const total = questions.length;

  function selectAnswer(value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current]: value }));
  }

  function normalize(s: string) {
    return s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
  }

  function isCorrect(idx: number) {
    const user = answers[idx];
    if (!user) return false;
    const correct = questions[idx].answer;
    if (questions[idx].type === "mcq") {
      return (
        normalize(user) === normalize(correct) ||
        normalize(user).includes(normalize(correct)) ||
        normalize(correct).includes(normalize(user))
      );
    }
    return (
      normalize(user) === normalize(correct) ||
      normalize(user).includes(normalize(correct)) ||
      normalize(correct).includes(normalize(user))
    );
  }

  const score = submitted
    ? questions.reduce((acc, _, i) => acc + (isCorrect(i) ? 1 : 0), 0)
    : 0;

  function handleSubmit() {
    setSubmitted(true);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setCurrent(0);
  }

  const progress = ((current + 1) / total) * 100;

  return (
    <div className="space-y-4">
      {/* Progress + export */}
      <div className="flex items-center justify-between text-sm text-muted-foreground gap-2 flex-wrap">
        <span>
          Question {current + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          {submitted && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Trophy className="h-4 w-4 text-amber-500" />
              Score: {score}/{total} ({Math.round((score / total) * 100)}%)
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => exportQuizPdf(questions)}
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <span className="px-2 py-0.5 rounded bg-muted">{q.type}</span>
          </div>
          <CardTitle className="text-lg leading-snug">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.type === "mcq" && q.options ? (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[current] === opt;
                let stateClass = "";
                if (submitted) {
                  const correct =
                    normalize(opt) === normalize(q.answer) ||
                    normalize(q.answer).includes(normalize(opt));
                  if (correct) stateClass = "border-emerald-500 bg-emerald-500/10";
                  else if (selected) stateClass = "border-red-500 bg-red-500/10";
                } else if (selected) {
                  stateClass = "border-indigo-500 bg-indigo-500/10";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={submitted}
                    onClick={() => selectAnswer(opt)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors",
                      "hover:bg-muted/50 disabled:cursor-default",
                      stateClass || "border-border"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              disabled={submitted}
              value={answers[current] ?? ""}
              onChange={(e) => selectAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )}

          {submitted && (
            <div
              className={cn(
                "rounded-md p-3 text-sm space-y-1",
                isCorrect(current)
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-red-500/10 text-red-700 dark:text-red-300"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                {isCorrect(current) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Correct
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" /> Incorrect
                  </>
                )}
              </div>
              <p>
                <span className="opacity-70">Answer: </span>
                {q.answer}
              </p>
              {q.explanation && (
                <p className="opacity-80 text-xs mt-1">{q.explanation}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {!submitted && current === total - 1 && (
            <Button size="sm" onClick={handleSubmit} disabled={!answers[current]}>
              Submit Quiz
            </Button>
          )}
          {submitted && (
            <Button size="sm" variant="outline" onClick={handleReset} className="gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={current === total - 1}
          onClick={() => setCurrent((c) => c + 1)}
        >
          Next
        </Button>
      </div>

      {/* Score summary after submit */}
      {submitted && (
        <Card className="border-indigo-500/30 bg-indigo-500/5">
          <CardContent className="pt-6 text-center space-y-2">
            <Trophy className="h-8 w-8 mx-auto text-amber-500" />
            <p className="text-2xl font-bold">
              {score} / {total}
            </p>
            <p className="text-sm text-muted-foreground">
              {score === total
                ? "Perfect score! 🎉"
                : score >= total * 0.7
                ? "Great job!"
                : score >= total * 0.4
                ? "Keep practicing!"
                : "Review the notes and try again."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
