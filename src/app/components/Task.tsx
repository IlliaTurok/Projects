"use client";

import { FormEventHandler, useState } from "react";
import { TaskType } from "@/lib/types";
import { FiEdit, FiTrash2, FiCheck, FiCalendar } from "react-icons/fi";
import Modal from "./Modal";
import { addTodo, completeTodo, deleteTodo, editTodo } from "../../lib/api";
import { useRouter } from "next/navigation";
import { assert } from "console";

interface TaskProps {
  task: TaskType;
}
const Task: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalFinished, setOpenModalFinished] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>("");
  const [editDueDate, setEditDueDate] = useState<string>(task.dueDate || "");

  const now = new Date();
  const due = new Date(task.dueDate ?? "");
  const diffMs = due.getTime() - now.getTime();

  const isOverdue = diffMs < 0;

  const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
  const days = Math.floor(diffHours / 24);
  const hours = diffHours % 24;

  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      text: taskToEdit,
      dueDate: editDueDate,
      completed: task.completed,
    });
    setOpenModalEdit(false);
    router.refresh();
  };
  const handleDeleteTask = async (id: string) => {
    await deleteTodo(id);
    setOpenModalDeleted(false);
    router.refresh();
  };
  const handleCompleteTask = async (completed: boolean) => {
    await completeTodo(Number(task.id), !task.completed);
    setOpenModalFinished(false);
    router.refresh();
  };
  return (
    <tr key={task.id}>
      <td>{task.text}</td>
      <td>
        <FiCheck
          onClick={() => handleCompleteTask(task.completed)}
          cursor="pointer"
          className={`ml-7 ${
            task.completed ? "text-green-500" : "text-blue-700"
          }`}
          size={20}
        />
      </td>
      <td>
        {task.dueDate && !task.completed && (
          <div
            className={`text-sm ${
              isOverdue ? "text-red-500" : "text-green-500"
            }`}
          >
            {isOverdue ? `${days}d ${hours}h` : `${days}d ${hours}h`}
          </div>
        )}
      </td>
      <td className="flex gap-5">
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor="pointer"
          className="text-blue-700"
          size={20}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className="font-bold text-lg mb-4">Edit task</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Task</span>
                </label>
                <input
                  value={taskToEdit}
                  onChange={(e) => setTaskToEdit(e.target.value)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Deadline</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>

              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
        </Modal>

        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor="pointer"
          className="text-red-700"
          size={20}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className="text-lg">
            Are you sure, you wand to delete this task?
          </h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteTask(task.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
