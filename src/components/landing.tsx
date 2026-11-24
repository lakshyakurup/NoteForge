"use client";

import Link from "next/link";
import {
  Sparkles,
  Brain,
  BookOpen,
  Layers,
  MessageSquare,
  FileText,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pain = [
  {
    title: "Lost in long lectures",
    body: "Attention drifts; the important bits never get written down.",
  },
  {
    title: "Scattered notes",
    body: "Docs, PDFs, and screenshots live in five different places.",
  },
  {
    title: "Read it. Forgot it.",
    body: "Re-reading feels productive but fails under exam pressure.",
  },
  {
    title: "Stuck at midnight",
    body: "No tutor online when a concept finally refuses to click.",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI Quizzes",
    body: "Mixed MCQ, fill-in, and short answers with explanations.",
  },
  {
    icon: BookOpen,
    title: "Flashcards",
    body: "Active recall with Knew it / Still learning tracking.",
  },
  {
    icon: Layers,
    title: "Concept breakdowns",
    body: "Structured explanations, key points, and analogies.",
  },
  {
    icon: FileText,
    title: "Summaries & plans",
    body: "Executive summaries and multi-day study schedules.",
  },
  {
    icon: MessageSquare,
    title: "24/7 AI Tutor",
    body: "Chat about your notes — clarify, quiz, or dig deeper.",
  },
  {
    icon: Zap,
    title: "One upload → full system",
    body: "Paste or upload once; generate every study mode from it.",
  },
];

const steps = [
  { n: "1", t: "Start a session", d: "Open the workspace and paste or upload notes." },
  { n: "2", t: "Generate assets", d: "Quiz, concepts, revision, summary, explain, plan." },
  { n: "3", t: "Practice & chat", d: "Study cards, take quizzes, ask the tutor." },
  { n: "4", t: "Track progress", d: "Session checklist shows what's done and what's left." },
];

const faqs = [
  {
    q: "Who is NoteForge for?",
    a: "Students, self-learners, and anyone turning dense notes into practice material.",
  },
  {
    q: "What files can I upload?",
    a: "PDF, Markdown, and plain text. You can also paste notes directly.",
  },
  {
    q: "Do I need an API key?",
    a: "On the hosted demo, keys are configured server-side. Self-hosters set GEMINI_API_KEY or OPENAI_API_KEY.",
  },
  {
    q: "Is my data stored on a server?",
    a: "History and progress stay in your browser (localStorage). API calls send notes only to generate content.",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Nav */}
      <header className="border-b border-white/5 sticky top-0 z-40 bg-[#07070f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">NoteForge</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/app">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                Open app
              </Button>
            </Link>
            <Link href="/app">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Start free session
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" />
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-16 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/80">
            AI study system · not just another chatbot
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Study smarter.{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Remember more.
            </span>
            <br />
            Stress less.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Turn lectures and notes into quizzes, flashcards, concept maps, study plans, and a
            tutor that stays grounded in <em>your</em> material.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/app">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-6">
                Start free study session
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="outline" className="h-12 border-white/15 text-white hover:bg-white/5">
                How it works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-semibold mb-2">Sound familiar?</h2>
        <p className="text-center text-white/50 mb-10">Studying feels harder than it should.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pain.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2"
            >
              <h3 className="font-medium text-indigo-200">{p.title}</h3>
              <p className="text-sm text-white/50">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16" id="features">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-3">
          One upload → a complete study system
        </h2>
        <p className="text-center text-white/50 mb-12 max-w-xl mx-auto">
          Everything you need to practice active recall, test yourself, and get unstuck — in one
          workspace.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 space-y-3"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-indigo-300" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section className="max-w-6xl mx-auto px-4 py-16" id="how">
        <h2 className="text-center text-2xl font-semibold mb-10">How NoteForge works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="space-y-3">
              <div className="text-3xl font-bold text-indigo-400/80">{s.n}</div>
              <h3 className="font-medium">{s.t}</h3>
              <p className="text-sm text-white/50">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Science-ish */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
          <h2 className="text-2xl font-semibold mb-6">Built on how learning actually works</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-white/60">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-medium">Active recall</div>
                Retrieving beats re-reading — flashcards and quizzes force it.
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-medium">Practice testing</div>
                Spot weak spots before the exam does.
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-medium">Self-explanation</div>
                Tutor chat lets you talk concepts through in your own words.
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-medium">Spaced practice</div>
                Mark cards known vs still learning and return to the hard ones.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <summary className="cursor-pointer font-medium list-none flex justify-between gap-4">
                {f.q}
                <span className="text-white/40 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-white/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl font-bold">Your next study session can be smarter.</h2>
        <p className="text-white/55">
          Upload notes once. Generate a full practice system in minutes.
        </p>
        <Link href="/app">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-8">
            Create free session
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-xs text-white/40">
        NoteForge · Built with Next.js & AI · Open source study companion
      </footer>
    </div>
  );
}
