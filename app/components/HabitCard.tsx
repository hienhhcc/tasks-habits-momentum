"use client";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  color: string;
}

interface HabitCardProps {
  habit: Habit;
  onToggle?: (id: string) => void;
}

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <div
      onClick={() => onToggle?.(habit.id)}
      className={`group cursor-pointer bg-card border rounded-2xl p-4 transition-all duration-300 hover:shadow-lg ${
        habit.completedToday
          ? "border-success/50 bg-success-light"
          : "border-border hover:border-accent/30"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
            habit.completedToday ? "bg-success/20" : "bg-background-secondary"
          }`}
          style={{
            backgroundColor: habit.completedToday
              ? undefined
              : `${habit.color}15`,
          }}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{habit.name}</h4>
          <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
            <span className="text-amber-500">🔥</span>
            <span>{habit.streak} day streak</span>
          </div>
        </div>

        {/* Checkbox */}
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            habit.completedToday
              ? "bg-success border-success"
              : "border-border group-hover:border-success"
          }`}
        >
          {habit.completedToday && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
