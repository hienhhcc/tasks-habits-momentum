import Icon from "@/app/components/Icon";
import Sidebar from "@/app/components/Sidebar";
import { Suspense } from "react";
import TasksContent from "./TasksContent";

function TasksSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 h-20" />
        ))}
      </div>
      {/* Controls skeleton */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg w-24 h-10" />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="bg-card border border-border rounded-lg w-40 h-10" />
          <div className="bg-accent/50 rounded-lg w-28 h-10" />
        </div>
      </div>
      {/* Tasks skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 h-20" />
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <>
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Icon name="tasks" className="w-6 h-6 text-accent" />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Tasks
            </h1>
          </div>
          <p className="text-foreground-muted">
            Manage all your tasks in one place
          </p>
        </header>

        {/* Tasks Content - wrapped in Suspense */}
        <Suspense fallback={<TasksSkeleton />}>
          <TasksContent />
        </Suspense>
      </main>
    </>
  );
}
