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

delete from public.cv_documents existing
where existing.locale = 'pl'
  and existing.id <> (
    select newest.id
    from public.cv_documents newest
    where newest.locale = 'pl'
    order by newest.updated_at desc
    limit 1
  );

create unique index if not exists cv_documents_locale_key
on public.cv_documents (locale);

drop trigger if exists cv_documents_set_updated_at on public.cv_documents;
create trigger cv_documents_set_updated_at
before update on public.cv_documents
for each row execute function public.set_updated_at();
