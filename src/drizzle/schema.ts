import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  dueDate: timestamp("due_date").defaultNow(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
