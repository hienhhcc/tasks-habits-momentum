"use client";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
}

const priorityConfig = {
  low: {
    color: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
    label: "Low",
  },
  medium: {
    color: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
    label: "Medium",
  },
  high: {
    color: "bg-danger/10 text-danger border-danger/20",
    dot: "bg-danger",
    label: "High",
  },
};

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <div
      className={`group bg-card border border-border rounded-2xl p-4 hover:border-accent/30 hover:shadow-lg transition-all duration-300 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle?.(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
            task.completed
              ? "bg-accent border-accent"
              : "border-border hover:border-accent"
          }`}
        >
          {task.completed && (
            <svg
              className="w-3.5 h-3.5 text-white"
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
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`font-medium truncate ${
                task.completed ? "line-through text-foreground-muted" : ""
              }`}
            >
              {task.title}
            </h4>
          </div>
          {task.description && (
            <p className="text-sm text-foreground-muted line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs">
            <span
              className={`px-2 py-1 rounded-full border ${priority.color} flex items-center gap-1.5`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
            <span className="text-foreground-muted flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {task.dueDate}
            </span>
          </div>
        </div>

        {/* Action */}
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-background-secondary rounded-lg transition-all">
          <svg
            className="w-4 h-4 text-foreground-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
