import { z } from "zod";

export const generateBodySchema = z.object({
  notes: z.string().min(1, "Notes are required").max(100_000),
  mode: z.enum(["quiz", "concepts", "revision", "summary", "explain", "plan"]),
  term: z.string().max(200).optional(),
  count: z.number().int().min(3).max(20).optional(),
  days: z.number().int().min(3).max(14).optional(),
});

export type GenerateBody = z.infer<typeof generateBodySchema>;
