import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const volunteers = [
  {
    id: '41111111-1111-4111-8111-111111111111',
    role: 'Treasurer',
    community: 'UCSC ISACA Student Group',
    startDate: new Date('2023-06-01T00:00:00.000Z'),
    endDate: new Date('2024-05-31T00:00:00.000Z'),
    description:
      'Served as Treasurer of the UCSC ISACA Student Group, supporting student-group financial responsibilities and organizational activities during the 2023-2024 term.',
    displayOrder: 1,
  },
  {
    id: '42222222-1111-4111-8111-111111111111',
    role: 'Team Lead (Design & Marketing)',
    community: 'UCSC ISACA Student Group',
    startDate: new Date('2022-04-01T00:00:00.000Z'),
    endDate: new Date('2024-05-31T00:00:00.000Z'),
    description:
      "Lead the Design & Marketing team of the UCSC ISACA Student Group, overseeing design and marketing initiatives to enhance the group's visibility and engagement.",
    displayOrder: 2,
  },
  {
    id: '43333333-1111-4111-8111-111111111111',
    role: 'Middle Board Director of Department of Graphic Designing',
    community: 'Colombo Beacon',
    startDate: new Date('2022-02-01T00:00:00.000Z'),
    endDate: new Date('2023-05-31T00:00:00.000Z'),
    description:
      'Served as Middle Board Director of the Department of Graphic Designing at Colombo Beacon, leading design initiatives and mentoring aspiring designers.',
    displayOrder: 3,
  },
];

export async function seedVolunteers(prisma = createPrismaClient()) {
  for (const volunteer of volunteers) {
    await prisma.volunteer.upsert({
      where: { id: volunteer.id },
      update: {
        role: volunteer.role,
        community: volunteer.community,
        startDate: volunteer.startDate,
        endDate: volunteer.endDate,
        description: volunteer.description,
        displayOrder: volunteer.displayOrder,
      },
      create: volunteer,
    });
  }

  console.log(`Upserted ${volunteers.length} volunteer records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedVolunteers(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
