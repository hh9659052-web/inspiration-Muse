"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * 泡泡爆裂粒子：从中心向四周迸发的虹彩小球 + 扩散光环。
 * 挂载即播放一次；配合 AnimatePresence 使用。
 */
export function BubbleExplosion({
  size = 300,
  onDone,
}: {
  size?: number;
  onDone?: () => void;
}) {
  const shards = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.15;
        const dist = size * (0.5 + ((i * 11) % 40) / 100);
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          d: 6 + ((i * 7) % 16),
          hue: ["#ffb2dc", "#c4b2ff", "#acd6ff", "#aaffec", "#ffeab0"][i % 5],
        };
      }),
    [size]
  );

  return (
    <div
      className="pointer-events-none relative"
      style={{ width: size, height: size }}
    >
      {/* 扩散光环 */}
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-white/70"
        initial={{ scale: 0.4, opacity: 1 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onAnimationComplete={onDone}
      />
      <motion.span
        className="absolute inset-0 rounded-full bg-white/40"
        initial={{ scale: 0.5, opacity: 0.9 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* 迸发碎泡 */}
      {shards.map((s) => (
        <motion.span
          key={s.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: s.d,
            height: s.d,
            background: `radial-gradient(circle at 32% 28%, white, ${s.hue})`,
            boxShadow: `0 0 10px ${s.hue}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
