import { getDb } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const { id } = params;
  const { text, completed, dueDate } = await req.json();

  const updatedTask = await db
    .update(tasks)
    .set({
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
    })
    .where(eq(tasks.id, Number(id)))
    .returning();

  return NextResponse.json(updatedTask[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const { id } = params;

  await db.delete(tasks).where(eq(tasks.id, Number(id)));
  return NextResponse.json({ success: true });
}
