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
      select
        count(*) as total_views,
        count(distinct session_id) as total_visitors
      from public.analytics_page_views
    ),
    day_buckets as (
      select generate_series(
        date_trunc('hour', now()) - interval '23 hours',
        date_trunc('hour', now()),
        interval '1 hour'
      ) as bucket
    ),
    day_stats as (
      select
        date_trunc('hour', created_at) as bucket,
        count(*) as views,
        count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('hour', now()) - interval '23 hours'
      group by 1
    ),
    day_json as (
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(day_buckets.bucket, 'HH24:00'),
          'views', coalesce(day_stats.views, 0),
          'visitors', coalesce(day_stats.visitors, 0)
        )
        order by day_buckets.bucket
      ) as data
      from day_buckets
      left join day_stats using (bucket)
    ),
    week_buckets as (
      select generate_series(
        date_trunc('day', now()) - interval '6 days',
        date_trunc('day', now()),
        interval '1 day'
      ) as bucket
    ),
    week_stats as (
      select
        date_trunc('day', created_at) as bucket,
        count(*) as views,
        count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('day', now()) - interval '6 days'
      group by 1
    ),
    week_json as (
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(week_buckets.bucket, 'DD.MM'),
          'views', coalesce(week_stats.views, 0),
          'visitors', coalesce(week_stats.visitors, 0)
        )
        order by week_buckets.bucket
      ) as data
      from week_buckets
      left join week_stats using (bucket)
    ),
    month_buckets as (
      select generate_series(
        date_trunc('day', now()) - interval '29 days',
        date_trunc('day', now()),
        interval '1 day'
      ) as bucket
    ),
    month_stats as (
      select
        date_trunc('day', created_at) as bucket,
        count(*) as views,
        count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('day', now()) - interval '29 days'
      group by 1
    ),
    month_json as (
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(month_buckets.bucket, 'DD.MM'),
          'views', coalesce(month_stats.views, 0),
          'visitors', coalesce(month_stats.visitors, 0)
        )
        order by month_buckets.bucket
      ) as data
      from month_buckets
      left join month_stats using (bucket)
    ),
    year_buckets as (
      select generate_series(
        date_trunc('month', now()) - interval '11 months',
        date_trunc('month', now()),
        interval '1 month'
      ) as bucket
    ),
    year_stats as (
      select
        date_trunc('month', created_at) as bucket,
        count(*) as views,
        count(distinct session_id) as visitors
      from public.analytics_page_views
      where created_at >= date_trunc('month', now()) - interval '11 months'
      group by 1
    ),
    year_json as (
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(year_buckets.bucket, 'Mon'),
          'views', coalesce(year_stats.views, 0),
          'visitors', coalesce(year_stats.visitors, 0)
        )
        order by year_buckets.bucket
      ) as data
      from year_buckets
      left join year_stats using (bucket)
    ),
    top_pages as (
      select coalesce(
        jsonb_agg(
          jsonb_build_object('path', path, 'views', views)
          order by views desc, path asc
        ),
        '[]'::jsonb
      ) as data
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
