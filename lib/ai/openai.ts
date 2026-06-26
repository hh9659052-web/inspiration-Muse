import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { requireEnv } from "@/lib/env";

import {
  SYSTEM_PROMPT,
  buildAnalysisPrompt,
  buildMicroTasksPrompt,
  buildActionBoardPrompt,
} from "@/lib/ai/prompts";
import {
  AnalysisSchema,
  MicroTasksSchema,
  ActionBoardSchema,
  type AnalysisOutput,
  type MicroTasksOutput,
  type ActionBoardOutput,
} from "@/lib/ai/schemas";

export const AI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

let _client: OpenAI | null = null;
function client(): OpenAI {
  _client ??= new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  return _client;
}

/** 通用：用 Responses API 跑一次结构化输出。 */
async function parse<T>(
  userPrompt: string,
  schema: Parameters<typeof zodTextFormat>[0],
  name: string
): Promise<T> {
  const response = await client().responses.parse({
    model: AI_MODEL,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    text: { format: zodTextFormat(schema, name) },
  });

  const parsed = response.output_parsed;
  if (!parsed) throw new Error("AI 未返回有效结果");
  return parsed as T;
}

export function analyzeIdea(title: string, content?: string | null) {
  return parse<AnalysisOutput>(
    buildAnalysisPrompt(title, content),
    AnalysisSchema,
    "analysis"
  );
}

export function generateMicroTasks(title: string, content?: string | null) {
  return parse<MicroTasksOutput>(
    buildMicroTasksPrompt(title, content),
    MicroTasksSchema,
    "micro_tasks"
  );
}

export function generateActionBoard(title: string, content?: string | null) {
  return parse<ActionBoardOutput>(
    buildActionBoardPrompt(title, content),
    ActionBoardSchema,
    "action_board"
  );
}
