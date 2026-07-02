"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";

/**
 * 庆祝特效：粒子迸发 + 徽章弹出。
 * playKey 变化时播放一次（传 0/undefined 不播放）。
 */
export function Celebration({
  playKey,
  badge,
}: {
  playKey: number;
  badge?: string;
}) {
  const parts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 90 + ((i * 17) % 70);
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 30,
          hue: ["#ffb2dc", "#c4b2ff", "#acd6ff", "#aaffec", "#ffd88a"][i % 5],
          d: 5 + ((i * 3) % 8),
          rot: ((i * 47) % 360) - 180,
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {playKey > 0 && (
        <div
          key={playKey}
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
        >
          {parts.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-sm"
              style={{ width: p.d, height: p.d * 1.6, background: p.hue }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.dx, y: p.dy + 60, opacity: 0, rotate: p.rot }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))}
          {badge && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: [0, 1.15, 1], rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="glass flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 shadow-xl"
            >
              <Award className="size-5 text-amber-500" />
              <span className="text-sm font-semibold">{badge}</span>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
