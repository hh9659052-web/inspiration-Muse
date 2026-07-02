"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: "easeOut" as const },
  }),
};

/** Hero 首屏：展览级排版，标题淡入上浮。 */
export function StudioHero() {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 pb-4 pt-20 text-center sm:pt-28">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="mb-5 text-[11px] font-medium tracking-[0.45em] text-foreground/40"
      >
        AI · MUSE · ATELIER
      </motion.p>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="text-balance text-4xl font-light leading-tight tracking-tight sm:text-6xl"
      >
        把混沌的念头
        <br />
        <span className="font-display italic text-iridescent">
          entrusted to the muse
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="mx-auto mt-6 max-w-md text-pretty text-sm leading-relaxed text-foreground/55"
      >
        丢进任何一个想法、疑问或冲动，缪斯会把它拆成几张可感、可做的灵感卡片。
        无需登录，即刻开始。
      </motion.p>
    </section>
  );
}
