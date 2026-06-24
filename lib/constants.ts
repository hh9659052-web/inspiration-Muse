/** 泡泡存活时长：72 小时 */
export const BUBBLE_TTL_HOURS = 72;
export const BUBBLE_TTL_MS = BUBBLE_TTL_HOURS * 60 * 60 * 1000;

/** 抢救（续命）次数上限 */
export const MAX_RESCUE_COUNT = 2;

/** 温度态阈值（剩余毫秒数） */
export const WARM_THRESHOLD_MS = 24 * 60 * 60 * 1000; // >24h: warm
// 0 ~ 24h: cooling
// <= 0:    cold

/** AI 生成小任务的固定数量 */
export const MICRO_TASK_COUNT = 3;
