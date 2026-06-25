import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateActionBoard, AI_MODEL } from "@/lib/ai/openai";
import type { Idea } from "@/types";

/** POST /api/ideas/[id]/board — 生成简单落地看板并落库。 */
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

  let board;
  try {
    board = await generateActionBoard(title, content);
  } catch (e) {
    const message = e instanceof Error ? e.message : "生成看板失败";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const { error } = await supabase.from("idea_analyses").upsert(
    {
      idea_id: id,
      user_id: user.id,
      action_board: board,
      model: AI_MODEL,
    },
    { onConflict: "idea_id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ board });
}
