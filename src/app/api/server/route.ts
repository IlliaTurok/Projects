import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // важно для драйвера pg

// GET /api/tasks — список
export async function GET() {
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
        // Если дата приходит строкой — приведём к Date, иначе оставим БД поставить defaultNow()
        ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
      })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// Если дергаешь API с другого origin — добавь CORS preflight
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
