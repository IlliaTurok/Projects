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

export function getDb(): NodePgDatabase<typeof schema> {
  const cs = process.env.DATABASE_URL;
  if (!cs) throw new Error("DATABASE_URL is not set");

  const isProd = !!process.env.VERCEL || process.env.NODE_ENV === "production";

  const poolOpts: ConstructorParameters<typeof Pool>[0] = {
    connectionString: cs,
    ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
    max: Number(process.env.PGPOOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.PG_IDLE ?? 10000),
    connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT ?? 5000),
    application_name: process.env.VERCEL ? "vercel-app" : "local-dev",
  };

  // ВАЖНО: однократно логируем, чтобы увидеть, что реально в рантайме
  if (!globalThis.__pgPool__) {
    console.log("[db] creating pool", {
      isProd,
      hasSSL: !!(poolOpts as any).ssl,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      urlFlags: (() => {
        try {
          const u = new URL(cs);
          return u.search;
        } catch { return "n/a"; }
      })(),
    });
    globalThis.__pgPool__ = new Pool(poolOpts);
  }

  if (!globalThis.__drizzleDb__) {
    globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });
  }
  return globalThis.__drizzleDb__!;
}
