// apps/whatever/src/types/task.ts
/** ===== Типы домена/контракты сервиса (чистые) ===== */
export type Task = {
  id: number;
  text: string;
  completed: boolean | null;
  dueDate: Date | null;
  createdAt: Date | null;
  updatedAt?: Date | null; // ← теперь опциональное
};


export type CreateTaskDto = {
  text: string;
  dueDate?: string | null;    // сырое значение с клиента
};

export type UpdateTaskPatch = {
  text?: string;
  completed?: boolean;
  dueDate?: string | null;    // сырое значение с клиента
};

export type ListOptions = {
  todayOnly?: boolean;        // фильтр "только на сегодня" (dueDate != null && !completed)
};

export interface TaskType {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}