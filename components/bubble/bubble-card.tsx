"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { TEMPERATURE_META } from "@/lib/bubble";
import { useCountdown } from "@/hooks/use-countdown";
import { CountdownTimer } from "@/components/bubble/countdown-timer";
import type { Idea } from "@/types";

/**
 * 单个泡泡卡片。
 * - 实时倒计时（每秒跳动）
 * - 温度态决定描边/文字颜色
 * - 冷却（过期）时整卡降饱和 + 轻微下沉，并提示进入抢救模式
 * - Framer Motion 入场动画（泡泡浮起）
 */
export function BubbleCard({ idea, index = 0 }: { idea: Idea; index?: number }) {
  const { temperature, isCold } = useCountdown(idea.expires_at);
  const meta = TEMPERATURE_META[temperature];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
    >
      <Link
        href={`/bubble/${idea.id}`}
        className={cn(
          "bubble-crystal group relative flex flex-col gap-3 rounded-[1.75rem] p-5 ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1",
          meta.ring,
          isCold && "opacity-70 saturate-50"
        )}
      >
        {/* 高光点 */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-6 top-4 size-2 rounded-full bg-white/80 blur-[1px]"
        />
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              meta.text
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                meta.dot,
                !isCold && "animate-pulse"
              )}
            />
            {meta.label}
          </span>
          <CountdownTimer expiresAt={idea.expires_at} />
        </div>

        <h3 className="line-clamp-2 font-semibold leading-snug">{idea.title}</h3>

        {idea.content && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {idea.content}
          </p>
        )}

        {isCold && (
          <p className="mt-1 text-xs font-medium text-bubble-cold">
            泡泡冷掉了 —— 点进去抢救它 →
          </p>
        )}
      </Link>
    </motion.div>
  );
}
