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
      pinnedColor: 'teal',
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
          {
            label: 'Tone references',
            url: 'https://example.com/contained-drama-tone',
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
          {
            label: 'Tone references',
            url: 'https://example.com/contained-drama-tone',
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
          {
            label: 'Moodboard mock',
            url: 'https://example.com/la-casa-moodboard',
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
          {
            label: 'Moodboard mock',
            url: 'https://example.com/la-casa-moodboard',
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

  const demoProjects = await prisma.project.findMany({
    where: {
      slug: {
        in: ['la-casa-del-ultimo-verano', 'llum-de-fabrica', 'itsasargiaren-itzala'],
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });
  const projectsBySlug = new Map(demoProjects.map((project) => [project.slug, project]));
  const casaProject = projectsBySlug.get('la-casa-del-ultimo-verano');
  const llumProject = projectsBySlug.get('llum-de-fabrica');
  const itsasargiaProject = projectsBySlug.get('itsasargiaren-itzala');

  if (!casaProject || !llumProject || !itsasargiaProject) {
    throw new Error('Demo projects were not seeded before project calls.');
  }

  await prisma.projectCall.upsert({
    where: { id: 'demo-call-casa-lead-performer' },
    update: {
      projectId: casaProject.id,
      creatorId: leah.id,
      title: 'Buscamos actriz protagonista para teaser dramático',
      role: 'Actriz protagonista',
      discipline: 'Casting',
      description:
        'Buscamos una intérprete para una prueba de tono de dos escenas. Interesa una presencia contenida, naturalista, con disponibilidad para lectura remota y una jornada de ensayo en Madrid.',
      language: 'Español',
      location: 'Madrid / Remoto',
      status: 'OPEN',
    },
    create: {
      id: 'demo-call-casa-lead-performer',
      projectId: casaProject.id,
      creatorId: leah.id,
      title: 'Buscamos actriz protagonista para teaser dramático',
      role: 'Actriz protagonista',
      discipline: 'Casting',
      description:
        'Buscamos una intérprete para una prueba de tono de dos escenas. Interesa una presencia contenida, naturalista, con disponibilidad para lectura remota y una jornada de ensayo en Madrid.',
      language: 'Español',
      location: 'Madrid / Remoto',
      status: 'OPEN',
    },
  });

  await prisma.projectCall.upsert({
    where: { id: 'demo-call-llum-director-foto' },
    update: {
      projectId: llumProject.id,
      creatorId: nico.id,
      title: 'Cerquem direcció de fotografia per curt en català',
      role: 'Direcció de fotografia',
      discipline: 'Camera / Visual style',
      description:
        'Busquem una mirada visual per treballar llum industrial, textures de barri i espais reconvertits. El primer pas seria revisar moodboards externs i preparar una prova curta.',
      language: 'Català',
      location: 'Barcelona / Terrassa',
      status: 'OPEN',
    },
    create: {
      id: 'demo-call-llum-director-foto',
      projectId: llumProject.id,
      creatorId: nico.id,
      title: 'Cerquem direcció de fotografia per curt en català',
      role: 'Direcció de fotografia',
      discipline: 'Camera / Visual style',
      description:
        'Busquem una mirada visual per treballar llum industrial, textures de barri i espais reconvertits. El primer pas seria revisar moodboards externs i preparar una prova curta.',
      language: 'Català',
      location: 'Barcelona / Terrassa',
      status: 'OPEN',
    },
  });

  await prisma.projectCall.upsert({
    where: { id: 'demo-call-itsasargia-script-polish' },
    update: {
      projectId: itsasargiaProject.id,
      creatorId: aisha.id,
      title: 'Euskarazko gidoi-oharrak eta elkarrizketa polish',
      role: 'Script consultant',
      discipline: 'Writing',
      description:
        'Idazketa-talde txiki bat osatzeko deialdia: elkarrizketen naturaltasuna, isiltasunaren erritmoa eta kostaldeko herri baten tonu emozionala landu nahi dira.',
      language: 'Euskera',
      location: 'Donostia / Online',
      status: 'OPEN',
    },
    create: {
      id: 'demo-call-itsasargia-script-polish',
      projectId: itsasargiaProject.id,
      creatorId: aisha.id,
      title: 'Euskarazko gidoi-oharrak eta elkarrizketa polish',
      role: 'Script consultant',
      discipline: 'Writing',
      description:
        'Idazketa-talde txiki bat osatzeko deialdia: elkarrizketen naturaltasuna, isiltasunaren erritmoa eta kostaldeko herri baten tonu emozionala landu nahi dira.',
      language: 'Euskera',
      location: 'Donostia / Online',
      status: 'OPEN',
    },
  });

  await prisma.projectApplication.upsert({
    where: {
      callId_applicantId: {
        callId: 'demo-call-casa-lead-performer',
        applicantId: aisha.id,
      },
    },
    update: {
      message:
        'Puedo ayudar a perfilar el casting y preparar una shortlist inicial con perfiles naturales para lectura remota.',
      status: 'SUBMITTED',
    },
    create: {
      callId: 'demo-call-casa-lead-performer',
      applicantId: aisha.id,
      message:
        'Puedo ayudar a perfilar el casting y preparar una shortlist inicial con perfiles naturales para lectura remota.',
      status: 'SUBMITTED',
    },
  });

  const learningItems = [
    {
      id: 'demo-learning-writers-room-remote',
      slug: 'remote-writers-room-for-proof-of-concepts',
      title: 'Remote writers room for proof-of-concepts',
      summary:
        'A practical workshop for structuring script notes, revision roles, and async feedback without losing authorship.',
      description:
        'Designed for small writing teams preparing short films, pitch pilots, or proof-of-concept scenes. The session covers room agreements, ownership of notes, version discipline, feedback rituals, and how to turn remote discussion into an actionable rewrite plan.',
      format: 'Workshop',
      discipline: 'Writing',
      language: 'English',
      level: 'Intermediate',
      durationMinutes: 90,
      instructorName: 'Leah Morgan',
      instructorRole: 'Screenwriter',
      provider: 'Creative Network Editorial',
      startsAt: new Date('2026-07-08T17:00:00.000Z'),
      externalUrl: 'https://example.com/education/remote-writers-room',
      status: 'PUBLISHED',
    },
    {
      id: 'demo-learning-casting-self-tape',
      slug: 'casting-self-tape-notes-for-independent-productions',
      title: 'Casting and self-tape notes for independent productions',
      summary:
        'How to write clear performer briefs, compare tapes fairly, and keep casting feedback useful for a small project.',
      description:
        'A focused class for directors, casting collaborators, and producers who need a repeatable self-tape process. It covers role briefs, language around performance notes, shortlist criteria, consent around materials, and a compact review workflow.',
      format: 'Class',
      discipline: 'Casting',
      language: 'English',
      level: 'Beginner',
      durationMinutes: 75,
      instructorName: 'Aisha Grant',
      instructorRole: 'Casting Director',
      provider: 'Creative Network Editorial',
      startsAt: new Date('2026-07-10T18:30:00.000Z'),
      externalUrl: 'https://example.com/education/casting-self-tape',
      status: 'PUBLISHED',
    },
    {
      id: 'demo-learning-pitch-package-es',
      slug: 'paquete-de-pitch-para-series-y-cortos',
      title: 'Paquete de pitch para series y cortos',
      summary:
        'Sesión en español sobre logline, dossier, referencias visuales y señales mínimas para presentar un proyecto.',
      description:
        'Pensada para equipos en fase de desarrollo que necesitan ordenar una primera presentación sin sobredimensionar materiales. Se trabaja cómo explicar tono, formato, audiencia, estado del proyecto, necesidades de equipo y próximos pasos de producción.',
      format: 'Webinar',
      discipline: 'Development',
      language: 'Español',
      level: 'Beginner',
      durationMinutes: 60,
      instructorName: 'Mara Soler',
      instructorRole: 'Producer',
      provider: 'Creative Network Editorial',
      startsAt: new Date('2026-07-15T16:00:00.000Z'),
      externalUrl: 'https://example.com/education/paquete-pitch',
      status: 'PUBLISHED',
    },
    {
      id: 'demo-learning-collaboracio-cat',
      slug: 'collaboracio-creativa-en-catala',
      title: 'Col·laboració creativa en català',
      summary:
        'Una trobada per preparar projectes locals amb equips petits, referències externes i rols ben definits.',
      description:
        'Sessió introductòria per a creadors que volen coordinar curtmetratges, peces musicals o dossiers visuals en català. Es revisen rols, ritme de reunions, recursos compartits, presentació del projecte i bones pràctiques per evitar confusió en equips distribuïts.',
      format: 'Roundtable',
      discipline: 'Collaboration',
      language: 'Català',
      level: 'Beginner',
      durationMinutes: 70,
      instructorName: 'Nico Reyes',
      instructorRole: 'Composer',
      provider: 'Creative Network Editorial',
      startsAt: new Date('2026-07-18T10:00:00.000Z'),
      externalUrl: 'https://example.com/education/collaboracio-catala',
      status: 'PUBLISHED',
    },
    {
      id: 'demo-learning-gidoi-oharrak-eu',
      slug: 'gidoi-oharrak-eta-elkarrizketa-polish',
      title: 'Gidoi-oharrak eta elkarrizketa polish',
      summary:
        'Euskarazko saio praktikoa elkarrizketak fintzeko, tonuari eusteko eta talde-oharrak antolatzeko.',
      description:
        'Idazketa-talde txikientzat pentsatutako preview saioa. Elkarrizketen naturaltasuna, pertsonaien ahotsa, isiluneen erritmoa eta berridazketa-oharren kudeaketa lantzen dira, urruneko lan-fluxu erraz batekin.',
      format: 'Workshop',
      discipline: 'Writing',
      language: 'Euskera',
      level: 'Intermediate',
      durationMinutes: 80,
      instructorName: 'Aisha Grant',
      instructorRole: 'Casting Director / Script notes',
      provider: 'Creative Network Editorial',
      startsAt: new Date('2026-07-22T17:00:00.000Z'),
      externalUrl: 'https://example.com/education/gidoi-oharrak',
      status: 'PUBLISHED',
    },
    {
      id: 'demo-learning-composer-cues',
      slug: 'composer-cues-for-trailers-and-proof-of-concepts',
      title: 'Composer cues for trailers and proof-of-concepts',
      summary:
        'A compact session on spotting, references, cue naming, and handoff expectations for early-stage audiovisual teams.',
      description:
        'For composers, editors, and producers collaborating before a final cut exists. The class explains how to discuss emotion, pacing, references, temporary tracks, deliverables, and credit expectations when a project is still exploratory.',
      format: 'Class',
      discipline: 'Music',
      language: 'English',
      level: 'Intermediate',
      durationMinutes: 65,
      instructorName: 'Nico Reyes',
      instructorRole: 'Composer',
      provider: 'Creative Network Editorial',
      startsAt: new Date('2026-07-25T15:30:00.000Z'),
      externalUrl: 'https://example.com/education/composer-cues',
      status: 'PUBLISHED',
    },
  ];

  for (const item of learningItems) {
    const { id, ...itemData } = item;

    await prisma.learningItem.upsert({
      where: { slug: item.slug },
      update: itemData,
      create: item,
    });
  }

  await prisma.learningBookmark.upsert({
    where: {
      itemId_userId: {
        itemId: 'demo-learning-writers-room-remote',
        userId: mara.id,
      },
    },
    update: {},
    create: {
      itemId: 'demo-learning-writers-room-remote',
      userId: mara.id,
      note: 'Useful for the contained drama remote rewrite process.',
    },
  });

  await prisma.learningBookmark.upsert({
    where: {
      itemId_userId: {
        itemId: 'demo-learning-pitch-package-es',
        userId: leah.id,
      },
    },
    update: {},
    create: {
      itemId: 'demo-learning-pitch-package-es',
      userId: leah.id,
      note: 'Good fit for Spanish-language pitch materials.',
    },
  });

  await prisma.serviceListing.upsert({
    where: { slug: 'script-notes-for-contained-drama-leahmorgan' },
    update: {
      ownerId: leah.id,
      title: 'Script notes for contained drama',
      summary:
        'Focused notes for short scripts, proof-of-concept scenes, and lean drama pilots.',
      description:
        'I review short scripts and early pitch pilots with attention to structure, character pressure, scene economy, and production feasibility. Useful for teams preparing a proof-of-concept, a table read, or a compact rewrite plan.',
      category: 'Script notes',
      language: 'English / Español',
      deliveryMode: 'REMOTE',
      rateNote: 'Preview call free; quote after brief.',
      availability: 'Two review slots per month.',
      status: 'ACTIVE',
    },
    create: {
      id: 'script-notes-for-contained-drama-leahmorgan',
      slug: 'script-notes-for-contained-drama-leahmorgan',
      ownerId: leah.id,
      title: 'Script notes for contained drama',
      summary:
        'Focused notes for short scripts, proof-of-concept scenes, and lean drama pilots.',
      description:
        'I review short scripts and early pitch pilots with attention to structure, character pressure, scene economy, and production feasibility. Useful for teams preparing a proof-of-concept, a table read, or a compact rewrite plan.',
      category: 'Script notes',
      language: 'English / Español',
      deliveryMode: 'REMOTE',
      rateNote: 'Preview call free; quote after brief.',
      availability: 'Two review slots per month.',
      status: 'ACTIVE',
    },
  });

  await prisma.serviceListing.upsert({
    where: { slug: 'casting-shortlist-and-self-tape-brief-aishagrant' },
    update: {
      ownerId: aisha.id,
      title: 'Casting shortlist and self-tape brief',
      summary:
        'Role briefs, shortlist logic, and self-tape notes for indie productions and teasers.',
      description:
        'I help teams turn a role into a clear performer brief, define shortlist criteria, and prepare self-tape instructions that respect the performer while making review easier for directors and producers.',
      category: 'Casting',
      language: 'English',
      deliveryMode: 'HYBRID',
      rateNote: 'Scoped per role or small slate.',
      availability: 'Remote review, Los Angeles sessions by arrangement.',
      status: 'ACTIVE',
    },
    create: {
      id: 'casting-shortlist-and-self-tape-brief-aishagrant',
      slug: 'casting-shortlist-and-self-tape-brief-aishagrant',
      ownerId: aisha.id,
      title: 'Casting shortlist and self-tape brief',
      summary:
        'Role briefs, shortlist logic, and self-tape notes for indie productions and teasers.',
      description:
        'I help teams turn a role into a clear performer brief, define shortlist criteria, and prepare self-tape instructions that respect the performer while making review easier for directors and producers.',
      category: 'Casting',
      language: 'English',
      deliveryMode: 'HYBRID',
      rateNote: 'Scoped per role or small slate.',
      availability: 'Remote review, Los Angeles sessions by arrangement.',
      status: 'ACTIVE',
    },
  });

  await prisma.serviceListing.upsert({
    where: { slug: 'composer-cues-for-proof-of-concepts-nicoreyes' },
    update: {
      ownerId: nico.id,
      title: 'Composer cues for proof-of-concepts',
      summary:
        'Small cue packs, tone sketches, and trailer-like music references for early edits.',
      description:
        'I create compact music sketches for teasers, short films, and proof-of-concept edits. Best for teams that need emotional direction, pacing references, and a practical conversation between composer, editor, and producer.',
      category: 'Music',
      language: 'Instrumental / Català / Español',
      deliveryMode: 'REMOTE',
      rateNote: 'Quote depends on cue count and usage.',
      availability: 'Available for July remote collaborations.',
      status: 'ACTIVE',
    },
    create: {
      id: 'composer-cues-for-proof-of-concepts-nicoreyes',
      slug: 'composer-cues-for-proof-of-concepts-nicoreyes',
      ownerId: nico.id,
      title: 'Composer cues for proof-of-concepts',
      summary:
        'Small cue packs, tone sketches, and trailer-like music references for early edits.',
      description:
        'I create compact music sketches for teasers, short films, and proof-of-concept edits. Best for teams that need emotional direction, pacing references, and a practical conversation between composer, editor, and producer.',
      category: 'Music',
      language: 'Instrumental / Català / Español',
      deliveryMode: 'REMOTE',
      rateNote: 'Quote depends on cue count and usage.',
      availability: 'Available for July remote collaborations.',
      status: 'ACTIVE',
    },
  });

  await prisma.serviceListing.upsert({
    where: { slug: 'producer-packaging-for-short-form-projects-marasoler' },
    update: {
      ownerId: mara.id,
      title: 'Producer packaging for short-form projects',
      summary:
        'Practical packaging notes for proof-of-concept shorts, decks, teams, and next steps.',
      description:
        'I help creative teams clarify what a short-form proof-of-concept needs before outreach: logline, comparable references, collaborator roles, small-budget assumptions, and a lightweight next-step plan.',
      category: 'Production',
      language: 'Español / English',
      deliveryMode: 'REMOTE',
      rateNote: 'Initial scoping conversation free.',
      availability: 'Limited availability around festival deadlines.',
      status: 'ACTIVE',
    },
    create: {
      id: 'producer-packaging-for-short-form-projects-marasoler',
      slug: 'producer-packaging-for-short-form-projects-marasoler',
      ownerId: mara.id,
      title: 'Producer packaging for short-form projects',
      summary:
        'Practical packaging notes for proof-of-concept shorts, decks, teams, and next steps.',
      description:
        'I help creative teams clarify what a short-form proof-of-concept needs before outreach: logline, comparable references, collaborator roles, small-budget assumptions, and a lightweight next-step plan.',
      category: 'Production',
      language: 'Español / English',
      deliveryMode: 'REMOTE',
      rateNote: 'Initial scoping conversation free.',
      availability: 'Limited availability around festival deadlines.',
      status: 'ACTIVE',
    },
  });

  await prisma.serviceInquiry.upsert({
    where: { id: 'demo-inquiry-mara-to-leah-script-notes' },
    update: {
      listingId: 'script-notes-for-contained-drama-leahmorgan',
      senderId: mara.id,
      recipientId: leah.id,
      message:
        'I would like notes on whether the contained drama proof-of-concept is clear enough for a producer read and a small table session.',
      status: 'NEW',
    },
    create: {
      id: 'demo-inquiry-mara-to-leah-script-notes',
      listingId: 'script-notes-for-contained-drama-leahmorgan',
      senderId: mara.id,
      recipientId: leah.id,
      message:
        'I would like notes on whether the contained drama proof-of-concept is clear enough for a producer read and a small table session.',
      status: 'NEW',
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
  console.log('Seeded demo project calls and applications.');
  console.log('Seeded demo education preview items and bookmarks.');
  console.log('Seeded demo marketplace services and inquiries.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
