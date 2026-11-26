import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hackathonWaitlist } from "@/lib/db-schema";

const waitlistSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  country: z.string().trim().min(2).max(80),
  track: z.enum(["climate", "learning", "civic-tech", "open-track"]),
  updatesOptIn: z.literal(true),
  website: z.string().max(200).optional().default(""),
});

const genericSuccess = {
  ok: true,
  message: "You’re on the list. We’ll be in touch when there’s news.",
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please check your details and try again." }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please check your details and try again." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json(genericSuccess);
  }

  try {
    await db.insert(hackathonWaitlist).values({
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      country: parsed.data.country,
      track: parsed.data.track,
      updatesOptIn: parsed.data.updatesOptIn,
    }).onConflictDoNothing({ target: hackathonWaitlist.email });

    return NextResponse.json(genericSuccess);
  } catch {
    return NextResponse.json(
      { message: "We couldn’t save that just now. Please try again in a moment." },
      { status: 503 },
    );
  }
}
