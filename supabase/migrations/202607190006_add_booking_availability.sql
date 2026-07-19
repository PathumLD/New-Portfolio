alter table public.bookings
  add column if not exists booking_start_at timestamptz,
  add column if not exists booking_end_at timestamptz;

update public.bookings
set
  booking_start_at = (meeting_date::timestamp + start_time) at time zone timezone,
  booking_end_at = ((meeting_date::timestamp + start_time) at time zone timezone) + (duration_minutes || ' minutes')::interval
where booking_start_at is null
   or booking_end_at is null;

alter table public.bookings
  alter column booking_start_at set not null,
  alter column booking_end_at set not null;

create index if not exists bookings_booking_start_end_idx
  on public.bookings (booking_start_at, booking_end_at);

alter table public.bookings
  drop constraint if exists bookings_no_overlapping_active_slots;

alter table public.bookings
  add constraint bookings_no_overlapping_active_slots
  exclude using gist (
    tstzrange(booking_start_at, booking_end_at, '[)') with &&
  )
  where (status in ('pending', 'confirmed'));

create or replace function public.get_unavailable_booking_slots(
  slot_date date,
  slot_timezone text,
  slot_duration_minutes integer
)
returns table(start_time text)
language sql
stable
security definer
set search_path = public
as $$
  with candidate_slots as (
    select
      make_time((slot_minutes / 60)::int, (slot_minutes % 60)::int, 0) as local_start_time,
      ((slot_date::timestamp + make_time((slot_minutes / 60)::int, (slot_minutes % 60)::int, 0)) at time zone slot_timezone) as candidate_start_at,
      (((slot_date::timestamp + make_time((slot_minutes / 60)::int, (slot_minutes % 60)::int, 0)) at time zone slot_timezone) + (slot_duration_minutes || ' minutes')::interval) as candidate_end_at
    from generate_series(
      12 * 60,
      22 * 60 - slot_duration_minutes,
      slot_duration_minutes
    ) as slot_minutes
  )
  select to_char(candidate_slots.local_start_time, 'HH24:MI') as start_time
  from candidate_slots
  where exists (
    select 1
    from public.bookings
    where bookings.status in ('pending', 'confirmed')
      and tstzrange(bookings.booking_start_at, bookings.booking_end_at, '[)')
        && tstzrange(candidate_slots.candidate_start_at, candidate_slots.candidate_end_at, '[)')
  )
  order by candidate_slots.local_start_time;
$$;

grant execute on function public.get_unavailable_booking_slots(date, text, integer) to anon, authenticated;
