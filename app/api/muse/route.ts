import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateMuseCards,
  generateMicroTasks,
  generateActionBoard,
  generateSkillRecs,
  generateJobRecs,
  generateIcebreaker,
} from "@/lib/ai/openai";

const bodySchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("idea"), input: z.string().trim().min(2).max(600) }),
  z.object({ mode: z.literal("rescue"), input: z.string().trim().min(2).max(300) }),
  z.object({ mode: z.literal("board"), input: z.string().trim().min(2).max(300) }),
  z.object({
    mode: z.literal("skill"),
    skill: z.string().trim().min(1).max(60),
    level: z.number().min(0).max(100),
  }),
  z.object({
    mode: z.literal("job"),
    skills: z.string().trim().min(2).max(300),
    passion: z.string().trim().min(2).max(300),
  }),
  z.object({
    mode: z.literal("icebreaker"),
    ideaA: z.string().trim().min(2).max(300),
    ideaB: z.string().trim().min(2).max(300),
  }),
]);

/**
 * POST /api/muse — 灵感宇宙统一 AI 接口。
 * mode: idea 想法拆解 | rescue 冷却抢救 | board 落地看板
 *     | skill 教程推荐 | job 职业方向 | icebreaker 破冰问题
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
  const body = parsed.data;

  try {
    switch (body.mode) {
      case "idea": {
        const { cards } = await generateMuseCards(body.input);
        return NextResponse.json({ cards });
      }
      case "rescue": {
        const { tasks } = await generateMicroTasks(body.input);
        return NextResponse.json({ tasks });
      }
      case "board": {
        const board = await generateActionBoard(body.input);
        return NextResponse.json({ board });
      }
      case "skill": {
        const recs = await generateSkillRecs(body.skill, body.level);
        return NextResponse.json(recs);
      }
      case "job": {
        const { jobs } = await generateJobRecs(body.skills, body.passion);
        return NextResponse.json({ jobs });
      }
      case "icebreaker": {
        const { question } = await generateIcebreaker(body.ideaA, body.ideaB);
        return NextResponse.json({ question });
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
