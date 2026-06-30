"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { FloatingBubbles } from "@/components/visual/floating-bubbles";

export default function EnterPage() {
  return (
    <main className="bg-dream relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <FloatingBubbles density="sparse" />
      {/* 柔光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-0 size-[60vw] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 text-center"
      >
        {/* 女神像（图二：张开双手） */}
        <motion.img
          src="/images/entry-goddess.png"
          alt="灵感缪斯·迎接"
          draggable={false}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="h-[52vh] w-auto select-none object-contain mix-blend-multiply"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />

        <div className="flex flex-col items-center gap-3">
          <p className="font-display text-2xl italic text-foreground/70">
            Throw in your most chaotic thought
          </p>
          <h1 className="text-balance text-2xl font-light tracking-tight sm:text-3xl">
            把此刻脑子里最乱的那个念头，丢进来
          </h1>
        </div>

        <Link
          href="/login"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-10 py-4 text-sm font-medium text-background transition-transform hover:scale-105"
        >
          轻触，进入
        </Link>

        <Link
          href="/"
          className="text-xs text-foreground/40 transition-colors hover:text-foreground/70"
        >
          ← 返回封面
        </Link>
      </motion.div>
    </main>
  );
}
