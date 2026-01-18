"use client";

import Icon from "./Icon";

export const ADD_TASK_EVENT = "open-add-task-modal";

export function triggerAddTaskModal() {
  // Event handler in TaskListClient
  window.dispatchEvent(new CustomEvent(ADD_TASK_EVENT));
}

export default function AddTaskButton() {
  return (
    <button
      onClick={triggerAddTaskModal}
      className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95"
    >
      <Icon name="plus" strokeWidth={2} />
      Add New Task
    </button>
  );
}
