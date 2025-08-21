import { getDb } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";


export async function getAllTasks() {
  const db = getDb();
  return await db.select().from(tasks);
}

export async function createTask(body: { text: string; dueDate?: string }) {
  const db = getDb();
  return await db.insert(tasks).values({
      text: body.text,
      ...(body.dueDate ? { dueDate: new Date(body.dueDate) } : {}),
    }).returning();
  }

export async function updateTask(
  id: number, body: { text?: string; completed?: boolean; dueDate?: string }) {
  const db = getDb();

  const { text, completed, dueDate } = body;
  const [updated] = await db
      .update(tasks)
      .set({
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      })
      .where(eq(tasks.id, id))
      .returning();
  return updated ?? null;
}

export async function deleteTask(id: number) {
  const db = getDb();
  const [deleted] = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning({ id: tasks.id });
  return deleted ?? null;
}
