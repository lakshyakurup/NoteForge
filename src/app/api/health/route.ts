import { NextResponse } from "next/server";

/** Lightweight health check for Vercel / uptime monitors */
export async function GET() {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return NextResponse.json(
    {
      ok: true,
      service: "noteforge",
      demo,
      ai: {
        gemini: hasGemini,
        openai: hasOpenAI,
        ready: demo || hasGemini || hasOpenAI,
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
