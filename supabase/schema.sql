-- Run this once in Supabase: SQL Editor > New query > paste > Run
create extension if not exists pgcrypto;

create table if not exists site_settings (
  key text primary key,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  position int not null default 0,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists items_collection_position on items (collection, position);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  scope text,
  message text not null,
  created_at timestamptz not null default now()
);

-- The browser never talks to the database directly: only the Express server
-- (service-role key) can read/write. RLS on with no policies = locked to the public.
alter table site_settings enable row level security;
alter table items enable row level security;
alter table messages enable row level security;

-- Public storage bucket for images / videos / CV (uploads go through the server)
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "public read portfolio files" on storage.objects;
create policy "public read portfolio files" on storage.objects
  for select using (bucket_id = 'portfolio');
