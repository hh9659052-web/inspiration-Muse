import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/bubble/countdown-timer";
import { AiAnalysisPanel } from "@/components/analysis/ai-analysis-panel";
import type { Idea, IdeaAnalysis } from "@/types";

export default async function BubbleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const idea = data as Idea;

  const { data: analysisRow } = await supabase
    .from("idea_analyses")
    .select("*")
    .eq("idea_id", id)
    .maybeSingle();
  const analysis = (analysisRow as IdeaAnalysis | null) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          返回泡泡墙
        </Link>
      </Button>

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{idea.title}</h1>
          {idea.content && (
            <p className="whitespace-pre-wrap text-muted-foreground">
              {idea.content}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 border-t pt-4">
          <span className="text-sm text-muted-foreground">距离冷却还有</span>
          <CountdownTimer expiresAt={idea.expires_at} size="lg" />
        </div>
      </div>

      <AiAnalysisPanel ideaId={idea.id} initial={analysis?.analysis ?? null} />

      {/* M5：小任务 + 看板；M6：抢救模式 */}
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        5 分钟小任务与落地看板将在 M5 加入这里。
      </div>
    </div>
  );
}
