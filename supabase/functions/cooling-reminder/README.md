# cooling-reminder · 泡泡冷却邮件提醒

定时扫描「剩余 ≤ 6 小时即将冷却、且未提醒过」的泡泡，给主人发一封提醒邮件，引导他花 5 分钟抢救。

## 工作原理

```
pg_cron（每 30 分钟）
  └─ pg_net.http_post → Edge Function: cooling-reminder
        ├─ 查 ideas: status in (active,rescued) 且 0 < 剩余 ≤ 6h 且 reminded_at is null
        ├─ 取 profiles.email → Resend 发邮件
        └─ 标记 reminded_at（避免重复打扰；续命时会重置）
```

## 部署步骤

前置：已执行 `supabase/migrations/0002_cooling_reminder.sql`（新增 `ideas.reminded_at`）。

```bash
# 1. 关联项目
supabase link --project-ref <PROJECT_REF>

# 2. 配置密钥（SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 平台自动注入，无需手动设）
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set REMINDER_FROM_EMAIL="灵感缪斯 <muse@yourdomain.com>"
supabase secrets set SITE_URL=https://your-app.vercel.app
supabase secrets set CRON_SECRET=<任选一段随机串>   # 可选，用于校验调用来源

# 3. 部署函数
supabase functions deploy cooling-reminder

# 4. 在 SQL Editor 执行 schedule.sql 注册 pg_cron 定时任务
#    （把 <PROJECT_REF> 与 Authorization 改成你的值）
```

## 邮件服务

示例用 [Resend](https://resend.com)（需验证发信域名）。
换其它服务时，只改 `index.ts` 里调用 `api.resend.com/emails` 那段即可。

## 本地测试

```bash
supabase functions serve cooling-reminder --no-verify-jwt
curl -X POST http://localhost:54321/functions/v1/cooling-reminder
# 返回 { "candidates": N, "sent": M }
```

## 可调参数

- 提醒阈值：`index.ts` 顶部 `REMINDER_BEFORE_HOURS`（默认 6，与前端 `lib/constants.ts` 保持一致）
- 调用频率：`schedule.sql` 的 cron 表达式（默认 `*/30 * * * *`）
