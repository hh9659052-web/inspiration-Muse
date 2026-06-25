"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LifeBuoy, Loader2, CheckCircle2, Archive } from "lucide-react";
import { toast } from "sonner";

import { MAX_RESCUE_COUNT } from "@/lib/constants";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";
import type { Idea } from "@/types";

/**
 * 抢救模式 + 泡泡状态操作。
 * - 倒计时归零（冷却）时浮现抢救横幅
 * - 始终提供「标记完成 / 归档」
 */
export function RescueModeBanner({ idea }: { idea: Idea }) {
  const router = useRouter();
  const { isCold } = useCountdown(idea.expires_at);
  const [pending, setPending] = useState<null | "rescue" | "complete" | "archive">(
    null
  );

  const rescuesLeft = MAX_RESCUE_COUNT - idea.rescue_count;
  const canRescue = rescuesLeft > 0;

  async function rescue() {
    setPending("rescue");
    const res = await fetch(`/api/ideas/${idea.id}/rescue`, { method: "POST" });
    setPending(null);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "抢救失败" }));
      toast.error("抢救失败", { description: error });
      return;
    }
    toast.success("泡泡满血复活 🫧", {
      description: "倒计时已重置 72 小时，这次别让它冷掉。",
    });
    router.refresh();
  }

  async function setStatus(status: "completed" | "archived") {
    setPending(status === "completed" ? "complete" : "archive");
    const res = await fetch(`/api/ideas/${idea.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setPending(null);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "操作失败" }));
      toast.error("操作失败", { description: error });
      return;
    }
    toast.success(status === "completed" ? "恭喜落地 🎉" : "已归档");
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {isCold && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3 rounded-2xl border border-bubble-cold/40 bg-bubble-cold/10 p-5"
          >
            <div className="flex items-center gap-2 font-semibold text-bubble-cold">
              <LifeBuoy className="size-5" />
              泡泡冷掉了 —— 进入抢救模式
            </div>
            <p className="text-sm text-muted-foreground">
              {canRescue
                ? `再给它一次机会？抢救后倒计时重置 72 小时（还可抢救 ${rescuesLeft} 次）。`
                : `已达抢救上限（${MAX_RESCUE_COUNT} 次）。也许是时候放手，把精力留给更想做的事。`}
            </p>
            {canRescue && (
              <Button onClick={rescue} disabled={pending !== null} className="w-fit">
                {pending === "rescue" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LifeBuoy className="size-4" />
                )}
                再抢救一次
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatus("completed")}
          disabled={pending !== null}
        >
          {pending === "complete" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          标记完成
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStatus("archived")}
          disabled={pending !== null}
          className="text-muted-foreground"
        >
          {pending === "archive" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Archive className="size-4" />
          )}
          归档放弃
        </Button>
      </div>
    </div>
  );
}
