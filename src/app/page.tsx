import { list } from "@/services/tasks.service";
import AddTask from "./components/AddTask";
import TodoList from "./components/TodoList";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const tasks = await list();

  return (
    <main className="max-w-4xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <AddTask />
      </div>
      <TodoList tasks={tasks} />
    </main>
  );
}
