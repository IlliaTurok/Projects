function getBaseUrl() {
  // В проде на Vercel:
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Локально:
  return "http://localhost:3000";
}

async function apiFetch(path: string, init?: RequestInit) {
  const base = getBaseUrl();
  const url = new URL(path, base).toString(); // всегда абсолютный URL
  const res = await fetch(url, init);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed: ${res.status}`);
  }
  return res.json();
}

// === Использование ===
import { TaskType } from "@/lib/types";

export const getAllTodos = async (): Promise<TaskType[]> => {
  return apiFetch("/api/tasks", { cache: "no-store" });
};

export const addTodo = async (todo: { text: string; dueDate?: string }) => {
  return apiFetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
};

export const editTodo = async (todo: TaskType): Promise<TaskType> => {
  return apiFetch(`/api/tasks/${Number(todo.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: todo.text,
      dueDate: todo.dueDate,
      completed: todo.completed,
    }),
  });
};

export const deleteTodo = async (id: string | number): Promise<void> => {
  await apiFetch(`/api/tasks/${Number(id)}`, { method: "DELETE" });
};

export const completeTodo = async (
  id: string | number,
  completed: boolean
): Promise<TaskType> => {
  return apiFetch(`/api/tasks/${Number(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
};