"use client";

import { TaskType } from "@/lib/types";
import Task from "./Task";
import { useState } from "react";

interface TodoListProps {
  tasks: TaskType[];
}

const TodoList: React.FC<TodoListProps> = ({ tasks }) => {
  const [showTodayOnly, setShowTodayOnly] = useState(false);

const filteredTasks = showTodayOnly
  ? tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;

      const now = new Date();
      const due = new Date(task.dueDate);
      const diffMs = due.getTime() - now.getTime();

      return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
    })
  : tasks;


  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={showTodayOnly}
          onChange={() => setShowTodayOnly(!showTodayOnly)}
          className="checkbox checkbox-sm"
        />
        <span className="text-sm">Show only todays tasks</span>
      </div>

      <table className="table bg-base-100">
        <thead>
          <tr>
            <th className="w-full">TASKS</th>
            <th>COMPLETE</th>
            <th>DEADLINE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
