import { ITask } from "@/types/tasks";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return "https://nextproject-lilac.vercel.app";
}

export const getAllTodos = async (): Promise<ITask[]> => {
  const res = await fetch(`https://nextproject-lilac.vercel.app/api/tasks`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error receiving tasks");
  return res.json();
};

export async function addTodo(data: { text: string; dueDate: string }) {
  const res = await fetch(`${getBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add todo");
  return res.json();
}

export const editTodo = async (todo: ITask): Promise<ITask> => {
  const res = await fetch(`${getBaseUrl()}/api/tasks/${todo.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: todo.text,
      dueDate: todo.dueDate,
      completed: todo.completed,
    }),
  });

  if (!res.ok) throw new Error("Failed to edit todo");
  return res.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const res = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete task");
};

export const completeTodo = async (
  id: number,
  completed: boolean
): Promise<ITask> => {
  const res = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) throw new Error("Failed to complete task");
  return res.json();
};
