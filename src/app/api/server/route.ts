// Thin route handlers: HTTP/Dtos only; all business logic lives in services.

import * as tasksService from "@/services/tasks.service";

import { BadRequestError } from "@/services/tasks.service";

import { NextResponse } from "next/server";


export const runtime = "nodejs";

interface TaskCreateBody {
  text?: string;
  dueDate?: string | null;
}

export async function GET() {
  try {
    const tasks = await tasksService.list();
    return NextResponse.json(tasks);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // NOTE: no zod schema here — we rely on best-effort validation in the service.
    // TODO: add zod/valibot input schema to return precise 400 errors on bad payloads.
    const body = (await req.json().catch(() => ({}))) as TaskCreateBody;
    const created = await tasksService.create({
      text: body.text ?? "",
      dueDate: body.dueDate ?? null,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof BadRequestError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
