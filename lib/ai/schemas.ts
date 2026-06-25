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
