"use client";

import Link from "next/link";
import { useState } from "react";
import HabitCard, { Habit } from "./components/HabitCard";
import ProgressRing from "./components/ProgressRing";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import TaskCard, { Task } from "./components/TaskCard";

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

export default function Home() {
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Good morning, <span className="gradient-text">Hien</span> 👋
              </h1>
              <p className="text-foreground-muted">{currentDate}</p>
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Task
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          <div className="animate-fade-in stagger-1 opacity-0">
            <StatCard
              title="Tasks Completed"
              value={`${completedTasks}/${tasks.length}`}
              subtitle="2 more than yesterday"
              color="accent"
              trend={{ value: 12, positive: true }}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              }
            />
          </div>
          <div className="animate-fade-in stagger-2 opacity-0">
            <StatCard
              title="Habits Today"
              value={`${completedHabits}/${habits.length}`}
              subtitle="Keep it up!"
              color="success"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              }
            />
          </div>
          <div className="animate-fade-in stagger-3 opacity-0">
            <StatCard
              title="Current Streak"
              value="12 days"
              subtitle="Personal best: 21 days"
              color="warning"
              trend={{ value: 5, positive: true }}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />
          </div>
          <div className="animate-fade-in stagger-4 opacity-0">
            <StatCard
              title="Focus Time"
              value="4.5h"
              subtitle="Today's total"
              color="accent"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
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

        {/* Motivation Quote */}
        <section className="mt-8 bg-linear-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-2xl p-6 animate-fade-in stagger-5 opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <p className="text-lg font-medium italic">
                &quot;The secret of getting ahead is getting started.&quot;
              </p>
              <p className="text-sm text-foreground-muted mt-1">— Mark Twain</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
