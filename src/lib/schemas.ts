import { z } from "zod";

export const generateBodySchema = z.object({
  notes: z.string().min(1, "Notes are required").max(100_000),
  mode: z.enum(["quiz", "concepts", "revision"]),
});

export type GenerateBody = z.infer<typeof generateBodySchema>;
