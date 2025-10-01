import "server-only";
import * as repo from "@/repositories/task.repo";
import type { Task, CreateTaskDto, UpdateTaskPatch } from "@/types/task";

export class BadRequestError extends Error { readonly code = 400 as const; constructor(m:string){super(m);this.name="BadRequestError";} }
export class NotFoundError  extends Error { readonly code = 404 as const; constructor(m:string){super(m);this.name="NotFoundError";} }
export class DatabaseError  extends Error { readonly code = 500 as const; constructor(m:string){super(m);this.name="DatabaseError";} }

function assertValidId(id: unknown): asserts id is number {
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) throw new BadRequestError("invalid id");
}
function normalizeText(text: unknown): string {
  if (typeof text !== "string" || text.trim() === "") throw new BadRequestError("text must be a non-empty string");
  return text.trim();
}

export async function list(): Promise<Task[]> {
  try { return await repo.getAllTasks(); }
  catch (e: unknown) { throw new DatabaseError(e instanceof Error ? e.message : "failed to list tasks"); }
}

export async function getById(id: number): Promise<Task | null> {
  assertValidId(id);
  try { return await repo.getTaskById(id); }
  catch (e: unknown) { throw new DatabaseError(e instanceof Error ? e.message : "failed to get task"); }
}

export async function create(dto: CreateTaskDto): Promise<Task> {
  const text = normalizeText(dto.text);
  try {
    const created = await repo.createTask({ text, dueDate: dto.dueDate ?? null });
    if (!created) throw new DatabaseError("failed to create task");
    return created;
  } catch (e: unknown) { throw new DatabaseError(e instanceof Error ? e.message : "failed to create task"); }
}

export async function update(id: number, patch: UpdateTaskPatch): Promise<Task> {
  assertValidId(id);
  try {
    const updated = await repo.updateTask(id, patch);
    if (!updated) throw new NotFoundError("task not found");
    return updated;
  } catch (e: unknown) {
    if (e instanceof NotFoundError) throw e;
    throw new DatabaseError(e instanceof Error ? e.message : "failed to update task");
  }
}

export async function remove(id: number): Promise<Task> {
  assertValidId(id);
  try {
    const deleted = await repo.deleteTask(id);
    if (!deleted) throw new NotFoundError("task not found");
    return deleted;
  } catch (e: unknown) {
    if (e instanceof NotFoundError) throw e;
    throw new DatabaseError(e instanceof Error ? e.message : "failed to delete task");
  }
}

