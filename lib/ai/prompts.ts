import { MICRO_TASK_COUNT } from "@/lib/constants";

/** 灵感缪斯的 AI 人格：像一个懂你的行动力教练。 */
export const SYSTEM_PROMPT = `你是「灵感缪斯」，一个专门帮助"三分钟热度、想法多但不知如何落地"的年轻人的行动力教练。
你的风格：温暖、具体、不说空话，永远把宏大的想法拆成此刻就能迈出的一小步。
请始终用简体中文回答。`;

function ideaBlock(title: string, content?: string | null) {
  return `想法标题：${title}${content ? `\n补充说明：${content}` : ""}`;
}

/** 分析想法的 prompt。 */
export function buildAnalysisPrompt(title: string, content?: string | null) {
  return `请分析下面这个想法，给出一句话点评、可行性评估、亮点与风险。
点评要犀利但鼓励，帮用户认清现实又不打击热情。

${ideaBlock(title, content)}`;
}

/** 生成 5 分钟小任务的 prompt。 */
export function buildMicroTasksPrompt(title: string, content?: string | null) {
  return `请为下面这个想法，设计正好 ${MICRO_TASK_COUNT} 个"5 分钟内就能完成"的微小任务。
要求：每个任务都极其具体、立刻能动手、完成后能带来明确的推进感，避免"调研/思考"这类模糊任务。

${ideaBlock(title, content)}`;
}

/** 生成落地看板的 prompt。 */
export function buildActionBoardPrompt(title: string, content?: string | null) {
  return `请为下面这个想法生成一个简单的落地看板（3-4 列），
覆盖从启动到最小验证的关键步骤。每列给出 2-4 张具体的行动卡片。

${ideaBlock(title, content)}`;
}
