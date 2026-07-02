"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LifeBuoy, CheckCircle2, Circle, Timer } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { AiLoader } from "@/components/universe/ai-loader";
import { Celebration } from "@/components/universe/celebration";

interface Task {
  title: string;
  estimateMin: number;
  done: boolean;
}

/** 冷却泡泡：Three-Minute Heat Converter —— 给沉睡的想法 3 个 5 分钟小任务。 */
export function CoolingPanel() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [celebrate, setCelebrate] = useState(0);

  async function rescue() {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setTasks([]);

    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "rescue", input: idea }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("抢救失败", { description: error });
      return;
    }
    const data = await res.json();
    setTasks(
      data.tasks.map((t: { title: string; estimateMin: number }) => ({
        ...t,
        done: false,
      }))
    );
  }

  function toggle(i: number) {
    setTasks((prev) => {
      const next = prev.map((t, j) => (j === i ? { ...t, done: !t.done } : t));
      if (next[i].done && next.every((t) => t.done)) {
        setCelebrate((k) => k + 1);
        toast.success("热度回来了 🔥", { description: "这个想法被你救活了。" });
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Celebration playKey={celebrate} badge="三分钟热度转换成功" />

      <p className="text-sm leading-relaxed text-foreground/55">
        有个想法冷掉了？把它写下来，缪斯会给你{" "}
        <b className="text-foreground/80">3 个 ≤5 分钟</b>{" "}
        的微小任务——先动起来，热度自然回来。
      </p>

      <div className="input-glow flex items-center gap-2 rounded-2xl border border-white/70 bg-white/40 p-2 pl-4">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && rescue()}
          maxLength={300}
          placeholder="例如：想学做播客，搁置两周了"
          className="w-full bg-transparent py-2 outline-none placeholder:text-foreground/35"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rescue}
          disabled={loading || !idea.trim()}
          className="btn-glow inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm text-background disabled:opacity-40"
        >
          <LifeBuoy className="size-4" />
          抢救
        </motion.button>
      </div>

      {loading && <AiLoader text="正在点燃三分钟热度" />}

      {tasks.length > 0 && (
        <ul className="flex flex-col gap-2">
          {tasks.map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              <button
                onClick={() => toggle(i)}
                className={cn(
                  "card-lift flex w-full items-start gap-3 rounded-2xl border border-white/60 bg-white/45 p-4 text-left",
                  t.done && "opacity-60"
                )}
              >
                {t.done ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="mt-0.5 size-5 shrink-0 text-foreground/30" />
                )}
                <span className="flex flex-col gap-0.5">
                  <span className={cn("text-sm", t.done && "line-through")}>
                    {t.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/45">
                    <Timer className="size-3" />约 {t.estimateMin} 分钟
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
