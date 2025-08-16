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

  const url = new URL(cs);
  const search = url.search.toLowerCase();

  // поддерживаем sslmode=require, ssl=require, ssl=true, а также PGSSLMODE=require и флаг DATABASE_SSL=require
  const sslMatch = /[?&](sslmode|ssl)=([^&]+)/.exec(search);
  const sslValue = sslMatch?.[2];

  const needSSL =
    process.env.DATABASE_SSL === "require" ||
    process.env.PGSSLMODE?.toLowerCase() === "require" ||
    sslValue === "require" ||
    sslValue === "true";

  const poolOpts: ConstructorParameters<typeof Pool>[0] = {
    connectionString: cs,
    ...(needSSL ? { ssl: { rejectUnauthorized: false } } : {}),
    // (необязательно, но полезно на serverless)
    max: Number(process.env.PGPOOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.PG_IDLE ?? 10000),
    connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT ?? 5000),
    application_name: process.env.VERCEL ? "vercel-app" : "local-dev",
  };

  if (!globalThis.__pgPool__) globalThis.__pgPool__ = new Pool(poolOpts);
  if (!globalThis.__drizzleDb__) globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });
  return globalThis.__drizzleDb__!;
}
