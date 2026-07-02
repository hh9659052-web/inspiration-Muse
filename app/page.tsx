"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { GoddessBackground } from "@/components/universe/goddess-background";
import { ParticleField } from "@/components/universe/particle-field";
import { BubbleExplosion } from "@/components/universe/bubble-explosion";
import { StaggeredFade } from "@/components/universe/staggered-fade";
import { FloatingBubbles } from "@/components/visual/floating-bubbles";

type Stage = "loading" | "entry" | "exploding";

const NAV_LINKS = [
  { label: "灵感宇宙", href: "/universe" },
  { label: "工作台", href: "/studio" },
  { label: "泡泡墙", href: "/dashboard" },
  { label: "历史", href: "/history" },
];

/**
 * 电影级入口 Hero（cinematic spec × 梦幻女神 × WATCHING 编辑感）：
 * Loading → 半透明端坐女神全屏（主图） → 逐字浮现标题 → liquid-glass CTA
 * → 泡泡爆裂转场 → /universe（隐藏图：张开双手的女神）。
 */
export default function EntryPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStage("entry"), 1500);
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
      {/* 主图：端坐女神全屏（100vw/100svh cover center，半透明） */}
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
          {/* 导航：品牌 / 桌面居中链接 / 移动端汉堡 */}
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex items-center justify-between px-5 py-5 md:justify-center md:gap-16 md:px-10"
          >
            <span className="text-sm font-light uppercase tracking-[0.25em] text-foreground/85 md:tracking-[0.3em]">
              Inspiration&nbsp;Muse
            </span>

            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs font-light uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-300 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="liquid-glass rounded-full px-5 py-2 text-xs uppercase tracking-[0.18em] text-foreground/80"
              >
                登录 / 注册
              </Link>
            </nav>

            {/* 移动端汉堡 */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-foreground/80 md:hidden"
              aria-label="菜单"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </motion.header>

          {/* 移动端玻璃菜单 */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mobile-menu-glass fixed left-4 right-4 top-16 z-50 flex flex-col items-center gap-5 rounded-2xl py-8 md:hidden"
              >
                {[...NAV_LINKS, { label: "登录 / 注册", href: "/login" }].map(
                  (l, i) => (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm font-light uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  )
                )}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Hero 内容 */}
          <div className="relative z-10 flex flex-1 flex-col items-center px-5 pt-12 text-center sm:px-8 sm:pt-16 md:pt-24">
            <h1 className="font-display mb-6 font-normal leading-[1.08] tracking-tight text-foreground sm:mb-8">
              <StaggeredFade
                text="WITNESS THE"
                className="block text-4xl sm:text-6xl lg:text-8xl xl:text-9xl"
              />
              <StaggeredFade
                text="HIDDEN MUSE."
                baseDelay={0.5}
                className="text-iridescent block text-4xl italic sm:text-6xl lg:text-8xl xl:text-9xl"
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="mb-8 max-w-xs text-sm font-light leading-relaxed text-foreground/60 sm:mb-10 sm:max-w-md sm:text-base lg:text-lg"
            >
              把一闪而过的灵感，托付给缪斯。
              <br className="hidden sm:block" />
              an odyssey through sparks and living forms.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              onClick={enter}
              className="liquid-glass rounded-full px-7 py-3.5 text-sm uppercase tracking-[0.18em] text-foreground/85 sm:px-10 sm:py-4 sm:tracking-[0.2em]"
            >
              Begin the Experience
            </motion.button>
          </div>

          {/* 左下角标（WATCHING 式） */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="absolute bottom-6 left-6 z-20 flex items-center gap-3 sm:left-10"
          >
            <span className="glass flex size-10 items-center justify-center rounded-full text-xs text-foreground/60">
              01
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] tracking-wide text-foreground/45">
              give every spark a life
            </span>
          </motion.div>

          {/* 右侧竖排刊名 */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-[10px] tracking-[0.5em] text-foreground/35 [writing-mode:vertical-rl] sm:right-8"
          >
            INSPIRATION&nbsp;MUSE&nbsp;·&nbsp;VOL.72H
          </motion.span>
        </div>
      )}

      {/* 泡泡爆开转场 → 隐藏图（张开双手的女神）所在的 /universe */}
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
