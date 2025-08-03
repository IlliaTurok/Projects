import { ITask } from "@/types/tasks";

/**
 * Определяет базовый URL:
 *  • В браузере — пустая строка (относительный путь).
 *  • На Vercel — https://{VERCEL_URL}.
 *  • Локально — http://localhost:3000 (или BASE_URL из .env).
 */
function getBaseUrl() {
  // ----- Клиент (браузер) -----
  if (typeof window !== "undefined") return "";

  // ----- Прод (Vercel) -----
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // ----- Локалка / кастом -----
  if (process.env.BASE_URL) return process.env.BASE_URL;

  // Фолбэк для dev-сервера
  return "http://localhost:3000";
}

/* -------------------------------- GET -------------------------------- */

export const getAllTodos = async (): Promise<ITask[]> => {
  const base = getBaseUrl();
  console.log("📡 [getAllTodos] baseUrl =", base); // ← видно в логах Vercel

  const res = await fetch(`${base}/api/tasks`, { cache: "no-store" });

  if (!res.ok) throw new Error("❌ fetch /api/tasks failed");
  return res.json();
};

/* -------------------------------- POST -------------------------------- */

export const addTodo = async (data: { text: string; dueDate?: string }) => {
  const res = await fetch(`${getBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("❌ addTodo failed");
  return res.json();
};

/* ------------------------------- PATCH -------------------------------- */

export const editTodo = async (t: ITask): Promise<ITask> => {
  const res = await fetch(`${getBaseUrl()}/api/tasks/${t.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: t.text, dueDate: t.dueDate, completed: t.completed }),
  });

  if (!res.ok) throw new Error("❌ editTodo failed");
  return res.json();
};

export const completeTodo = async (id: number, completed: boolean): Promise<ITask> => {
  const res = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) throw new Error("❌ completeTodo failed");
  return res.json();
};

/* -------------------------------- DELETE ------------------------------ */

export const deleteTodo = async (id: string) => {
  const res = await fetch(`${getBaseUrl()}/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("❌ deleteTodo failed");
};
