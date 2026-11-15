-- Vybchord Website — Supabase schema (v1)
-- Run in Supabase SQL editor or as supabase/migrations/0001_init.sql

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
create type lead_form_type as enum ('demo', 'project', 'staffing', 'contact', 'newsletter');
create type lead_status    as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
create type product_status as enum ('live', 'pilot', 'coming_soon');
create type business_line  as enum ('products', 'services', 'staffing');
create type job_type       as enum ('full_time', 'contract', 'deployment');
create type app_status     as enum ('new', 'screening', 'interview', 'offer', 'rejected', 'bench');

-- ---------- Admins ----------
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------- Leads ----------
create table leads (
  id uuid primary key default gen_random_uuid(),
  form_type lead_form_type not null,
  status lead_status not null default 'new',
  name text,
  email text not null,
  phone text,
  company text,
  payload jsonb not null default '{}'::jsonb,   -- form-specific fields
  attachment_path text,                          -- private bucket path
  source_page text,
  utm jsonb default '{}'::jsonb,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on leads (form_type, status, created_at desc);

create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  note text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------- Content ----------
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  summary text,
  domain text,                       -- HRTech, Real Estate, Legal...
  status product_status not null default 'coming_soon',
  modules jsonb default '[]'::jsonb, -- [{title, description}]
  screenshots text[] default '{}',
  deployment_options text[] default '{}',
  faqs jsonb default '[]'::jsonb,
  seo_title text, seo_description text,
  sort_order int default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client_name text,
  anonymised boolean not null default false,
  industry text,
  line business_line not null,
  challenge text, solution text, outcome text,
  stack text[] default '{}',
  images text[] default '{}',
  seo_title text, seo_description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body_mdx text not null default '',
  cover_image text,
  category text,
  tags text[] default '{}',
  author text default 'Dharmaraj Sekar',
  published_at timestamptz,          -- null = draft; future = scheduled
  seo_title text, seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type job_type not null,
  location text,
  work_mode text,                    -- remote / onsite / hybrid
  experience text,
  description_mdx text not null default '',
  skills text[] default '{}',
  is_open boolean not null default true,
  posted_at timestamptz not null default now(),
  valid_through timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete set null,
  status app_status not null default 'new',
  name text not null,
  email text not null,
  phone text not null,
  experience_years numeric,
  cv_path text not null,
  links jsonb default '{}'::jsonb,   -- linkedin, github, portfolio
  notice_period text,
  location text,
  expected_ctc text,
  skills text[] default '{}',
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on applications (job_id, status);

create table site_settings (
  id int primary key default 1 check (id = 1),  -- single row
  legal_name text not null default 'VYBCHORD TECHNOLOGIES & SERVICES PRIVATE LIMITED',
  cin text,
  gstin text,
  registered_office text,
  email text,
  phone text,
  whatsapp text,
  socials jsonb default '{}'::jsonb,
  announcement text,
  updated_at timestamptz not null default now()
);
insert into site_settings (id) values (1);

create table admin_audit_log (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id),
  action text not null,
  entity text,
  entity_id text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table rate_limits (
  key text primary key,              -- e.g. ip:form
  count int not null default 0,
  window_start timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$ declare t text; begin
  foreach t in array array['leads','products','case_studies','posts','jobs','applications','site_settings'] loop
    execute format('create trigger trg_%s_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- RLS ----------
alter table admins           enable row level security;
alter table leads            enable row level security;
alter table lead_notes       enable row level security;
alter table products         enable row level security;
alter table case_studies     enable row level security;
alter table posts            enable row level security;
alter table jobs             enable row level security;
alter table applications     enable row level security;
alter table site_settings    enable row level security;
alter table admin_audit_log  enable row level security;
alter table rate_limits      enable row level security;

-- Public read of published content
create policy "public read products"     on products     for select using (published);
create policy "public read case studies" on case_studies for select using (published);
create policy "public read posts"        on posts        for select using (published_at is not null and published_at <= now());
create policy "public read open jobs"    on jobs         for select using (is_open);
create policy "public read settings"     on site_settings for select using (true);

-- Admin full access
create policy "admin all admins"       on admins          for all using (is_admin()) with check (is_admin());
create policy "admin all leads"        on leads           for all using (is_admin()) with check (is_admin());
create policy "admin all lead_notes"   on lead_notes      for all using (is_admin()) with check (is_admin());
create policy "admin all products"     on products        for all using (is_admin()) with check (is_admin());
create policy "admin all case_studies" on case_studies    for all using (is_admin()) with check (is_admin());
create policy "admin all posts"        on posts           for all using (is_admin()) with check (is_admin());
create policy "admin all jobs"         on jobs            for all using (is_admin()) with check (is_admin());
create policy "admin all applications" on applications    for all using (is_admin()) with check (is_admin());
create policy "admin all settings"     on site_settings   for all using (is_admin()) with check (is_admin());
create policy "admin read audit"       on admin_audit_log for select using (is_admin());
-- leads / applications / rate_limits are INSERTED only by server actions using the service-role key.
-- Anon has no insert policy, so the browser can never write or read them directly.

-- ---------- Storage ----------
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', false)  -- CVs, briefs
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('media', 'media', true)        -- product screenshots, covers
  on conflict (id) do nothing;

create policy "admin read uploads"  on storage.objects for select using (bucket_id = 'uploads' and is_admin());
create policy "admin manage media"  on storage.objects for all    using (bucket_id = 'media' and is_admin()) with check (bucket_id = 'media' and is_admin());
create policy "public read media"   on storage.objects for select using (bucket_id = 'media');

-- ---------- Seed ----------
insert into products (slug, name, tagline, domain, status, sort_order, published) values
  ('vaulthrms', 'VaultHRMS', 'Enterprise HCM platform', 'HRTech', 'pilot', 1, true),
  ('propflow',  'PropFlow',  'Real estate CRM and digital platform', 'Real Estate Tech', 'pilot', 2, true);

-- After your first magic-link login, register yourself as admin:
-- insert into admins (user_id, email) select id, email from auth.users where email = 'dharmaraj@<your-domain>';

-- ---------- v1.1: product detail fields (FR-P3) — supabase/migrations/0002_product_detail_fields.sql ----------
alter table products add column if not exists problem text;
alter table products add column if not exists security_notes text[] default '{}';

-- ---------- v1.2: rate limit function (tech spec §4) — supabase/migrations/0003_rate_limit_fn.sql ----------
create or replace function hit_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  v_count int;
begin
  insert into rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case when r.window_start < now() - make_interval(secs => p_window_seconds)
                 then 1 else r.count + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds)
                        then now() else r.window_start end
  returning r.count into v_count;
  return v_count <= p_limit;
end; $$;

-- Only the server (service role) may call it.
revoke all on function hit_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function hit_rate_limit(text, int, int) to service_role;
