import { NextRequest, NextResponse } from "next/server";
import {
  generateQuiz,
  generateConceptBreakdown,
  generateRevisionPack,
} from "@/lib/ai";
import { generateBodySchema } from "@/lib/schemas";
import { getDemoResult } from "@/lib/demo-data";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel Pro allows higher; Hobby max is 60s on newer plans

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = generateBodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().formErrors.join(", ") || "Invalid body" },
        { status: 400 }
      );
    }

    const { notes, mode } = parsed.data;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json(getDemoResult(mode));
    }

    let data;

    if (mode === "quiz") {
      data = { questions: await generateQuiz(notes) };
    } else if (mode === "concepts") {
      data = { concepts: await generateConceptBreakdown(notes) };
    } else {
      data = await generateRevisionPack(notes);
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to generate content";
    console.error("[NoteForge API]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
