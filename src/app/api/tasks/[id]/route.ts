import { updateTask, deleteTask } from "@/repositories/task.repo";

import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

// Here was a big error with Promise
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { text, completed, dueDate } = body ?? {};

  const updated = await updateTask(idNum, { text, completed, dueDate });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: number } }
) {
  const deleted = await deleteTask(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, id: deleted.id });
}
