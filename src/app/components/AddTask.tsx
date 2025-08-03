"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { addTodo } from "../../lib/api";
import { useRouter } from "next/navigation";

const AddTask = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const router = useRouter();

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addTodo({
      text: newTaskValue,
      dueDate,
    });
    setNewTaskValue("");
    setModalOpen(false);
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-primary w-full"
      >
        Add new task <AiOutlinePlus size={18} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
  <form onSubmit={handleSubmitNewTodo}>
    <h3 className="font-bold text-lg">Add new task</h3>

    <div className="modal-action flex flex-col gap-4 w-full">
      <div>
        <label className="label">
          <span className="label-text">Task</span>
        </label>
        <input
          value={newTaskValue}
          onChange={(e) => setNewTaskValue(e.target.value)}
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
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit" className="btn">
        Submit
      </button>
    </div>
  </form>
</Modal>

    </div>
  );
};

export default AddTask;
