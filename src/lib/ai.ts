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

async function callAI(prompt: string): Promise<string> {
  const provider = getProvider();

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] },
    ]);
    return result.response.text();
  }

  // OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });
  return completion.choices[0]?.message?.content ?? "{}";
}

export async function generateQuiz(notes: string, count = 8): Promise<QuizQuestion[]> {
  const prompt = `From the following study notes, generate exactly ${count} quiz questions.
Mix of multiple-choice (mcq), fill-in-the-blank (fill), and short-answer (short).

Return JSON in this exact shape:
{
  "questions": [
    {
      "type": "mcq" | "fill" | "short",
      "question": "string",
      "options": ["A", "B", "C", "D"]  // only for mcq
      "answer": "string",
      "explanation": "short explanation"
    }
  ]
}

Notes:\n${notes}`;

  const raw = await callAI(prompt);
  const parsed = JSON.parse(raw);
  return parsed.questions ?? [];
}

export async function generateConceptBreakdown(notes: string): Promise<ConceptBreakdown[]> {
  const prompt = `Break down the key concepts from these notes into clear, structured explanations.

Return JSON:
{
  "concepts": [
    {
      "title": "Concept name",
      "summary": "2-3 sentence explanation",
      "keyPoints": ["point 1", "point 2"],
      "analogies": ["optional analogy"]
    }
  ]
}

Notes:\n${notes}`;

  const raw = await callAI(prompt);
  const parsed = JSON.parse(raw);
  return parsed.concepts ?? [];
}

export async function generateRevisionPack(notes: string): Promise<RevisionPack> {
  const prompt = `Create a high-yield revision pack from these notes.

Return JSON:
{
  "cheatSheet": "concise markdown-style summary",
  "flashcards": [
    { "front": "term or question", "back": "definition or answer" }
  ],
  "highYield": ["must-know fact 1", "must-know fact 2"]
}

Notes:\n${notes}`;

  const raw = await callAI(prompt);
  return JSON.parse(raw);
}
