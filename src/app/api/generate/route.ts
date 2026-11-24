import { NextRequest, NextResponse } from "next/server";
import {
  generateQuiz,
  generateConceptBreakdown,
  generateRevisionPack,
  generateSummary,
  explainTerm,
  generateStudyPlan,
} from "@/lib/ai";
import { generateBodySchema } from "@/lib/schemas";
import { getDemoResult } from "@/lib/demo-data";

export const runtime = "nodejs";
export const maxDuration = 60;

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

    const { notes, mode, term, count, days } = parsed.data;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json(getDemoResult(mode, term));
    }

    let data: unknown;

    switch (mode) {
      case "quiz":
        data = { questions: await generateQuiz(notes, count ?? 8) };
        break;
      case "concepts":
        data = { concepts: await generateConceptBreakdown(notes) };
        break;
      case "revision":
        data = await generateRevisionPack(notes);
        break;
      case "summary":
        data = await generateSummary(notes);
        break;
      case "explain":
        if (!term?.trim()) {
          return NextResponse.json({ error: "term is required for explain mode" }, { status: 400 });
        }
        data = await explainTerm(notes, term.trim());
        break;
      case "plan":
        data = await generateStudyPlan(notes, days ?? 5);
        break;
      default:
        return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate content";
    console.error("[NoteForge API]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
