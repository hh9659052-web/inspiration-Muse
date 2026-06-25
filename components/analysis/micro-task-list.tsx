"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, ListChecks, Timer } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MicroTask } from "@/types";

export function MicroTaskList({
  ideaId,
  initial,
}: {
  ideaId: string;
  initial: MicroTask[];
}) {
  const [tasks, setTasks] = useState<MicroTask[]>(initial);
  const [generating, setGenerating] = useState(false);

  async function generate() {
    setGenerating(true);
    const res = await fetch(`/api/ideas/${ideaId}/tasks`, { method: "POST" });
    setGenerating(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("生成任务失败", { description: error });
      return;
    }
    const { microTasks } = await res.json();
    setTasks(microTasks);
    toast.success("3 个小任务已就绪 ✅");
  }

  async function toggle(task: MicroTask) {
    const next: MicroTask["status"] = task.status === "done" ? "todo" : "done";
    // 乐观更新
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );
    const res = await fetch(`/api/ideas/${ideaId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id, status: next }),
    });
    if (!res.ok) {
      // 回滚
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
      toast.error("更新失败");
    }
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <ListChecks className="size-8 text-primary" />
          <p className="font-medium">把想法变成此刻能做的小事</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            缪斯会给你 3 个 5 分钟内就能完成的微行动，先迈出第一步。
          </p>
          <Button onClick={generate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ListChecks className="size-4" />
            )}
            生成 3 个小任务
          </Button>
        </CardContent>
      </Card>
    );
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <ListChecks className="size-4 text-primary" />5 分钟小任务
          </span>
          <span className="text-xs text-muted-foreground">
            {doneCount}/{tasks.length} 完成
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {tasks.map((task, i) => {
            const done = task.status === "done";
            return (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => toggle(task)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50",
                    done && "opacity-60"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="flex flex-col gap-0.5">
                    <span className={cn("text-sm", done && "line-through")}>
                      {task.title}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="size-3" />约 {task.estimateMin} 分钟
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <Button
          variant="ghost"
          size="sm"
          onClick={generate}
          disabled={generating}
          className="w-fit"
        >
          {generating && <Loader2 className="size-4 animate-spin" />}
          换一批
        </Button>
      </CardContent>
    </Card>
  );
}
