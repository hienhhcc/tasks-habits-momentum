import { getStats } from "@/app/actions/stats";
import StatsPageClient from "./StatsPageClient";

export default async function StatsContent() {
  const stats = await getStats();
  return <StatsPageClient stats={stats} />;
}
