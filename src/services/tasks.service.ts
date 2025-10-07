import "server-only";
import * as repo from "@/repositories/task.repo";
import type { Task as DbTask, CreateTaskDto, UpdateTaskPatch } from "@/types/task";

export class BadRequestError extends Error { readonly code = 400 as const; constructor(m: string) { super(m); this.name = "BadRequestError"; } }
export class NotFoundError  extends Error { readonly code = 404 as const; constructor(m: string) { super(m); this.name = "NotFoundError"; } }
export class DatabaseError  extends Error { readonly code = 500 as const; constructor(m: string) { super(m); this.name = "DatabaseError"; } }

// UI representation of a Task
export type UiTask = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;   // ISO string | undefined
  createdAt?: string; // ISO string | undefined
};

function parseId(id: unknown): number {
  const n = typeof id === "string" ? Number(id) : id;
  if (typeof n !== "number" || !Number.isInteger(n) || n <= 0) {
    throw new BadRequestError("invalid id");
  }
  return n;
}

function normalizeText(text: unknown): string {
  if (typeof text !== "string" || text.trim() === "") {
    throw new BadRequestError("text must be a non-empty string");
  }
  return text.trim();
}

// Converts Date | null | undefined to ISO string | undefined
function toIso(d: Date | null | undefined): string | undefined {
  return d ? new Date(d).toISOString() : undefined;
}

// Converts DbTask (from DB) to UiTask (for UI)
function toUi(t: DbTask): UiTask {
  return {
    id: String(t.id),
    text: t.text,
    completed: !!t.completed,
    dueDate: toIso(t.dueDate),
    createdAt: toIso(t.createdAt),
  };
}

export async function list(): Promise<UiTask[]> {
  try {
    const tasks = await repo.getAllTasks();
    return tasks.map(toUi);
  } catch (e: unknown) {
    throw new DatabaseError(e instanceof Error ? e.message : "failed to list tasks");
  }
}

export async function getById(id: number | string): Promise<UiTask | null> {
  const parsed = parseId(id);
  try {
    const found = await repo.getTaskById(parsed);
    return found ? toUi(found) : null;
  } catch (e: unknown) {
    throw new DatabaseError(e instanceof Error ? e.message : "failed to get task");
  }
}

export async function create(dto: CreateTaskDto): Promise<UiTask> {
  const text = normalizeText(dto.text);
  try {
    const created = await repo.createTask({ text, dueDate: dto.dueDate ?? null });
    if (!created) throw new DatabaseError("failed to create task");
    return toUi(created);
  } catch (e: unknown) {
    throw new DatabaseError(e instanceof Error ? e.message : "failed to create task");
  }
}

export async function update(id: number | string, patch: UpdateTaskPatch): Promise<UiTask> {
  const parsed = parseId(id);
  try {
    const updated = await repo.updateTask(parsed, patch);
    if (!updated) throw new NotFoundError("task not found");
    return toUi(updated);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) throw e;
    throw new DatabaseError(e instanceof Error ? e.message : "failed to update task");
  }
}

export async function remove(id: number | string): Promise<UiTask> {
  const parsed = parseId(id);
  try {
    const deleted = await repo.deleteTask(parsed);
    if (!deleted) throw new NotFoundError("task not found");
    return toUi(deleted);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) throw e;
    throw new DatabaseError(e instanceof Error ? e.message : "failed to delete task");
  }
}
