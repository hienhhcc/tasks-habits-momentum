"use client";

import type { HabitWithCompletion } from "@/app/actions/habits";
import { toggleHabitComplete } from "@/app/actions/habits";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import HabitCard from "./HabitCard";
import Icon from "./Icon";

interface HabitListClientProps {
  initialHabits: HabitWithCompletion[];
}

export default function HabitListClient({
  initialHabits,
}: HabitListClientProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticHabits, toggleOptimisticHabit] = useOptimistic(
    initialHabits,
    (state, habitId: string) =>
      state.map((habit) =>
        habit.id === habitId
          ? { ...habit, completedToday: !habit.completedToday }
          : habit
      )
  );

  const handleToggle = (id: string) => {
    startTransition(async () => {
      toggleOptimisticHabit(id);
      await toggleHabitComplete(id);
    });
  };

  return (
    <div className="animate-fade-in stagger-5 opacity-0">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Daily Habits
        </h3>
        <Link
          href="/habits"
          className="text-accent hover:text-accent-hover font-medium text-sm flex items-center gap-1 transition-colors"
        >
          View all
          <Icon name="chevronRight" className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {optimisticHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={{
              id: habit.id,
              name: habit.name,
              icon: habit.icon,
              streak: habit.streak,
              completedToday: habit.completedToday,
              color: habit.color,
            }}
            onToggle={handleToggle}
          />
        ))}
        {optimisticHabits.length === 0 && (
          <div className="text-center py-8 text-foreground-muted">
            <p>No habits yet. Create your first habit!</p>
          </div>
        )}
      </div>
    </div>
  );
}
