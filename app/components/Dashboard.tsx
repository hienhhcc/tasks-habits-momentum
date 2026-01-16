"use client";

import Link from "next/link";
import { useState } from "react";
import HabitCard, { Habit } from "./HabitCard";
import Icon from "./Icon";
import ProgressRing from "./ProgressRing";
import StatCard from "./StatCard";
import TaskCard, { Task } from "./TaskCard";

// Sample data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft the Q1 project proposal for the client meeting",
    priority: "high",
    dueDate: "Today",
    completed: false,
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Check pending PRs in the main repository",
    priority: "medium",
    dueDate: "Today",
    completed: true,
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Add new API endpoints to the docs",
    priority: "low",
    dueDate: "Tomorrow",
    completed: false,
  },
  {
    id: "4",
    title: "Team standup meeting",
    priority: "medium",
    dueDate: "Today",
    completed: false,
  },
];

const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Drink 8 glasses of water",
    icon: "💧",
    streak: 12,
    completedToday: true,
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Read for 30 minutes",
    icon: "📚",
    streak: 7,
    completedToday: false,
    color: "#8b5cf6",
  },
  {
    id: "3",
    name: "Exercise",
    icon: "🏃",
    streak: 5,
    completedToday: true,
    color: "#22c55e",
  },
  {
    id: "4",
    name: "Meditate",
    icon: "🧘",
    streak: 21,
    completedToday: false,
    color: "#f59e0b",
  },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [habits, setHabits] = useState(initialHabits);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, completedToday: !habit.completedToday }
          : habit
      )
    );
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalProgress = Math.round(
    ((completedTasks + completedHabits) / (tasks.length + habits.length)) * 100
  );

  return (
    <>
      {/* Stats Row */}
      <section className="grid grid-cols-4 gap-6 mb-8">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard
            title="Tasks Completed"
            value={`${completedTasks}/${tasks.length}`}
            subtitle="2 more than yesterday"
            color="accent"
            trend={{ value: 12, positive: true }}
            icon={<Icon name="tasks" className="w-6 h-6" strokeWidth={2} />}
          />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard
            title="Habits Today"
            value={`${completedHabits}/${habits.length}`}
            subtitle="Keep it up!"
            color="success"
            icon={<Icon name="habits" className="w-6 h-6" strokeWidth={2} />}
          />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard
            title="Current Streak"
            value="12 days"
            subtitle="Personal best: 21 days"
            color="warning"
            trend={{ value: 5, positive: true }}
            icon={<Icon name="trendUp" className="w-6 h-6" strokeWidth={2} />}
          />
        </div>
        <div className="animate-fade-in stagger-4 opacity-0">
          <StatCard
            title="Focus Time"
            value="4.5h"
            subtitle="Today's total"
            color="accent"
            icon={<Icon name="clock" className="w-6 h-6" strokeWidth={2} />}
          />
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Tasks Section */}
        <section className="col-span-2 animate-fade-in stagger-3 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Today&apos;s Tasks
              </h2>
              <p className="text-sm text-foreground-muted">
                {tasks.filter((t) => !t.completed).length} tasks remaining
              </p>
            </div>
            <Link
              href="/tasks"
              className="text-accent hover:text-accent-hover font-medium text-sm flex items-center gap-1 transition-colors"
            >
              View all
              <Icon name="chevronRight" className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </div>
        </section>

        {/* Right Column */}
        <aside className="space-y-8">
          {/* Progress Ring */}
          <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in stagger-4 opacity-0">
            <h3
              className="text-lg font-bold mb-6"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Today&apos;s Progress
            </h3>
            <div className="flex justify-center">
              <ProgressRing
                progress={totalProgress}
                label="Completed"
                sublabel={`${completedTasks + completedHabits} of ${
                  tasks.length + habits.length
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-accent"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {completedTasks}
                </p>
                <p className="text-xs text-foreground-muted">Tasks Done</p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-success"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {completedHabits}
                </p>
                <p className="text-xs text-foreground-muted">Habits Done</p>
              </div>
            </div>
          </div>

          {/* Habits Section */}
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
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
