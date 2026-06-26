"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 一键启动：一次生成 分析 + 小任务 + 看板。
 * 成功后刷新页面以让三个面板都读到最新数据。
 */
export function KickstartButton({ ideaId }: { ideaId: string }) {
  const [loading, setLoading] = useState(false);

  async function kickstart() {
    setLoading(true);
    const res = await fetch(`/api/ideas/${ideaId}/kickstart`, {
      method: "POST",
    });
    if (!res.ok) {
      setLoading(false);
      const { error } = await res.json().catch(() => ({ error: "启动失败" }));
      toast.error("一键启动失败", { description: error });
      return;
    }
    toast.success("缪斯已就位 ✨", { description: "分析、小任务、看板都生成好了。" });
    // 三个面板各自以 initial 初始化，刷新页面拿到最新服务端数据最稳妥
    window.location.reload();
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Rocket className="size-9 text-primary" />
        </motion.div>
        <p className="font-semibold">让缪斯一次帮你拆解到底</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          一键生成「分析 + 3 个 5 分钟小任务 + 落地看板」，省下三连点，直接开干。
        </p>
        <Button onClick={kickstart} disabled={loading} size="lg">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Rocket className="size-4" />
          )}
          一键启动
        </Button>
        <p className="text-xs text-muted-foreground">
          也可以在下方分步生成
        </p>
      </CardContent>
    </Card>
  );
}
