import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();
  const users = [];

  for (let i = 1; i <= 3; i++) {
    users.push({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log('Seed data created.');
}

seed().then(() => {
  console.log('Database seeded');
});
