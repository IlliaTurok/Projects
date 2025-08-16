// src/drizzle/db.ts
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
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

  // На Vercel (или вообще в production) ВСЕГДА включаем SSL с поблажкой
  const isProd = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";

  const poolOpts: PoolConfig = {
    connectionString: cs,
    ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
    // Небольшой пул для serverless
    max: Number(process.env.PGPOOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.PG_IDLE ?? 10_000),
    connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT ?? 5_000),
    application_name: process.env.VERCEL ? "vercel-app" : "local-dev",
  };

  if (!globalThis.__pgPool__) {
    // Разовый лог, чтобы в логах Vercel было видно, что реально подхватилось
    // (без any и без утечки секретов — строку подключения не печатаем целиком)
    console.log("[db] creating pool", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: Boolean(process.env.VERCEL),
      hasSSL: isProd, // мы добавляем ssl только в проде
    });

    globalThis.__pgPool__ = new Pool(poolOpts);
  }

  if (!globalThis.__drizzleDb__) {
    globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });
  }

  return globalThis.__drizzleDb__!;
}
