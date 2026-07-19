import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const education = [
  {
    id: '31111111-1111-4111-8111-111111111111',
    degree: 'Bachelor of Science in Information Systems',
    university: 'University of Colombo School of Computing',
    startDate: new Date('2021-04-01T00:00:00.000Z'),
    endDate: new Date('2024-05-31T00:00:00.000Z'),
    description:
      'Relevant coursework included Data Structures and Algorithms, Programming with C, PHP, Java, and JavaScript, Software Engineering, Rapid Application Development, Software Testing, Middleware Architecture, and Enterprise Applications.',
    skills: ['Data Structures', 'JavaScript', 'Software Engineering', 'Testing', 'Enterprise Applications'],
    displayOrder: 1,
  },
];

export async function seedEducation(prisma = createPrismaClient()) {
  for (const item of education) {
    await prisma.education.upsert({
      where: { id: item.id },
      update: {
        degree: item.degree,
        university: item.university,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
        skills: item.skills,
        displayOrder: item.displayOrder,
      },
      create: item,
    });
  }

  console.log(`Upserted ${education.length} education records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedEducation(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
