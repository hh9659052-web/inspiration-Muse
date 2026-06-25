import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeIdea, AI_MODEL } from "@/lib/ai/openai";
import type { Idea } from "@/types";

/** POST /api/ideas/[id]/analyze — 用 AI 分析想法并落库到 idea_analyses。 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // RLS 保证只能取到自己的 idea
  const { data: idea } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!idea) {
    return NextResponse.json({ error: "想法不存在" }, { status: 404 });
  }
  const { title, content } = idea as Idea;

  let analysis;
  try {
    analysis = await analyzeIdea(title, content);
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI 分析失败";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // upsert：一个 idea 对应一行分析（unique idea_id）
  const { error } = await supabase.from("idea_analyses").upsert(
    {
      idea_id: id,
      user_id: user.id,
      analysis,
      model: AI_MODEL,
    },
    { onConflict: "idea_id" }
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ analysis });
}
