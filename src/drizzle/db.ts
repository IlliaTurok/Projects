// src/drizzle/db.ts
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined;
  // eslint-disable-next-line no-var
  var __drizzleDb__: NodePgDatabase<typeof schema> | undefined;
}

function createPool(connectionString: string) {
  const host = (() => {
    try { return new URL(connectionString).hostname; } catch { return ""; }
  })();

  const needsSSL =
    host.includes("supabase.co") || host.includes("supabase.com");

  return new Pool({
    connectionString,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
  });
}

export function getDb(): NodePgDatabase<typeof schema> {
  const cs = process.env.DATABASE_URL;
  if (!cs) throw new Error("DATABASE_URL is not set");

  if (!globalThis.__pgPool__) globalThis.__pgPool__ = createPool(cs);
  if (!globalThis.__drizzleDb__)
    globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });

  return globalThis.__drizzleDb__!;
}
