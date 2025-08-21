import { updateTask, deleteTask } from "@/repositories/task.repo";

import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

// Here was a big error with Promise
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idNum = Number(params.id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { text, completed, dueDate } = body ?? {};

    const updated = await updateTask(idNum, { text, completed, dueDate });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idNum = Number(params.id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const deleted = await deleteTask(idNum);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
