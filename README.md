# 灵感缪斯 · Inspiration Muse

帮「三分钟热度、想法多、却不知如何落地」的年轻人，把一闪而过的灵感变成可执行的第一步。

每个想法是一个**泡泡**：它有 **72 小时**的生命倒计时。冷掉之前，AI 会帮你分析它，并拆成 **3 个 5 分钟内就能完成的小任务**，再生成一块简单的落地看板。泡泡快冷掉时，可以进入**抢救模式**给它续命。

## 技术栈

- **前端**：Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui · Framer Motion
- **后端**：Next.js Route Handlers / Server Actions
- **数据库 & 登录**：Supabase (PostgreSQL + Auth)
- **AI**：OpenAI Responses API
- **部署**：Vercel

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 填入 Supabase 与 OpenAI 的密钥

# 3. 启动
npm run dev
```

打开 http://localhost:3000 。

### Supabase 配置（M1 登录）

1. 在 [supabase.com](https://supabase.com) 新建项目，把 `Project URL` 与 `anon key` 填入 `.env.local`。
2. 在 **SQL Editor** 执行 `supabase/migrations/0001_init.sql` 建表。
3. **Authentication → URL Configuration** 中，把 `Site URL` 设为本地/线上地址，并在 `Redirect URLs` 加入：
   - `http://localhost:3000/auth/callback`
   - `https://<你的域名>/auth/callback`
4. 默认使用邮箱 Magic Link 登录，无需密码。

## 开发里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M0 | 项目脚手架 | ✅ |
| M1 | Supabase + 邮箱登录 | ✅ |
| M2 | 发布 & 展示泡泡 | ⏳ |
| M3 | 72h 倒计时 + 冷却态 | ⏳ |
| M4 | AI 分析 idea | ⏳ |
| M5 | AI 小任务 + 落地看板 | ⏳ |
| M6 | 抢救模式 | ⏳ |
| M7 | 历史记录 + 体验打磨 | ⏳ |

## 目录约定

- `app/` — 路由与页面（App Router）
- `components/` — UI 与业务组件（`ui/` 为 shadcn 基础组件）
- `lib/` — Supabase / OpenAI 封装、工具、常量
- `supabase/migrations/` — 数据库建表 SQL
- `types/` — 业务与数据库类型
