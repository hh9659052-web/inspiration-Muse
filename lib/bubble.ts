import { WARM_THRESHOLD_MS } from "@/lib/constants";
import type { BubbleTemperature, Idea } from "@/types";

/** 剩余存活毫秒数（可为负，表示已过期）。 */
export function getRemainingMs(idea: Pick<Idea, "expires_at">): number {
  return new Date(idea.expires_at).getTime() - Date.now();
}

/** 根据剩余时间判断泡泡温度态。 */
export function getTemperature(remainingMs: number): BubbleTemperature {
  if (remainingMs <= 0) return "cold";
  if (remainingMs <= WARM_THRESHOLD_MS) return "cooling";
  return "warm";
}

/** 是否已冷却（过期，可进入抢救模式）。 */
export function isCold(idea: Pick<Idea, "expires_at">): boolean {
  return getRemainingMs(idea) <= 0;
}

/** 把剩余毫秒格式化为 HH:MM:SS（过期返回 00:00:00）。 */
export function formatRemaining(remainingMs: number): string {
  const ms = Math.max(0, remainingMs);
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** 温度态对应的视觉文案与 Tailwind 颜色类。 */
export const TEMPERATURE_META: Record<
  BubbleTemperature,
  { label: string; ring: string; text: string; dot: string }
> = {
  warm: {
    label: "新鲜",
    ring: "ring-bubble-warm/40",
    text: "text-bubble-warm",
    dot: "bg-bubble-warm",
  },
  cooling: {
    label: "降温中",
    ring: "ring-bubble-cooling/50",
    text: "text-bubble-cooling",
    dot: "bg-bubble-cooling",
  },
  cold: {
    label: "已冷却",
    ring: "ring-bubble-cold/50",
    text: "text-bubble-cold",
    dot: "bg-bubble-cold",
  },
};
