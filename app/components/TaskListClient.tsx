"use client";

import { createTask, toggleTaskComplete } from "@/app/actions/tasks";
import type { Task } from "@/db";
import Link from "next/link";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { ADD_TASK_EVENT } from "./AddTaskButton";
import Icon from "./Icon";
import Modal from "./Modal";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

// Format database date to human-readable string
function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return "No date";

  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return "Overdue";
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface TaskListClientProps {
  initialTasks: Task[];
}

export default function TaskListClient({ initialTasks }: TaskListClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (
      state,
      update: { type: "toggle"; id: string } | { type: "add"; task: Task }
    ) => {
      if (update.type === "toggle") {
        return state.map((task) =>
          task.id === update.id ? { ...task, completed: !task.completed } : task
        );
      }
      if (update.type === "add") {
        return [update.task, ...state];
      }
      return state;
    }
  );

  // Listen for add task event from header button
  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener(ADD_TASK_EVENT, handleOpenModal);
    return () => window.removeEventListener(ADD_TASK_EVENT, handleOpenModal);
  }, []);

  const handleToggle = (id: string) => {
    startTransition(async () => {
      addOptimisticTask({ type: "toggle", id });
      await toggleTaskComplete(id);
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
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addOptimisticTask({ type: "add", task: tempTask });
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

  const remainingTasks = optimisticTasks.filter((t) => !t.completed).length;

  return (
    <>
      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Task"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Tasks Section */}
      <section className="col-span-2 animate-fade-in stagger-3 opacity-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Today&apos;s Tasks
            </h2>
            <p className="text-sm text-foreground-muted">
              {remainingTasks} tasks remaining
            </p>
          </div>
          <Link
            href="/tasks"
            className="text-accent hover:text-accent-hover font-medium text-sm flex items-center gap-1 transition-colors"
          >
            View all
            <Icon name="chevronRight" className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {optimisticTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                id: task.id,
                title: task.title,
                description: task.description ?? undefined,
                priority: task.priority,
                dueDate: formatDueDate(task.dueDate),
                completed: task.completed,
              }}
              onToggle={handleToggle}
            />
          ))}
          {optimisticTasks.length === 0 && (
            <div className="text-center py-12 text-foreground-muted">
              <p>No tasks yet. Add your first task!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
