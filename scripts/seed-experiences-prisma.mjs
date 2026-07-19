import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const experiences = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    jobTitle: 'Freelance Software Engineer',
    company: 'KodeMargin',
    startDate: new Date('2024-11-01T00:00:00.000Z'),
    endDate: null,
    description:
      'Provide freelance software engineering services focused on full-stack web application development, system design, API implementation, frontend delivery, and deployment-ready solutions.',
    tags: ['Full-Stack Development', 'React', 'Next.js', 'Node.js', 'ASP.NET Core'],
    displayOrder: 1,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    jobTitle: 'Information Communication Technology Teacher',
    company: 'Siyopen Institute',
    startDate: new Date('2025-03-01T00:00:00.000Z'),
    endDate: null,
    description:
      'Teach Ordinary Level Information and Communication Technology for Grade 6 to Grade 11 students, combining practical ICT fundamentals with clear explanations and structured learning support.',
    tags: ['ICT Teaching', 'Lesson Planning', 'Communication', 'Student Support'],
    displayOrder: 2,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    jobTitle: 'Freelance Web Developer',
    company: 'Freelance',
    startDate: new Date('2024-02-01T00:00:00.000Z'),
    endDate: null,
    description:
      'Design and develop web solutions for independent clients, working across requirements, interface implementation, backend integration, and production deployment.',
    tags: ['Web Development', 'React', 'Node.js', 'Databases', 'Deployment'],
    displayOrder: 3,
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    jobTitle: 'Freelance Graphic Designer',
    company: 'Freelance',
    startDate: new Date('2022-04-01T00:00:00.000Z'),
    endDate: null,
    description:
      'Create visual design assets and UI-focused creative work using Adobe tools, Figma, Canva, and layout systems, supporting both standalone design needs and software product interfaces.',
    tags: ['Figma', 'Photoshop', 'Illustrator', 'Canva', 'UI/UX'],
    displayOrder: 4,
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    jobTitle: 'Software Engineer',
    company: 'Cipherlabz',
    startDate: new Date('2026-03-01T00:00:00.000Z'),
    endDate: new Date('2026-06-30T00:00:00.000Z'),
    description:
      'Worked as a full-stack developer on a modular ERP platform using React, ASP.NET Core, microservices, PostgreSQL, Docker, and Ocelot API Gateway. Built the Kitchen Service module from the ground up and contributed to Inventory and Finance modules with scalable backend services, optimized schemas, and responsive frontend features.',
    tags: ['React.js', 'ASP.NET Core', 'Microservices', 'Docker', 'Ocelot', 'PostgreSQL'],
    displayOrder: 5,
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    jobTitle: 'Software Engineer',
    company: 'FuelBack PVT LTD',
    startDate: new Date('2025-05-01T00:00:00.000Z'),
    endDate: new Date('2025-10-31T00:00:00.000Z'),
    description:
      'Independently designed, developed, and deployed an AI-powered job portal from concept to production. Built scalable Next.js and TypeScript features, Supabase authentication, Prisma data access, role-based access control, AI-assisted job matching, and cloud deployment workflows.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Vercel', 'Gemini API'],
    displayOrder: 6,
  },
  {
    id: '77777777-7777-4777-8777-777777777777',
    jobTitle: 'Software Engineer Intern',
    company: 'Boffo System Labs',
    startDate: new Date('2023-11-01T00:00:00.000Z'),
    endDate: new Date('2024-05-31T00:00:00.000Z'),
    description:
      'Contributed to web application development using React.js, Node.js, Express.js, MongoDB, and ASP.NET Core. Worked on requirements analysis, technical documentation, system design, implementation, testing, RESTful APIs, and Git-based team workflows.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'ASP.NET Core', 'Git'],
    displayOrder: 7,
  },
];

export async function seedExperiences(prisma = createPrismaClient()) {
  for (const experience of experiences) {
    await prisma.experience.upsert({
      where: { id: experience.id },
      update: {
        jobTitle: experience.jobTitle,
        company: experience.company,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
        tags: experience.tags,
        displayOrder: experience.displayOrder,
      },
      create: experience,
    });
  }

  console.log(`Upserted ${experiences.length} experience records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedExperiences(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
