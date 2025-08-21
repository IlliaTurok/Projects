import { getAllTasks, createTask } from "@/repositories/task.repo";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getAllTasks());
}

interface TaskCreateBody {
  text?: string;
  dueDate?: string;
}

export async function POST(req: Request) {
  const body: TaskCreateBody = await req
    .json()
    .catch(() => ({} as TaskCreateBody));
  if (!body.text)
    return NextResponse.json(
      { error: 'Field "text" is required' },
      { status: 400 }
    );
  return NextResponse.json(
    await createTask({ text: body.text, dueDate: body.dueDate }),
    { status: 201 }
  );
}
