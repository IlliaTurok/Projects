//Domain types / service contracts
export type Task = {
  id: number;
  text: string;
  completed: boolean | null;
  dueDate: Date | null;
  createdAt: Date | null;
  updatedAt?: Date | null;
};


export type CreateTaskDto = {
  text: string;
  dueDate?: string | null;    
};

export type UpdateTaskPatch = {
  text?: string;
  completed?: boolean;
  dueDate?: string | null;    
};

export type ListOptions = {
  todayOnly?: boolean;       
};

export interface TaskType {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}