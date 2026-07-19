import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const projects = [
  {
    id: '21111111-1111-4111-8111-111111111111',
    title: 'AI-Powered Job Portal',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'],
    description:
      'JobGenie - An intelligent job portal with AI-driven job recommendations powered by Google Gemini API and automated resume parsing. Full-stack application built with Next.js 16, Supabase (Auth + Real-time DB), and Prisma. Features advanced search with filtering, role-based access control, OTP email verification, application tracking, real-time updates, Redux state management, and production-ready deployment on Vercel. Designed with TypeScript, Tailwind CSS 4, and shadcn/ui for type-safety, scalability, and modern UX.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Gemini API', 'Vercel'],
    demoLink: 'https://www.jobgenie.biz',
    githubLink: null,
    displayOrder: 1,
  },
  {
    id: '22222222-1111-4111-8111-111111111111',
    title: 'Claz - Online Tutoring Platform',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1610484826917-0f101a7bf7f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description:
      'Claz - a Next.js + TypeScript grade-wise learning platform with AI-assisted study recommendations, a searchable teacher-controlled library of notes and past papers, Prisma + Supabase (realtime Postgres) backend for data and realtime updates, and production-ready deployment on Vercel.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Gemini API', 'Vercel'],
    demoLink: 'https://class.pathumld.com',
    githubLink: null,
    displayOrder: 2,
  },
  {
    id: '23333333-1111-4111-8111-111111111111',
    title: 'Pascal Playground - Pascal Learning Platform',
    category: 'Website',
    images: ['https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description:
      'Pascal Playground - an interactive Pascal learning platform and in-browser IDE built with Vite + TypeScript + React; features a CodeMirror editor, remote compilation via Compiler Explorer (Godbolt / Free Pascal), step debugger & code tracer, lessons, coding challenges and an AI tutor, autosave + versioned code history, import/export tools, and production-ready deployment.',
    tags: ['React.js', 'TypeScript', 'Redux', 'Tailwind CSS', 'Github', 'Gemini API', 'Vercel'],
    demoLink: 'https://pascal-playground.vercel.app',
    githubLink: null,
    displayOrder: 3,
  },
  {
    id: '24444444-1111-4111-8111-111111111111',
    title: 'PayScript - Invoice Generator',
    category: 'Website',
    images: ['https://images.unsplash.com/photo-1735825764485-93a381fd5779?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description:
      'PayScript - A customizable, privacy-first invoice generator requiring no sign-up or backend. Built with React 18, TypeScript, Vite, and Zustand for lightweight state management. Features multiple professional templates with live preview, dynamic color customization, precision financial calculations using Decimal.js, auto-save persistence, high-resolution PDF export, QR code generation, and responsive design.',
    tags: ['React.js', 'TypeScript', 'Zustand', 'Tailwind CSS', 'Github', 'Gemini API', 'Vercel'],
    demoLink: 'https://pay-script.vercel.app',
    githubLink: null,
    displayOrder: 4,
  },
  {
    id: '25555555-1111-4111-8111-111111111111',
    title: 'Resume Management System',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80'],
    description:
      'A recruitment-focused resume management system for HR teams, built with RESTful APIs, MongoDB data storage, responsive React interfaces, and comprehensive unit and integration testing.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Vercel'],
    demoLink: null,
    githubLink: null,
    displayOrder: 5,
  },
  {
    id: '26666666-1111-4111-8111-111111111111',
    title: 'MindTalk - Mental Health Support Platform',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'],
    description:
      'A secure mental health support platform connecting users and counselors with real-time communication, JWT authentication, role-based authorization, encrypted notes, blog management, and dedicated dashboards.',
    tags: ['React.js', 'Spring Boot', 'PostgreSQL', 'Tailwind CSS', 'JWT', 'CryptoJS'],
    demoLink: null,
    githubLink: null,
    displayOrder: 6,
  },
  {
    id: '27777777-1111-4111-8111-111111111111',
    title: 'BlogMe - Content Management Platform',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'],
    description:
      'A scalable blogging platform using ASP.NET Core Web API, Entity Framework, SQL Server, React, and Tailwind CSS with search, indexing, filtering, mobile-first layouts, and cross-browser compatibility.',
    tags: ['React.js', 'Tailwind CSS', 'ASP.NET Core', 'SQL Server', 'Entity Framework'],
    demoLink: null,
    githubLink: null,
    displayOrder: 7,
  },
  {
    id: '28888888-1111-4111-8111-111111111111',
    title: 'Stadia - Indoor Stadium Booking System',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80'],
    description:
      'A multi-role indoor stadium booking platform for clients, coaches, suppliers, and administrators, with booking workflows, user management, role-based access control, and a structured PHP and MySQL backend.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    demoLink: null,
    githubLink: null,
    displayOrder: 8,
  },
  {
    id: '29999999-1111-4111-8111-111111111111',
    title: 'Delivery Management ERP System',
    category: 'Web Applications',
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'],
    description:
      'A delivery management ERP system for coordinating product deliveries from a central kitchen to multiple outlets, providing operational visibility through an integrated full-stack platform.',
    tags: ['Next.js', 'ASP.NET Core', 'PostgreSQL', 'Docker', 'GitHub'],
    demoLink: null,
    githubLink: null,
    displayOrder: 9,
  },
];

export async function seedProjects(prisma = createPrismaClient()) {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {
        title: project.title,
        category: project.category,
        images: project.images,
        description: project.description,
        tags: project.tags,
        demoLink: project.demoLink,
        githubLink: project.githubLink,
        displayOrder: project.displayOrder,
      },
      create: project,
    });
  }

  console.log(`Upserted ${projects.length} project records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedProjects(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
