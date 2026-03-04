-- Founder Command Center — Initial Schema
-- Run against your Supabase project: supabase db push

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- CORE: Businesses
-- ============================================================
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  tagline text,
  tag text not null check (tag in ('ALL', 'FITNESS', 'INSTAGRAM', 'INTELLIGENCE', 'AUTOMOTIVE')),
  repo text,
  status text not null default 'active',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table business_metrics (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  metric_name text not null,
  current_value text,
  target_value text,
  status text default 'on-track',
  recorded_at timestamptz default now()
);

create table business_domains (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  progress int default 0 check (progress >= 0 and progress <= 100),
  phase text,
  blocker text,
  next_milestone text,
  sort_order int default 0
);

create table blockers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  description text not null,
  blocking text,
  owner text,
  cleared boolean default false,
  cleared_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- INTELLIGENCE: Personas, Frameworks, Skills
-- ============================================================
create table intelligence_files (
  id uuid primary key default uuid_generate_v4(),
  file_path text unique not null,
  file_type text not null check (file_type in ('persona', 'framework', 'skill')),
  name text not null,
  description text,
  tags text[] default '{}',
  tier int default 1,
  category text,
  content text,
  content_hash text,
  last_synced_at timestamptz default now()
);

-- ============================================================
-- VAULT: Encrypted credentials
-- ============================================================
create table credential_vaults (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete set null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table credentials (
  id uuid primary key default uuid_generate_v4(),
  vault_id uuid references credential_vaults(id) on delete cascade,
  label text not null,
  category text,
  service text,
  encrypted_value text not null,
  environment text default 'production',
  tags text[] default '{}',
  last_accessed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table credential_access_log (
  id uuid primary key default uuid_generate_v4(),
  credential_id uuid references credentials(id) on delete cascade,
  action text not null,
  accessed_at timestamptz default now()
);

-- ============================================================
-- COUNCIL: AI Advisory Sessions
-- ============================================================
create table advisory_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete set null,
  question text,
  session_type text default 'quick_consult',
  participants jsonb default '[]',
  status text default 'active',
  created_at timestamptz default now()
);

create table advisory_responses (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references advisory_sessions(id) on delete cascade,
  persona_id text not null,
  response_text text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- NOTES: Meeting notes and general notes
-- ============================================================
create table notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete set null,
  title text not null,
  content text,
  tags text[] default '{}',
  note_type text default 'general',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TASKS: Cross-business action items
-- ============================================================
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete set null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('backlog', 'todo', 'in_progress', 'done', 'cancelled')),
  priority int default 2 check (priority >= 0 and priority <= 3),
  labels text[] default '{}',
  due_date date,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- FINANCIAL: Revenue and expenses
-- ============================================================
create table revenue_entries (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  amount numeric not null,
  type text default 'recurring' check (type in ('one_time', 'recurring')),
  source text,
  period_start date,
  period_end date,
  created_at timestamptz default now()
);

create table expenses (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  amount numeric not null,
  category text,
  vendor text,
  description text,
  is_recurring boolean default false,
  date date,
  created_at timestamptz default now()
);

-- ============================================================
-- RESEARCH: Scanner results
-- ============================================================
create table research_monitors (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete set null,
  name text not null,
  keywords text[] default '{}',
  sources text[] default '{}',
  is_active boolean default true,
  last_run_at timestamptz,
  created_at timestamptz default now()
);

create table research_items (
  id uuid primary key default uuid_generate_v4(),
  monitor_id uuid references research_monitors(id) on delete set null,
  source text,
  title text not null,
  url text,
  content_snippet text,
  ai_summary text,
  relevance_score numeric,
  is_bookmarked boolean default false,
  tags text[] default '{}',
  discovered_at timestamptz default now()
);

-- ============================================================
-- RLS Policies (basic — enable after adding auth)
-- ============================================================
-- Enable RLS on all tables
alter table businesses enable row level security;
alter table business_metrics enable row level security;
alter table business_domains enable row level security;
alter table blockers enable row level security;
alter table intelligence_files enable row level security;
alter table credential_vaults enable row level security;
alter table credentials enable row level security;
alter table advisory_sessions enable row level security;
alter table advisory_responses enable row level security;
alter table notes enable row level security;
alter table tasks enable row level security;
alter table revenue_entries enable row level security;
alter table expenses enable row level security;
alter table research_monitors enable row level security;
alter table research_items enable row level security;

-- Allow authenticated users full access (single-user app for now)
create policy "Authenticated users can do everything" on businesses for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on business_metrics for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on business_domains for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on blockers for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on intelligence_files for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on credential_vaults for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on credentials for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on advisory_sessions for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on advisory_responses for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on notes for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on tasks for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on revenue_entries for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on expenses for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on research_monitors for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on research_items for all using (auth.role() = 'authenticated');
