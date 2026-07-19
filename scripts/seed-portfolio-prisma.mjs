import { createPrismaClient } from './prisma-seed-utils.mjs';
import { seedAwards } from './seed-awards-prisma.mjs';
import { seedCertificates } from './seed-certificates-prisma.mjs';
import { seedEducation } from './seed-education-prisma.mjs';
import { seedExperiences } from './seed-experiences-prisma.mjs';
import { seedProjectCategories } from './seed-project-categories-prisma.mjs';
import { seedProjects } from './seed-projects-prisma.mjs';
import { seedVolunteers } from './seed-volunteers-prisma.mjs';

const prisma = createPrismaClient();

try {
  await seedExperiences(prisma);
  await seedProjectCategories(prisma);
  await seedProjects(prisma);
  await seedEducation(prisma);
  await seedVolunteers(prisma);
  await seedCertificates(prisma);
  await seedAwards(prisma);
  console.log('Portfolio seed completed.');
} finally {
  await prisma.$disconnect();
}
