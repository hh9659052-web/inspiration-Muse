"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, GraduationCap, Snowflake, Globe2, LayoutGrid, Compass } from "lucide-react";

import { GoddessBackground } from "@/components/universe/goddess-background";
import { ParticleField } from "@/components/universe/particle-field";
import { FloatingBubble } from "@/components/universe/floating-bubble";
import { BubbleExplosion } from "@/components/universe/bubble-explosion";
import { GlassModal } from "@/components/universe/glass-modal";
import { IdeaPanel } from "@/components/universe/panels/idea-panel";
import { SkillPanel } from "@/components/universe/panels/skill-panel";
import { CoolingPanel } from "@/components/universe/panels/cooling-panel";
import { PlazaPanel } from "@/components/universe/panels/plaza-panel";
import { BoardPanel } from "@/components/universe/panels/board-panel";
import { JobPanel } from "@/components/universe/panels/job-panel";

type Scene = "seed" | "burst" | "open";
type PanelKey = "idea" | "skill" | "cooling" | "plaza" | "board" | "job" | null;

const PANELS: Record<
  Exclude<PanelKey, null>,
  { title: string; icon: React.ReactNode; body: React.ReactNode }
> = {
  idea: { title: "想法泡泡", icon: <Lightbulb className="size-5 text-amber-500" />, body: <IdeaPanel /> },
  skill: { title: "技能泡泡", icon: <GraduationCap className="size-5 text-violet-500" />, body: <SkillPanel /> },
  cooling: { title: "冷却泡泡 · 三分钟热度转换器", icon: <Snowflake className="size-5 text-sky-500" />, body: <CoolingPanel /> },
  plaza: { title: "灵感广场", icon: <Globe2 className="size-5 text-emerald-500" />, body: <PlazaPanel /> },
  board: { title: "落地看板", icon: <LayoutGrid className="size-5 text-rose-400" />, body: <BoardPanel /> },
  job: { title: "职业推荐泡泡", icon: <Compass className="size-5 text-indigo-500" />, body: <JobPanel /> },
};

/** 主场景：女神双手托起灵感宇宙。 */
export default function UniversePage() {
  const [scene, setScene] = useState<Scene>("seed");
  const [panel, setPanel] = useState<PanelKey>(null);
  const [mouse, setMouse] = useState({ mx: 0, my: 0 });

  function onMove(e: React.MouseEvent) {
    const { innerWidth, innerHeight } = window;
    setMouse({
      mx: (e.clientX / innerWidth) * 2 - 1,
      my: (e.clientY / innerHeight) * 2 - 1,
    });
  }

  function burst() {
    setScene("burst");
    setTimeout(() => setScene("open"), 550);
  }

  return (
    <main
      onMouseMove={onMove}
      className="relative h-[100svh] w-screen overflow-hidden"
    >
      {/* 图三：张开双手的女神全屏背景 */}
      <GoddessBackground src="/images/goddess-main.png" dim={0.06} />
      <ParticleField count={26} />

      {/* 入场白光淡出（承接入口爆裂转场） */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {/* 顶部 */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 sm:px-12">
        <Link href="/" className="font-display text-lg italic text-foreground/70 transition-colors hover:text-foreground">
          ← Inspiration Muse
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/studio" className="text-foreground/55 transition-colors hover:text-foreground">
            工作台
          </Link>
          <Link href="/dashboard" className="text-foreground/55 transition-colors hover:text-foreground">
            泡泡墙
          </Link>
          <Link
            href="/login"
            className="btn-glow rounded-full border border-foreground/20 bg-white/40 px-4 py-1.5 text-foreground/75 backdrop-blur"
          >
            登录 / 注册
          </Link>
        </div>
      </header>

      {/* 编辑杂志感：巨型刊名叠压（在泡泡之下、女神之上） */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[4svh] z-0 select-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="text-liquid whitespace-nowrap text-center text-[13vw] font-semibold leading-none tracking-tight"
        >
          universe.
        </motion.p>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[10px] tracking-[0.5em] text-foreground/35 [writing-mode:vertical-rl] sm:left-8"
      >
        SIX&nbsp;BUBBLES&nbsp;·&nbsp;ONE&nbsp;GODDESS
      </motion.span>

      {/* 场景一：女神手上悬浮最大的 Idea Bubble */}
      <AnimatePresence>
        {scene === "seed" && (
          <FloatingBubble
            label="Idea Bubble"
            sub="点我，释放你的灵感宇宙"
            size={200}
            x="calc(50% - 100px)"
            y="22%"
            mx={mouse.mx}
            my={mouse.my}
            depth={14}
            emphasis
            onClick={burst}
          />
        )}
      </AnimatePresence>

      {/* 爆裂瞬间 */}
      {scene === "burst" && (
        <div className="absolute left-1/2 top-[22%] z-30 -translate-x-1/2">
          <BubbleExplosion size={320} />
        </div>
      )}

      {/* 场景二：六大功能泡泡分裂展开 */}
      {scene === "open" && (
        <>
          <FloatingBubble label="想法泡泡" sub="丢进混乱念头" size={170} x="calc(50% - 85px)" y="14%" mx={mouse.mx} my={mouse.my} depth={18} delay={0} emphasis onClick={() => setPanel("idea")} />
          <FloatingBubble label="技能泡泡" sub="越学越大越亮" size={130} x="calc(26% - 65px)" y="30%" mx={mouse.mx} my={mouse.my} depth={12} delay={0.08} onClick={() => setPanel("skill")} />
          <FloatingBubble label="灵感广场" sub="连接同频的人" size={126} x="calc(74% - 63px)" y="28%" mx={mouse.mx} my={mouse.my} depth={12} delay={0.16} onClick={() => setPanel("plaza")} />
          <FloatingBubble label="冷却泡泡" sub="抢救沉睡灵感" size={112} x="calc(14% - 56px)" y="56%" mx={mouse.mx} my={mouse.my} depth={9} delay={0.24} onClick={() => setPanel("cooling")} />
          <FloatingBubble label="落地看板" sub="从想到做" size={118} x="calc(86% - 59px)" y="54%" mx={mouse.mx} my={mouse.my} depth={9} delay={0.32} onClick={() => setPanel("board")} />
          <FloatingBubble label="职业推荐" sub="热爱优先" size={98} x="calc(50% - 49px)" y="46%" mx={mouse.mx} my={mouse.my} depth={7} delay={0.4} onClick={() => setPanel("job")} />
        </>
      )}

      {/* 底部引导 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute inset-x-0 bottom-6 z-10 text-center text-xs tracking-[0.3em] text-foreground/35"
      >
        {scene === "seed" ? "轻触泡泡 · 开启灵感宇宙" : "点击任意泡泡 · 展开功能"}
      </motion.p>

      {/* 功能面板 */}
      {panel && (
        <GlassModal
          open={!!panel}
          onClose={() => setPanel(null)}
          title={PANELS[panel].title}
          icon={PANELS[panel].icon}
        >
          {PANELS[panel].body}
        </GlassModal>
      )}
    </main>
  );
}
