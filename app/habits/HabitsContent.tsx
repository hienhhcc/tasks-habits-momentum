import { getHabits } from "@/app/actions/habits";
import HabitsPageClient from "./HabitsPageClient";

export default async function HabitsContent() {
  const habits = await getHabits();
  return <HabitsPageClient initialHabits={habits} />;
}
