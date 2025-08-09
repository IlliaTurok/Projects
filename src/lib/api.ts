import { TaskType } from "@/lib/types";

// Общая функция проверки ответа
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "Request failed";
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {
      message = await res.text();
    }
    throw new Error(message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Хелпер для формирования dueDate
function normalizeDueDate(dueDate?: string) {
  if (!dueDate) return undefined;
  // Добавляем секунды и Z, если не указаны
  if (!dueDate.includes("Z")) {
    return new Date(`${dueDate}:00`).toISOString();
  }
  return new Date(dueDate).toISOString();
}

// Получение всех задач
export const getAllTodos = async (): Promise<TaskType[]> => {
  const res = await fetch(`/api/tasks`, { cache: "no-store" });
  return handleResponse<TaskType[]>(res);
};

// Добавление задачи
export const addTodo = async (todo: { text: string; dueDate?: string }) => {
  const res = await fetch(`/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: todo.text,
      dueDate: normalizeDueDate(todo.dueDate),
    }),
  });
  return handleResponse<TaskType>(res);
};

// Редактирование задачи
export const editTodo = async (todo: TaskType): Promise<TaskType> => {
  const res = await fetch(`/api/tasks/${Number(todo.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: todo.text,
      dueDate: normalizeDueDate(todo.dueDate),
      completed: todo.completed,
    }),
  });
  return handleResponse<TaskType>(res);
};

// Удаление задачи
export const deleteTodo = async (id: string | number): Promise<void> => {
  const res = await fetch(`/api/tasks/${Number(id)}`, { method: "DELETE" });
  await handleResponse(res);
};

// Завершение задачи
export const completeTodo = async (
  id: string | number,
  completed: boolean
): Promise<TaskType> => {
  const res = await fetch(`/api/tasks/${Number(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return handleResponse<TaskType>(res);
};
