import { NextRequest, NextResponse } from "next/server";
import {
  generateQuiz,
  generateConceptBreakdown,
  generateRevisionPack,
} from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notes, mode } = body;

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    if (!mode || !["quiz", "concepts", "revision"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Use quiz | concepts | revision" },
        { status: 400 }
      );
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
  } catch (err: any) {
    console.error("[NoteForge API]", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
