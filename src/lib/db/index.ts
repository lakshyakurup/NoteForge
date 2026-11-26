import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db-schema";

const globalForPostgres = globalThis as typeof globalThis & { postgresPool?: Pool };

export const pool = globalForPostgres.postgresPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresPool = pool;
}

export const db = drizzle(pool, { schema });
