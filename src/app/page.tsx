// app/page.tsx
import { getDb } from "@/drizzle/db";
import { tasks as tasksTable } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import AddTask from "./components/AddTask";
import TodoList from "./components/TodoList";
import { TaskType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = 'force-dynamic'  
export const revalidate = 0

export default async function Home() {
  const db = getDb();
  const rows = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt));

  const tasks: TaskType[] = rows.map((r) => ({
    id: String(r.id),
    text: r.text,
    completed: Boolean(r.completed),
    dueDate: r.dueDate ? new Date(r.dueDate).toISOString() : undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
  }));

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
