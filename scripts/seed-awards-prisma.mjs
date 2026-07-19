import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const awards = [
  {
    id: '61111111-1111-4111-8111-111111111111',
    name: 'Best Graphic Designer',
    organization: 'PAHASARA Media Club',
    issuedDate: new Date('2023-01-01T00:00:00.000Z'),
    description: 'Honored to be recognized as the Best Designer of the Year 2022/23 by Pahasara Media Club!',
    documentUrl: null,
    displayOrder: 1,
  },
  {
    id: '62222222-1111-4111-8111-111111111111',
    name: 'Guest Speaker at the Project Hustlers 2023',
    organization: 'Leo Club of the Faculty of Arts, University of Colombo',
    issuedDate: new Date('2023-01-01T00:00:00.000Z'),
    description:
      'Honored to be invited as a guest speaker about Graphic Designing  and Photoshop at the Project Hustlers 2023 organized by the Leo Club of the Faculty of Arts, University of Colombo.',
    documentUrl: null,
    displayOrder: 2,
  },
];

export async function seedAwards(prisma = createPrismaClient()) {
  for (const award of awards) {
    await prisma.award.upsert({
      where: { id: award.id },
      update: {
        name: award.name,
        organization: award.organization,
        issuedDate: award.issuedDate,
        description: award.description,
        documentUrl: award.documentUrl,
        displayOrder: award.displayOrder,
      },
      create: award,
    });
  }

  console.log(`Upserted ${awards.length} award records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedAwards(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
