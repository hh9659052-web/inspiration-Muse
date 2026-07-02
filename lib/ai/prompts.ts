import { MICRO_TASK_COUNT } from "@/lib/constants";

/** 灵感缪斯的 AI 人格：像一个懂你的行动力教练。 */
export const SYSTEM_PROMPT = `你是「灵感缪斯」，一个专门帮助"三分钟热度、想法多但不知如何落地"的年轻人的行动力教练。
你的风格：温暖、具体、不说空话，永远把宏大的想法拆成此刻就能迈出的一小步。
请始终用简体中文回答，并严格按要求只返回 JSON。`;

function ideaBlock(title: string, content?: string | null) {
  return `想法标题：${title}${content ? `\n补充说明：${content}` : ""}`;
}

/** 分析想法的 prompt。 */
export function buildAnalysisPrompt(title: string, content?: string | null) {
  return `请分析下面这个想法，给出一句话点评、可行性评估、亮点与风险。
点评要犀利但鼓励，帮用户认清现实又不打击热情。

${ideaBlock(title, content)}

只返回一个 JSON 对象，不要任何额外文字或解释，格式严格如下：
{
  "oneLiner": "一句话点评（犀利但鼓励）",
  "feasibility": "可行性评估，2-3 句，说明落地难度与关键前提",
  "highlights": ["亮点1", "亮点2"],
  "risks": ["风险1", "风险2"]
}`;
}

/** 生成 5 分钟小任务的 prompt。 */
export function buildMicroTasksPrompt(title: string, content?: string | null) {
  return `请为下面这个想法，设计正好 ${MICRO_TASK_COUNT} 个"5 分钟内就能完成"的微小任务。
要求：每个任务都极其具体、立刻能动手、完成后能带来明确的推进感，避免"调研/思考"这类模糊任务。

${ideaBlock(title, content)}

只返回一个 JSON 对象，不要任何额外文字，格式严格如下（tasks 数组正好 ${MICRO_TASK_COUNT} 个）：
{
  "tasks": [
    { "title": "具体的 5 分钟任务", "estimateMin": 5 }
  ]
}`;
}

/** 工作台：把任意输入拆成多张灵感卡片。 */
export function buildMuseCardsPrompt(input: string) {
  return `用户在灵感工作台丢进来一个想法/问题/念头，请生成 3-4 张风格各异的灵感卡片，
从不同角度帮 TA 把这个念头变得可感、可做：
- 至少包含一张「解读」（这个念头背后真正想要什么）
- 至少包含一张「行动」（今天就能做的一小步，极其具体）
- 可选「延伸」（一个意想不到的变体方向）或「风险」（最容易半途而废的点）

用户输入：${input}

只返回一个 JSON 对象，不要任何额外文字，格式严格如下：
{
  "cards": [
    { "tag": "解读", "title": "短标题", "content": "3-5 句具体内容" }
  ]
}`;
}

/** 技能泡泡：按熟练度推荐教程。 */
export function buildSkillPrompt(skill: string, level: number) {
  return `用户想提升技能「${skill}」，自评熟练度 ${level}%（0=零基础，100=精通）。
请推荐 3-4 条最适合 TA 当前水平的学习内容（Bilibili 或 YouTube），
并给出下一个小里程碑。推荐要具体到可搜索的主题，不要编造具体视频链接。

只返回 JSON：
{ "courses": [ { "title": "", "platform": "bilibili", "level": "", "reason": "", "searchQuery": "" } ], "nextMilestone": "" }`;
}

/** 职业泡泡：按技能与热爱推荐方向。 */
export function buildJobPrompt(skills: string, passion: string) {
  return `用户技能：${skills}
用户热爱/偏好：${passion}
请优先按「热爱」而非「擅长」推荐 2-3 个职业/发展方向，每个附 3-4 步技能提升路径。

只返回 JSON：
{ "jobs": [ { "title": "", "match": "", "skillPath": ["", ""] } ] }`;
}

/** 灵感广场：基于两个想法交集生成破冰问题。 */
export function buildIcebreakerPrompt(ideaA: string, ideaB: string) {
  return `两位陌生用户刚刚连接成功：
A 的想法：${ideaA}
B 的想法：${ideaB}
请基于两个想法的交集，生成 1 个轻松、具体、聊得起来的破冰问题。

只返回 JSON：{ "question": "" }`;
}

/** 生成落地看板的 prompt。 */
export function buildActionBoardPrompt(title: string, content?: string | null) {
  return `请为下面这个想法生成一个简单的落地看板（3-4 列），
覆盖从启动到最小验证的关键步骤。每列给出 2-4 张具体的行动卡片。

${ideaBlock(title, content)}

只返回一个 JSON 对象，不要任何额外文字，格式严格如下：
{
  "columns": [
    { "key": "todo", "title": "列标题", "cards": ["卡片1", "卡片2"] }
  ]
}`;
}
