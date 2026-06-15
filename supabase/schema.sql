create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  summary text not null,
  problem text not null,
  solution text not null,
  technologies text[] not null default '{}',
  scope text[] not null default '{}',
  role text not null,
  duration text,
  year text not null,
  area text not null default 'unity' check (area in ('unity', 'web')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default true,
  sort_order integer not null default 100,
  links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects
add column if not exists area text not null default 'unity';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_area_check'
  ) then
    alter table public.projects
    add constraint projects_area_check check (area in ('unity', 'web'));
  end if;
end;
$$;

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  url text not null,
  alt text not null,
  poster_url text,
  poster_storage_path text,
  storage_path text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

alter table public.project_media
add column if not exists poster_storage_path text;

create table if not exists public.project_translations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  locale text not null check (locale in ('pl', 'en')),
  title text not null,
  subtitle text not null,
  summary text not null,
  problem text not null,
  solution text not null,
  scope text[] not null default '{}',
  role text,
  duration text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, locale)
);

create table if not exists public.cv_documents (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'pl' check (locale in ('pl', 'en')),
  file_name text not null,
  url text not null,
  storage_path text not null,
  updated_at timestamptz not null default now()
);

alter table public.cv_documents
add column if not exists locale text not null default 'pl';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cv_documents_locale_check'
  ) then
    alter table public.cv_documents
    add constraint cv_documents_locale_check check (locale in ('pl', 'en'));
  end if;
end;
$$;

create table if not exists public.portfolio_settings (
  id boolean primary key default true,
  web_portfolio_url text not null default '/websites',
  updated_at timestamptz not null default now(),
  constraint portfolio_settings_singleton check (id)
);

create table if not exists public.site_content (
  id boolean primary key default true,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null,
  locale text not null default 'pl' check (locale in ('pl', 'en')),
  source_url text not null,
  user_agent text,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists project_translations_set_updated_at on public.project_translations;
create trigger project_translations_set_updated_at
before update on public.project_translations
for each row execute function public.set_updated_at();

drop trigger if exists cv_documents_set_updated_at on public.cv_documents;
create trigger cv_documents_set_updated_at
before update on public.cv_documents
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_settings_set_updated_at on public.portfolio_settings;
create trigger portfolio_settings_set_updated_at
before update on public.portfolio_settings
for each row execute function public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.project_translations enable row level security;
alter table public.cv_documents enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Admin users can read themselves" on public.admin_users;
create policy "Admin users can read themselves"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
using (status = 'published');

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
on public.projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read media for published projects" on public.project_media;
create policy "Public can read media for published projects"
on public.project_media for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_media.project_id
      and projects.status = 'published'
  )
);

drop policy if exists "Admins can manage project media" on public.project_media;
create policy "Admins can manage project media"
on public.project_media for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read translations for published projects" on public.project_translations;
create policy "Public can read translations for published projects"
on public.project_translations for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_translations.project_id
      and projects.status = 'published'
  )
);

drop policy if exists "Admins can manage project translations" on public.project_translations;
create policy "Admins can manage project translations"
on public.project_translations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read cv" on public.cv_documents;
create policy "Public can read cv"
on public.cv_documents for select
using (true);

drop policy if exists "Admins can manage cv" on public.cv_documents;
create policy "Admins can manage cv"
on public.cv_documents for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read portfolio settings" on public.portfolio_settings;
create policy "Public can read portfolio settings"
on public.portfolio_settings for select
using (true);

drop policy if exists "Admins can manage portfolio settings" on public.portfolio_settings;
create policy "Admins can manage portfolio settings"
on public.portfolio_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
using (true);

drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage contact messages" on public.contact_messages;
create policy "Admins can manage contact messages"
on public.contact_messages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table if not exists public.analytics_page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  locale text not null default 'pl' check (locale in ('pl', 'en')),
  referrer text,
  session_id text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_page_views_created_at_idx
on public.analytics_page_views (created_at desc);

create index if not exists analytics_page_views_path_idx
on public.analytics_page_views (path);

create index if not exists analytics_page_views_session_id_idx
on public.analytics_page_views (session_id);

alter table public.analytics_page_views enable row level security;

drop policy if exists "Admins can read analytics" on public.analytics_page_views;
create policy "Admins can read analytics"
on public.analytics_page_views for select
to authenticated
using (public.is_admin());

