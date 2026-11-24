import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  notes: z.string().min(1).max(80_000),
  message: z.string().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .optional(),
});

function getProvider() {
  const preferred = process.env.AI_PROVIDER?.toLowerCase();
  if (preferred === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (preferred === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { notes, message, history = [] } = parsed.data;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({
        reply:
          "(Demo tutor) Based on your notes: focus on the core definitions first, then connect them with one concrete example. Ask a follow-up if you want a quiz-style check.",
      });
    }

    const provider = getProvider();
    if (!provider) {
      return NextResponse.json(
        { error: "No AI API key configured" },
        { status: 500 }
      );
    }

    const system = `You are NoteForge Tutor — a patient, accurate study coach.
Answer using the student's notes as primary context. Be concise, structured, and encouraging.
If the notes lack info, say so and give a careful general explanation.
Notes:\n${notes.slice(0, 40_000)}`;

    if (provider === "gemini") {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: system,
      });
      const transcript = [
        ...history.map((h) => `${h.role}: ${h.content}`),
        `user: ${message}`,
      ].join("\n");
      const result = await model.generateContent(transcript);
      return NextResponse.json({ reply: result.response.text() });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        ...history.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({
      reply: completion.choices[0]?.message?.content ?? "",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Tutor failed";
    console.error("[tutor]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
