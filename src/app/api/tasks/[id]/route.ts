import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Update task
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { text, completed, dueDate } = await req.json();

    const updatedTask = await db
      .update(tasks)
      .set({
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      })
      .where(eq(tasks.id, Number(params.id)))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

//Delete task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(tasks).where(eq(tasks.id, Number(params.id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
