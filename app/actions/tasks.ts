"use server";

import { db, tasks, type NewTask, type Task } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Convert human-readable due date to actual date string
function parseDueDate(dueDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (dueDate) {
    case "Today":
      return today.toISOString().split("T")[0];
    case "Tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    case "This Week": {
      const endOfWeek = new Date(today);
      const daysUntilSunday = 7 - today.getDay();
      endOfWeek.setDate(today.getDate() + daysUntilSunday);
      return endOfWeek.toISOString().split("T")[0];
    }
    case "Next Week": {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek.toISOString().split("T")[0];
    }
    default:
      // If it's already a date string, return as is
      return dueDate;
  }
}

export async function getTasks(): Promise<Task[]> {
  return await db.select().from(tasks).orderBy(tasks.createdAt);
}

export async function createTask(
  data: Omit<NewTask, "id" | "createdAt" | "updatedAt"> & { dueDate?: string }
): Promise<Task> {
  const taskData = {
    ...data,
    dueDate: data.dueDate ? parseDueDate(data.dueDate) : null,
  };

  const [newTask] = await db.insert(tasks).values(taskData).returning();
  revalidatePath("/");
  return newTask;
}

export async function toggleTaskComplete(id: string): Promise<Task> {
  // First get the current task
  const [currentTask] = await db.select().from(tasks).where(eq(tasks.id, id));

  if (!currentTask) {
    throw new Error("Task not found");
  }

  // Toggle the completed status
  const [updatedTask] = await db
    .update(tasks)
    .set({
      completed: !currentTask.completed,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning();

  revalidatePath("/");
  return updatedTask;
}

export async function deleteTask(id: string): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
}
