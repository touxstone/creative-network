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
  const usersByEmail = new Map();

  for (const user of demoUsers) {
    const savedUser = await prisma.user.upsert({
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

    usersByEmail.set(savedUser.email, savedUser);
  }

  const mara = usersByEmail.get('mara@creativenetwork.test');
  const leah = usersByEmail.get('leah@creativenetwork.test');

  const posts = [
    {
      id: 'demo-post-leah-contained-drama',
      authorId: leah.id,
      content:
        'Looking for a producer with festival short experience for a contained drama proof of concept. The script is 12 pages, two locations, and designed for a tight weekend shoot.',
    },
    {
      id: 'demo-post-mara-packaging',
      authorId: mara.id,
      content:
        'Packaging a small slate of proof-of-concept shorts this month. Particularly interested in directors who can work with grounded genre and strong performance beats.',
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        content: post.content,
        authorId: post.authorId,
      },
      create: post,
    });
  }

  await prisma.comment.upsert({
    where: { id: 'demo-comment-mara-on-leah' },
    update: {
      content: 'Happy to look at the deck. Send the tone references when ready.',
      postId: 'demo-post-leah-contained-drama',
      authorId: mara.id,
    },
    create: {
      id: 'demo-comment-mara-on-leah',
      content: 'Happy to look at the deck. Send the tone references when ready.',
      postId: 'demo-post-leah-contained-drama',
      authorId: mara.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'demo-comment-leah-on-mara' },
    update: {
      content: 'I know two directors who might fit this. I can introduce you.',
      postId: 'demo-post-mara-packaging',
      authorId: leah.id,
    },
    create: {
      id: 'demo-comment-leah-on-mara',
      content: 'I know two directors who might fit this. I can introduce you.',
      postId: 'demo-post-mara-packaging',
      authorId: leah.id,
    },
  });

  await prisma.like.upsert({
    where: {
      postId_userId: {
        postId: 'demo-post-leah-contained-drama',
        userId: mara.id,
      },
    },
    update: {},
    create: {
      postId: 'demo-post-leah-contained-drama',
      userId: mara.id,
    },
  });

  await prisma.like.upsert({
    where: {
      postId_userId: {
        postId: 'demo-post-mara-packaging',
        userId: leah.id,
      },
    },
    update: {},
    create: {
      postId: 'demo-post-mara-packaging',
      userId: leah.id,
    },
  });

  console.log('Seeded demo users:');
  console.log('mara@creativenetwork.test / DemoPassword123');
  console.log('leah@creativenetwork.test / DemoPassword123');
  console.log('Seeded demo social feed posts, comments, and likes.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
