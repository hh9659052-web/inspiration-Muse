import OpenAI from "openai";
import { z } from "zod";
import { requireEnv } from "@/lib/env";

import {
  SYSTEM_PROMPT,
  buildAnalysisPrompt,
  buildMicroTasksPrompt,
  buildActionBoardPrompt,
  buildMuseCardsPrompt,
  buildSkillPrompt,
  buildJobPrompt,
  buildIcebreakerPrompt,
} from "@/lib/ai/prompts";
import {
  AnalysisSchema,
  MicroTasksSchema,
  ActionBoardSchema,
  MuseCardsSchema,
  SkillRecsSchema,
  JobRecsSchema,
  IcebreakerSchema,
  type AnalysisOutput,
  type MicroTasksOutput,
  type ActionBoardOutput,
  type MuseCardsOutput,
  type SkillRecsOutput,
  type JobRecsOutput,
  type IcebreakerOutput,
} from "@/lib/ai/schemas";

// 默认 deepseek-chat；用 OpenAI 时设为 gpt-4o-mini 等。
export const AI_MODEL = process.env.OPENAI_MODEL ?? "deepseek-chat";

let _client: OpenAI | null = null;
function client(): OpenAI {
  // OPENAI_BASE_URL 可指向任何兼容 OpenAI 接口的服务（DeepSeek / 其它国内兼容服务 / 中转），
  // 用于绕开 OpenAI 官方对部分国家/地区的封禁。未设置时用官方默认地址。
  _client ??= new OpenAI({
    apiKey: requireEnv("OPENAI_API_KEY"),
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
  return _client;
}

/**
 * 用 Chat Completions + JSON 模式跑一次结构化输出，并用 zod 校验。
 * 兼容 OpenAI 与 DeepSeek 等 OpenAI-兼容服务（不依赖 Responses API）。
 */
async function parseJson<T>(
  userPrompt: string,
  schema: z.ZodType<T>
): Promise<T> {
  const res = await client().chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = res.choices[0]?.message?.content;
  if (!content) throw new Error("AI 未返回有效结果");

  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    throw new Error("AI 返回的不是有效 JSON");
  }
  return schema.parse(data);
}

export function analyzeIdea(title: string, content?: string | null) {
  return parseJson<AnalysisOutput>(
    buildAnalysisPrompt(title, content),
    AnalysisSchema
  );
}

export function generateMicroTasks(title: string, content?: string | null) {
  return parseJson<MicroTasksOutput>(
    buildMicroTasksPrompt(title, content),
    MicroTasksSchema
  );
}

export function generateActionBoard(title: string, content?: string | null) {
  return parseJson<ActionBoardOutput>(
    buildActionBoardPrompt(title, content),
    ActionBoardSchema
  );
}

export function generateMuseCards(input: string) {
  return parseJson<MuseCardsOutput>(buildMuseCardsPrompt(input), MuseCardsSchema);
}

export function generateSkillRecs(skill: string, level: number) {
  return parseJson<SkillRecsOutput>(buildSkillPrompt(skill, level), SkillRecsSchema);
}

export function generateJobRecs(skills: string, passion: string) {
  return parseJson<JobRecsOutput>(buildJobPrompt(skills, passion), JobRecsSchema);
}

export function generateIcebreaker(ideaA: string, ideaB: string) {
  return parseJson<IcebreakerOutput>(
    buildIcebreakerPrompt(ideaA, ideaB),
    IcebreakerSchema
  );
}
