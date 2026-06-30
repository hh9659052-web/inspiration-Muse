"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { FloatingBubbles } from "@/components/visual/floating-bubbles";

export default function CoverPage() {
  return (
    <main className="bg-dream relative min-h-screen overflow-hidden">
      {/* 漂浮的水晶泡泡装饰 */}
      <FloatingBubbles density="rich" />

      {/* 顶部编辑式导航 */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-2xl italic tracking-tight">
          Inspiration&nbsp;Muse
        </span>
        <nav className="hidden items-center gap-8 text-sm text-foreground/70 sm:flex">
          <Link href="#about" className="transition-colors hover:text-foreground">
            关于
          </Link>
          <Link href="#features" className="transition-colors hover:text-foreground">
            功能
          </Link>
          <Link
            href="/enter"
            className="inline-flex items-center gap-1 rounded-full border border-foreground/20 px-4 py-1.5 transition-colors hover:bg-foreground hover:text-background"
          >
            进入 <ArrowUpRight className="size-3.5" />
          </Link>
        </nav>
      </header>

      {/* 主视觉：女神像 + 巨型标题叠压（参考图五） */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col items-center justify-center px-6">
        {/* 背后的巨型字 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-x-0 top-[14%] text-center text-[18vw] font-light leading-none tracking-tight text-foreground/10 sm:text-[15vw]"
        >
          灵感缪斯
        </motion.h1>

        {/* 女神像（图一：端坐女神，主封面） */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 flex h-[60vh] w-full max-w-xl items-end justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cover-goddess.png"
            alt="灵感缪斯·女神"
            className="h-full w-auto select-none object-contain mix-blend-multiply"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
        </motion.div>

        {/* 标语 + 进入 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative z-20 -mt-6 flex flex-col items-center gap-5 text-center"
        >
          <p className="font-display text-3xl italic text-iridescent sm:text-4xl">
            give every spark a life
          </p>
          <p className="max-w-md text-pretty text-sm text-foreground/60">
            把一闪而过的灵感吹成一个泡泡。它有 72 小时的生命，
            缪斯帮你在它冷掉之前，迈出落地的第一步。
          </p>
          <Link
            href="/enter"
            className="group mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-transform hover:scale-105"
          >
            进入灵感宇宙
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
