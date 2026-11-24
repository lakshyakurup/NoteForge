"use client";

import { useEffect, useState } from "react";
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
  History,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUpload } from "@/components/file-upload";
import { QuizPlayer } from "@/components/quiz-player";
import { Flashcard } from "@/components/flashcard";
import { HistoryPanel } from "@/components/history-panel";
import { AuthDialog } from "@/components/auth-dialog";
import {
  getUser,
  saveToHistory,
  type HistoryEntry,
} from "@/lib/history";

type Mode = "quiz" | "concepts" | "revision" | null;

export default function HomePage() {
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<Mode>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUserState] = useState<{ name: string; email?: string } | null>(null);

  useEffect(() => {
    setUserState(getUser());
  }, []);

  async function handleGenerate(selected: Mode) {
    if (!notes.trim()) {
      setError("Paste or upload some study notes first.");
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

      // Save to local history
      const title =
        selected === "quiz"
          ? `Quiz · ${data.questions?.length ?? 0} questions`
          : selected === "concepts"
          ? `Concepts · ${data.concepts?.length ?? 0}`
          : "Revision Pack";

      saveToHistory({
        title,
        mode: selected!,
        notesPreview: notes.slice(0, 120),
        result: data,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function loadFromHistory(entry: HistoryEntry) {
    setNotes(entry.notesPreview); // preview only; full notes not stored to save space
    setMode(entry.mode);
    setResult(entry.result);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">NoteForge</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI-powered study companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setHistoryOpen(true)}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setAuthOpen(true)}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline max-w-[80px] truncate">
                {user?.name ?? "Sign in"}
              </span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Turn notes into mastery
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Upload a PDF or Markdown file, or paste notes — then generate
            interactive quizzes, concept breakdowns, and revision packs.
          </p>
        </section>

        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-indigo-500" />
              Your Notes
            </CardTitle>
            <CardDescription>
              Paste text or upload a .txt / .md / .pdf file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload
              onTextExtracted={(text) => {
                setNotes(text);
                setError(null);
              }}
            />

            <Textarea
              placeholder="Paste your lecture notes, textbook excerpts, or study material here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[180px]"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleGenerate("quiz")}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
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
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">
                {mode === "quiz" && "Interactive Quiz"}
                {mode === "concepts" && "Concept Breakdown"}
                {mode === "revision" && "Revision Pack"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === "quiz" && result.questions && (
                <QuizPlayer questions={result.questions} />
              )}

              {mode === "concepts" && result.concepts && (
                <div className="space-y-4">
                  {result.concepts.map((c: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-card p-4 space-y-2"
                    >
                      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                        {c.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{c.summary}</p>
                      {c.keyPoints?.length > 0 && (
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {c.keyPoints.map((p: string, j: number) => (
                            <li key={j}>{p}</li>
                          ))}
                        </ul>
                      )}
                      {c.analogies?.length > 0 && (
                        <div className="text-xs text-muted-foreground italic pt-1">
                          Analogy: {c.analogies.join(" · ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mode === "revision" && (
                <div className="space-y-6">
                  {result.cheatSheet && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Cheat Sheet
                      </h3>
                      <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                        {result.cheatSheet}
                      </div>
                    </div>
                  )}

                  {result.flashcards?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Flashcards — click to flip
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.flashcards.map((fc: any, i: number) => (
                          <Flashcard key={i} front={fc.front} back={fc.back} />
                        ))}
                      </div>
                    </div>
                  )}

                  {result.highYield?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        High-Yield Points
                      </h3>
                      <ul className="space-y-1.5">
                        {result.highYield.map((item: string, i: number) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-indigo-500 shrink-0">▸</span>
                            {item}
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

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        NoteForge · Built with Next.js & AI
        {user && <> · Signed in as {user.name}</>}
      </footer>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={loadFromHistory}
      />
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        currentUser={user}
        onAuthChange={setUserState}
      />
    </div>
  );
}
