import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  // Чтобы не плодить пулы/инстансы при hot-reload и в serverless
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined;
  // eslint-disable-next-line no-var
  var __db__: ReturnType<typeof drizzle> | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const isProd = process.env.NODE_ENV === "production";

// Supabase обычно требует SSL. На Vercel это критично.
const pool =
  globalThis.__pgPool__ ??
  new Pool({
    connectionString,
    ssl: isProd ? { rejectUnauthorized: false } : undefined,
  });

if (!globalThis.__pgPool__) globalThis.__pgPool__ = pool;

export const db =
  globalThis.__db__ ?? drizzle(pool, { schema, logger: false });

if (!globalThis.__db__) globalThis.__db__ = db;

export type DB = typeof db;
