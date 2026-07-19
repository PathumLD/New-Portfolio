create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  hiring_reason text not null,
  project_details text not null,
  attachment_bucket text,
  attachment_path text,
  attachment_url text,
  attachment_name text,
  attachment_size bigint,
  attachment_type text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  source text not null default 'contact_page',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
drop policy if exists "Admin can read contact messages" on public.contact_messages;
drop policy if exists "Admin can update contact messages" on public.contact_messages;
drop policy if exists "Admin can delete contact messages" on public.contact_messages;

create policy "Anyone can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    status = 'new'
    and source = 'contact_page'
  );

create policy "Admin can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

create policy "Admin can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

grant insert on table public.contact_messages to anon, authenticated;
grant select, update, delete on table public.contact_messages to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contact-attachments',
  'contact-attachments',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can upload contact attachments" on storage.objects;
drop policy if exists "Admin can read contact attachments" on storage.objects;
drop policy if exists "Admin can update contact attachments" on storage.objects;
drop policy if exists "Admin can delete contact attachments" on storage.objects;

create policy "Anyone can upload contact attachments"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'contact-attachments'
    and (storage.foldername(name))[1] = 'contact-submissions'
  );

create policy "Admin can read contact attachments"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'contact-attachments'
    and (auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com'
  );

create policy "Admin can update contact attachments"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'contact-attachments'
    and (auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com'
  )
  with check (
    bucket_id = 'contact-attachments'
    and (auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com'
  );

create policy "Admin can delete contact attachments"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'contact-attachments'
    and (auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com'
  );
