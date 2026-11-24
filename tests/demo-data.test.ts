import { describe, it, expect } from "vitest";
import { getDemoResult, DEMO_QUIZ } from "../src/lib/demo-data";

describe("demo data", () => {
  it("returns quiz questions", () => {
    const data = getDemoResult("quiz") as { questions: unknown[] };
    expect(data.questions.length).toBe(DEMO_QUIZ.length);
  });

  it("returns concepts", () => {
    const data = getDemoResult("concepts") as { concepts: unknown[] };
    expect(data.concepts.length).toBeGreaterThan(0);
  });

  it("returns revision pack", () => {
    const data = getDemoResult("revision") as { flashcards: unknown[] };
    expect(data.flashcards.length).toBeGreaterThan(0);
  });
});
