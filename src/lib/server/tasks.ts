import { getDb } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { desc } from "drizzle-orm";

export async function fetchTasksServer() {
  const db = getDb();
  return db.select().from(tasks).orderBy(desc(tasks.createdAt));
}
