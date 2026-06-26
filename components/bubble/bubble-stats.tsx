import { Sparkles, LifeBuoy, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BubbleStats {
  active: number; // 进行中（未冷却）
  cooling: number; // 待抢救（已冷却）
  completed: number; // 已落地
}

/** 泡泡墙顶部统计条。 */
export function BubbleStatsBar({ stats }: { stats: BubbleStats }) {
  const items = [
    {
      icon: Sparkles,
      label: "进行中",
      value: stats.active,
      color: "text-bubble-warm",
    },
    {
      icon: LifeBuoy,
      label: "待抢救",
      value: stats.cooling,
      color: "text-bubble-cold",
    },
    {
      icon: Trophy,
      label: "已落地",
      value: stats.completed,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border bg-card p-3"
        >
          <Icon className={cn("size-5 shrink-0", color)} />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tabular-nums">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
