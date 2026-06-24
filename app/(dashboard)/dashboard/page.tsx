import { createClient } from "@/lib/supabase/server";
import { BubbleWall } from "@/components/bubble/bubble-wall";
import type { Idea } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 只展示「进行中」的泡泡（active/cooling/rescued）；
  // 已完成/归档的进入历史页（M7）。
  const { data } = await supabase
    .from("ideas")
    .select("*")
    .in("status", ["active", "cooling", "rescued"])
    .order("created_at", { ascending: false });

  const ideas = (data ?? []) as Idea[];

  return <BubbleWall ideas={ideas} />;
}
