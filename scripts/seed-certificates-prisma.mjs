import { createPrismaClient, isDirectRun } from './prisma-seed-utils.mjs';

const certificates = [
  ['51111111-1111-4111-8111-111111111111', 'Introduction to JavaScript', 'Credential listed on LinkedIn', '2024-01-01', null, 1],
  ['52222222-1111-4111-8111-111111111111', 'Web Development - 1. Web Design for Beginners', 'Credential listed on LinkedIn', '2024-01-01', null, 2],
  ['53333333-1111-4111-8111-111111111111', 'Microsoft Learn AI Skills Challenge', 'Microsoft Learn', '2024-01-01', null, 3],
  ['54444444-1111-4111-8111-111111111111', 'Introduction to Cybersecurity', 'Cisco Networking Academy', '2023-01-01', 'https://www.credly.com/badges/02c1a29f-a5a1-469b-ba8a-e1a7c3894d68/public_url', 4],
  ['55555555-1111-4111-8111-111111111111', 'Introduction to IoT', 'Cisco Networking Academy', '2023-01-01', 'https://www.credly.com/badges/a94a7e7c-1745-4ccb-8ae9-ab86de819959/public_url', 5],
  ['56666666-1111-4111-8111-111111111111', 'Cybersecurity Essentials', 'Cisco Networking Academy', '2023-01-01', 'https://www.credly.com/badges/0c1f1c08-3365-4366-83f9-0578d4d745f1/public_url', 6],
  ['57777777-1111-4111-8111-111111111111', 'Networking Essentials', 'Cisco Networking Academy', '2023-01-01', 'https://www.linkedin.com/posts/pathumld_networking-essentials-activity-7089685699381075969-s44w?utm_source=share&utm_medium=member_desktop&rcm=ACoAADbSQqUBAvBBb56O1Zk6240l5m1Z7jq2CfU', 7],
  ['58888888-1111-4111-8111-111111111111', 'The Cybersecurity Threat Landscape', 'Linkedin Learning', '2024-01-01', 'https://lnkd.in/gBBgC3ez', 8],
  ['59999999-1111-4111-8111-111111111111', 'DevOps Foundations: DevSecOps', 'Linkedin Learning', '2024-01-01', 'https://lnkd.in/gJPRrppd', 9],
  ['5aaaaaaa-1111-4111-8111-111111111111', 'Jenkings', 'Kodekloud', '2025-03-01', 'https://www.linkedin.com/posts/pathumld_kodekloud-jenkins-learningneverstops-activity-7302319456347635713-qOc1?utm_source=share&utm_medium=member_desktop&rcm=ACoAADbSQqUBAvBBb56O1Zk6240l5m1Z7jq2CfU', 10],
].map(([id, name, organization, issuedDate, credentialLink, displayOrder]) => ({
  id,
  name,
  organization,
  issuedDate: new Date(`${issuedDate}T00:00:00.000Z`),
  credentialLink,
  documentUrl: null,
  displayOrder,
}));

export async function seedCertificates(prisma = createPrismaClient()) {
  for (const certificate of certificates) {
    await prisma.certificate.upsert({
      where: { id: certificate.id },
      update: {
        name: certificate.name,
        organization: certificate.organization,
        issuedDate: certificate.issuedDate,
        credentialLink: certificate.credentialLink,
        documentUrl: certificate.documentUrl,
        displayOrder: certificate.displayOrder,
      },
      create: certificate,
    });
  }

  console.log(`Upserted ${certificates.length} certificate records with Prisma.`);
}

if (isDirectRun(import.meta.url)) {
  const prisma = createPrismaClient();

  try {
    await seedCertificates(prisma);
  } finally {
    await prisma.$disconnect();
  }
}
