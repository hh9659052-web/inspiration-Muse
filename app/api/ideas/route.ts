import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createIdeaSchema = z.object({
  title: z.string().trim().min(1, "标题不能为空").max(120, "标题太长了"),
  content: z.string().trim().max(2000).optional().default(""),
});

/** GET /api/ideas — 当前用户的所有 idea（按创建时间倒序）。 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ideas: data });
}

/** POST /api/ideas — 创建一个新的想法泡泡。 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createIdeaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "参数错误" },
      { status: 400 }
    );
  }

  const { title, content } = parsed.data;

  // expires_at 由数据库默认值 now()+72h 生成；status 默认 active。
  const { data, error } = await supabase
    .from("ideas")
    .insert({ user_id: user.id, title, content: content || null })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ idea: data }, { status: 201 });
}
