import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export type QuizQuestion = {
  type: "mcq" | "fill" | "short";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export type ConceptBreakdown = {
  title: string;
  summary: string;
  keyPoints: string[];
  analogies?: string[];
};

export type RevisionPack = {
  cheatSheet: string;
  flashcards: { front: string; back: string }[];
  highYield: string[];
};

export type SummaryResult = {
  title: string;
  summary: string;
  bullets: string[];
  keywords: string[];
};

export type ExplainResult = {
  term: string;
  definition: string;
  simple: string;
  example: string;
  related: string[];
};

export type StudyPlanResult = {
  title: string;
  totalMinutes: number;
  sessions: { day: string; focus: string; minutes: number; tasks: string[] }[];
  tips: string[];
};

const systemPrompt = `You are NoteForge, an expert AI tutor.
You turn raw study notes into clear, accurate learning materials.
Always respond with valid JSON only. No markdown fences.`;

function getProvider() {
  const preferred = process.env.AI_PROVIDER?.toLowerCase();
  if (preferred === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (preferred === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error("No AI API key found. Set GEMINI_API_KEY or OPENAI_API_KEY.");
}

function cleanJson(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return text.trim();
}

async function callAI(prompt: string): Promise<string> {
  const provider = getProvider();

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(prompt);
    return cleanJson(result.response.text());
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });
  return cleanJson(completion.choices[0]?.message?.content ?? "{}");
}

export async function generateQuiz(notes: string, count = 8): Promise<QuizQuestion[]> {
  const prompt = `From the following study notes, generate exactly ${count} quiz questions.
Mix of multiple-choice (mcq), fill-in-the-blank (fill), and short-answer (short).

Return JSON:
{"questions":[{"type":"mcq"|"fill"|"short","question":"string","options":["A","B","C","D"],"answer":"string","explanation":"short"}]}

Notes:\n${notes}`;
  const parsed = JSON.parse(await callAI(prompt));
  return parsed.questions ?? [];
}

export async function generateConceptBreakdown(notes: string): Promise<ConceptBreakdown[]> {
  const prompt = `Break down key concepts from these notes.
Return JSON:
{"concepts":[{"title":"","summary":"","keyPoints":[],"analogies":[]}]}

Notes:\n${notes}`;
  const parsed = JSON.parse(await callAI(prompt));
  return parsed.concepts ?? [];
}

export async function generateRevisionPack(notes: string): Promise<RevisionPack> {
  const prompt = `Create a high-yield revision pack.
Return JSON:
{"cheatSheet":"","flashcards":[{"front":"","back":""}],"highYield":[]}

Notes:\n${notes}`;
  return JSON.parse(await callAI(prompt));
}

export async function generateSummary(notes: string): Promise<SummaryResult> {
  const prompt = `Summarize these study notes for fast review.
Return JSON:
{"title":"","summary":"2-4 sentence overview","bullets":["key point"],"keywords":["term"]}

Notes:\n${notes}`;
  return JSON.parse(await callAI(prompt));
}

export async function explainTerm(notes: string, term: string): Promise<ExplainResult> {
  const prompt = `Explain the term "${term}" in the context of these notes.
Return JSON:
{"term":"${term}","definition":"precise","simple":"ELI5","example":"concrete example","related":["related term"]}

Notes:\n${notes}`;
  return JSON.parse(await callAI(prompt));
}

export async function generateStudyPlan(notes: string, days = 5): Promise<StudyPlanResult> {
  const prompt = `Create a ${days}-day study plan from these notes.
Return JSON:
{"title":"","totalMinutes":0,"sessions":[{"day":"Day 1","focus":"","minutes":30,"tasks":[]}],"tips":[]}

Notes:\n${notes}`;
  return JSON.parse(await callAI(prompt));
}
