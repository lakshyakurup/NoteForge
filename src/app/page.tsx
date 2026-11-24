"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  exportConceptsPdf,
  exportRevisionPdf,
} from "@/lib/export-pdf";
import { DEMO_NOTES } from "@/lib/demo-data";

type GenMode =
  | "quiz"
  | "concepts"
  | "revision"
  | "summary"
  | "explain"
  | "plan";

export default function HomePage() {
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

  useEffect(() => {
    setUserState(getUser());
    setHistoryCount(getHistory().length);
  }, [tab, result]);

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
        body: JSON.stringify({
          notes,
          mode: selected,
          term: term || undefined,
        }),
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
          selected === "summary" || selected === "explain" || selected === "plan"
            ? "revision"
            : (selected as "quiz" | "concepts" | "revision"),
        notes,
        result: data,
      });
      setHistoryCount(getHistory().length);

      if (selected === "revision" || selected === "quiz") {
        /* stay on forge to show results */
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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

  const flashcards: { front: string; back: string }[] =
    result?.flashcards || [];

  return (
    <div className="min-h-screen tech-grid flex flex-col md:flex-row">
      <DemoBanner />
      <AppSidebar
        active={tab}
        onChange={setTab}
        userName={user?.name}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">NoteForge</span>
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">
              {tab === "forge" && "Generate learning assets from notes"}
              {tab === "study" && "Active recall · flashcard deck"}
              {tab === "history" && "Local session archive"}
              {tab === "status" && "Runtime & AI readiness"}
              {tab === "settings" && "Profile & preferences"}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
                {user?.name ?? "Sign in"}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* ——— FORGE ——— */}
          {tab === "forge" && (
            <>
              <section className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-violet-200 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                  Command center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Six engines · one notes stream · export-ready outputs
                </p>
              </section>

              <Card className="glass glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-400" />
                    Notes stream
                  </CardTitle>
                  <CardDescription>
                    Upload PDF / Markdown / TXT or paste — then fire any engine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
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
                    placeholder="Paste lecture notes, textbook excerpts…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[160px] bg-background/50 font-mono text-sm"
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
                        className={
                          mode === m
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                            : ""
                        }
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

                  {mode === "explain" || true ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Term to explain (for Explain engine)"
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  ) : null}

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}
                </CardContent>
              </Card>

              {loading && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                      Neural pipeline running…
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingState />
                  </CardContent>
                </Card>
              )}

              {result && !loading && (
                <Card className="glass glow-border">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                    <CardTitle className="capitalize">
                      {mode === "quiz" && "Interactive Quiz"}
                      {mode === "concepts" && "Concept Breakdown"}
                      {mode === "revision" && "Revision Pack"}
                      {mode === "summary" && "Executive Summary"}
                      {mode === "explain" && `Explain: ${result.term}`}
                      {mode === "plan" && (result.title || "Study Plan")}
                    </CardTitle>
                    {(mode === "concepts" || mode === "revision") && (
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                    )}
                    {mode === "revision" && flashcards.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setStudyIndex(0);
                          setTab("study");
                        }}
                      >
                        Open Study
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mode === "quiz" && result.questions && (
                      <QuizPlayer questions={result.questions} />
                    )}

                    {mode === "concepts" && result.concepts && (
                      <div className="space-y-4">
                        {result.concepts.map((c: any, i: number) => (
                          <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-2">
                            <h3 className="text-lg font-semibold text-indigo-300">{c.title}</h3>
                            <p className="text-sm text-muted-foreground">{c.summary}</p>
                            {c.keyPoints?.length > 0 && (
                              <ul className="list-disc list-inside text-sm space-y-1">
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
                          <pre className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm whitespace-pre-wrap">
                            {result.cheatSheet}
                          </pre>
                        )}
                        {flashcards.length > 0 && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {flashcards.map((fc: any, i: number) => (
                              <Flashcard key={i} front={fc.front} back={fc.back} />
                            ))}
                          </div>
                        )}
                        {result.highYield?.length > 0 && (
                          <ul className="space-y-1.5">
                            {result.highYield.map((item: string, i: number) => (
                              <li key={i} className="text-sm flex gap-2">
                                <span className="text-indigo-400">▸</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {mode === "summary" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed">{result.summary}</p>
                        {result.bullets && (
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {result.bullets.map((b: string, i: number) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                        {result.keywords && (
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.map((k: string, i: number) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {mode === "explain" && (
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-xs uppercase text-muted-foreground">Definition</div>
                          <p>{result.definition}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase text-muted-foreground">Simple</div>
                          <p>{result.simple}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase text-muted-foreground">Example</div>
                          <p>{result.example}</p>
                        </div>
                        {result.related?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {result.related.map((r: string, i: number) => (
                              <button
                                key={i}
                                type="button"
                                className="text-xs px-2 py-1 rounded-full border border-border hover:border-indigo-500"
                                onClick={() => {
                                  setTerm(r);
                                  handleGenerate("explain");
                                }}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {mode === "plan" && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Total focus time ≈ {result.totalMinutes} min
                        </p>
                        <div className="space-y-3">
                          {result.sessions?.map((s: any, i: number) => (
                            <div
                              key={i}
                              className="rounded-xl border border-border/60 bg-background/40 p-4"
                            >
                              <div className="flex justify-between gap-2">
                                <span className="font-semibold text-indigo-300">{s.day}</span>
                                <span className="text-xs text-muted-foreground">{s.minutes} min</span>
                              </div>
                              <p className="text-sm mt-1">{s.focus}</p>
                              <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                                {s.tasks?.map((t: string, j: number) => (
                                  <li key={j}>{t}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {result.tips?.length > 0 && (
                          <div className="text-xs text-muted-foreground space-y-1">
                            {result.tips.map((t: string, i: number) => (
                              <p key={i}>💡 {t}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* ——— STUDY ——— */}
          {tab === "study" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Study deck</h1>
              {flashcards.length === 0 ? (
                <Card className="glass">
                  <CardContent className="py-12 text-center text-muted-foreground text-sm">
                    Generate a <strong>Revision Pack</strong> first, then open Study.
                    <div className="mt-4">
                      <Button onClick={() => setTab("forge")}>Go to Forge</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Card {studyIndex + 1} / {flashcards.length}
                  </p>
                  <div className="max-w-md mx-auto">
                    <Flashcard
                      key={studyIndex}
                      front={flashcards[studyIndex].front}
                      back={flashcards[studyIndex].back}
                    />
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      disabled={studyIndex === 0}
                      onClick={() => setStudyIndex((i) => i - 1)}
                    >
                      Previous
                    </Button>
                    <Button
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

          {/* ——— HISTORY ——— */}
          {tab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">History</h1>
                <span className="text-xs text-muted-foreground">{historyCount} sessions</span>
              </div>
              <Button variant="outline" onClick={() => setHistoryOpen(true)}>
                Open full history panel
              </Button>
              <p className="text-sm text-muted-foreground">
                Sessions are stored in your browser (localStorage). Full notes are restored when you reopen an entry.
              </p>
            </div>
          )}

          {/* ——— STATUS ——— */}
          {tab === "status" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">System status</h1>
              <Card className="glass">
                <CardContent className="pt-6 space-y-3 font-mono text-sm">
                  {!health && <p className="text-muted-foreground">Probing /api/health…</p>}
                  {health && (
                    <>
                      <Row label="service" value={health.service || "—"} />
                      <Row label="ok" value={String(health.ok)} ok={health.ok} />
                      <Row label="demo" value={String(health.demo)} />
                      <Row label="gemini" value={String(health.ai?.gemini)} ok={health.ai?.gemini} />
                      <Row label="openai" value={String(health.ai?.openai)} ok={health.ai?.openai} />
                      <Row label="ai ready" value={String(health.ai?.ready)} ok={health.ai?.ready} />
                      <Row label="timestamp" value={health.timestamp || "—"} />
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={fetchHealth}>
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ——— SETTINGS ——— */}
          {tab === "settings" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Local-only operator identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Signed in as:{" "}
                    <strong>{user?.name ?? "Guest"}</strong>
                    {user?.email ? ` · ${user.email}` : ""}
                  </p>
                  <Button onClick={() => setAuthOpen(true)}>Edit profile</Button>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeToggle />
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>API notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Keys are configured on the server (Vercel env vars).</p>
                  <p>
                    Modes: quiz · concepts · revision · summary · explain · plan — all hit{" "}
                    <code className="text-indigo-300">POST /api/generate</code>
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <MobileTabBar active={tab} onChange={setTab} />

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

function Row({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/40 pb-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={ok === true ? "text-emerald-400" : ok === false ? "text-red-400" : ""}>
        {value}
      </span>
    </div>
  );
}
