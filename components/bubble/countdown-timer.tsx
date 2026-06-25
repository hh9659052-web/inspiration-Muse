"use client";

import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatRemaining, TEMPERATURE_META } from "@/lib/bubble";
import { useCountdown } from "@/hooks/use-countdown";

/**
 * 实时倒计时徽标。每秒跳动，按温度态变色；过期显示「已冷却」。
 * size="lg" 用于详情页的大号展示。
 */
export function CountdownTimer({
  expiresAt,
  size = "sm",
  className,
}: {
  expiresAt: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { remainingMs, temperature, isCold } = useCountdown(expiresAt);
  const meta = TEMPERATURE_META[temperature];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono tabular-nums",
        size === "lg" ? "text-3xl font-semibold" : "text-xs",
        meta.text,
        className
      )}
    >
      <Clock className={size === "lg" ? "size-6" : "size-3"} />
      {isCold ? "已冷却" : formatRemaining(remainingMs)}
    </span>
  );
}
