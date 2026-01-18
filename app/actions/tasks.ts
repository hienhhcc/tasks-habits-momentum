"use server";

import { db, tasks, type NewTask, type Task } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";

// Helper to format date as YYYY-MM-DD using LOCAL timezone (not UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert human-readable due date to actual date string
function parseDueDate(dueDate: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Handle known string values
  switch (dueDate) {
    case "Today":
      return formatDateLocal(today);
    case "Tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDateLocal(tomorrow);
    }
    case "This Week": {
      // End of current week (Saturday if today is Sunday, otherwise next Sunday)
      const endOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilEndOfWeek = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
      endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
      return formatDateLocal(endOfWeek);
    }
    case "Next Week": {
      // 7 days after end of this week
      const endOfThisWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilEndOfWeek = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
      endOfThisWeek.setDate(today.getDate() + daysUntilEndOfWeek + 7);
      return formatDateLocal(endOfThisWeek);
    }
    case "No date":
      return null;
    case "Overdue":
      // Keep the existing date for overdue tasks
      return null;
  }

  // Handle "In X days" format
  const inDaysMatch = dueDate.match(/^In (\d+) days?$/);
  if (inDaysMatch) {
    const days = parseInt(inDaysMatch[1], 10);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);
    return formatDateLocal(futureDate);
  }

  // Handle formatted dates like "Jan 25"
  const parsedDate = new Date(dueDate + ", " + today.getFullYear());
  if (!isNaN(parsedDate.getTime())) {
    return formatDateLocal(parsedDate);
  }

  // If it's already a date string (YYYY-MM-DD format), return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return dueDate;
  }

  // Default: return null to keep existing
  return null;
}

export async function getTasks(): Promise<Task[]> {
  await connection();
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
  revalidatePath("/tasks");
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

export async function updateTask(
  id: string,
  data: Partial<Omit<NewTask, "id" | "createdAt" | "updatedAt">> & {
    dueDate?: string;
  }
): Promise<Task> {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  // Only include fields that are provided
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.completed !== undefined) updateData.completed = data.completed;

  // Handle dueDate - only update if parseDueDate returns a valid date
  if (data.dueDate) {
    const parsedDate = parseDueDate(data.dueDate);
    if (parsedDate !== null) {
      updateData.dueDate = parsedDate;
    }
    // If null, we skip updating dueDate (keeps existing value)
  }

  const [updatedTask] = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/tasks");
  return updatedTask;
}

export async function deleteTask(id: string): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
  revalidatePath("/tasks");
}
