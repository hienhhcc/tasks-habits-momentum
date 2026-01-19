"use client";

import {
  createHabit,
  deleteHabit,
  toggleHabitComplete,
  updateHabit,
  type HabitWithCompletion,
} from "@/app/actions/habits";
import HabitForm from "@/app/components/HabitForm";
import Icon from "@/app/components/Icon";
import Modal from "@/app/components/Modal";
import { useMemo, useOptimistic, useState, useTransition } from "react";

type FilterType = "all" | "completed" | "pending";

interface HabitsPageClientProps {
  initialHabits: HabitWithCompletion[];
}

export default function HabitsPageClient({ initialHabits }: HabitsPageClientProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletion | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticHabits, updateOptimisticHabits] = useOptimistic(
    initialHabits,
    (
      state,
      action:
        | { type: "toggle"; id: string }
        | { type: "delete"; id: string }
        | { type: "add"; habit: HabitWithCompletion }
        | { type: "update"; habit: HabitWithCompletion }
    ) => {
      switch (action.type) {
        case "toggle":
          return state.map((h) =>
            h.id === action.id
              ? {
                  ...h,
                  completedToday: !h.completedToday,
                  streak: h.completedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
                }
              : h
          );
        case "delete":
          return state.filter((h) => h.id !== action.id);
        case "add":
          return [action.habit, ...state];
        case "update":
          return state.map((h) =>
            h.id === action.habit.id ? action.habit : h
          );
        default:
          return state;
      }
    }
  );

  // Filter habits
  const filteredHabits = useMemo(() => {
    switch (filter) {
      case "completed":
        return optimisticHabits.filter((h) => h.completedToday);
      case "pending":
        return optimisticHabits.filter((h) => !h.completedToday);
      default:
        return optimisticHabits;
    }
  }, [optimisticHabits, filter]);

  const handleToggle = (id: string) => {
    startTransition(async () => {
      updateOptimisticHabits({ type: "toggle", id });
      await toggleHabitComplete(id);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      updateOptimisticHabits({ type: "delete", id });
      await deleteHabit(id);
    });
  };

  const handleAddHabit = (habitData: { name: string; icon: string; color: string }) => {
    startTransition(async () => {
      const tempHabit: HabitWithCompletion = {
        id: crypto.randomUUID(),
        name: habitData.name,
        icon: habitData.icon,
        color: habitData.color,
        streak: 0,
        completedToday: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      updateOptimisticHabits({ type: "add", habit: tempHabit });
      setIsModalOpen(false);

      await createHabit(habitData);
    });
  };

  const handleEditHabit = (habitData: { name: string; icon: string; color: string }) => {
    if (!editingHabit) return;

    startTransition(async () => {
      const updatedHabit: HabitWithCompletion = {
        ...editingHabit,
        ...habitData,
        updatedAt: new Date(),
      };
      updateOptimisticHabits({ type: "update", habit: updatedHabit });
      setEditingHabit(null);

      await updateHabit(editingHabit.id, habitData);
    });
  };

  const stats = {
    total: optimisticHabits.length,
    completed: optimisticHabits.filter((h) => h.completedToday).length,
    longestStreak: Math.max(0, ...optimisticHabits.map((h) => h.streak)),
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      {/* Add/Edit Habit Modal */}
      <Modal
        isOpen={isModalOpen || editingHabit !== null}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        title={editingHabit ? "Edit Habit" : "Add New Habit"}
      >
        <HabitForm
          onSubmit={editingHabit ? handleEditHabit : handleAddHabit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingHabit(null);
          }}
          initialData={
            editingHabit
              ? {
                  name: editingHabit.name,
                  icon: editingHabit.icon,
                  color: editingHabit.color,
                }
              : undefined
          }
        />
      </Modal>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {stats.total}
          </p>
          <p className="text-sm text-foreground-muted">Total Habits</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-success" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {completionRate}%
          </p>
          <p className="text-sm text-foreground-muted">Completed Today</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            🔥 {stats.longestStreak}
          </p>
          <p className="text-sm text-foreground-muted">Best Streak</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          {(["all", "pending", "completed"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-card border border-border hover:border-accent/50"
              }`}
            >
              {f === "pending" ? "Incomplete" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Habit Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
        >
          <Icon name="plus" className="w-4 h-4" strokeWidth={2} />
          Add Habit
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {filteredHabits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            onToggle={handleToggle}
            onEdit={() => setEditingHabit(habit)}
            onDelete={handleDelete}
          />
        ))}
        {filteredHabits.length === 0 && (
          <div className="text-center py-16 text-foreground-muted">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-secondary flex items-center justify-center">
              <Icon name="habits" className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-1">No habits found</p>
            <p className="text-sm">
              {filter === "all"
                ? "Create your first habit to get started!"
                : `No ${filter === "pending" ? "incomplete" : filter} habits.`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Habit Row Component with edit/delete actions
function HabitRow({
  habit,
  onToggle,
  onEdit,
  onDelete,
}: {
  habit: HabitWithCompletion;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`group bg-card border rounded-xl p-4 transition-all relative ${
        habit.completedToday
          ? "border-success/50 bg-success/5"
          : "border-border hover:border-accent/30"
      } ${showActions ? "z-30" : ""}`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105 cursor-pointer ${
            habit.completedToday ? "bg-success/20" : ""
          }`}
          style={{
            backgroundColor: habit.completedToday ? undefined : `${habit.color}15`,
          }}
          onClick={() => onToggle(habit.id)}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{habit.name}</h4>
          <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
            <span className="text-amber-500">🔥</span>
            <span>{habit.streak} day streak</span>
          </div>
        </div>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(habit.id)}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
            habit.completedToday
              ? "bg-success border-success"
              : "border-border hover:border-success"
          }`}
        >
          {habit.completedToday && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-background-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 py-1 min-w-32">
                <button
                  onClick={() => {
                    setShowActions(false);
                    onEdit();
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDelete(habit.id);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary text-danger flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
