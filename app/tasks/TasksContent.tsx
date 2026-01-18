import { getTasks } from "@/app/actions/tasks";
import TasksPageClient from "./TasksPageClient";

export default async function TasksContent() {
  const tasks = await getTasks();
  return <TasksPageClient initialTasks={tasks} />;
}
