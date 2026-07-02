"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { ResultCard, type MuseCard } from "@/components/studio/result-card";

const FAV_KEY = "muse:favorites";

/** AI 输入面板：发光输入框 → 生成 → 分析加载态 → 结果卡片逐个弹出。 */
export function PromptPanel() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<MuseCard[]>([]);
  const [favorites, setFavorites] = useState<Record<string, MuseCard>>({});

  // 收藏持久化（localStorage）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);
  function toggleFavorite(card: MuseCard) {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[card.id]) {
        delete next[card.id];
        toast("已取消收藏");
      } else {
        next[card.id] = card;
        toast.success("已收藏 ♥");
      }
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setCards([]);

    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("缪斯走神了", { description: error });
      return;
    }
    const data = await res.json();
    setCards(
      data.cards.map((c: Omit<MuseCard, "id">, i: number) => ({
        ...c,
        id: `${Date.now()}-${i}`,
      }))
    );
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-32">
      {/* 输入区 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="glass input-glow rounded-3xl border border-white/60 p-3"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
          }}
          rows={3}
          maxLength={600}
          placeholder="丢进你此刻最乱的念头……比如：想做一个只卖一种食物的小店"
          className="w-full resize-none bg-transparent px-3 py-2 text-base leading-relaxed outline-none placeholder:text-foreground/35"
        />
        <div className="flex items-center justify-between px-3 pb-1">
          <span className="text-xs text-foreground/35">
            {prompt.length}/600 · ⌘/Ctrl + Enter 快速生成
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="btn-glow inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background disabled:opacity-40"
          >
            <Wand2 className="size-4" />
            {loading ? "缪斯思考中" : "生成灵感"}
          </motion.button>
        </div>
      </motion.div>

      {/* 加载态：AI 正在分析 */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-14 flex flex-col items-center gap-6"
          >
            {/* 呼吸的虹彩泡泡 + 扩散光环 */}
            <div className="relative flex size-24 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full border border-violet-300/50"
                animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-sky-300/50"
                animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: 0.6,
                  ease: "easeOut",
                }}
              />
              <motion.span
                className="bubble-crystal size-16 rounded-full"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-foreground/55">
              <Sparkles className="size-4 text-violet-500" />
              AI 正在分析你的念头
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结果卡片：逐个弹出 */}
      {cards.length > 0 && (
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {cards.map((card, i) => (
            <ResultCard
              key={card.id}
              card={card}
              index={i}
              favorited={!!favorites[card.id]}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
