"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { AiLoader } from "@/components/universe/ai-loader";
import { Celebration } from "@/components/universe/celebration";

interface Column {
  key: string;
  title: string;
  cards: string[];
}

/** 落地看板泡泡：AI 生成看板，里程碑打勾触发庆祝 + 徽章。 */
export function BoardPanel() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [celebrate, setCelebrate] = useState(0);
  const [badge, setBadge] = useState("");

  async function generate() {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setColumns([]);
    setDone({});

    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "board", input: idea }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("生成看板失败", { description: error });
      return;
    }
    const data = await res.json();
    setColumns(data.board.columns);
  }

  function toggle(key: string, colTitle: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) {
        setBadge(`里程碑达成 · ${colTitle}`);
        setCelebrate((k) => k + 1);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Celebration playKey={celebrate} badge={badge} />

      <div className="input-glow flex items-center gap-2 rounded-2xl border border-white/70 bg-white/40 p-2 pl-4">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          maxLength={300}
          placeholder="想落地什么？如：开一家线上手作饰品店"
          className="w-full bg-transparent py-2 outline-none placeholder:text-foreground/35"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generate}
          disabled={loading || !idea.trim()}
          className="btn-glow inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm text-background disabled:opacity-40"
        >
          <LayoutGrid className="size-4" />
          生成看板
        </motion.button>
      </div>

      {loading && <AiLoader text="正在扫描全网案例，规划落地路径" />}

      {columns.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {columns.map((col, ci) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.12 }}
              className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/35 p-3"
            >
              <span className="text-sm font-semibold">{col.title}</span>
              {col.cards.map((card, i) => {
                const key = `${col.key}-${i}`;
                const isDone = !!done[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key, col.title)}
                    className={cn(
                      "card-lift flex items-start gap-2 rounded-xl border border-white/60 bg-white/60 p-2.5 text-left text-xs leading-relaxed",
                      isDone && "opacity-55"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-foreground/25" />
                    )}
                    <span className={cn(isDone && "line-through")}>{card}</span>
                  </button>
                );
              })}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