create or replace function public.track_page_view(
  p_path text,
  p_locale text,
  p_referrer text,
  p_session_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_path text := left(coalesce(nullif(trim(p_path), ''), '/'), 2048);
  normalized_session_id text := left(coalesce(nullif(trim(p_session_id), ''), gen_random_uuid()::text), 128);
  request_headers jsonb := nullif(current_setting('request.headers', true), '')::jsonb;
begin
  if normalized_path like '/admin%' then
    return;
  end if;

  insert into public.analytics_page_views (
    path,
    locale,
    referrer,
    session_id,
    user_agent
  )
  values (
    normalized_path,
    case when p_locale in ('pl', 'en') then p_locale else 'pl' end,
    nullif(left(coalesce(p_referrer, ''), 2048), ''),
    normalized_session_id,
    nullif(left(coalesce(request_headers ->> 'user-agent', ''), 512), '')
  );
end;
$$;

grant execute on function public.track_page_view(text, text, text, text)
to anon, authenticated;

create or replace function public.get_analytics_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;

  with
    totals as (
      select count(*) as total_views, count(distinct session_id) as total_visitors
      from public.analytics_page_views
    ),
    day_buckets as (
      select generate_series(date_trunc('hour', now()) - interval '23 hours', date_trunc('hour', now()), interval '1 hour') as bucket
    ),
    day_stats as (
      select date_trunc('hour', created_at) as bucket, count(*) as views, count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('hour', now()) - interval '23 hours'
      group by 1
    ),
    day_json as (
      select jsonb_agg(jsonb_build_object('label', to_char(day_buckets.bucket, 'HH24:00'), 'views', coalesce(day_stats.views, 0), 'visitors', coalesce(day_stats.visitors, 0)) order by day_buckets.bucket) as data
      from day_buckets
      left join day_stats using (bucket)
    ),
    week_buckets as (
      select generate_series(date_trunc('day', now()) - interval '6 days', date_trunc('day', now()), interval '1 day') as bucket
    ),
    week_stats as (
      select date_trunc('day', created_at) as bucket, count(*) as views, count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('day', now()) - interval '6 days'
      group by 1
    ),
    week_json as (
      select jsonb_agg(jsonb_build_object('label', to_char(week_buckets.bucket, 'DD.MM'), 'views', coalesce(week_stats.views, 0), 'visitors', coalesce(week_stats.visitors, 0)) order by week_buckets.bucket) as data
      from week_buckets
      left join week_stats using (bucket)
    ),
    month_buckets as (
      select generate_series(date_trunc('day', now()) - interval '29 days', date_trunc('day', now()), interval '1 day') as bucket
    ),
    month_stats as (
      select date_trunc('day', created_at) as bucket, count(*) as views, count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('day', now()) - interval '29 days'
      group by 1
    ),
    month_json as (
      select jsonb_agg(jsonb_build_object('label', to_char(month_buckets.bucket, 'DD.MM'), 'views', coalesce(month_stats.views, 0), 'visitors', coalesce(month_stats.visitors, 0)) order by month_buckets.bucket) as data
      from month_buckets
      left join month_stats using (bucket)
    ),
    year_buckets as (
      select generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') as bucket
    ),
    year_stats as (
      select date_trunc('month', created_at) as bucket, count(*) as views, count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('month', now()) - interval '11 months'
      group by 1
    ),
    year_json as (
      select jsonb_agg(jsonb_build_object('label', to_char(year_buckets.bucket, 'Mon'), 'views', coalesce(year_stats.views, 0), 'visitors', coalesce(year_stats.visitors, 0)) order by year_buckets.bucket) as data
      from year_buckets
      left join year_stats using (bucket)
    ),
    top_pages as (
      select coalesce(jsonb_agg(jsonb_build_object('path', path, 'views', views) order by views desc, path asc), '[]'::jsonb) as data
      from (
        select path, count(*) as views
        from public.analytics_page_views
        group by path
        order by views desc, path asc
        limit 6
      ) page_counts
    )
  select jsonb_build_object(
    'totalViews', totals.total_views,
    'totalVisitors', totals.total_visitors,
    'periods', jsonb_build_object(
      'day', coalesce(day_json.data, '[]'::jsonb),
      'week', coalesce(week_json.data, '[]'::jsonb),
      'month', coalesce(month_json.data, '[]'::jsonb),
      'year', coalesce(year_json.data, '[]'::jsonb)
    ),
    'topPages', top_pages.data
  )
  into result
  from totals, day_json, week_json, month_json, year_json, top_pages;

  return result;
end;
$$;

grant execute on function public.get_analytics_summary()
to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-media', 'project-media', true, 104857600, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('cv', 'cv', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read storage files" on storage.objects;
create policy "Public can read storage files"
on storage.objects for select
using (bucket_id in ('project-media', 'cv'));

drop policy if exists "Admins can upload storage files" on storage.objects;
create policy "Admins can upload storage files"
on storage.objects for insert
to authenticated
with check (bucket_id in ('project-media', 'cv') and public.is_admin());

drop policy if exists "Admins can update storage files" on storage.objects;
create policy "Admins can update storage files"
on storage.objects for update
to authenticated
using (bucket_id in ('project-media', 'cv') and public.is_admin())
with check (bucket_id in ('project-media', 'cv') and public.is_admin());

drop policy if exists "Admins can delete storage files" on storage.objects;
create policy "Admins can delete storage files"
on storage.objects for delete
to authenticated
using (bucket_id in ('project-media', 'cv') and public.is_admin());

insert into public.portfolio_settings (id, web_portfolio_url)
values (true, '/websites')
on conflict (id) do nothing;

insert into public.site_content (id, content)
values (true, '{}'::jsonb)
on conflict (id) do nothing;

-- After creating a Supabase Auth user, grant access to /admin:
-- insert into public.admin_users (user_id) values ('AUTH_USER_UUID');
--
-- Contact Edge Function environment:
-- RESEND_API_KEY=<resend_api_key>
-- CONTACT_TO_EMAIL=<target_inbox>
-- CONTACT_FROM_EMAIL=Miłosz Czech <contact@your-domain.com>
-- CONTACT_ALLOWED_ORIGIN=https://your-domain.com
