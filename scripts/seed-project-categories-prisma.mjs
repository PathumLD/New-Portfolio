import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const projectCategories = [
  {
    id: '71111111-1111-4111-8111-111111111111',
    name: 'Website',
    slug: 'website',
    displayOrder: 1,
  },
  {
    id: '72222222-1111-4111-8111-111111111111',
    name: 'Web Applications',
    slug: 'web-applications',
    displayOrder: 2,
  },
  {
    id: '73333333-1111-4111-8111-111111111111',
    name: 'Mobile Applications',
    slug: 'mobile-applications',
    displayOrder: 3,
  },
];

export async function seedProjectCategories(prisma = createPrismaClient()) {
  for (const category of projectCategories) {
    await prisma.projectCategory.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        slug: category.slug,
        displayOrder: category.displayOrder,
      },
      create: category,
    });
  }

  console.log(`Upserted ${projectCategories.length} project category records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedProjectCategories(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
