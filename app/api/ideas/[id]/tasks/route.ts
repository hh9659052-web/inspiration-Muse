import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateMicroTasks, AI_MODEL } from "@/lib/ai/openai";
import type { Idea, MicroTask } from "@/types";

/** POST /api/ideas/[id]/tasks — 生成 3 个 5 分钟小任务并落库。 */
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

  let generated;
  try {
    generated = await generateMicroTasks(title, content);
  } catch (e) {
    const message = e instanceof Error ? e.message : "生成任务失败";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 给每个任务补上 id 与初始状态
  const microTasks: MicroTask[] = generated.tasks.map((t) => ({
    id: crypto.randomUUID(),
    title: t.title,
    estimateMin: t.estimateMin,
    status: "todo",
  }));

  const { error } = await supabase.from("idea_analyses").upsert(
    {
      idea_id: id,
      user_id: user.id,
      micro_tasks: microTasks,
      model: AI_MODEL,
    },
    { onConflict: "idea_id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ microTasks });
}

const patchSchema = z.object({
  taskId: z.string(),
  status: z.enum(["todo", "doing", "done"]),
});

/** PATCH /api/ideas/[id]/tasks — 更新某个小任务的状态。 */
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

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
  const { taskId, status } = parsed.data;

  const { data: row } = await supabase
    .from("idea_analyses")
    .select("micro_tasks")
    .eq("idea_id", id)
    .maybeSingle();
  if (!row) return NextResponse.json({ error: "尚未生成任务" }, { status: 404 });

  const tasks = (row.micro_tasks as MicroTask[]).map((t) =>
    t.id === taskId ? { ...t, status } : t
  );

  const { error } = await supabase
    .from("idea_analyses")
    .update({ micro_tasks: tasks })
    .eq("idea_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ microTasks: tasks });
}
