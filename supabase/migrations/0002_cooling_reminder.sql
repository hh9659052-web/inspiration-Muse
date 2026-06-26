-- 泡泡冷却邮件提醒：记录「即将冷却」提醒是否已发送，避免重复打扰。

alter table public.ideas
  add column if not exists reminded_at timestamptz;

-- 便于 Edge Function 高效筛选「即将冷却且未提醒」的泡泡
create index if not exists idx_ideas_reminder
  on public.ideas (expires_at)
  where reminded_at is null;
