import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { error } from "console";
import { NextResponse } from "next/server";

// Get all tasks
export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return NextResponse.json(allTasks);
  } catch (err) {
    console.error("Error in GET /api/tasks:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Add new task
export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const newTask = await db.insert(tasks).values({ text }).returning();
    return NextResponse.json(newTask[0]);
  } catch (err) {
    console.error("Error in Post /api/tasks:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
