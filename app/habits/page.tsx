import Icon from "@/app/components/Icon";
import { Suspense } from "react";
import HabitsContent from "./HabitsContent";

function HabitsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4">
            <div className="h-8 w-12 bg-background-secondary rounded mb-2" />
            <div className="h-4 w-24 bg-background-secondary rounded" />
          </div>
        ))}
      </div>

      {/* Habits skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-background-secondary rounded-xl" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-background-secondary rounded mb-2" />
              <div className="h-4 w-20 bg-background-secondary rounded" />
            </div>
            <div className="w-8 h-8 bg-background-secondary rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HabitsPage() {
  return (
    <main className="flex-1 p-8 overflow-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Icon name="habits" className="w-6 h-6 text-accent" />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Daily Habits
          </h1>
        </div>
        <p className="text-foreground-muted">
          Build consistency with daily habits. Track your streaks and stay motivated.
        </p>
      </div>

      <Suspense fallback={<HabitsSkeleton />}>
        <HabitsContent />
      </Suspense>
    </main>
  );
}
