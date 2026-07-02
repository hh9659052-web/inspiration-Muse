"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AiLoader } from "@/components/universe/ai-loader";
import { CountdownBubble } from "@/components/universe/countdown-bubble";
import { ResultCard, type MuseCard } from "@/components/studio/result-card";
import { BUBBLE_TTL_MS } from "@/lib/constants";

const DEMO_KEY = "muse:demo-idea";

/** 想法泡泡：输入 → AI 拆解卡片 → 72h 倒计时开始。 */
export function IdeaPanel() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<MuseCard[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setExpiresAt(saved.expiresAt);
        setInput(saved.input ?? "");
        if (saved.cards) setCards(saved.cards);
      }
    } catch {}
  }, []);

  async function generate() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setCards([]);

    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "idea", input }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("缪斯走神了", { description: error });
      return;
    }
    const data = await res.json();
    const withIds: MuseCard[] = data.cards.map(
      (c: Omit<MuseCard, "id">, i: number) => ({ ...c, id: `${Date.now()}-${i}` })
    );
    setCards(withIds);

    // 泡泡诞生：72 小时倒计时开始
    const exp = new Date(Date.now() + BUBBLE_TTL_MS).toISOString();
    setExpiresAt(exp);
    localStorage.setItem(
      DEMO_KEY,
      JSON.stringify({ input, cards: withIds, expiresAt: exp })
    );
    toast.success("泡泡已升起 🫧", { description: "72 小时倒计时开始了。" });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="input-glow rounded-2xl border border-white/70 bg-white/40 p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          maxLength={600}
          placeholder="丢进你此刻最乱的念头……"
          className="w-full resize-none bg-transparent px-2 py-1 outline-none placeholder:text-foreground/35"
        />
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={generate}
            disabled={loading || !input.trim()}
            className="btn-glow inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-40"
          >
            <Wand2 className="size-4" />
            让缪斯拆解
          </motion.button>
        </div>
      </div>

      {loading && <AiLoader text="缪斯正在拆解你的念头" />}

      {expiresAt && !loading && cards.length > 0 && (
        <CountdownBubble expiresAt={expiresAt} />
      )}

      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <ResultCard
              key={card.id}
              card={card}
              index={i}
              favorited={!!favorites[card.id]}
              onToggleFavorite={(c) =>
                setFavorites((p) => ({ ...p, [c.id]: !p[c.id] }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
