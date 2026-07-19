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

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  tags text[] not null default '{}',
  github_link text,
  demo_link text,
  images text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  university text not null,
  start_date date not null,
  end_date date,
  description text not null,
  skills text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  community text not null,
  start_date date not null,
  end_date date,
  description text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null,
  issued_date date not null,
  credential_link text,
  document_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null,
  issued_date date not null,
  description text,
  document_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.education
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.volunteers
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.certificates
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.awards
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.projects
  alter column id set default gen_random_uuid(),
  alter column tags set default '{}',
  alter column images set default '{}',
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

alter table public.education
  alter column id set default gen_random_uuid(),
  alter column skills set default '{}',
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

alter table public.volunteers
  alter column id set default gen_random_uuid(),
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

alter table public.certificates
  alter column id set default gen_random_uuid(),
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

alter table public.awards
  alter column id set default gen_random_uuid(),
  alter column display_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

create index if not exists projects_display_order_idx on public.projects (display_order, created_at desc);
create index if not exists education_display_order_idx on public.education (display_order, start_date desc);
create index if not exists volunteers_display_order_idx on public.volunteers (display_order, start_date desc);
create index if not exists certificates_display_order_idx on public.certificates (display_order, issued_date desc);
create index if not exists awards_display_order_idx on public.awards (display_order, issued_date desc);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_education_updated_at on public.education;
create trigger set_education_updated_at
  before update on public.education
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_volunteers_updated_at on public.volunteers;
create trigger set_volunteers_updated_at
  before update on public.volunteers
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_certificates_updated_at on public.certificates;
create trigger set_certificates_updated_at
  before update on public.certificates
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_awards_updated_at on public.awards;
create trigger set_awards_updated_at
  before update on public.awards
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.volunteers enable row level security;
alter table public.certificates enable row level security;
alter table public.awards enable row level security;

drop policy if exists "Anyone can read projects" on public.projects;
drop policy if exists "Admin can insert projects" on public.projects;
drop policy if exists "Admin can update projects" on public.projects;
drop policy if exists "Admin can delete projects" on public.projects;
create policy "Anyone can read projects" on public.projects for select to anon, authenticated using (true);
create policy "Admin can insert projects" on public.projects for insert to authenticated with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can update projects" on public.projects for update to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com') with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can delete projects" on public.projects for delete to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

drop policy if exists "Anyone can read education" on public.education;
drop policy if exists "Admin can insert education" on public.education;
drop policy if exists "Admin can update education" on public.education;
drop policy if exists "Admin can delete education" on public.education;
create policy "Anyone can read education" on public.education for select to anon, authenticated using (true);
create policy "Admin can insert education" on public.education for insert to authenticated with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can update education" on public.education for update to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com') with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can delete education" on public.education for delete to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

drop policy if exists "Anyone can read volunteers" on public.volunteers;
drop policy if exists "Admin can insert volunteers" on public.volunteers;
drop policy if exists "Admin can update volunteers" on public.volunteers;
drop policy if exists "Admin can delete volunteers" on public.volunteers;
create policy "Anyone can read volunteers" on public.volunteers for select to anon, authenticated using (true);
create policy "Admin can insert volunteers" on public.volunteers for insert to authenticated with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can update volunteers" on public.volunteers for update to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com') with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can delete volunteers" on public.volunteers for delete to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

drop policy if exists "Anyone can read certificates" on public.certificates;
drop policy if exists "Admin can insert certificates" on public.certificates;
drop policy if exists "Admin can update certificates" on public.certificates;
drop policy if exists "Admin can delete certificates" on public.certificates;
create policy "Anyone can read certificates" on public.certificates for select to anon, authenticated using (true);
create policy "Admin can insert certificates" on public.certificates for insert to authenticated with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can update certificates" on public.certificates for update to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com') with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can delete certificates" on public.certificates for delete to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

drop policy if exists "Anyone can read awards" on public.awards;
drop policy if exists "Admin can insert awards" on public.awards;
drop policy if exists "Admin can update awards" on public.awards;
drop policy if exists "Admin can delete awards" on public.awards;
create policy "Anyone can read awards" on public.awards for select to anon, authenticated using (true);
create policy "Admin can insert awards" on public.awards for insert to authenticated with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can update awards" on public.awards for update to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com') with check ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');
create policy "Admin can delete awards" on public.awards for delete to authenticated using ((auth.jwt() ->> 'email') = 'pathumlk.diz@gmail.com');

