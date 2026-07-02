import { z } from "zod";
import { MICRO_TASK_COUNT } from "@/lib/constants";

/** AI 分析结构化输出。 */
export const AnalysisSchema = z.object({
  oneLiner: z.string().describe("一句话点评这个想法，犀利但鼓励"),
  feasibility: z.string().describe("可行性评估，2-3 句，落地难度与关键前提"),
  highlights: z.array(z.string()).describe("2-4 个亮点/独特价值"),
  risks: z.array(z.string()).describe("2-4 个风险或容易半途而废的点"),
});
export type AnalysisOutput = z.infer<typeof AnalysisSchema>;

/** AI 生成的小任务（数量固定为 MICRO_TASK_COUNT）。 */
export const MicroTasksSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().describe("一个 5 分钟内能完成的、立刻能动手的小任务"),
        estimateMin: z.number().describe("预估分钟数，1-5 之间"),
      })
    )
    .describe(`正好 ${MICRO_TASK_COUNT} 个任务`),
});
export type MicroTasksOutput = z.infer<typeof MicroTasksSchema>;

/** 工作台：一次生成多张灵感卡片。 */
export const MuseCardsSchema = z.object({
  cards: z
    .array(
      z.object({
        tag: z.string().describe("卡片类型标签，如 解读/行动/延伸/风险"),
        title: z.string().describe("卡片标题，短句"),
        content: z.string().describe("卡片正文，3-5 句，具体可执行"),
      })
    )
    .describe("3-4 张风格各异的灵感卡片"),
});
export type MuseCardsOutput = z.infer<typeof MuseCardsSchema>;

/** 技能泡泡：教程推荐。 */
export const SkillRecsSchema = z.object({
  courses: z
    .array(
      z.object({
        title: z.string().describe("教程/学习主题名"),
        platform: z.enum(["bilibili", "youtube"]).describe("推荐平台"),
        level: z.string().describe("适合的水平，如 入门/进阶"),
        reason: z.string().describe("为什么适合当前熟练度，1-2 句"),
        searchQuery: z.string().describe("在该平台搜索用的关键词"),
      })
    )
    .describe("3-4 条按当前熟练度排序的教程推荐"),
  nextMilestone: z.string().describe("下一个小里程碑，1 句"),
});
export type SkillRecsOutput = z.infer<typeof SkillRecsSchema>;

/** 职业泡泡：方向推荐。 */
export const JobRecsSchema = z.object({
  jobs: z
    .array(
      z.object({
        title: z.string().describe("职业/方向名"),
        match: z.string().describe("为什么匹配（优先热爱而非擅长），2 句"),
        skillPath: z.array(z.string()).describe("3-4 步技能提升路径"),
      })
    )
    .describe("2-3 个方向"),
});
export type JobRecsOutput = z.infer<typeof JobRecsSchema>;

/** 灵感广场：连接破冰问题。 */
export const IcebreakerSchema = z.object({
  question: z.string().describe("基于两个想法交集的破冰问题，1 句，轻松具体"),
});
export type IcebreakerOutput = z.infer<typeof IcebreakerSchema>;

/** AI 生成的落地看板。 */
export const ActionBoardSchema = z.object({
  columns: z
    .array(
      z.object({
        key: z.string().describe("列标识，如 todo/doing/done 或阶段名"),
        title: z.string().describe("列标题"),
        cards: z.array(z.string()).describe("该列下的卡片文案"),
      })
    )
    .describe("3-4 列的简单看板，覆盖从启动到验证的最小路径"),
});
export type ActionBoardOutput = z.infer<typeof ActionBoardSchema>;
