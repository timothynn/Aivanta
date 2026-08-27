create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  industry text,
  message text not null,
  goals text[] not null default '{}',
  source text not null default 'homepage_contact_form',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_email_idx on leads (email);

create table if not exists lead_assessments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  company_size text,
  existing_systems text[] not null default '{}',
  ai_goals text[] not null default '{}',
  urgency text,
  budget_range text,
  notes text,
  score integer,
  created_at timestamptz not null default now()
);

create table if not exists email_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  provider text not null,
  provider_message_id text,
  event_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor_id text,
  event_type text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
