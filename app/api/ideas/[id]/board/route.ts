import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateActionBoard, AI_MODEL } from "@/lib/ai/openai";
import type { Idea } from "@/types";

const boardSchema = z.object({
  board: z.object({
    columns: z.array(
      z.object({
        key: z.string(),
        title: z.string(),
        cards: z.array(z.string()),
      })
    ),
  }),
});

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

/** PATCH /api/ideas/[id]/board — 持久化拖拽后的看板状态。 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const parsed = boardSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  const { error } = await supabase
    .from("idea_analyses")
    .update({ action_board: parsed.data.board })
    .eq("idea_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
