"use server";

import { db, habitCompletions, habits, tasks } from "@/db";
import { eq, sql } from "drizzle-orm";
import { connection } from "next/server";

export interface WeeklyData {
  day: string;
  date: string;
  tasksCompleted: number;
  habitsCompleted: number;
}

export interface StatsData {
  // Overview stats
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  taskCompletionRate: number;

  totalHabits: number;
  habitsCompletedToday: number;
  totalStreak: number;
  longestStreak: number;

  // Weekly data for charts
  weeklyData: WeeklyData[];

  // Priority breakdown
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export async function getStats(): Promise<StatsData> {
  await connection();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDateLocal(today);

  // Get start of week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfWeekStr = formatDateLocal(startOfWeek);

  // Get all tasks
  const allTasks = await db.select().from(tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority breakdown
  const priorityBreakdown = {
    high: allTasks.filter((t) => t.priority === "high").length,
    medium: allTasks.filter((t) => t.priority === "medium").length,
    low: allTasks.filter((t) => t.priority === "low").length,
  };

  // Get all habits
  const allHabits = await db.select().from(habits);
  const totalHabits = allHabits.length;
  const totalStreak = allHabits.reduce((sum, h) => sum + h.streak, 0);
  const longestStreak = Math.max(0, ...allHabits.map((h) => h.streak));

  // Get today's habit completions
  const todayCompletions = await db
    .select()
    .from(habitCompletions)
    .where(eq(habitCompletions.completedDate, todayStr));
  const habitsCompletedToday = todayCompletions.length;

  // Get weekly data
  const weeklyData: WeeklyData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = formatDateLocal(date);

    // Count tasks completed on this day (check updatedAt for completed tasks)
    const tasksCompletedOnDay = allTasks.filter((t) => {
      if (!t.completed) return false;
      const updatedDate = formatDateLocal(new Date(t.updatedAt));
      return updatedDate === dateStr;
    }).length;

    // Count habits completed on this day
    const habitsOnDay = await db
      .select({ count: sql<number>`count(*)` })
      .from(habitCompletions)
      .where(eq(habitCompletions.completedDate, dateStr));

    weeklyData.push({
      day: getDayName(date),
      date: dateStr,
      tasksCompleted: tasksCompletedOnDay,
      habitsCompleted: Number(habitsOnDay[0]?.count || 0),
    });
  }

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    taskCompletionRate,
    totalHabits,
    habitsCompletedToday,
    totalStreak,
    longestStreak,
    weeklyData,
    priorityBreakdown,
  };
}
