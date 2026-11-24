"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  Layers,
  Download,
  ScrollText,
  HelpCircle,
  CalendarDays,
  Zap,
  MessageSquare,
  Send,
  CheckCircle2,
  Circle,
  ArrowLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUpload } from "@/components/file-upload";
import { QuizPlayer } from "@/components/quiz-player";
import { Flashcard } from "@/components/flashcard";
import { HistoryPanel } from "@/components/history-panel";
import { AuthDialog } from "@/components/auth-dialog";
import { DemoBanner } from "@/components/demo-banner";
import { LoadingState } from "@/components/loading-state";
import { AppSidebar, type AppTab } from "@/components/app-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import {
  getUser,
  getHistory,
  saveToHistory,
  type HistoryEntry,
} from "@/lib/history";
import { exportConceptsPdf, exportRevisionPdf } from "@/lib/export-pdf";
import { DEMO_NOTES } from "@/lib/demo-data";
import {
  getProgress,
  patchProgress,
  progressPercent,
  type SessionProgress,
} from "@/lib/progress";

type GenMode =
  | "quiz"
  | "concepts"
  | "revision"
  | "summary"
  | "explain"
  | "plan";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function AppWorkspace() {
  const [tab, setTab] = useState<AppTab>("forge");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<GenMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUserState] = useState<{ name: string; email?: string } | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [health, setHealth] = useState<any>(null);
  const [studyIndex, setStudyIndex] = useState(0);
  const [progress, setProgress] = useState<SessionProgress | null>(null);

  // Tutor
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setUserState(getUser());
    setHistoryCount(getHistory().length);
    setProgress(getProgress());
  }, [tab, result]);

  useEffect(() => {
    if (notes.trim().length > 40) {
      setProgress(patchProgress({ notesReady: true })!);
    }
  }, [notes]);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      setHealth(await res.json());
    } catch {
      setHealth({ ok: false });
    }
  }, []);

  useEffect(() => {
    if (tab === "status") fetchHealth();
  }, [tab, fetchHealth]);

  async function handleGenerate(selected: GenMode) {
    if (!notes.trim()) {
      setError("Paste or upload study notes first.");
      return;
    }
    if (selected === "explain" && !term.trim()) {
      setError("Enter a term to explain.");
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
        body: JSON.stringify({ notes, mode: selected, term: term || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }
      const data = await res.json();
      setResult(data);

      const titleMap: Record<GenMode, string> = {
        quiz: `Quiz · ${data.questions?.length ?? 0} Qs`,
        concepts: `Concepts · ${data.concepts?.length ?? 0}`,
        revision: "Revision Pack",
        summary: data.title || "Summary",
        explain: `Explain · ${data.term || term}`,
        plan: data.title || "Study Plan",
      };

      saveToHistory({
        title: titleMap[selected],
        mode:
          selected === "quiz" || selected === "concepts" || selected === "revision"
            ? selected
            : "revision",
        notes,
        result: data,
      });
      setHistoryCount(getHistory().length);

      if (selected === "quiz") setProgress(patchProgress({ quiz: true })!);
      if (selected === "concepts") setProgress(patchProgress({ concepts: true })!);
      if (selected === "revision") setProgress(patchProgress({ revision: true })!);
      if (selected === "summary") setProgress(patchProgress({ summary: true })!);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function sendTutor() {
    if (!chatInput.trim() || !notes.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    const next = [...chat, { role: "user" as const, content: msg }];
    setChat(next);
    setChatLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, message: msg, history: chat.slice(-10) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tutor error");
      setChat([...next, { role: "assistant", content: data.reply }]);
      setProgress(
        patchProgress({ tutorMessages: (getProgress().tutorMessages || 0) + 1 })!
      );
    } catch (e: any) {
      setChat([
        ...next,
        { role: "assistant", content: e.message || "Tutor unavailable." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function loadFromHistory(entry: HistoryEntry) {
    setNotes(entry.notes || entry.notesPreview || "");
    setResult(entry.result);
    setMode(
      entry.result?.questions
        ? "quiz"
        : entry.result?.concepts
        ? "concepts"
        : entry.result?.flashcards
        ? "revision"
        : entry.result?.sessions
        ? "plan"
        : entry.result?.term
        ? "explain"
        : entry.result?.bullets
        ? "summary"
        : "revision"
    );
    setError(null);
    setTab("forge");
    setHistoryOpen(false);
  }

  function handleExport() {
    if (!result || !mode) return;
    if (mode === "concepts" && result.concepts) exportConceptsPdf(result.concepts);
    else if (mode === "revision") exportRevisionPdf(result);
  }

  function markCard(kind: "known" | "learning") {
    const p = getProgress();
    if (kind === "known") {
      setProgress(patchProgress({ cardsKnown: p.cardsKnown + 1 })!);
    } else {
      setProgress(patchProgress({ cardsLearning: p.cardsLearning + 1 })!);
    }
    const len = result?.flashcards?.length || 0;
    if (studyIndex < len - 1) setStudyIndex((i) => i + 1);
  }

  const flashcards: { front: string; back: string }[] = result?.flashcards || [];
  const pct = progress ? progressPercent(progress) : 0;

  // Extend sidebar tabs conceptually — tutor via settings? Use forge + study + add tutor as status alternate
  // We'll use "settings" slot? Better: map Study for cards, and use a tutor button in forge / dedicated via History replaced... 
  // AppTab type is fixed — use status for system, add tutor in forge area and a quick link. Or repurpose: when tab forge show engines including Tutor chat section.

  return (
    <div className="min-h-screen tech-grid flex flex-col md:flex-row">
      <DemoBanner />
      <AppSidebar active={tab} onChange={setTab} userName={user?.name} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-foreground font-medium">Session</span>
                <span className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                  <span
                    className="block h-full bg-indigo-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span>{pct}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Marketing site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
                {user?.name ?? "Sign in"}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-6">
          {tab === "forge" && (
            <>
              <section className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workspace</h1>
                <p className="text-sm text-muted-foreground">
                  Upload once · generate quizzes, cards, summaries, plans · chat with tutor
                </p>
              </section>

              {/* Progress checklist */}
              {progress && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      ["Notes", progress.notesReady],
                      ["Summary", progress.summary],
                      ["Quiz", progress.quiz],
                      ["Concepts", progress.concepts],
                      ["Revision", progress.revision],
                      ["Tutor", progress.tutorMessages > 0],
                    ] as const
                  ).map(([label, done]) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2"
                    >
                      {done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {label}
                    </div>
                  ))}
                </div>
              )}

              <Card className="glass glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-400" />
                    Notes stream
                  </CardTitle>
                  <CardDescription>PDF · Markdown · TXT · or paste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <FileUpload
                      onTextExtracted={(text) => {
                        setNotes(text);
                        setError(null);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNotes(DEMO_NOTES);
                        setError(null);
                      }}
                    >
                      Load sample
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Paste lecture notes…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[140px] bg-background/50 font-mono text-sm"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { m: "quiz" as GenMode, icon: Brain, label: "Quiz" },
                        { m: "concepts" as GenMode, icon: Layers, label: "Concepts" },
                        { m: "revision" as GenMode, icon: BookOpen, label: "Revision" },
                        { m: "summary" as GenMode, icon: ScrollText, label: "Summary" },
                        { m: "explain" as GenMode, icon: HelpCircle, label: "Explain" },
                        { m: "plan" as GenMode, icon: CalendarDays, label: "Study plan" },
                      ] as const
                    ).map(({ m, icon: Icon, label }) => (
                      <Button
                        key={m}
                        variant={mode === m ? "default" : "outline"}
                        disabled={loading}
                        className={mode === m ? "bg-indigo-600 hover:bg-indigo-500 text-white" : ""}
                        onClick={() => handleGenerate(m)}
                      >
                        {loading && mode === m ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        {label}
                      </Button>
                    ))}
                  </div>

                  <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Term to explain (Explain engine)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* AI Tutor */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-400" />
                    AI Tutor
                  </CardTitle>
                  <CardDescription>Grounded in the notes above · 24/7 clarity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-48 overflow-y-auto rounded-xl border border-border/60 bg-background/40 p-3 space-y-2 text-sm">
                    {chat.length === 0 && (
                      <p className="text-muted-foreground text-xs">
                        Ask anything about your notes — "Explain the Calvin cycle simply" or "Quiz me on ATP".
                      </p>
                    )}
                    {chat.map((m, i) => (
                      <div
                        key={i}
                        className={
                          m.role === "user"
                            ? "ml-8 rounded-lg bg-indigo-600/20 px-3 py-2"
                            : "mr-8 rounded-lg bg-muted/60 px-3 py-2"
                        }
                      >
                        {m.content}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendTutor()}
                      placeholder={notes.trim() ? "Ask your tutor…" : "Add notes first"}
                      disabled={!notes.trim() || chatLoading}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <Button onClick={sendTutor} disabled={!notes.trim() || chatLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {loading && (
                <Card className="glass">
                  <CardContent className="py-8">
                    <LoadingState />
                  </CardContent>
                </Card>
              )}

              {result && !loading && (
                <ResultsBlock
                  mode={mode}
                  result={result}
                  onExport={handleExport}
                  onOpenStudy={() => {
                    setStudyIndex(0);
                    setTab("study");
                  }}
                  flashcards={flashcards}
                  setTerm={setTerm}
                  handleGenerate={handleGenerate}
                />
              )}
            </>
          )}

          {tab === "study" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Study deck</h1>
              {flashcards.length === 0 ? (
                <Card className="glass">
                  <CardContent className="py-12 text-center text-muted-foreground text-sm space-y-4">
                    <p>Generate a Revision Pack first, then practice here.</p>
                    <Button onClick={() => setTab("forge")}>Go to Forge</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Card {studyIndex + 1} / {flashcards.length}
                    {progress && (
                      <span className="ml-3">
                        Known {progress.cardsKnown} · Learning {progress.cardsLearning}
                      </span>
                    )}
                  </p>
                  <div className="max-w-md mx-auto">
                    <Flashcard
                      key={studyIndex}
                      front={flashcards[studyIndex].front}
                      back={flashcards[studyIndex].back}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={() => markCard("learning")}>
                      Still learning
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      onClick={() => markCard("known")}
                    >
                      Knew it
                    </Button>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="ghost"
                      disabled={studyIndex === 0}
                      onClick={() => setStudyIndex((i) => i - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={studyIndex >= flashcards.length - 1}
                      onClick={() => setStudyIndex((i) => i + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">History</h1>
              <Button variant="outline" onClick={() => setHistoryOpen(true)}>
                Open history panel ({historyCount})
              </Button>
            </div>
          )}

          {tab === "status" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">System</h1>
              <Card className="glass">
                <CardContent className="pt-6 space-y-2 font-mono text-sm">
                  {!health && <p>Probing…</p>}
                  {health && (
                    <>
                      <div>ok: {String(health.ok)}</div>
                      <div>demo: {String(health.demo)}</div>
                      <div>gemini: {String(health.ai?.gemini)}</div>
                      <div>openai: {String(health.ai?.openai)}</div>
                      <div>ready: {String(health.ai?.ready)}</div>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={fetchHealth}>
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Card className="glass">
                <CardContent className="pt-6 space-y-3">
                  <p className="text-sm">
                    Operator: <strong>{user?.name ?? "Guest"}</strong>
                  </p>
                  <Button onClick={() => setAuthOpen(true)}>Edit profile</Button>
                  <ThemeToggle />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <MobileTabBar active={tab} onChange={setTab} />
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} onSelect={loadFromHistory} />
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} currentUser={user} onAuthChange={setUserState} />
    </div>
  );
}

function ResultsBlock({
  mode,
  result,
  onExport,
  onOpenStudy,
  flashcards,
  setTerm,
  handleGenerate,
}: any) {
  return (
    <Card className="glass glow-border">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <CardTitle className="capitalize">{mode}</CardTitle>
        <div className="flex gap-2">
          {(mode === "concepts" || mode === "revision") && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-3.5 w-3.5" /> PDF
            </Button>
          )}
          {mode === "revision" && flashcards.length > 0 && (
            <Button variant="outline" size="sm" onClick={onOpenStudy}>
              Open Study
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "quiz" && result.questions && <QuizPlayer questions={result.questions} />}
        {mode === "concepts" &&
          result.concepts?.map((c: any, i: number) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 space-y-2">
              <h3 className="font-semibold text-indigo-300">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.summary}</p>
              <ul className="list-disc list-inside text-sm">
                {c.keyPoints?.map((p: string, j: number) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        {mode === "revision" && (
          <>
            {result.cheatSheet && (
              <pre className="rounded-xl border p-4 text-sm whitespace-pre-wrap">{result.cheatSheet}</pre>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {flashcards.map((fc: any, i: number) => (
                <Flashcard key={i} front={fc.front} back={fc.back} />
              ))}
            </div>
          </>
        )}
        {mode === "summary" && (
          <>
            <p className="text-sm">{result.summary}</p>
            <ul className="list-disc list-inside text-sm">
              {result.bullets?.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </>
        )}
        {mode === "explain" && (
          <div className="text-sm space-y-2">
            <p>{result.definition}</p>
            <p className="text-muted-foreground">{result.simple}</p>
            <p>{result.example}</p>
            <div className="flex flex-wrap gap-2">
              {result.related?.map((r: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  className="text-xs px-2 py-1 rounded-full border"
                  onClick={() => {
                    setTerm(r);
                    handleGenerate("explain");
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === "plan" &&
          result.sessions?.map((s: any, i: number) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="font-semibold text-indigo-300">
                {s.day} · {s.minutes} min
              </div>
              <p className="text-sm">{s.focus}</p>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
