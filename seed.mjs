import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const demoUsers = [
  {
    email: 'mara@creativenetwork.test',
    username: 'marasoler',
    name: 'Mara Soler',
    profession: 'Producer',
    location: 'Madrid',
    website: 'https://creativenetwork.test/marasoler',
    bio: 'Producer focused on international co-productions, short-form proof of concepts, and connecting writers with technical teams.',
  },
  {
    email: 'leah@creativenetwork.test',
    username: 'leahmorgan',
    name: 'Leah Morgan',
    profession: 'Screenwriter',
    location: 'London',
    website: 'https://creativenetwork.test/leahmorgan',
    bio: 'Screenwriter building contained drama pilots and pitch decks for international development teams.',
  },
];

async function main() {
  const password = await bcrypt.hash('DemoPassword123', 12);

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        name: user.name,
        profession: user.profession,
        location: user.location,
        website: user.website,
        bio: user.bio,
      },
      create: {
        ...user,
        password,
      },
    });
  }

  console.log('Seeded demo users:');
  console.log('mara@creativenetwork.test / DemoPassword123');
  console.log('leah@creativenetwork.test / DemoPassword123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
