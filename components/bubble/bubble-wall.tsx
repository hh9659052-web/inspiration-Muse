import { Sparkles } from "lucide-react";

import { BubbleCard } from "@/components/bubble/bubble-card";
import { CreateBubbleDialog } from "@/components/bubble/create-bubble-dialog";
import type { Idea } from "@/types";

export function BubbleWall({ ideas }: { ideas: Idea[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">我的泡泡墙</h1>
          <p className="text-sm text-muted-foreground">
            每个想法都有 72 小时。冷掉之前，让 AI 帮你迈出第一步。
          </p>
        </div>
        <CreateBubbleDialog />
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <Sparkles className="size-8 text-primary" />
          <p className="font-medium">还没有泡泡</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            点击右上角「吹个泡泡」，把脑子里那个一闪而过的想法记下来。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea, i) => (
            <BubbleCard key={idea.id} idea={idea} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
