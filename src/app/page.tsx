"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  FileText,
  Loader2,
  Sparkles,
  Layers,
} from "lucide-react";

type Mode = "quiz" | "concepts" | "revision" | null;

export default function HomePage() {
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<Mode>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(selected: Mode) {
    if (!notes.trim()) {
      setError("Paste some study notes first.");
      return;
    }
    setMode(selected);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, mode: selected }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              NoteForge
            </h1>
            <p className="text-xs text-zinc-400">AI-powered study companion</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Turn notes into mastery
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Paste your study notes and instantly generate interactive quizzes,
            concept breakdowns, and high-yield revision packs.
          </p>
        </section>

        {/* Input */}
        <Card className="bg-zinc-900/70 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              Your Notes
            </CardTitle>
            <CardDescription>
              Paste plain text, Markdown, or any study material.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your lecture notes, textbook excerpts, or study material here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleGenerate("quiz")}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500"
              >
                {loading && mode === "quiz" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                Generate Quiz
              </Button>

              <Button
                onClick={() => handleGenerate("concepts")}
                disabled={loading}
                variant="outline"
                className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
              >
                {loading && mode === "concepts" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Layers className="h-4 w-4" />
                )}
                Concept Breakdown
              </Button>

              <Button
                onClick={() => handleGenerate("revision")}
                disabled={loading}
                variant="outline"
                className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
              >
                {loading && mode === "revision" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                Revision Pack
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-zinc-900/70 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white capitalize">
                {mode === "quiz" && "Interactive Quiz"}
                {mode === "concepts" && "Concept Breakdown"}
                {mode === "revision" && "Revision Pack"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === "quiz" && result.questions && (
                <div className="space-y-4">
                  {result.questions.map((q: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-mono text-indigo-400 mt-1">
                          Q{i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-zinc-100 font-medium">{q.question}</p>
                          {q.type === "mcq" && q.options && (
                            <ul className="mt-2 space-y-1">
                              {q.options.map((opt: string, j: number) => (
                                <li
                                  key={j}
                                  className="text-sm text-zinc-400 pl-2"
                                >
                                  • {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="mt-2 text-sm text-emerald-400">
                            Answer: {q.answer}
                          </p>
                          {q.explanation && (
                            <p className="text-xs text-zinc-500 mt-1">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {mode === "concepts" && result.concepts && (
                <div className="space-y-4">
                  {result.concepts.map((c: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 space-y-2"
                    >
                      <h3 className="text-lg font-semibold text-indigo-300">
                        {c.title}
                      </h3>
                      <p className="text-zinc-300 text-sm">{c.summary}</p>
                      {c.keyPoints?.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                          {c.keyPoints.map((p: string, j: number) => (
                            <li key={j}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mode === "revision" && (
                <div className="space-y-6">
                  {result.cheatSheet && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Cheat Sheet
                      </h3>
                      <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-300 whitespace-pre-wrap">
                        {result.cheatSheet}
                      </div>
                    </div>
                  )}

                  {result.flashcards?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Flashcards
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {result.flashcards.map((fc: any, i: number) => (
                          <div
                            key={i}
                            className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3"
                          >
                            <p className="text-sm font-medium text-indigo-300">
                              {fc.front}
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">{fc.back}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.highYield?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        High-Yield Points
                      </h3>
                      <ul className="space-y-1">
                        {result.highYield.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-zinc-300 flex gap-2"
                          >
                            <span className="text-indigo-400">▸</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
        NoteForge · Built with Next.js & AI
      </footer>
    </div>
  );
}
