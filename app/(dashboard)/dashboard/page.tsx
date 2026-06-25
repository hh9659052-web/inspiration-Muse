import { createClient } from "@/lib/supabase/server";
import { BubbleWall } from "@/components/bubble/bubble-wall";
import { isCold } from "@/lib/bubble";
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

  // 惰性冷却：已过期但仍标记 active/rescued 的泡泡，落库为 cooling。
  const newlyCold = ideas.filter(
    (i) => i.status !== "cooling" && isCold(i)
  );
  if (newlyCold.length > 0) {
    const ids = newlyCold.map((i) => i.id);
    await supabase.from("ideas").update({ status: "cooling" }).in("id", ids);
    for (const i of ideas) {
      if (ids.includes(i.id)) i.status = "cooling";
    }
  }

  return <BubbleWall ideas={ideas} />;
}
