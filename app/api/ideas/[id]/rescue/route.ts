import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUBBLE_TTL_MS, MAX_RESCUE_COUNT } from "@/lib/constants";
import type { Idea } from "@/types";

/**
 * POST /api/ideas/[id]/rescue — 抢救一个冷却的泡泡。
 * 重置 expires_at = now()+72h，rescue_count++，状态转 rescued。
 * 超过续命上限则拒绝（只能归档）。
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

  const current = idea as Idea;
  if (current.rescue_count >= MAX_RESCUE_COUNT) {
    return NextResponse.json(
      { error: `每个泡泡最多抢救 ${MAX_RESCUE_COUNT} 次，这次只能归档了` },
      { status: 409 }
    );
  }

  const newExpiresAt = new Date(Date.now() + BUBBLE_TTL_MS).toISOString();

  const { data, error } = await supabase
    .from("ideas")
    .update({
      expires_at: newExpiresAt,
      rescue_count: current.rescue_count + 1,
      status: "rescued",
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ idea: data });
}
