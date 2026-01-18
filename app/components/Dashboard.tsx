import { getHabits } from "@/app/actions/habits";
import { getTasks } from "@/app/actions/tasks";
import DashboardStats from "./DashboardStats";
import HabitListClient from "./HabitListClient";
import TaskListClient from "./TaskListClient";

export default async function Dashboard() {
  // Fetch data from database
  const [tasks, habits] = await Promise.all([getTasks(), getHabits()]);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const completedHabits = habits.filter((h) => h.completedToday).length;

  return (
    <>
      {/* Stats Row */}
      <DashboardStats
        completedTasks={completedTasks}
        totalTasks={tasks.length}
        completedHabits={completedHabits}
        totalHabits={habits.length}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Tasks Section */}
        <TaskListClient initialTasks={tasks} />

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
              <ProgressRingWrapper
                completedTasks={completedTasks}
                totalTasks={tasks.length}
                completedHabits={completedHabits}
                totalHabits={habits.length}
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
          <HabitListClient initialHabits={habits} />
        </aside>
      </div>
    </>
  );
}

// Simple wrapper for progress ring
import ProgressRing from "./ProgressRing";

function ProgressRingWrapper({
  completedTasks,
  totalTasks,
  completedHabits,
  totalHabits,
}: {
  completedTasks: number;
  totalTasks: number;
  completedHabits: number;
  totalHabits: number;
}) {
  const total = totalTasks + totalHabits;
  const completed = completedTasks + completedHabits;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <ProgressRing
      progress={progress}
      label="Completed"
      sublabel={`${completed} of ${total}`}
    />
  );
}
