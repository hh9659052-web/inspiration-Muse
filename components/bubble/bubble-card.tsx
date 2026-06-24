"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatRemaining,
  getRemainingMs,
  getTemperature,
  TEMPERATURE_META,
} from "@/lib/bubble";
import type { Idea } from "@/types";

/**
 * 单个泡泡卡片。
 * M2：渲染基本信息 + 静态剩余时间徽标。
 * M3 将把剩余时间换成实时倒计时 + 冷却动画。
 */
export function BubbleCard({ idea }: { idea: Idea }) {
  const remainingMs = getRemainingMs(idea);
  const temp = getTemperature(remainingMs);
  const meta = TEMPERATURE_META[temp];

  return (
    <Link
      href={`/bubble/${idea.id}`}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm ring-2 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-md",
        meta.ring
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium",
            meta.text
          )}
        >
          <span className={cn("size-2 rounded-full", meta.dot)} />
          {meta.label}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-xs",
            meta.text
          )}
        >
          <Clock className="size-3" />
          {formatRemaining(remainingMs)}
        </span>
      </div>

      <h3 className="line-clamp-2 font-semibold leading-snug">{idea.title}</h3>

      {idea.content && (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {idea.content}
        </p>
      )}
    </Link>
  );
}
