create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.meeting_type as enum ('discovery_call');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  meeting_type public.meeting_type not null default 'discovery_call',
  duration_minutes integer not null check (duration_minutes in (15, 30)),
  meeting_date date not null,
  start_time time without time zone not null,
  timezone text not null default 'Asia/Colombo',
  client_name text not null,
  client_email text not null,
  client_phone text,
  notes text,
  status public.booking_status not null default 'pending',
  source text not null default 'contact_page',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_meeting_date_start_time_idx on public.bookings (meeting_date, start_time);
create index bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

create policy "Anyone can request a booking"
  on public.bookings
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and source = 'contact_page'
  );

create policy "Admin can read bookings"
  on public.bookings
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can update bookings"
  on public.bookings
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can delete bookings"
  on public.bookings
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
