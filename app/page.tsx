"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { GoddessBackground } from "@/components/universe/goddess-background";
import { ParticleField } from "@/components/universe/particle-field";
import { BubbleExplosion } from "@/components/universe/bubble-explosion";
import { FloatingBubbles } from "@/components/visual/floating-bubbles";

type Stage = "loading" | "entry" | "exploding";

/**
 * 入口体验（编辑杂志风，参考 WATCHING.）：
 * Loading → 女神全屏 + 巨型标题叠压 → ENTER 泡泡爆裂 → /universe。
 */
export default function EntryPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");

  useEffect(() => {
    const t = setTimeout(() => setStage("entry"), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    router.prefetch("/universe");
  }, [router]);

  function enter() {
    setStage("exploding");
    setTimeout(() => router.push("/universe"), 650);
  }

  return (
    <main className="relative h-[100svh] w-screen overflow-hidden">
      {/* 图二：端坐女神全屏背景（100vw/100svh cover center） */}
      <GoddessBackground src="/images/goddess-entry.png" />
      <ParticleField count={18} />
      <FloatingBubbles density="sparse" />

      {/* Loading 启动页 */}
      <AnimatePresence>
        {stage === "loading" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="bg-dream absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
          >
            <motion.span
              className="bubble-crystal size-20 rounded-full"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-2xl italic tracking-wide text-foreground/70"
            >
              Inspiration Muse
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {stage !== "loading" && (
        <div className="relative z-10 flex h-full flex-col">
          {/* 顶部：logo 左 / 胶囊导航居中 / 登录右（WATCHING 式） */}
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative flex items-center justify-between px-6 py-5 sm:px-10"
          >
            <span className="font-display text-xl italic tracking-tight">
              ✦&nbsp;Muse
            </span>

            <nav className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 rounded-full px-7 py-2.5 text-xs tracking-wide text-foreground/65 sm:flex">
              <Link href="/universe" className="transition-colors hover:text-foreground">灵感宇宙</Link>
              <Link href="/studio" className="transition-colors hover:text-foreground">工作台</Link>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">泡泡墙</Link>
              <Link href="/history" className="transition-colors hover:text-foreground">历史</Link>
            </nav>

            <Link
              href="/login"
              className="btn-glow rounded-full bg-foreground px-5 py-2 text-xs text-background"
            >
              登录 / 注册
            </Link>
          </motion.header>

          {/* 巨型标题：横贯全屏、叠压女神（编辑杂志感） */}
          <div className="pointer-events-none absolute inset-x-0 top-[46%] z-10 -translate-y-1/2 select-none">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 1.1, ease: "easeOut" }}
              className="whitespace-nowrap text-center font-sans text-[17vw] font-bold leading-none tracking-tight text-white/60 mix-blend-overlay drop-shadow-[0_2px_24px_rgba(120,110,220,0.25)]"
            >
              MUSE<span className="text-white/80">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="mt-2 text-center text-[11px] font-medium tracking-[0.6em] text-foreground/45"
            >
              灵&nbsp;感&nbsp;缪&nbsp;斯&nbsp;·&nbsp;GIVE&nbsp;EVERY&nbsp;SPARK&nbsp;A&nbsp;LIFE
            </motion.p>
          </div>

          {/* ENTER 泡泡：压在巨型字与女神之上 */}
          <div className="flex flex-1 items-end justify-center pb-[9svh]">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 150, damping: 14 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={enter}
              className="group relative z-20"
            >
              <span className="bubble-crystal flex size-32 items-center justify-center rounded-full text-sm font-medium tracking-[0.45em] text-foreground/80 transition-shadow duration-300 group-hover:shadow-[0_0_60px_-4px_rgba(168,150,255,0.85)]">
                ENTER
              </span>
            </motion.button>
          </div>

          {/* 左下：辅助入口（杂志角标） */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-6 left-6 z-20 flex items-center gap-3 sm:left-10"
          >
            <span className="glass flex size-10 items-center justify-center rounded-full text-xs text-foreground/60">
              01
            </span>
            <button
              onClick={enter}
              className="glass btn-glow rounded-full px-5 py-2.5 text-xs tracking-wide text-foreground/70 hover:text-foreground"
            >
              开始体验 →
            </button>
          </motion.div>

          {/* 右侧：竖排刊名（WATCHING 式侧标） */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-[10px] tracking-[0.5em] text-foreground/35 [writing-mode:vertical-rl] sm:right-8"
          >
            INSPIRATION&nbsp;MUSE&nbsp;·&nbsp;VOL.72H
          </motion.span>
        </div>
      )}

      {/* 泡泡爆开转场 */}
      <AnimatePresence>
        {stage === "exploding" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            <BubbleExplosion size={420} />
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