insert into public.projects (id, title, category, images, description, tags, demo_link, display_order) values
  ('21111111-1111-4111-8111-111111111111', 'AI-Powered Job Portal', 'Web Applications', array['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'], 'JobGenie - An intelligent job portal with AI-driven job recommendations powered by Google Gemini API and automated resume parsing. Full-stack application built with Next.js 16, Supabase (Auth + Real-time DB), and Prisma. Features advanced search with filtering, role-based access control, OTP email verification, application tracking, real-time updates, Redux state management, and production-ready deployment on Vercel. Designed with TypeScript, Tailwind CSS 4, and shadcn/ui for type-safety, scalability, and modern UX.', array['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Gemini API', 'Vercel'], 'https://www.jobgenie.biz', 1),
  ('22222222-1111-4111-8111-111111111111', 'Claz - Online Tutoring Platform', 'Web Applications', array['https://images.unsplash.com/photo-1610484826917-0f101a7bf7f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'], 'Claz - a Next.js + TypeScript grade-wise learning platform with AI-assisted study recommendations, a searchable teacher-controlled library of notes and past papers, Prisma + Supabase (realtime Postgres) backend for data and realtime updates, and production-ready deployment on Vercel.', array['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Gemini API', 'Vercel'], 'https://class.pathumld.com', 2),
  ('23333333-1111-4111-8111-111111111111', 'Pascal Playground - Pascal Learning Platform', 'Website', array['https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'], 'Pascal Playground - an interactive Pascal learning platform and in-browser IDE built with Vite + TypeScript + React; features a CodeMirror editor, remote compilation via Compiler Explorer (Godbolt / Free Pascal), step debugger & code tracer, lessons, coding challenges and an AI tutor, autosave + versioned code history, import/export tools, and production-ready deployment.', array['React.js', 'TypeScript', 'Redux', 'Tailwind CSS', 'Github', 'Gemini API', 'Vercel'], 'https://pascal-playground.vercel.app', 3),
  ('24444444-1111-4111-8111-111111111111', 'PayScript - Invoice Generator', 'Website', array['https://images.unsplash.com/photo-1735825764485-93a381fd5779?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'], 'PayScript - A customizable, privacy-first invoice generator requiring no sign-up or backend. Built with React 18, TypeScript, Vite, and Zustand for lightweight state management. Features multiple professional templates with live preview, dynamic color customization, precision financial calculations using Decimal.js, auto-save persistence, high-resolution PDF export, QR code generation, and responsive design.', array['React.js', 'TypeScript', 'Zustand', 'Tailwind CSS', 'Github', 'Gemini API', 'Vercel'], 'https://pay-script.vercel.app', 4),
  ('25555555-1111-4111-8111-111111111111', 'Resume Management System', 'Web Applications', array['https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80'], 'A recruitment-focused resume management system for HR teams, built with RESTful APIs, MongoDB data storage, responsive React interfaces, and comprehensive unit and integration testing.', array['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Vercel'], null, 5),
  ('26666666-1111-4111-8111-111111111111', 'MindTalk - Mental Health Support Platform', 'Web Applications', array['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'], 'A secure mental health support platform connecting users and counselors with real-time communication, JWT authentication, role-based authorization, encrypted notes, blog management, and dedicated dashboards.', array['React.js', 'Spring Boot', 'PostgreSQL', 'Tailwind CSS', 'JWT', 'CryptoJS'], null, 6),
  ('27777777-1111-4111-8111-111111111111', 'BlogMe - Content Management Platform', 'Web Applications', array['https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'], 'A scalable blogging platform using ASP.NET Core Web API, Entity Framework, SQL Server, React, and Tailwind CSS with search, indexing, filtering, mobile-first layouts, and cross-browser compatibility.', array['React.js', 'Tailwind CSS', 'ASP.NET Core', 'SQL Server', 'Entity Framework'], null, 7),
  ('28888888-1111-4111-8111-111111111111', 'Stadia - Indoor Stadium Booking System', 'Web Applications', array['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80'], 'A multi-role indoor stadium booking platform for clients, coaches, suppliers, and administrators, with booking workflows, user management, role-based access control, and a structured PHP and MySQL backend.', array['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'], null, 8),
  ('29999999-1111-4111-8111-111111111111', 'Delivery Management ERP System', 'Web Applications', array['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'], 'A delivery management ERP system for coordinating product deliveries from a central kitchen to multiple outlets, providing operational visibility through an integrated full-stack platform.', array['Next.js', 'ASP.NET Core', 'PostgreSQL', 'Docker', 'GitHub'], null, 9)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  images = excluded.images,
  description = excluded.description,
  tags = excluded.tags,
  demo_link = excluded.demo_link,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.education (id, degree, university, start_date, end_date, description, skills, display_order) values
  ('31111111-1111-4111-8111-111111111111', 'Bachelor of Science in Information Systems', 'University of Colombo School of Computing', '2021-04-01', '2024-05-31', 'Relevant coursework included Data Structures and Algorithms, Programming with C, PHP, Java, and JavaScript, Software Engineering, Rapid Application Development, Software Testing, Middleware Architecture, and Enterprise Applications.', array['Data Structures', 'JavaScript', 'Software Engineering', 'Testing', 'Enterprise Applications'], 1)
