"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/** 工作台顶部玻璃导航：品牌 / 链接 / 登录注册入口。 */
export function StudioNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="glass sticky top-4 z-40 mx-auto flex w-[min(1100px,calc(100%-2rem))] items-center justify-between rounded-2xl px-6 py-3"
    >
      <Link href="/" className="font-display text-xl italic tracking-tight">
        Inspiration&nbsp;Muse
        <span className="ml-2 align-middle font-sans text-[10px] not-italic tracking-[0.3em] text-foreground/40">
          STUDIO
        </span>
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/dashboard"
          className="hidden text-foreground/60 transition-colors hover:text-foreground sm:inline"
        >
          泡泡墙
        </Link>
        <Link
          href="/history"
          className="hidden text-foreground/60 transition-colors hover:text-foreground sm:inline"
        >
          历史
        </Link>
        <Link
          href="/login"
          className="btn-glow rounded-full border border-foreground/15 bg-white/40 px-5 py-2 text-foreground/80 backdrop-blur transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          登录 / 注册
        </Link>
      </nav>
    </motion.header>
  );
}
