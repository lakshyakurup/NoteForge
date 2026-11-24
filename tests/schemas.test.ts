import { describe, it, expect } from "vitest";
import { generateBodySchema } from "../src/lib/schemas";

describe("generateBodySchema", () => {
  it("accepts valid quiz payload", () => {
    const result = generateBodySchema.safeParse({
      notes: "Some study notes about biology",
      mode: "quiz",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty notes", () => {
    const result = generateBodySchema.safeParse({
      notes: "",
      mode: "concepts",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid mode", () => {
    const result = generateBodySchema.safeParse({
      notes: "hello",
      mode: "flashcards",
    });
    expect(result.success).toBe(false);
  });
});
