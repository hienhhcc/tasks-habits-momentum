export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats Row Skeleton */}
      <section className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 h-32"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-background-secondary" />
              <div className="w-12 h-6 rounded-full bg-background-secondary" />
            </div>
            <div className="w-20 h-8 bg-background-secondary rounded mb-2" />
            <div className="w-32 h-4 bg-background-secondary rounded" />
          </div>
        ))}
      </section>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-3 gap-8">
        {/* Tasks Section Skeleton */}
        <section className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="w-32 h-6 bg-background-secondary rounded mb-2" />
              <div className="w-24 h-4 bg-background-secondary rounded" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-4 h-24"
              >
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-background-secondary" />
                  <div className="flex-1">
                    <div className="w-48 h-5 bg-background-secondary rounded mb-2" />
                    <div className="w-full h-4 bg-background-secondary rounded mb-2" />
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-background-secondary rounded-full" />
                      <div className="w-20 h-5 bg-background-secondary rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column Skeleton */}
        <aside className="space-y-8">
          {/* Progress Ring Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="w-32 h-6 bg-background-secondary rounded mb-6" />
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full bg-background-secondary" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="w-8 h-8 bg-background-secondary rounded mx-auto mb-1" />
                <div className="w-16 h-3 bg-background-secondary rounded mx-auto" />
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-background-secondary rounded mx-auto mb-1" />
                <div className="w-16 h-3 bg-background-secondary rounded mx-auto" />
              </div>
            </div>
          </div>

          {/* Habits Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-24 h-6 bg-background-secondary rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-4 h-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-background-secondary" />
                    <div className="flex-1">
                      <div className="w-32 h-5 bg-background-secondary rounded mb-2" />
                      <div className="w-20 h-4 bg-background-secondary rounded" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-background-secondary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
