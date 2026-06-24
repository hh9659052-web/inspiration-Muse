-- 灵感缪斯 初始数据库结构
-- 在 Supabase SQL Editor 中执行，或通过 supabase CLI 迁移。

-- ============ 枚举类型 ============
create type idea_status as enum ('active', 'cooling', 'rescued', 'archived', 'completed');
-- active   : 正常，72h 内
-- cooling  : 已过期/即将冷却，进入抢救候选
-- rescued  : 用户点了"抢救"，续命重置倒计时
-- completed: 已落地完成
-- archived : 用户主动归档/放弃

create type task_status as enum ('todo', 'doing', 'done');

-- ============ profiles（扩展 auth.users）============
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now()
);

-- ============ ideas（泡泡）============
create table public.ideas (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  content      text,
  status       idea_status not null default 'active',
  -- 倒计时核心：创建/抢救时设置 expires_at = now() + 72h
  expires_at   timestamptz not null default (now() + interval '72 hours'),
  rescue_count int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_ideas_user on public.ideas(user_id);
create index idx_ideas_status on public.ideas(status);
create index idx_ideas_expires on public.ideas(expires_at);

-- ============ idea_analyses（AI 分析 + 任务 + 看板）============
create table public.idea_analyses (
  id           uuid primary key default gen_random_uuid(),
  idea_id      uuid not null references public.ideas(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  analysis     jsonb,                              -- { feasibility, highlights[], risks[], oneLiner }
  micro_tasks  jsonb not null default '[]'::jsonb, -- [{ id, title, status, estimateMin }]
  action_board jsonb,                              -- { columns: [{ key, title, cards: [] }] }
  model        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(idea_id)
);

create index idx_analyses_idea on public.idea_analyses(idea_id);

-- ============ updated_at 自动更新 ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_ideas_updated before update on public.ideas
  for each row execute function public.set_updated_at();
create trigger trg_analyses_updated before update on public.idea_analyses
  for each row execute function public.set_updated_at();

-- ============ 新用户自动建 profile ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, email) values (new.id, new.email);
  return new;
end; $$;

create trigger trg_on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ RLS：用户只能操作自己的数据 ============
alter table public.profiles      enable row level security;
alter table public.ideas         enable row level security;
alter table public.idea_analyses enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own ideas" on public.ideas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own analyses" on public.idea_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
