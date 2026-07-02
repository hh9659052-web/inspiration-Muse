"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/** AI 生成中：呼吸虹彩泡泡 + 扩散光环 + 点点。 */
export function AiLoader({ text = "缪斯正在思考" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="relative flex size-20 items-center justify-center">
        {[0, 0.6].map((delay) => (
          <motion.span
            key={delay}
            className="absolute inset-0 rounded-full border border-violet-300/60"
            animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay, ease: "easeOut" }}
          />
        ))}
        <motion.span
          className="bubble-crystal size-14 rounded-full"
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }}
        />
      </div>
      <div className="flex items-center gap-1.5 text-sm text-foreground/60">
        <Sparkles className="size-4 text-violet-500" />
        {text}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.25 }}
          >
            ·
          </motion.span>
        ))}
      </div>
    </div>
  );
}
