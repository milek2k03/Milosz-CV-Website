alter table public.projects
alter column year type text
using year::text;
