import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'mock-user-id' },
    update: {},
    create: {
      id: 'mock-user-id',
      email: 'test@example.com',
      password: 'password123',
      role: 'STUDENT',
      profile: {
        create: {
          name: 'Test User',
          bio: 'I am a mock user for testing.',
        }
      }
    },
  });
  console.log('Mock user ensured:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
