import Icon from "./Icon";
import StatCard from "./StatCard";

interface DashboardStatsProps {
  completedTasks: number;
  totalTasks: number;
  completedHabits: number;
  totalHabits: number;
}

export default function DashboardStats({
  completedTasks,
  totalTasks,
  completedHabits,
  totalHabits,
}: DashboardStatsProps) {
  return (
    <section className="grid grid-cols-4 gap-6 mb-8">
      <div className="animate-fade-in stagger-1 opacity-0">
        <StatCard
          title="Tasks Completed"
          value={`${completedTasks}/${totalTasks}`}
          subtitle="Keep going!"
          color="accent"
          trend={{ value: 12, positive: true }}
          icon={<Icon name="tasks" className="w-6 h-6" strokeWidth={2} />}
        />
      </div>
      <div className="animate-fade-in stagger-2 opacity-0">
        <StatCard
          title="Habits Today"
          value={`${completedHabits}/${totalHabits}`}
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
  );
}
