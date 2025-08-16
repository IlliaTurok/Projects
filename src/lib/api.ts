// src/lib/api.ts
function getBaseUrl() {
  // В браузере — относительный путь (никаких http://localhost)
  if (typeof window !== "undefined") return "";

  // На сервере можно использовать Vercel URL, если он есть
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Фолбэк для локалки
  return "http://localhost:3000";
}

async function apiFetch(path: string, init?: RequestInit) {
  const base = getBaseUrl();
  const url = base ? new URL(path, base).toString() : path; // в браузере останется "/api/..."
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(await res.text().catch(() => `Request failed: ${res.status}`));
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