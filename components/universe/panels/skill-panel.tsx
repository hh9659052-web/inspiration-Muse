"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";

import { AiLoader } from "@/components/universe/ai-loader";

interface Course {
  title: string;
  platform: "bilibili" | "youtube";
  level: string;
  reason: string;
  searchQuery: string;
}

function searchUrl(c: Course) {
  return c.platform === "bilibili"
    ? `https://search.bilibili.com/all?keyword=${encodeURIComponent(c.searchQuery)}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(c.searchQuery)}`;
}

/** 技能泡泡：输入技能+熟练度 → AI 推荐教程；学完一课泡泡变大变亮。 */
export function SkillPanel() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState(30);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [milestone, setMilestone] = useState("");

  async function recommend() {
    if (!skill.trim() || loading) return;
    setLoading(true);
    setCourses([]);

    const res = await fetch("/api/muse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "skill", skill, level }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("推荐失败", { description: error });
      return;
    }
    const data = await res.json();
    setCourses(data.courses);
    setMilestone(data.nextMilestone ?? "");
  }

  function learned() {
    setLevel((l) => Math.min(100, l + 5));
    toast.success("泡泡变大变亮了 ✨", { description: `${skill} +5%` });
  }

  // 技能泡泡视觉：熟练度驱动大小与亮度
  const d = 90 + level * 0.9;

  return (
    <div className="flex flex-col gap-5">
      {/* 技能泡泡可视化 */}
      <div className="flex items-center justify-center py-2">
        <motion.div
          animate={{ width: d, height: d, y: [0, -6, 0] }}
          transition={{
            width: { type: "spring", stiffness: 120, damping: 14 },
            height: { type: "spring", stiffness: 120, damping: 14 },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          }}
          className="bubble-crystal flex flex-col items-center justify-center rounded-full"
          style={{ filter: `saturate(${0.6 + level / 150}) brightness(${0.95 + level / 400})` }}
        >
          <span className="max-w-[80%] truncate text-sm font-medium text-foreground/80">
            {skill || "技能"}
          </span>
          <span className="text-xs text-foreground/50">{level}%</span>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="input-glow rounded-2xl border border-white/70 bg-white/40 px-4 py-2">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            maxLength={60}
            placeholder="想提升什么技能？如：视频剪辑"
            className="w-full bg-transparent py-1.5 outline-none placeholder:text-foreground/35"
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-foreground/60">
          熟练度
          <input
            type="range"
            min={0}
            max={100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <span className="w-10 text-right font-mono">{level}%</span>
        </label>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={recommend}
          disabled={loading || !skill.trim()}
          className="btn-glow inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm text-background disabled:opacity-40"
        >
          <GraduationCap className="size-4" />
          按我的水平推荐教程
        </motion.button>
      </div>

      {loading && <AiLoader text="正在为你的水平匹配教程" />}

      {courses.length > 0 && (
        <div className="flex flex-col gap-3">
          {milestone && (
            <p className="rounded-xl bg-violet-500/10 px-4 py-2 text-xs text-violet-700">
              🎯 下一个里程碑：{milestone}
            </p>
          )}
          {courses.map((c, i) => (
            <motion.a
              key={i}
              href={searchUrl(c)}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="card-lift flex items-start justify-between gap-3 rounded-2xl border border-white/60 bg-white/45 p-4"
            >
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium">{c.title}</span>
                <span className="text-xs text-foreground/50">{c.reason}</span>
                <span className="text-[11px] text-foreground/40">
                  {c.platform === "bilibili" ? "📺 Bilibili" : "▶️ YouTube"} · {c.level}
                </span>
              </span>
              <ExternalLink className="mt-1 size-4 shrink-0 text-foreground/35" />
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={learned}
            className="btn-glow mx-auto inline-flex items-center gap-1.5 rounded-full border border-violet-300/60 bg-violet-500/10 px-5 py-2 text-sm text-violet-700"
          >
            <Plus className="size-4" />
            我学完了一课（+5%）
          </motion.button>
        </div>
      )}
    </div>
  );
}
