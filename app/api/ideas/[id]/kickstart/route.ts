import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  analyzeIdea,
  generateMicroTasks,
  generateActionBoard,
  AI_MODEL,
} from "@/lib/ai/openai";
import type { Idea, MicroTask } from "@/types";

/**
 * POST /api/ideas/[id]/kickstart — 一键启动。
 * 并行生成「分析 + 3 个小任务 + 落地看板」，一次性落库到 idea_analyses。
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { data: idea } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!idea) return NextResponse.json({ error: "想法不存在" }, { status: 404 });
  const { title, content } = idea as Idea;

  let analysis, tasks, board;
  try {
    [analysis, tasks, board] = await Promise.all([
      analyzeIdea(title, content),
      generateMicroTasks(title, content),
      generateActionBoard(title, content),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "一键启动失败";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const microTasks: MicroTask[] = tasks.tasks.map((t) => ({
    id: crypto.randomUUID(),
    title: t.title,
    estimateMin: t.estimateMin,
    status: "todo",
  }));

  const { error } = await supabase.from("idea_analyses").upsert(
    {
      idea_id: id,
      user_id: user.id,
      analysis,
      micro_tasks: microTasks,
      action_board: board,
      model: AI_MODEL,
    },
    { onConflict: "idea_id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ analysis, microTasks, board });
}
