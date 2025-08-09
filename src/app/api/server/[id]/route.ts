import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

// PATCH /api/tasks/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { text, completed, dueDate } = body ?? {};

    const [updated] = await db
      .update(tasks)
      .set({
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      })
      .where(eq(tasks.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(tasks)
      .where(eq(tasks.id, Number(id)))
      .returning({ id: tasks.id });

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
