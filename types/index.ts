/** 泡泡（idea）生命周期状态，与数据库 idea_status 枚举一致。 */
export type IdeaStatus =
  | "active"
  | "cooling"
  | "rescued"
  | "archived"
  | "completed";

/** 泡泡温度态（前端按剩余时间实时计算，不落库）。 */
export type BubbleTemperature = "warm" | "cooling" | "cold";

/** 小任务状态。 */
export type TaskStatus = "todo" | "doing" | "done";

/** 一条 idea 记录。 */
export interface Idea {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  status: IdeaStatus;
  expires_at: string; // ISO 时间戳
  rescue_count: number;
  created_at: string;
  updated_at: string;
}

/** AI 生成的 5 分钟小任务。 */
export interface MicroTask {
  id: string;
  title: string;
  status: TaskStatus;
  estimateMin: number;
}

/** AI 分析结果。 */
export interface IdeaAnalysisResult {
  feasibility: string;
  highlights: string[];
  risks: string[];
  oneLiner: string;
}

/** 落地看板。 */
export interface ActionBoard {
  columns: {
    key: string;
    title: string;
    cards: string[];
  }[];
}

/** idea_analyses 记录。 */
export interface IdeaAnalysis {
  id: string;
  idea_id: string;
  user_id: string;
  analysis: IdeaAnalysisResult | null;
  micro_tasks: MicroTask[];
  action_board: ActionBoard | null;
  model: string | null;
  created_at: string;
  updated_at: string;
}
