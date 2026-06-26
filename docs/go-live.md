# 上线 Runbook · 从零到线上

照着做约 15 分钟即可让灵感缪斯跑在 Vercel 上。需要：GitHub（已就绪）、Supabase、OpenAI、Vercel 账号。

---

## 第 1 步：Supabase（数据库 + 登录）

1. 在 [supabase.com](https://supabase.com) **New project**，记下数据库区域（建议离用户近）。
2. 进项目 **Settings → API**，复制两个值备用：
   - `Project URL` → 对应 `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → 对应 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → 对应 `SUPABASE_SERVICE_ROLE_KEY`（只给服务端/Edge Function 用）
3. **SQL Editor** 依次执行两个迁移（直接把文件内容贴进去 Run）：
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_cooling_reminder.sql`
4. **Authentication → URL Configuration**：
   - `Site URL` 先填 `http://localhost:3000`（部署后改成线上域名）
   - `Redirect URLs` 添加 `http://localhost:3000/auth/callback`（线上域名稍后再加）

## 第 2 步：OpenAI

1. [platform.openai.com](https://platform.openai.com) → **API keys → Create new secret key** → 复制 → 对应 `OPENAI_API_KEY`。
2. 模型默认 `gpt-4o-mini`，如需更强可设 `OPENAI_MODEL`（如 `gpt-4o`）。

## 第 3 步：Vercel 部署

1. [vercel.com](https://vercel.com) → **Add New → Project** → 导入 `hh9659052-web/inspiration-Muse`（自动识别 Next.js）。
2. **Environment Variables** 填入：

   | 变量 | 值来源 |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | 第 1 步 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 第 1 步 |
   | `SUPABASE_SERVICE_ROLE_KEY` | 第 1 步 |
   | `OPENAI_API_KEY` | 第 2 步 |
   | `OPENAI_MODEL` | 可选，默认 `gpt-4o-mini` |
   | `NEXT_PUBLIC_SITE_URL` | 先填占位，部署后改成真实域名 |

3. **Deploy**，等待构建完成，拿到线上域名（如 `https://inspiration-muse.vercel.app`）。

## 第 4 步：回填线上域名（关键，别漏）

1. Vercel → 项目 **Settings → Environment Variables**：把 `NEXT_PUBLIC_SITE_URL` 改成真实域名 → **Redeploy**。
2. Supabase → **Authentication → URL Configuration**：
   - `Site URL` 改成线上域名
   - `Redirect URLs` 追加 `https://<你的域名>/auth/callback`

> 漏了这步，邮件登录链接会跳回 localhost。

## 第 5 步（可选）：冷却邮件提醒

按 `supabase/functions/cooling-reminder/README.md`：部署 Edge Function、配 Resend 密钥、执行 `schedule.sql` 注册 pg_cron。不做也不影响主功能。

---

## 上线冒烟测试

- [ ] 打开线上域名，落地页正常
- [ ] `/login` 输邮箱 → 收到登录邮件 → 点击进入 `/dashboard`
- [ ] 「吹个泡泡」发布一个想法 → 出现在泡泡墙，倒计时跳动
- [ ] 进详情页 →「一键启动」→ 出现分析 / 3 个小任务 / 看板
- [ ] 勾选小任务、拖动看板卡片 → 刷新后保持
- [ ] 标记完成 → 进 `/history`

## 常见问题

| 现象 | 原因 / 处理 |
|------|------------|
| 登录链接跳到 localhost | `NEXT_PUBLIC_SITE_URL` 或 Supabase Redirect URLs 没改成线上 |
| AI 报错「未配置 OPENAI_API_KEY」| Vercel 环境变量漏填或没 redeploy |
| 看不到别人的泡泡（正常） | RLS 生效，用户只能看自己的数据 |
| 列表为空但已登录 | 确认两个迁移 SQL 都执行了 |
