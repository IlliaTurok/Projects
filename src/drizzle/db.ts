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

  // Включаем SSL только когда нужно:
  // - если переменная окружения DATABASE_SSL=require
  // - или если в URL есть ?sslmode=require (например, Supabase)
  const needSSL =
    process.env.DATABASE_SSL === "require" ||
    (cs && /[\?&]sslmode=require\b/i.test(cs));

  const poolOpts: ConstructorParameters<typeof Pool>[0] = {
    connectionString: cs,
    ...(needSSL ? { ssl: { rejectUnauthorized: false } } : {}), // локально без SSL
  };

  if (!globalThis.__pgPool__) {
    globalThis.__pgPool__ = new Pool(poolOpts);
  }
  if (!globalThis.__drizzleDb__) {
    globalThis.__drizzleDb__ = drizzle(globalThis.__pgPool__!, { schema });
  }
  return globalThis.__drizzleDb__!;
}