import { getDb } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import type { Task } from "@/types/task";

// Get all tasks (sorted by createdAt desc)

export async function getTaskById(id: number): Promise<Task | null> {
  const db = getDb();
  const [row] = await db.select().from(tasks).where(eq(tasks.id, id));
  return row ?? null;
}

export async function getAllTasks() {
  const db = getDb();
  return db.select().from(tasks).orderBy(desc(tasks.createdAt));
}

export async function createTask(body: {
  text: string;
  dueDate?: string | null;
}) {
  const db = getDb();

  const values: {
    text: string;
    dueDate?: Date | null;
  } = { text: body.text };

  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === "") {
      values.dueDate = null;
    } else {
      values.dueDate = new Date(body.dueDate);
    }
  }

  // important: return full row, not partial
  const [created] = await db.insert(tasks).values(values).returning();
  return created ?? null;
}

export async function updateTask(
  id: number,
  body: { text?: string; completed?: boolean; dueDate?: string | null }
) {
  const db = getDb();
  const setData: {
    text?: string;
    completed?: boolean;
    dueDate?: Date | null;
  } = {};

  if (body.text !== undefined) {
    setData.text = body.text;
  }

  if (body.completed !== undefined) {
    setData.completed = body.completed;
  }

  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === "") {
      setData.dueDate = null;
    } else {
      setData.dueDate = new Date(body.dueDate);
    }
  }

  if (Object.keys(setData).length === 0) return null;

  // important: return full row, not only ID
  const [updated] = await db
    .update(tasks)
    .set(setData)
    .where(eq(tasks.id, id))
    .returning();
  return updated ?? null;
}

export async function deleteTask(id: number) {
  const db = getDb();

  // important: return full row, not only ID
  const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  return deleted ?? null;
}
