// src/drizzle/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Глобальные переменные для hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb: ReturnType<typeof drizzle> | undefined;
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!global.__pgPool) {
    global.__pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes(".supabase.co")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  if (!global.__drizzleDb) {
    global.__drizzleDb = drizzle(global.__pgPool, { schema });
  }

  return global.__drizzleDb;
}
