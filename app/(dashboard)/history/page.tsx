import Link from "next/link";
import { History as HistoryIcon, ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { HistoryCard } from "@/components/bubble/history-card";
import type { Idea } from "@/types";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("ideas")
    .select("*")
    .in("status", ["completed", "archived"])
    .order("updated_at", { ascending: false });

  const ideas = (data ?? []) as Idea[];
  const completed = ideas.filter((i) => i.status === "completed");
  const archived = ideas.filter((i) => i.status === "archived");

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          返回泡泡墙
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">历史泡泡</h1>
        <p className="text-sm text-muted-foreground">
          那些你落地的、或选择放下的想法。每一个都算数。
        </p>
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <HistoryIcon className="size-8 text-muted-foreground" />
          <p className="font-medium">还没有历史记录</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            完成或归档一个泡泡后，它会出现在这里。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {completed.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-primary">
                已落地 · {completed.length}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {completed.map((idea) => (
                  <HistoryCard key={idea.id} idea={idea} />
                ))}
              </div>
            </section>
          )}

          {archived.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                已归档 · {archived.length}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {archived.map((idea) => (
                  <HistoryCard key={idea.id} idea={idea} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
