"use client";

import type { StatsData } from "@/app/actions/stats";

interface StatsPageClientProps {
  stats: StatsData;
}

export default function StatsPageClient({ stats }: StatsPageClientProps) {
  const maxWeeklyValue = Math.max(
    ...stats.weeklyData.map((d) => Math.max(d.tasksCompleted, d.habitsCompleted)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Task Completion"
          value={`${stats.taskCompletionRate}%`}
          subtext={`${stats.completedTasks} of ${stats.totalTasks} tasks`}
          color="accent"
        />
        <StatCard
          label="Habits Today"
          value={`${stats.habitsCompletedToday}/${stats.totalHabits}`}
          subtext={
            stats.totalHabits > 0
              ? `${Math.round((stats.habitsCompletedToday / stats.totalHabits) * 100)}% complete`
              : "No habits yet"
          }
          color="success"
        />
        <StatCard
          label="Total Streak"
          value={`🔥 ${stats.totalStreak}`}
          subtext="Combined habit streaks"
          color="warning"
        />
        <StatCard
          label="Longest Streak"
          value={`${stats.longestStreak} days`}
          subtext="Personal best"
          color="accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3
            className="text-lg font-bold mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Weekly Activity
          </h3>
          <div className="h-48">
            <div className="flex items-end justify-between gap-2 h-full">
              {stats.weeklyData.map((day, index) => {
                const isToday = index === new Date().getDay();
                const taskHeight = maxWeeklyValue > 0 
                  ? Math.max((day.tasksCompleted / maxWeeklyValue) * 140, day.tasksCompleted > 0 ? 8 : 0)
                  : 0;
                const habitHeight = maxWeeklyValue > 0 
                  ? Math.max((day.habitsCompleted / maxWeeklyValue) * 140, day.habitsCompleted > 0 ? 8 : 0)
                  : 0;
                
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center h-full">
                    <div className="flex-1 w-full flex items-end justify-center gap-1 pb-2">
                      {/* Tasks bar */}
                      <div
                        className="w-5 bg-accent/80 rounded-t-md transition-all hover:bg-accent cursor-pointer"
                        style={{ height: `${taskHeight}px` }}
                        title={`${day.tasksCompleted} tasks`}
                      />
                      {/* Habits bar */}
                      <div
                        className="w-5 bg-success/80 rounded-t-md transition-all hover:bg-success cursor-pointer"
                        style={{ height: `${habitHeight}px` }}
                        title={`${day.habitsCompleted} habits`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isToday ? "text-accent" : "text-foreground-muted"
                      }`}
                    >
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent" />
              <span className="text-sm text-foreground-muted">Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-sm text-foreground-muted">Habits</span>
            </div>
          </div>
        </div>

        {/* Task vs Habits Comparison */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3
            className="text-lg font-bold mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tasks vs Habits
          </h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              {/* Donut chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-background-secondary"
                />
                {/* Tasks segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${(stats.completedTasks / Math.max(stats.totalTasks + stats.totalHabits, 1)) * 251.2} 251.2`}
                  className="text-accent transition-all"
                />
                {/* Habits segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${(stats.habitsCompletedToday / Math.max(stats.totalTasks + stats.totalHabits, 1)) * 251.2} 251.2`}
                  strokeDashoffset={`-${(stats.completedTasks / Math.max(stats.totalTasks + stats.totalHabits, 1)) * 251.2}`}
                  className="text-success transition-all"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {stats.completedTasks + stats.habitsCompletedToday}
                </span>
                <span className="text-xs text-foreground-muted">completed</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent" />
              <span className="text-sm text-foreground-muted">
                {stats.completedTasks} Tasks
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-sm text-foreground-muted">
                {stats.habitsCompletedToday} Habits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Priority Breakdown */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Priority Breakdown
          </h3>
          <div className="space-y-4">
            <PriorityBar
              label="High"
              count={stats.priorityBreakdown.high}
              total={stats.totalTasks}
              color="bg-danger"
            />
            <PriorityBar
              label="Medium"
              count={stats.priorityBreakdown.medium}
              total={stats.totalTasks}
              color="bg-warning"
            />
            <PriorityBar
              label="Low"
              count={stats.priorityBreakdown.low}
              total={stats.totalTasks}
              color="bg-success"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-foreground-muted">Pending Tasks</span>
              <span className="font-semibold text-warning">{stats.pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-foreground-muted">Total Habits</span>
              <span className="font-semibold">{stats.totalHabits}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground-muted">Weekly Completions</span>
              <span className="font-semibold text-success">
                {stats.weeklyData.reduce((sum, d) => sum + d.tasksCompleted + d.habitsCompleted, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-xl p-6">
          <h3
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Productivity Score
          </h3>
          <div className="flex flex-col items-center justify-center h-24">
            <div
              className="text-5xl font-bold gradient-text"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {calculateProductivityScore(stats)}
            </div>
            <p className="text-sm text-foreground-muted mt-1">
              {getProductivityLabel(calculateProductivityScore(stats))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: string;
  subtext: string;
  color: "accent" | "success" | "warning" | "danger";
}) {
  const colorClasses = {
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-all">
      <p className="text-sm text-foreground-muted mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${colorClasses[color]}`}
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {value}
      </p>
      <p className="text-xs text-foreground-muted mt-1">{subtext}</p>
    </div>
  );
}

function PriorityBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-foreground-muted">{count}</span>
      </div>
      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function calculateProductivityScore(stats: StatsData): number {
  // Weighted score based on:
  // - Task completion rate (40%)
  // - Habit completion today (30%)
  // - Streak maintenance (30%)
  const taskScore = stats.taskCompletionRate * 0.4;
  const habitScore =
    stats.totalHabits > 0
      ? (stats.habitsCompletedToday / stats.totalHabits) * 100 * 0.3
      : 0;
  const streakScore = Math.min(stats.longestStreak * 3, 100) * 0.3;

  return Math.round(taskScore + habitScore + streakScore);
}

function getProductivityLabel(score: number): string {
  if (score >= 90) return "Outstanding! 🌟";
  if (score >= 70) return "Great progress! 💪";
  if (score >= 50) return "Keep going! 🚀";
  if (score >= 30) return "Building momentum 📈";
  return "Just getting started 🌱";
}
