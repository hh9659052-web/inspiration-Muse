"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Dot, MessageCircleHeart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Celebration } from "@/components/universe/celebration";

/** 广场上的公开泡泡（演示数据，正式版接数据库）。 */
const PUBLIC_BUBBLES = [
  { id: "p1", author: "小汽水", idea: "只卖一种口味的冰淇淋车，每周换口味" },
  { id: "p2", author: "Momo", idea: "给独居年轻人做「一人食」菜谱订阅" },
  { id: "p3", author: "阿飞", idea: "城市屋顶观星地图小程序" },
  { id: "p4", author: "Luna", idea: "用 AI 把日记自动变成周报播客" },
];

/** 灵感广场：公开泡泡 + 连接请求 + 破冰。 */
export function PlazaPanel() {
  const [myIdea, setMyIdea] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);
  const [icebreaker, setIcebreaker] = useState("");
  const [celebrate, setCelebrate] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("muse:demo-idea");
      if (raw) setMyIdea(JSON.parse(raw).input ?? "");
    } catch {}
  }, []);

  async function connect(target: (typeof PUBLIC_BUBBLES)[number]) {
    if (connecting) return;
    setConnecting(target.id);
    setIcebreaker("");

    // 对方「同意」需要时间——演示中直接请求破冰问题
    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "icebreaker",
        ideaA: myIdea || "一个还没想清楚的点子",
        ideaB: target.idea,
      }),
    });
    setConnecting(null);

    if (!res.ok) {
      toast.error("连接失败，再试一次");
      return;
    }
    const data = await res.json();
    setConnected(target.id);
    setIcebreaker(data.question);
    setCelebrate((k) => k + 1);
  }

  return (
    <div className="flex flex-col gap-5">
      <Celebration playKey={celebrate} badge="灵感连接成功" />

      <p className="text-sm leading-relaxed text-foreground/55">
        这些是其他人公开的想法泡泡 🕊️。发起连接，对方同意后即可私聊、一起把想法做出来。
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PUBLIC_BUBBLES.map((b, i) => {
          const isConnected = connected === b.id;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "card-lift relative flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/45 p-4",
                isConnected &&
                  "border-violet-300 shadow-[0_0_28px_-4px_rgba(168,150,255,0.6)]"
              )}
            >
              <span className="flex items-center text-xs text-foreground/45">
                🕊️ {b.author}
                <Dot className="size-4" />
                公开泡泡
              </span>
              <p className="text-sm leading-relaxed">{b.idea}</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => connect(b)}
                disabled={!!connecting || isConnected}
                className={cn(
                  "btn-glow mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-xs",
                  isConnected
                    ? "bg-violet-500/15 text-violet-700"
                    : "bg-foreground text-background disabled:opacity-40"
                )}
              >
                <Link2 className="size-3.5" />
                {isConnected
                  ? "已连接"
                  : connecting === b.id
                    ? "对方确认中…"
                    : "申请连接"}
              </motion.button>

              {/* 连接成功：发光连线 */}
              {isConnected && (
                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute -top-2 left-6 right-6 h-0.5 origin-left rounded-full bg-gradient-to-r from-violet-400 via-sky-300 to-pink-300 shadow-[0_0_12px_rgba(168,150,255,0.9)]"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {icebreaker && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass flex items-start gap-3 rounded-2xl border border-violet-200/80 p-4"
          >
            <MessageCircleHeart className="mt-0.5 size-5 shrink-0 text-violet-500" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-violet-600">
                AI 破冰第一句
              </span>
              <p className="text-sm leading-relaxed">{icebreaker}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
