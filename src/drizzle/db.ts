// src/drizzle/db.ts
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __pgPool__: Pool | undefined;
  var __drizzleDb__: NodePgDatabase<typeof schema> | undefined;
}

export function getDb(): NodePgDatabase<typeof schema> {
  const cs = process.env.DATABASE_URL;
  if (!cs) throw new Error("DATABASE_URL is not set");

  // На Vercel (или вообще в production) ВСЕГДА включаем SSL с поблажкой:
  const isProd = !!process.env.VERCEL || process.env.NODE_ENV === "production";

  const poolOpts: ConstructorParameters<typeof Pool>[0] = {
    connectionString: cs,
    ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
    // опционально, но полезно на serverless
    max: Number(process.env.PGPOOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.PG_IDLE ?? 10000),
    connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT ?? 5000),
    application_name: process.env.VERCEL ? "vercel-app" : "local-dev",
  };

  if (!globalThis.__pgPool__) globalThis.__pgPool__ = new Pool(poolOpts);
  if (!globalThis.__drizzleDb__) globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });
  return globalThis.__drizzleDb__!;
}
