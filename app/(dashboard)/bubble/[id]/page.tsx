import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import type { Idea } from "@/types";

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

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          返回泡泡墙
        </Link>
      </Button>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{idea.title}</h1>
        {idea.content && (
          <p className="whitespace-pre-wrap text-muted-foreground">
            {idea.content}
          </p>
        )}
      </div>

      {/* M3：实时倒计时；M4：AI 分析；M5：小任务 + 看板；M6：抢救模式 */}
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        倒计时、AI 分析、5 分钟小任务与落地看板将在后续里程碑（M3–M6）加入这里。
      </div>
    </div>
  );
}
