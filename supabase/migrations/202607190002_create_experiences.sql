create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  company text not null,
  start_date date not null,
  end_date date,
  description text not null,
  tags text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.experiences
  add column if not exists display_order integer not null default 0;

create index if not exists experiences_display_order_idx on public.experiences (display_order, start_date desc);

alter table public.experiences enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'experiences'
      and policyname = 'Anyone can read experiences'
  ) then
    create policy "Anyone can read experiences"
      on public.experiences
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'experiences'
      and policyname = 'Admin can insert experiences'
  ) then
    create policy "Admin can insert experiences"
      on public.experiences
      for insert
      to authenticated
      with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'experiences'
      and policyname = 'Admin can update experiences'
  ) then
    create policy "Admin can update experiences"
      on public.experiences
      for update
      to authenticated
      using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com')
      with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'experiences'
      and policyname = 'Admin can delete experiences'
  ) then
    create policy "Admin can delete experiences"
      on public.experiences
      for delete
      to authenticated
      using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
  end if;
end $$;

insert into public.experiences (
  id,
  job_title,
  company,
  start_date,
  end_date,
  description,
  tags,
  display_order
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'Freelance Software Engineer',
    'KodeMargin',
    '2024-11-01',
    null,
    'Provide freelance software engineering services focused on full-stack web application development, system design, API implementation, frontend delivery, and deployment-ready solutions.',
    array['Full-Stack Development', 'React', 'Next.js', 'Node.js', 'ASP.NET Core'],
    1
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Information Communication Technology Teacher',
    'Siyopen Institute',
    '2025-03-01',
    null,
    'Teach Ordinary Level Information and Communication Technology for Grade 6 to Grade 11 students, combining practical ICT fundamentals with clear explanations and structured learning support.',
    array['ICT Teaching', 'Lesson Planning', 'Communication', 'Student Support'],
    2
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Freelance Web Developer',
    'Freelance',
    '2024-02-01',
    null,
    'Design and develop web solutions for independent clients, working across requirements, interface implementation, backend integration, and production deployment.',
    array['Web Development', 'React', 'Node.js', 'Databases', 'Deployment'],
    3
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Freelance Graphic Designer',
    'Freelance',
    '2022-04-01',
    null,
    'Create visual design assets and UI-focused creative work using Adobe tools, Figma, Canva, and layout systems, supporting both standalone design needs and software product interfaces.',
    array['Figma', 'Photoshop', 'Illustrator', 'Canva', 'UI/UX'],
    4
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Software Engineer',
    'Cipherlabz',
    '2026-03-01',
    '2026-06-30',
    'Worked as a full-stack developer on a modular ERP platform using React, ASP.NET Core, microservices, PostgreSQL, Docker, and Ocelot API Gateway. Built the Kitchen Service module from the ground up and contributed to Inventory and Finance modules with scalable backend services, optimized schemas, and responsive frontend features.',
    array['React.js', 'ASP.NET Core', 'Microservices', 'Docker', 'Ocelot', 'PostgreSQL'],
    5
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Software Engineer',
    'FuelBack PVT LTD',
    '2025-05-01',
    '2025-10-31',
    'Independently designed, developed, and deployed an AI-powered job portal from concept to production. Built scalable Next.js and TypeScript features, Supabase authentication, Prisma data access, role-based access control, AI-assisted job matching, and cloud deployment workflows.',
    array['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Vercel', 'Gemini API'],
    6
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    'Software Engineer Intern',
    'Boffo System Labs',
    '2023-11-01',
    '2024-05-31',
    'Contributed to web application development using React.js, Node.js, Express.js, MongoDB, and ASP.NET Core. Worked on requirements analysis, technical documentation, system design, implementation, testing, RESTful APIs, and Git-based team workflows.',
    array['React.js', 'Node.js', 'Express.js', 'MongoDB', 'ASP.NET Core', 'Git'],
    7
  )
on conflict (id) do update set
  job_title = excluded.job_title,
  company = excluded.company,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  description = excluded.description,
  tags = excluded.tags,
  display_order = excluded.display_order,
  updated_at = now();
