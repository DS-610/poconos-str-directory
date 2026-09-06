-- Inbound email pipeline
-- Run in Supabase SQL Editor

create table if not exists public.inbound_messages (
  id uuid primary key default uuid_generate_v4(),
  from_email text not null,
  from_name text,
  to_email text not null,
  subject text,
  body_text text,
  message_id text,
  thread_id text,
  status text not null default 'new' check (status in ('new', 'drafting', 'responded', 'archived')),
  reply_body text,
  replied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_inbound_status on public.inbound_messages(status);
create index if not exists idx_inbound_from on public.inbound_messages(from_email);
create index if not exists idx_inbound_created on public.inbound_messages(created_at desc);
