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
 * 入口体验：Loading 启动页 → 女神全屏 Entry → 泡泡爆开转场 → /universe。
 */
export default function EntryPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");

  // Loading 启动页：品牌浮现后进入 Entry
  useEffect(() => {
    const t = setTimeout(() => setStage("entry"), 1600);
    return () => clearTimeout(t);
  }, []);

  // 预取主场景，保证转场丝滑
  useEffect(() => {
    router.prefetch("/universe");
  }, [router]);

  function enter() {
    setStage("exploding");
    setTimeout(() => router.push("/universe"), 650);
  }

  return (
    <main className="relative h-[100svh] w-screen overflow-hidden">
      {/* 图二：端坐女神全屏背景 */}
      <GoddessBackground src="/images/goddess-entry.png" />
      <ParticleField count={20} />
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

      {/* Entry 内容 */}
      {stage !== "loading" && (
        <div className="relative z-10 flex h-full flex-col">
          {/* 顶部：Logo + 登录注册 */}
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-between px-8 py-6 sm:px-12"
          >
            <span className="font-display text-xl italic tracking-tight">
              Inspiration&nbsp;Muse
            </span>
            <Link
              href="/login"
              className="btn-glow rounded-full border border-foreground/20 bg-white/40 px-5 py-2 text-sm text-foreground/75 backdrop-blur transition-colors hover:text-foreground"
            >
              登录 / 注册
            </Link>
          </motion.header>

          {/* 中央：标题 + Enter */}
          <div className="flex flex-1 flex-col items-center justify-end pb-[12svh] text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-4xl font-light tracking-[0.3em] text-foreground/85 sm:text-5xl"
            >
              灵感缪斯
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-display mt-4 text-lg italic text-foreground/50"
            >
              give every spark a life
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 150, damping: 14 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={enter}
              className="group relative mt-10"
            >
              <span className="bubble-crystal flex size-32 items-center justify-center rounded-full text-base font-medium tracking-[0.4em] text-foreground/75 transition-shadow duration-300 group-hover:shadow-[0_0_60px_-4px_rgba(168,150,255,0.8)]">
                ENTER
              </span>
            </motion.button>
          </div>
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
