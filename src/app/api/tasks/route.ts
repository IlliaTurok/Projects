import { getDb } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  const all = await db.select().from(tasks);
  return NextResponse.json(all);
}

interface TaskCreateBody { text?: string; dueDate?: string; }
export async function POST(req: Request) {
  const db = getDb();
  const body: TaskCreateBody = await req.json().catch(() => ({} as TaskCreateBody));
  if (!body.text) return NextResponse.json({ error: 'Field "text" is required' }, { status: 400 });
  const [row] = await db.insert(tasks).values({
    text: body.text,
    ...(body.dueDate ? { dueDate: new Date(body.dueDate) } : {}),
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
