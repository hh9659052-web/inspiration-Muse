# 开发文档 · 功能 ↔ 文件对照

灵感缪斯 MVP 的 7 个核心功能与实现位置，便于继续迭代时快速定位。

## 架构概览

```
浏览器 (Client Components)
  └─ fetch → Next.js Route Handlers (app/api/**)
                └─ Supabase (PostgreSQL + Auth, RLS 行级安全)
                └─ OpenAI Responses API (lib/ai/**)
Server Components 直接用 lib/supabase/server 读数据
middleware.ts 统一刷新 session + 路由守卫
```

## 7 大功能对照

| # | 功能 | 关键文件 | 说明 |
|---|------|---------|------|
| 1 | 邮箱登录 | `app/(auth)/login/page.tsx`、`app/(auth)/auth/callback/route.ts`、`lib/supabase/*`、`middleware.ts` | Magic Link 免密登录 + 路由守卫 |
| 2 | 发布 Idea 泡泡 | `components/bubble/create-bubble-dialog.tsx`、`app/api/ideas/route.ts` (POST) | zod 校验，默认 72h 过期 |
| 3 | 72h 倒计时 | `hooks/use-countdown.ts`、`components/bubble/countdown-timer.tsx`、`lib/bubble.ts` | 每秒跳动，温度态变色 |
| 4 | AI 分析 idea | `app/api/ideas/[id]/analyze/route.ts`、`components/analysis/ai-analysis-panel.tsx`、`lib/ai/*` | Responses API + zod 结构化输出 |
| 5 | 冷却抢救模式 | `app/api/ideas/[id]/rescue/route.ts`、`components/rescue/rescue-mode-banner.tsx` | 重置倒计时，最多续命 2 次 |
| 6 | AI 5 分钟小任务 | `app/api/ideas/[id]/tasks/route.ts`、`components/analysis/micro-task-list.tsx` | 生成 3 个 + 勾选持久化 |
| 7 | AI 落地看板 | `app/api/ideas/[id]/board/route.ts`、`components/analysis/action-board.tsx` | 3-4 列卡片看板 |
| + | 历史记录 | `app/(dashboard)/history/page.tsx`、`components/bubble/history-card.tsx` | 已完成/归档回顾 |

## 数据模型

`supabase/migrations/0001_init.sql`：

- `ideas` — 泡泡主表（`expires_at` 驱动倒计时，`rescue_count` 限续命，`status` 枚举）
- `idea_analyses` — 1:1 存 AI 产物（`analysis` / `micro_tasks` / `action_board` 均为 JSONB）
- `profiles` — 用户扩展（新用户触发器自动建）
- 全表 RLS：`auth.uid() = user_id`，用户只能读写自己的数据

## 状态机

```
active ──过期──> cooling ──抢救──> rescued ──过期──> cooling ...（最多 2 次）
  │                 │                  │
  └───── completed / archived（进历史页）───┘
```

惰性冷却：泡泡墙加载时把过期的 active/rescued 落库为 cooling（`app/(dashboard)/dashboard/page.tsx`）。

## 路由一览

| 路由 | 鉴权 | 说明 |
|------|------|------|
| `/` | 公开 | 落地页 |
| `/login` · `/auth/callback` | 公开 | 登录 / 回调 |
| `/dashboard` | 私有 | 泡泡墙 |
| `/bubble/[id]` | 私有 | 详情：倒计时 + AI + 抢救 |
| `/history` | 私有 | 历史记录 |
| `/api/ideas` · `/api/ideas/[id]` · `/api/ideas/[id]/{analyze,tasks,board,rescue}` | 私有 | 数据与 AI 接口 |

## 已上线迭代

- 一键启动（并行生成分析+任务+看板）：`app/api/ideas/[id]/kickstart`
- 泡泡墙统计仪表盘：`components/bubble/bubble-stats.tsx`
- 看板卡片拖拽 + 持久化（dnd-kit）：`components/analysis/action-board.tsx` + `PATCH /api/ideas/[id]/board`

## 后续可迭代方向

- 泡泡即将冷却的邮件提醒（Supabase cron + Edge Function + 邮件服务）
- 泡泡破裂/完成的更丰富动效
- 邮件提醒「泡泡即将冷却」（Supabase cron + Edge Function）
- 数据库类型由 `supabase gen types` 自动生成填充 `types/database.ts`
