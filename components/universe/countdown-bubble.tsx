"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import { useCountdown } from "@/hooks/use-countdown";
import { formatRemaining } from "@/lib/bubble";
import { BUBBLE_TTL_MS } from "@/lib/constants";

/**
 * 72 小时倒计时泡泡：随剩余时间流逝而变暗、变透明、缓缓下沉。
 * progress = 剩余/72h：亮度、不透明度、下沉位移都由它驱动。
 */
export function CountdownBubble({ expiresAt }: { expiresAt: string }) {
  const { remainingMs, isCold } = useCountdown(expiresAt);
  const progress = Math.max(0, Math.min(1, remainingMs / BUBBLE_TTL_MS));

  const opacity = 0.35 + progress * 0.65; // 1 → 0.35
  const sink = (1 - progress) * 18; // 0 → 18px 下沉
  const saturate = 0.4 + progress * 0.6;

  return (
    <motion.div
      className="relative mx-auto flex size-36 items-center justify-center"
      animate={{ y: [sink, sink - 6, sink] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      style={{ opacity, filter: `saturate(${saturate})` }}
    >
      <span className="bubble-crystal absolute inset-0 rounded-full" />
      <div className="relative z-10 flex flex-col items-center gap-1">
        <Clock className="size-4 text-foreground/50" />
        <span className="font-mono text-lg font-semibold tabular-nums text-foreground/80">
          {isCold ? "已冷却" : formatRemaining(remainingMs)}
        </span>
        <span className="text-[10px] tracking-widest text-foreground/40">
          {isCold ? "等待抢救" : "距离冷却"}
        </span>
      </div>
    </motion.div>
  );
}
