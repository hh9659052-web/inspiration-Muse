-- 用 pg_cron + pg_net 定时调用 cooling-reminder Edge Function。
-- 在 Supabase SQL Editor 执行（需先启用扩展）。

-- 1) 启用扩展
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2) 每 30 分钟调用一次 Edge Function
--    把 <PROJECT_REF> 换成你的项目 ref；
--    Authorization 用 service_role key（或与函数里 CRON_SECRET 对应的值）。
select cron.schedule(
  'cooling-reminder-every-30min',
  '*/30 * * * *',
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.functions.supabase.co/cooling-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_OR_CRON_SECRET>'
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- 查看已注册任务： select * from cron.job;
-- 取消任务：       select cron.unschedule('cooling-reminder-every-30min');
