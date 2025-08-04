import { getAllTodos } from "../lib/api";
import AddTask from "./components/AddTask";
import TodoList from "./components/TodoList";

// export default async function Home() {
//   const tasks = await getAllTodos();
//   console.log(tasks);

//   return (
//     <main className="max-w-4xl mx-auto mt-4">
//       <div className="text-center my-5 flex flex-col gap-4">
//         <h1 className="text-2xl font-bold">Todo List</h1>
//         <AddTask />
//       </div>
//       <TodoList tasks={tasks} />
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ITask } from "@/types/tasks";

// ✅ Supabase client — берёт URL и ключ из .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) console.error("❌ Supabase error:", error);
      else setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Hello World 🌍</h1>
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </main>
  );
}
