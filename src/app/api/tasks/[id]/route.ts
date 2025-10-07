import * as tasksService from "@/services/tasks.service";

import { BadRequestError, NotFoundError } from "@/services/tasks.service";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Params = { id: string };

export async function PATCH(req: Request, ctx: { params: Promise<Params> }) {
  try {
    const { id } = await ctx.params; // ⬅️ await
    const body = await req.json().catch(() => ({}));
    const updated = await tasksService.update(Number(id), body);
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e instanceof BadRequestError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof NotFoundError) return NextResponse.json({ error: e.message }, { status: 404 });
    return NextResponse.json({ error: (e as Error).message ?? "internal error" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(_req: Request, ctx: { params: Promise<Params> }) {
  try {
    const { id } = await ctx.params; // ⬅️ await
    const deleted = await tasksService.remove(Number(id));
    return NextResponse.json(deleted);
  } catch (e: unknown) {
    if (e instanceof BadRequestError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof NotFoundError) return NextResponse.json({ error: e.message }, { status: 404 });
    return NextResponse.json({ error: (e as Error).message ?? "internal error" }, { status: 500 });
  }
}
