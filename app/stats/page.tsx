import Icon from "@/app/components/Icon";
import Sidebar from "@/app/components/Sidebar";
import { Suspense } from "react";
import StatsContent from "./StatsContent";

function StatsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <div className="h-4 w-20 bg-background-secondary rounded mb-3" />
            <div className="h-8 w-16 bg-background-secondary rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 h-80" />
        <div className="bg-card border border-border rounded-xl p-6 h-80" />
      </div>

      {/* Bottom row skeleton */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 h-48" />
        <div className="bg-card border border-border rounded-xl p-6 h-48" />
        <div className="bg-card border border-border rounded-xl p-6 h-48" />
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <>
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Icon name="stats" className="w-6 h-6 text-accent" />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Statistics
            </h1>
          </div>
          <p className="text-foreground-muted">
            Track your productivity and see your progress over time
          </p>
        </header>

        <Suspense fallback={<StatsSkeleton />}>
          <StatsContent />
        </Suspense>
      </main>
    </>
  );
}
