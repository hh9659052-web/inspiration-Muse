"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 可点击的功能泡泡：虹彩质感 + 缓慢漂浮 + 鼠标视差 + 悬停发光放大。
 * mx/my 为鼠标归一化偏移（-1..1），depth 越大视差越明显。
 */
export function FloatingBubble({
  label,
  sub,
  size,
  x,
  y,
  mx = 0,
  my = 0,
  depth = 10,
  delay = 0,
  onClick,
  emphasis = false,
  className,
}: {
  label: string;
  sub?: string;
  size: number;
  x: string;
  y: string;
  mx?: number;
  my?: number;
  depth?: number;
  delay?: number;
  onClick?: () => void;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: mx * depth,
        y: my * depth,
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { type: "spring", stiffness: 160, damping: 15, delay },
        x: { type: "spring", stiffness: 60, damping: 20 },
        y: { type: "spring", stiffness: 60, damping: 20 },
      }}
      whileHover={{ scale: 1.09 }}
      whileTap={{ scale: 0.94 }}
      className={cn("group absolute", className)}
      style={{ left: x, top: y, width: size, height: size }}
    >
      {/* 漂浮动画包一层，避免与视差 transform 冲突 */}
      <motion.span
        className={cn(
          "bubble-crystal flex size-full flex-col items-center justify-center gap-1 rounded-full text-center",
          "transition-shadow duration-300",
          "group-hover:shadow-[0_0_50px_-6px_rgba(168,150,255,0.75)]",
          emphasis && "shadow-[0_0_60px_-8px_rgba(168,150,255,0.6)]"
        )}
        animate={{ y: [0, -8, 0] }}
        transition={{
          repeat: Infinity,
          duration: 6 + (size % 5),
          ease: "easeInOut",
          delay,
        }}
      >
        <span
          className="font-medium leading-tight text-foreground/85"
          style={{ fontSize: Math.max(12, size * 0.11) }}
        >
          {label}
        </span>
        {sub && (
          <span
            className="px-3 leading-tight text-foreground/45"
            style={{ fontSize: Math.max(10, size * 0.062) }}
          >
            {sub}
          </span>
        )}
      </motion.span>
    </motion.button>
  );
}
