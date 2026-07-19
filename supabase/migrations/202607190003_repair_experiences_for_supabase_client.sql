create extension if not exists pgcrypto with schema extensions;

alter table public.experiences
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.experiences
  alter column id set default gen_random_uuid(),
  alter column tags set default '{}',
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_experiences_updated_at on public.experiences;
create trigger set_experiences_updated_at
  before update on public.experiences
  for each row
  execute function public.set_updated_at();

create index if not exists experiences_display_order_idx
  on public.experiences (display_order, start_date desc);

alter table public.experiences enable row level security;

drop policy if exists "Anyone can read experiences" on public.experiences;
drop policy if exists "Admin can insert experiences" on public.experiences;
drop policy if exists "Admin can update experiences" on public.experiences;
drop policy if exists "Admin can delete experiences" on public.experiences;

create policy "Anyone can read experiences"
  on public.experiences
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert experiences"
  on public.experiences
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can update experiences"
  on public.experiences
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can delete experiences"
  on public.experiences
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

notify pgrst, 'reload schema';
