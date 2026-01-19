"use client";

import { useState } from "react";

interface HabitFormProps {
  onSubmit: (habit: { name: string; icon: string; color: string }) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    icon: string;
    color: string;
  };
}

const ICONS = ["💧", "📚", "🏃", "🧘", "💪", "🎯", "✍️", "🌱", "💤", "🍎", "🧠", "🎨"];
const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export default function HabitForm({ onSubmit, onCancel, initialData }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "💧");
  const [color, setColor] = useState(initialData?.color ?? "#3b82f6");

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      icon,
      color,
    });

    // Reset form
    setName("");
    setIcon("💧");
    setColor("#3b82f6");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Habit Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Drink 8 glasses of water"
          className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-foreground-muted"
          autoFocus
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block text-sm font-medium mb-2">Icon</label>
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className={`p-3 rounded-xl text-2xl transition-all ${
                icon === i
                  ? "bg-accent/20 ring-2 ring-accent"
                  : "bg-background-secondary border border-border hover:border-foreground-muted"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-xl transition-all ${
                color === c
                  ? "ring-2 ring-offset-2 ring-offset-card ring-foreground scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">Preview</label>
        <div className="bg-background-secondary border border-border rounded-xl p-4 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <div>
            <p className="font-medium">{name || "Your habit name"}</p>
            <p className="text-sm text-foreground-muted">🔥 0 day streak</p>
          </div>
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
          disabled={!name.trim()}
          className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isEditing ? "Save Changes" : "Add Habit"}
        </button>
      </div>
    </form>
  );
}
