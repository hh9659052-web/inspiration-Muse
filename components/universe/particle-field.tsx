"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

/** 缓慢上浮的柔光粒子层。 */
export function ParticleField({ count = 26 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 13) % 100}%`,
        size: 2 + ((i * 7) % 5),
        duration: 14 + ((i * 5) % 12),
        delay: (i * 1.7) % 12,
        opacity: 0.25 + ((i * 13) % 40) / 100,
      })),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: "0 0 8px 2px rgba(255,255,255,0.6)",
          }}
          initial={{ y: "105svh" }}
          animate={{ y: "-6svh" }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
