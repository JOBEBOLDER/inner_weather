-- Run this in Supabase SQL Editor to enable cloud receipt storage.

create table if not exists receipts (
  id uuid primary key,
  created_at timestamptz not null default now(),
  original_input text not null,
  reframe text not null,
  awareness jsonb not null,
  items jsonb not null,
  action jsonb not null,
  style text not null,
  mode text not null check (mode in ('quick', 'deep')),
  merit text
);

create index if not exists receipts_created_at_idx on receipts (created_at desc);

alter table receipts enable row level security;

-- MVP: allow anonymous read/write (tighten when auth is added)
create policy "Allow anonymous read" on receipts
  for select using (true);

create policy "Allow anonymous insert" on receipts
  for insert with check (true);
