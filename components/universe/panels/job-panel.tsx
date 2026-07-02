"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { AiLoader } from "@/components/universe/ai-loader";

interface Job {
  title: string;
  match: string;
  skillPath: string[];
}

/** 职业推荐泡泡：优先热爱而非擅长。 */
export function JobPanel() {
  const [skills, setSkills] = useState("");
  const [passion, setPassion] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  async function recommend() {
    if (!skills.trim() || !passion.trim() || loading) return;
    setLoading(true);
    setJobs([]);

    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "job", skills, passion }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("推荐失败", { description: error });
      return;
    }
    const data = await res.json();
    setJobs(data.jobs);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground/55">
        我们优先推荐你<b className="text-foreground/80">热爱</b>的方向，而不只是你擅长的。
      </p>

      <div className="input-glow rounded-2xl border border-white/70 bg-white/40 px-4 py-2">
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          maxLength={300}
          placeholder="你的技能：如 写作、Python、做饭"
          className="w-full bg-transparent py-1.5 outline-none placeholder:text-foreground/35"
        />
      </div>
      <div className="input-glow rounded-2xl border border-white/70 bg-white/40 px-4 py-2">
        <input
          value={passion}
          onChange={(e) => setPassion(e.target.value)}
          maxLength={300}
          placeholder="你热爱的事：如 猫、独立游戏、深夜电台"
          className="w-full bg-transparent py-1.5 outline-none placeholder:text-foreground/35"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={recommend}
        disabled={loading || !skills.trim() || !passion.trim()}
        className="btn-glow inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm text-background disabled:opacity-40"
      >
        <Compass className="size-4" />
        为我指个方向
      </motion.button>

      {loading && <AiLoader text="正在寻找热爱与技能的交点" />}

      {jobs.map((j, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
          className="card-lift flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/45 p-4"
        >
          <span className="text-sm font-semibold">{j.title}</span>
          <p className="text-xs leading-relaxed text-foreground/55">{j.match}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-foreground/60">
            {j.skillPath.map((s, k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-violet-700">
                  {s}
                </span>
                {k < j.skillPath.length - 1 && (
                  <ArrowRight className="size-3 text-foreground/30" />
                )}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
