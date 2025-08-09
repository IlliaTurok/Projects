// src/drizzle/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Глобальные синглтоны (и в dev, и на Vercel)
declare global {
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined;
  // eslint-disable-next-line no-var
  var __drizzleDb__: ReturnType<typeof drizzle> | undefined;
}

function createPool(connectionString: string) {
  const isSupabase = connectionString.includes(".supabase.co");
  return new Pool({
    connectionString,
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
  });
}

// Ленивая инициализация БД — проверяем env только при реальном вызове
export function getDb() {
  const cs = process.env.DATABASE_URL;
  if (!cs) throw new Error("DATABASE_URL is not set");

  if (!globalThis.__pgPool__) {
    globalThis.__pgPool__ = createPool(cs);
  }
  if (!globalThis.__drizzleDb__) {
    globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });
  }
  return globalThis.__drizzleDb__!;
}
