import { getDb } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/tasks — список
export async function GET() {
  const db = getDb();
  try {
    const allTasks = await db.select().from(tasks);
    return NextResponse.json(allTasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/tasks — создание
export async function POST(req: Request) {
  const db = getDb();
  try {
    const body = await req.json().catch(() => ({}));
    const { text, dueDate } = body ?? {};

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: 'Field "text" is required (string)' },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(tasks)
      .values({
        text,
        ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
      })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
