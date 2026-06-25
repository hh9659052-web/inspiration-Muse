import Link from "next/link";
import { CheckCircle2, Archive } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Idea } from "@/types";

/** 历史泡泡卡片（已完成 / 已归档），只读回顾。 */
export function HistoryCard({ idea }: { idea: Idea }) {
  const completed = idea.status === "completed";

  return (
    <Link
      href={`/bubble/${idea.id}`}
      className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40"
    >
      {completed ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
      ) : (
        <Archive className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium">{idea.title}</span>
        <span
          className={cn(
            "text-xs",
            completed ? "text-primary" : "text-muted-foreground"
          )}
        >
          {completed ? "已落地" : "已归档"} ·{" "}
          {new Date(idea.updated_at).toLocaleDateString("zh-CN")}
        </span>
      </div>
    </Link>
  );
}
