"use client";

import { useState } from "react";
import { Task } from "./TaskCard";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "completed">) => void;
  onCancel: () => void;
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("Today");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("Today");
  };

  const priorities: {
    value: Task["priority"];
    label: string;
    color: string;
  }[] = [
    { value: "low", label: "Low", color: "bg-success text-white" },
    { value: "medium", label: "Medium", color: "bg-warning text-white" },
    { value: "high", label: "High", color: "bg-danger text-white" },
  ];

  const dueDates = ["Today", "Tomorrow", "This Week", "Next Week"];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Task Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-foreground-muted"
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description <span className="text-foreground-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-foreground-muted resize-none"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium mb-2">Priority</label>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
                priority === p.value
                  ? p.color
                  : "bg-background-secondary border border-border hover:border-foreground-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Due Date</label>
        <div className="grid grid-cols-4 gap-2">
          {dueDates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setDueDate(date)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                dueDate === date
                  ? "bg-accent text-white"
                  : "bg-background-secondary border border-border hover:border-foreground-muted"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-background-secondary border border-border rounded-xl font-medium hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
