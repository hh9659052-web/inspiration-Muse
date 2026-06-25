"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ActionBoard as ActionBoardType } from "@/types";

export function ActionBoard({
  ideaId,
  initial,
}: {
  ideaId: string;
  initial: ActionBoardType | null;
}) {
  const [board, setBoard] = useState<ActionBoardType | null>(initial);
  const [generating, setGenerating] = useState(false);

  async function generate() {
    setGenerating(true);
    const res = await fetch(`/api/ideas/${ideaId}/board`, { method: "POST" });
    setGenerating(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("生成看板失败", { description: error });
      return;
    }
    const { board } = await res.json();
    setBoard(board);
    toast.success("落地看板已生成 🗂️");
  }

  if (!board) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <LayoutGrid className="size-8 text-primary" />
          <p className="font-medium">看清从 0 到 1 的路径</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            缪斯会把落地过程拆成一块简单看板，每一步都有具体卡片。
          </p>
          <Button onClick={generate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LayoutGrid className="size-4" />
            )}
            生成落地看板
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <LayoutGrid className="size-4 text-primary" />
          落地看板
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={generate}
          disabled={generating}
        >
          {generating && <Loader2 className="size-4 animate-spin" />}
          重新生成
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {board.columns.map((col, i) => (
          <motion.div
            key={col.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-3"
          >
            <span className="text-sm font-semibold">{col.title}</span>
            <div className="flex flex-col gap-2">
              {col.cards.map((card, j) => (
                <div
                  key={j}
                  className="rounded-lg border bg-card p-2.5 text-sm shadow-sm"
                >
                  {card}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
