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
  {
    email: 'aisha@creativenetwork.test',
    username: 'aishagrant',
    name: 'Aisha Grant',
    profession: 'Casting Director',
    location: 'Los Angeles',
    website: 'https://creativenetwork.test/aishagrant',
    bio: 'Casting director focused on shortlists, talent discovery, and finding performers for international indie projects.',
  },
  {
    email: 'nico@creativenetwork.test',
    username: 'nicoreyes',
    name: 'Nico Reyes',
    profession: 'Composer',
    location: 'Barcelona',
    website: 'https://creativenetwork.test/nicoreyes',
    bio: 'Composer creating suspense cues, trailer packs, and intimate scores for features and proof-of-concept shorts.',
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
  const aisha = usersByEmail.get('aisha@creativenetwork.test');
  const nico = usersByEmail.get('nico@creativenetwork.test');

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

  await prisma.connection.upsert({
    where: {
      userAId_userBId: {
        userAId: mara.id,
        userBId: leah.id,
      },
    },
    update: {
      status: 'ACCEPTED',
    },
    create: {
      userAId: mara.id,
      userBId: leah.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.connection.upsert({
    where: {
      userAId_userBId: {
        userAId: aisha.id,
        userBId: mara.id,
      },
    },
    update: {
      status: 'PENDING',
    },
    create: {
      userAId: aisha.id,
      userBId: mara.id,
      status: 'PENDING',
    },
  });

  await prisma.connection.upsert({
    where: {
      userAId_userBId: {
        userAId: leah.id,
        userBId: nico.id,
      },
    },
    update: {
      status: 'PENDING',
    },
    create: {
      userAId: leah.id,
      userBId: nico.id,
      status: 'PENDING',
    },
  });

  await prisma.conversation.upsert({
    where: { id: 'demo-conversation-mara-leah' },
    update: {
      title: 'Contained drama proof-of-concept notes',
    },
    create: {
      id: 'demo-conversation-mara-leah',
      title: 'Contained drama proof-of-concept notes',
      participants: {
        create: [{ userId: mara.id }, { userId: leah.id }],
      },
    },
  });

  await prisma.message.upsert({
    where: { id: 'demo-message-leah-to-mara' },
    update: {
      content: 'I tightened the proof-of-concept logline. Would love your producer eye on it.',
      conversationId: 'demo-conversation-mara-leah',
      senderId: leah.id,
    },
    create: {
      id: 'demo-message-leah-to-mara',
      content: 'I tightened the proof-of-concept logline. Would love your producer eye on it.',
      conversationId: 'demo-conversation-mara-leah',
      senderId: leah.id,
    },
  });

  await prisma.message.upsert({
    where: { id: 'demo-message-mara-to-leah' },
    update: {
      content: 'Send it over. I can also suggest two comparable shorts for the pitch notes.',
      conversationId: 'demo-conversation-mara-leah',
      senderId: mara.id,
      replyToId: 'demo-message-leah-to-mara',
    },
    create: {
      id: 'demo-message-mara-to-leah',
      content: 'Send it over. I can also suggest two comparable shorts for the pitch notes.',
      conversationId: 'demo-conversation-mara-leah',
      senderId: mara.id,
      replyToId: 'demo-message-leah-to-mara',
    },
  });

  await prisma.conversation.update({
    where: { id: 'demo-conversation-mara-leah' },
    data: {
      pinnedMessageId: 'demo-message-leah-to-mara',
    },
  });

  await prisma.project.upsert({
    where: { slug: 'contained-drama-proof-of-concept' },
    update: {
      title: 'Contained Drama Proof of Concept',
      logline:
        'A contained short designed to test tone, performance, and festival viability before packaging a larger limited series.',
      description:
        'A 12-page two-location drama proof of concept built for a focused weekend shoot. The project is using Creative Network to gather producer notes, director references, and collaborators before moving toward a lightweight pitch package.',
      status: 'DEVELOPMENT',
      language: 'English',
      location: 'London / Madrid',
      ownerRole: 'Producer',
      ownerId: mara.id,
      members: {
        deleteMany: {},
        create: [
          { userId: mara.id, role: 'Producer' },
          { userId: leah.id, role: 'Writer' },
        ],
      },
      links: {
        deleteMany: {},
        create: [
          {
            label: 'Pitch deck placeholder',
            url: 'https://example.com/contained-drama-deck',
          },
        ],
      },
    },
    create: {
      title: 'Contained Drama Proof of Concept',
      slug: 'contained-drama-proof-of-concept',
      logline:
        'A contained short designed to test tone, performance, and festival viability before packaging a larger limited series.',
      description:
        'A 12-page two-location drama proof of concept built for a focused weekend shoot. The project is using Creative Network to gather producer notes, director references, and collaborators before moving toward a lightweight pitch package.',
      status: 'DEVELOPMENT',
      language: 'English',
      location: 'London / Madrid',
      ownerRole: 'Producer',
      ownerId: mara.id,
      members: {
        create: [
          { userId: mara.id, role: 'Producer' },
          { userId: leah.id, role: 'Writer' },
        ],
      },
      links: {
        create: [
          {
            label: 'Pitch deck placeholder',
            url: 'https://example.com/contained-drama-deck',
          },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: 'nocturne-trailer-cues' },
    update: {
      title: 'Nocturne Trailer Cues',
      logline:
        'A compact cue pack for grounded genre shorts, proof-of-concepts, and teaser edits.',
      description:
        'A portfolio-facing cue collection built around suspense, restraint, and intimate character beats. The project links out to external audio references rather than storing media directly in Creative Network.',
      status: 'SEEKING_COLLABORATORS',
      language: 'Instrumental',
      location: 'Barcelona / Remote',
      ownerRole: 'Composer',
      ownerId: nico.id,
      members: {
        deleteMany: {},
        create: [{ userId: nico.id, role: 'Composer' }],
      },
      links: {
        deleteMany: {},
        create: [
          {
            label: 'Cue reel placeholder',
            url: 'https://example.com/nocturne-cues',
          },
        ],
      },
    },
    create: {
      title: 'Nocturne Trailer Cues',
      slug: 'nocturne-trailer-cues',
      logline:
        'A compact cue pack for grounded genre shorts, proof-of-concepts, and teaser edits.',
      description:
        'A portfolio-facing cue collection built around suspense, restraint, and intimate character beats. The project links out to external audio references rather than storing media directly in Creative Network.',
      status: 'SEEKING_COLLABORATORS',
      language: 'Instrumental',
      location: 'Barcelona / Remote',
      ownerRole: 'Composer',
      ownerId: nico.id,
      members: {
        create: [{ userId: nico.id, role: 'Composer' }],
      },
      links: {
        create: [
          {
            label: 'Cue reel placeholder',
            url: 'https://example.com/nocturne-cues',
          },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: 'la-casa-del-ultimo-verano' },
    update: {
      title: 'La casa del último verano',
      logline:
        'Una miniserie dramática sobre tres hermanas que vuelven al pueblo familiar para decidir qué hacer con una casa cargada de memoria.',
      description:
        'Proyecto en fase de desarrollo para explorar reparto, tono visual y primeras lecturas de guion. Creative Network funciona aquí como punto de encuentro para notas de producción, referencias externas y búsqueda de perfiles creativos hispanohablantes.',
      status: 'DEVELOPMENT',
      language: 'Español',
      location: 'Madrid / Remoto',
      ownerRole: 'Guionista',
      ownerId: leah.id,
      members: {
        deleteMany: {},
        create: [
          { userId: leah.id, role: 'Guionista' },
          { userId: mara.id, role: 'Productora' },
        ],
      },
      links: {
        deleteMany: {},
        create: [
          {
            label: 'Biblia de serie mock',
            url: 'https://example.com/la-casa-del-ultimo-verano',
          },
        ],
      },
    },
    create: {
      title: 'La casa del último verano',
      slug: 'la-casa-del-ultimo-verano',
      logline:
        'Una miniserie dramática sobre tres hermanas que vuelven al pueblo familiar para decidir qué hacer con una casa cargada de memoria.',
      description:
        'Proyecto en fase de desarrollo para explorar reparto, tono visual y primeras lecturas de guion. Creative Network funciona aquí como punto de encuentro para notas de producción, referencias externas y búsqueda de perfiles creativos hispanohablantes.',
      status: 'DEVELOPMENT',
      language: 'Español',
      location: 'Madrid / Remoto',
      ownerRole: 'Guionista',
      ownerId: leah.id,
      members: {
        create: [
          { userId: leah.id, role: 'Guionista' },
          { userId: mara.id, role: 'Productora' },
        ],
      },
      links: {
        create: [
          {
            label: 'Biblia de serie mock',
            url: 'https://example.com/la-casa-del-ultimo-verano',
          },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: 'llum-de-fabrica' },
    update: {
      title: 'Llum de fàbrica',
      logline:
        'Un curt en català sobre una antiga nau industrial reconvertida en espai de creació i les tensions entre memòria, barri i futur.',
      description:
        'Peça curta pensada per provar llenguatge visual, música original i una petita comunitat de col·laboradors locals. El projecte utilitza enllaços externs per compartir moodboards, dossiers i referències sense pujar arxius a la plataforma.',
      status: 'SEEKING_COLLABORATORS',
      language: 'Català',
      location: 'Barcelona / Terrassa',
      ownerRole: 'Compositor',
      ownerId: nico.id,
      members: {
        deleteMany: {},
        create: [
          { userId: nico.id, role: 'Compositor' },
          { userId: mara.id, role: 'Producció' },
        ],
      },
      links: {
        deleteMany: {},
        create: [
          {
            label: 'Dossier visual mock',
            url: 'https://example.com/llum-de-fabrica',
          },
        ],
      },
    },
    create: {
      title: 'Llum de fàbrica',
      slug: 'llum-de-fabrica',
      logline:
        'Un curt en català sobre una antiga nau industrial reconvertida en espai de creació i les tensions entre memòria, barri i futur.',
      description:
        'Peça curta pensada per provar llenguatge visual, música original i una petita comunitat de col·laboradors locals. El projecte utilitza enllaços externs per compartir moodboards, dossiers i referències sense pujar arxius a la plataforma.',
      status: 'SEEKING_COLLABORATORS',
      language: 'Català',
      location: 'Barcelona / Terrassa',
      ownerRole: 'Compositor',
      ownerId: nico.id,
      members: {
        create: [
          { userId: nico.id, role: 'Compositor' },
          { userId: mara.id, role: 'Producció' },
        ],
      },
      links: {
        create: [
          {
            label: 'Dossier visual mock',
            url: 'https://example.com/llum-de-fabrica',
          },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: 'itsasargiaren-itzala' },
    update: {
      title: 'Itsasargiaren itzala',
      logline:
        'Euskarazko drama labur bat, kostaldeko herri batean desagertutako arrantzale baten oroitzapenak eta belaunaldi berrien isiltasunak gurutzatzen dituena.',
      description:
        'Garapen hasierako proiektua, idazketa-talde txiki batek urrunetik lantzeko pentsatua. Creative Networkek elkarrizketak, kanpoko erreferentziak eta lankidetza-seinaleak lotzen ditu, fitxategiak derrigorrez barruan gorde gabe.',
      status: 'DEVELOPMENT',
      language: 'Euskera',
      location: 'Donostia / Online',
      ownerRole: 'Casting director',
      ownerId: aisha.id,
      members: {
        deleteMany: {},
        create: [
          { userId: aisha.id, role: 'Casting' },
          { userId: leah.id, role: 'Script notes' },
        ],
      },
      links: {
        deleteMany: {},
        create: [
          {
            label: 'Erreferentzia mock',
            url: 'https://example.com/itsasargiaren-itzala',
          },
        ],
      },
    },
    create: {
      title: 'Itsasargiaren itzala',
      slug: 'itsasargiaren-itzala',
      logline:
        'Euskarazko drama labur bat, kostaldeko herri batean desagertutako arrantzale baten oroitzapenak eta belaunaldi berrien isiltasunak gurutzatzen dituena.',
      description:
        'Garapen hasierako proiektua, idazketa-talde txiki batek urrunetik lantzeko pentsatua. Creative Networkek elkarrizketak, kanpoko erreferentziak eta lankidetza-seinaleak lotzen ditu, fitxategiak derrigorrez barruan gorde gabe.',
      status: 'DEVELOPMENT',
      language: 'Euskera',
      location: 'Donostia / Online',
      ownerRole: 'Casting director',
      ownerId: aisha.id,
      members: {
        create: [
          { userId: aisha.id, role: 'Casting' },
          { userId: leah.id, role: 'Script notes' },
        ],
      },
      links: {
        create: [
          {
            label: 'Erreferentzia mock',
            url: 'https://example.com/itsasargiaren-itzala',
          },
        ],
      },
    },
  });

  console.log('Seeded demo users:');
  console.log('mara@creativenetwork.test / DemoPassword123');
  console.log('leah@creativenetwork.test / DemoPassword123');
  console.log('aisha@creativenetwork.test / DemoPassword123');
  console.log('nico@creativenetwork.test / DemoPassword123');
  console.log('Seeded demo social feed posts, comments, and likes.');
  console.log('Seeded demo network connections and requests.');
  console.log('Seeded demo messaging conversation and messages.');
  console.log('Seeded demo projects and portfolio links.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
