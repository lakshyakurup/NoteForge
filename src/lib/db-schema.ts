import { bigserial, boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const hackathonWaitlist = pgTable("hackathon_waitlist", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  country: text("country").notNull(),
  track: text("track").notNull(),
  updatesOptIn: boolean("updates_opt_in").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
