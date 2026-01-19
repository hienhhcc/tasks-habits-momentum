"use client";

import {
  createTask,
  deleteTask,
  toggleTaskComplete,
  updateTask,
} from "@/app/actions/tasks";
import Icon from "@/app/components/Icon";
import Modal from "@/app/components/Modal";
import TaskForm from "@/app/components/TaskForm";
import type { Task } from "@/db";
import { useMemo, useOptimistic, useState, useTransition } from "react";

type FilterType = "all" | "pending" | "completed";
type SortType = "date" | "priority" | "created";

interface TasksPageClientProps {
  initialTasks: Task[];
}

// Helper to format date as YYYY-MM-DD using LOCAL timezone (not UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert human-readable due date to database date string (client-side)
function toDbDate(dueDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (dueDate) {
    case "Today":
      return formatDateLocal(today);
    case "Tomorrow": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDateLocal(tomorrow);
    }
    case "This Week": {
      // End of current week (Saturday or Sunday depending on locale)
      // If today is Sunday (0), end of week is Saturday (6 days later)
      // Otherwise, end of week is the upcoming Sunday
      const endOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilEndOfWeek = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
      endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
      return formatDateLocal(endOfWeek);
    }
    case "Next Week": {
      // 7 days after end of this week
      const endOfThisWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilEndOfWeek = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
      endOfThisWeek.setDate(today.getDate() + daysUntilEndOfWeek + 7);
      return formatDateLocal(endOfThisWeek);
    }
    default:
      // Already a date string or unknown format
      return dueDate;
  }
}

// Format database date to human-readable string
function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return "No date";

  // If it's already a human-readable format, return as-is
  if (["Today", "Tomorrow", "This Week", "Next Week", "No date", "Overdue"].includes(dateStr)) {
    return dateStr;
  }

  const date = new Date(dateStr + "T00:00:00");
  
  // Check if valid date
  if (isNaN(date.getTime())) return dateStr;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return "Overdue";
  
  // Calculate end of this week (Saturday if today is Sunday, otherwise next Sunday)
  const dayOfWeek = today.getDay();
  const daysUntilEndOfWeek = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
  
  // If within this week (up to end of week)
  if (diffDays <= daysUntilEndOfWeek) return "This Week";
  
  // If within next week (up to 7 days after end of this week)
  if (diffDays <= daysUntilEndOfWeek + 7) return "Next Week";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const priorityOrder = { high: 0, medium: 1, low: 2 };

export default function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("created");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
    initialTasks,
    (
      state,
      action:
        | { type: "toggle"; id: string }
        | { type: "delete"; id: string }
        | { type: "add"; task: Task }
        | { type: "update"; task: Task }
    ) => {
      switch (action.type) {
        case "toggle":
          return state.map((t) =>
            t.id === action.id ? { ...t, completed: !t.completed } : t
          );
        case "delete":
          return state.filter((t) => t.id !== action.id);
        case "add":
          return [action.task, ...state];
        case "update":
          return state.map((t) =>
            t.id === action.task.id ? action.task : t
          );
        default:
          return state;
      }
    }
  );

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...optimisticTasks];

    // Apply filter
    if (filter === "pending") {
      result = result.filter((t) => !t.completed);
    } else if (filter === "completed") {
      result = result.filter((t) => t.completed);
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sort) {
        case "date":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "created":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [optimisticTasks, filter, sort]);

  const handleToggle = (id: string) => {
    startTransition(async () => {
      updateOptimisticTasks({ type: "toggle", id });
      await toggleTaskComplete(id);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      updateOptimisticTasks({ type: "delete", id });
      await deleteTask(id);
    });
  };

  const handleAddTask = (taskData: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
  }) => {
    startTransition(async () => {
      const tempTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description ?? null,
        priority: taskData.priority,
        dueDate: toDbDate(taskData.dueDate), // Convert to DB format for optimistic update
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      updateOptimisticTasks({ type: "add", task: tempTask });
      setIsModalOpen(false);

      await createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
      });
    });
  };

  const handleEditTask = (taskData: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
  }) => {
    if (!editingTask) return;

    startTransition(async () => {
      const updatedTask: Task = {
        ...editingTask,
        ...taskData,
        dueDate: toDbDate(taskData.dueDate),
        description: taskData.description ?? null,
        updatedAt: new Date(),
      };
      updateOptimisticTasks({ type: "update", task: updatedTask });
      setEditingTask(null);

      await updateTask(editingTask.id, taskData);
    });
  };

  const stats = {
    total: optimisticTasks.length,
    pending: optimisticTasks.filter((t) => !t.completed).length,
    completed: optimisticTasks.filter((t) => t.completed).length,
  };

  return (
    <>
      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen || editingTask !== null}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "Add New Task"}
      >
        <TaskForm
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          initialData={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description ?? "",
                  priority: editingTask.priority,
                  dueDate: formatDueDate(editingTask.dueDate),
                }
              : undefined
          }
        />
      </Modal>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {stats.total}
          </p>
          <p className="text-sm text-foreground-muted">Total Tasks</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-warning" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {stats.pending}
          </p>
          <p className="text-sm text-foreground-muted">Pending</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-success" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {stats.completed}
          </p>
          <p className="text-sm text-foreground-muted">Completed</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          {(["all", "pending", "completed"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-card border border-border hover:border-accent/50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="h-10 pl-4 pr-10 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="created">Sort by: Created</option>
            <option value="date">Sort by: Due Date</option>
            <option value="priority">Sort by: Priority</option>
          </select>

          {/* Add Task Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
          >
            <Icon name="plus" className="w-4 h-4" strokeWidth={2} />
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onEdit={() => setEditingTask(task)}
            onDelete={handleDelete}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16 text-foreground-muted">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-secondary flex items-center justify-center">
              <Icon name="tasks" className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-1">No tasks found</p>
            <p className="text-sm">
              {filter === "all"
                ? "Create your first task to get started!"
                : `No ${filter} tasks at the moment.`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Task Row Component with edit/delete actions
function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const priorityConfig = {
    low: {
      color: "bg-success/10 text-success border-success/20",
      dot: "bg-success",
    },
    medium: {
      color: "bg-warning/10 text-warning border-warning/20",
      dot: "bg-warning",
    },
    high: {
      color: "bg-danger/10 text-danger border-danger/20",
      dot: "bg-danger",
    },
  };

  const priority = priorityConfig[task.priority];

  return (
    <div
      className={`group bg-card border border-border rounded-xl p-4 hover:border-accent/30 transition-all relative ${
        task.completed && !showActions ? "opacity-60" : ""
      } ${showActions ? "z-30" : ""}`}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? "bg-accent border-accent"
              : "border-border hover:border-accent"
          }`}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${task.completed ? "line-through text-foreground-muted" : ""}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-foreground-muted truncate">{task.description}</p>
          )}
        </div>

        {/* Priority Badge */}
        <span className={`px-2.5 py-1 rounded-full text-xs border ${priority.color} flex items-center gap-1.5`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Due Date */}
        <span className="text-sm text-foreground-muted whitespace-nowrap">
          {formatDueDate(task.dueDate)}
        </span>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-background-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 py-1 min-w-32">
                <button
                  onClick={() => {
                    setShowActions(false);
                    onEdit();
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDelete(task.id);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary text-danger flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
