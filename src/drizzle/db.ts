import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {

  var __drizzleDb__: NodePgDatabase<typeof schema> | undefined;

  var __pgPool__: Pool | undefined;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!global.__pgPool__) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    const isProd = process.env.NODE_ENV === "production";
    global.__pgPool__ = new Pool({
      connectionString,
      ssl: isProd ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
  }
  if (!global.__drizzleDb__) {
    global.__drizzleDb__ = drizzle(global.__pgPool__!, { schema });
  }
  return global.__drizzleDb__!;
}
