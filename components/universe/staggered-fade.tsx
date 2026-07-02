"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * 逐字浮现标题（cinematic spec）：
 * 文本拆成单字符 motion.span，入视口后按 i*0.07s 依次淡入上浮，只触发一次。
 */
export function StaggeredFade({
  text,
  className,
  baseDelay = 0,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: baseDelay + i * 0.07, duration: 0.5, ease: "easeOut" }}
          className="inline-block"
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
