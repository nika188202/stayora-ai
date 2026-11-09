-- Run in the Supabase SQL Editor. Enable email confirmation in Auth settings.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  location text,
  language text default 'English',
  check_in text,
  check_out text,
  wifi_name text,
  house_rules text,
  description text,
  created_at timestamptz not null default now()
);
create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task text not null,
  model text,
  input_preview text,
  output_preview text,
  created_at timestamptz not null default now()
);
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'starter' check (plan in ('starter','pro','business')),
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists properties_user_id_idx on public.properties(user_id);
create index if not exists ai_usage_user_created_idx on public.ai_usage(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.ai_usage enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);
create policy "properties own all" on public.properties for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usage own read" on public.ai_usage for select using (auth.uid() = user_id);
create policy "usage own insert" on public.ai_usage for insert with check (auth.uid() = user_id);
create policy "subscription own read" on public.subscriptions for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id,email) values(new.id,new.email)
  on conflict (id) do update set email=excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- IMPORTANT: only the service-role backend/webhook should write subscription records.