on conflict (id) do update set
  degree = excluded.degree,
  university = excluded.university,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  description = excluded.description,
  skills = excluded.skills,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.volunteers (id, role, community, start_date, end_date, description, display_order) values
  ('41111111-1111-4111-8111-111111111111', 'Treasurer', 'UCSC ISACA Student Group', '2023-06-01', '2024-05-31', 'Served as Treasurer of the UCSC ISACA Student Group, supporting student-group financial responsibilities and organizational activities during the 2023-2024 term.', 1),
  ('42222222-1111-4111-8111-111111111111', 'Team Lead (Design & Marketing)', 'UCSC ISACA Student Group', '2022-04-01', '2024-05-31', 'Lead the Design & Marketing team of the UCSC ISACA Student Group, overseeing design and marketing initiatives to enhance the group''s visibility and engagement.', 2),
  ('43333333-1111-4111-8111-111111111111', 'Middle Board Director of Department of Graphic Designing', 'Colombo Beacon', '2022-02-01', '2023-05-31', 'Served as Middle Board Director of the Department of Graphic Designing at Colombo Beacon, leading design initiatives and mentoring aspiring designers.', 3)
on conflict (id) do update set
  role = excluded.role,
  community = excluded.community,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  description = excluded.description,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.certificates (id, name, organization, issued_date, credential_link, display_order) values
  ('51111111-1111-4111-8111-111111111111', 'Introduction to JavaScript', 'Credential listed on LinkedIn', '2024-01-01', null, 1),
  ('52222222-1111-4111-8111-111111111111', 'Web Development - 1. Web Design for Beginners', 'Credential listed on LinkedIn', '2024-01-01', null, 2),
  ('53333333-1111-4111-8111-111111111111', 'Microsoft Learn AI Skills Challenge', 'Microsoft Learn', '2024-01-01', null, 3),
  ('54444444-1111-4111-8111-111111111111', 'Introduction to Cybersecurity', 'Cisco Networking Academy', '2023-01-01', 'https://www.credly.com/badges/02c1a29f-a5a1-469b-ba8a-e1a7c3894d68/public_url', 4),
  ('55555555-1111-4111-8111-111111111111', 'Introduction to IoT', 'Cisco Networking Academy', '2023-01-01', 'https://www.credly.com/badges/a94a7e7c-1745-4ccb-8ae9-ab86de819959/public_url', 5),
  ('56666666-1111-4111-8111-111111111111', 'Cybersecurity Essentials', 'Cisco Networking Academy', '2023-01-01', 'https://www.credly.com/badges/0c1f1c08-3365-4366-83f9-0578d4d745f1/public_url', 6),
  ('57777777-1111-4111-8111-111111111111', 'Networking Essentials', 'Cisco Networking Academy', '2023-01-01', 'https://www.linkedin.com/posts/pathumld_networking-essentials-activity-7089685699381075969-s44w?utm_source=share&utm_medium=member_desktop&rcm=ACoAADbSQqUBAvBBb56O1Zk6240l5m1Z7jq2CfU', 7),
  ('58888888-1111-4111-8111-111111111111', 'The Cybersecurity Threat Landscape', 'Linkedin Learning', '2024-01-01', 'https://lnkd.in/gBBgC3ez', 8),
  ('59999999-1111-4111-8111-111111111111', 'DevOps Foundations: DevSecOps', 'Linkedin Learning', '2024-01-01', 'https://lnkd.in/gJPRrppd', 9),
  ('5aaaaaaa-1111-4111-8111-111111111111', 'Jenkings', 'Kodekloud', '2025-03-01', 'https://www.linkedin.com/posts/pathumld_kodekloud-jenkins-learningneverstops-activity-7302319456347635713-qOc1?utm_source=share&utm_medium=member_desktop&rcm=ACoAADbSQqUBAvBBb56O1Zk6240l5m1Z7jq2CfU', 10)
on conflict (id) do update set
  name = excluded.name,
  organization = excluded.organization,
  issued_date = excluded.issued_date,
  credential_link = excluded.credential_link,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.awards (id, name, organization, issued_date, description, display_order) values
  ('61111111-1111-4111-8111-111111111111', 'Best Graphic Designer', 'PAHASARA Media Club', '2023-01-01', 'Honored to be recognized as the Best Designer of the Year 2022/23 by Pahasara Media Club!', 1),
  ('62222222-1111-4111-8111-111111111111', 'Guest Speaker at the Project Hustlers 2023', 'Leo Club of the Faculty of Arts, University of Colombo', '2023-01-01', 'Honored to be invited as a guest speaker about Graphic Designing  and Photoshop at the Project Hustlers 2023 organized by the Leo Club of the Faculty of Arts, University of Colombo.', 2)
on conflict (id) do update set
  name = excluded.name,
  organization = excluded.organization,
  issued_date = excluded.issued_date,
  description = excluded.description,
  display_order = excluded.display_order,
  updated_at = now();

notify pgrst, 'reload schema';
