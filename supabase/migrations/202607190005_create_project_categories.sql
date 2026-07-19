create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_categories
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.project_categories
  alter column id set default gen_random_uuid(),
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

create index if not exists project_categories_display_order_idx
  on public.project_categories (display_order, name);

drop trigger if exists set_project_categories_updated_at on public.project_categories;
create trigger set_project_categories_updated_at
  before update on public.project_categories
  for each row
  execute function public.set_updated_at();

alter table public.project_categories enable row level security;

drop policy if exists "Anyone can read project categories" on public.project_categories;
drop policy if exists "Admin can insert project categories" on public.project_categories;
drop policy if exists "Admin can update project categories" on public.project_categories;
drop policy if exists "Admin can delete project categories" on public.project_categories;

create policy "Anyone can read project categories"
  on public.project_categories
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert project categories"
  on public.project_categories
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can update project categories"
  on public.project_categories
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can delete project categories"
  on public.project_categories
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

insert into public.project_categories (id, name, slug, display_order) values
  ('71111111-1111-4111-8111-111111111111', 'Website', 'website', 1),
  ('72222222-1111-4111-8111-111111111111', 'Web Applications', 'web-applications', 2),
  ('73333333-1111-4111-8111-111111111111', 'Mobile Applications', 'mobile-applications', 3)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  display_order = excluded.display_order,
  updated_at = now();

update public.projects
set category = 'Website'
where category in ('Websites', 'Website');

update public.projects
set category = 'Web Applications'
where category in ('Web Apps', 'Web Applications');

update public.projects
set category = 'Mobile Applications'
where category in ('Mobile Apps', 'Mobile Applications');

notify pgrst, 'reload schema';
