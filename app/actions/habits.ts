"use server";

import { db, habitCompletions, habits, type Habit, type NewHabit } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";

export type HabitWithCompletion = Habit & { completedToday: boolean };

export async function getHabits(): Promise<HabitWithCompletion[]> {
  await connection();

  const today = new Date().toISOString().split("T")[0];

  const habitsData = await db.select().from(habits).orderBy(habits.createdAt);

  // Check completions for today
  const completions = await db
    .select()
    .from(habitCompletions)
    .where(eq(habitCompletions.completedDate, today));

  const completedHabitIds = new Set(completions.map((c) => c.habitId));

  return habitsData.map((habit) => ({
    ...habit,
    completedToday: completedHabitIds.has(habit.id),
  }));
}

export async function createHabit(
  data: Omit<NewHabit, "id" | "createdAt" | "updatedAt">
): Promise<Habit> {
  const [newHabit] = await db.insert(habits).values(data).returning();
  revalidatePath("/");
  return newHabit;
}

export async function toggleHabitComplete(id: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];

  // Check if already completed today
  const [existing] = await db
    .select()
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.habitId, id),
        eq(habitCompletions.completedDate, today)
      )
    );

  if (existing) {
    // Remove completion and decrement streak
    await db
      .delete(habitCompletions)
      .where(eq(habitCompletions.id, existing.id));
    await db
      .update(habits)
      .set({
        streak: sql`GREATEST(${habits.streak} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, id));
    revalidatePath("/");
    return false;
  } else {
    // Add completion and increment streak
    await db.insert(habitCompletions).values({
      habitId: id,
      completedDate: today,
    });
    await db
      .update(habits)
      .set({
        streak: sql`${habits.streak} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, id));
    revalidatePath("/");
    return true;
  }
}

export async function deleteHabit(id: string): Promise<void> {
  await db.delete(habits).where(eq(habits.id, id));
  revalidatePath("/");
}
