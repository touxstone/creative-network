export const LANDING_LOCALES = ['en', 'es', 'ca', 'eu'] as const;

export type LandingLocale = (typeof LANDING_LOCALES)[number];

export const LOCALE_LABELS: Record<LandingLocale, string> = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
  eu: 'Euskara',
};

export function getLandingLocale(value: string | string[] | undefined): LandingLocale {
  const locale = Array.isArray(value) ? value[0] : value;

  if (LANDING_LOCALES.includes(locale as LandingLocale)) {
    return locale as LandingLocale;
  }

  return 'en';
}

export const landingCopy = {
  en: {
    navSignIn: 'Sign in',
    navCreate: 'Create profile',
    eyebrow: 'Professional network for film, media, and creative teams',
    title: 'Creative Network',
    intro:
      'Build a working creative circle: publish opportunities, discover collaborators, manage introductions, and keep project conversations moving.',
    create: 'Create profile',
    demo: 'Sign in to demo',
    demoAccount: 'Demo account: mara@creativenetwork.test',
    loungeTitle: 'Lounge',
    lounge:
      'A focused feed for opportunities, questions, updates, comments, and lightweight collaboration signals.',
    networkTitle: 'Network',
    network:
      'Discover professionals, send requests, accept introductions, and keep useful contacts visible.',
    profilesTitle: 'Project-ready profiles',
    profiles:
      'Profiles make craft, location, bio, and credits easier to scan before a conversation starts.',
    tryTitle: 'What stakeholders can try today',
    tryBody:
      'The authenticated demo already has persisted profiles, social activity, and networking requests.',
    networkingPreview: 'Networking preview',
    openWorkspace: 'Open workspace',
    knowledgeEyebrow: 'Open knowledge shelf',
    knowledgeTitle: 'Curated public resources for creative research',
    knowledgeBody:
      'A first signal of the platform’s editorial direction: specific external items for film, stage, voice, writing, and production teams, gathered with item-level rights review notes.',
    knowledgeRightsNote:
      'Creative Network links to the original source. Each item keeps its own rights, license, and jurisdiction notes.',
    specialtiesTitle: 'Specialties for the next polish slice',
    specialties:
      'Profile specialty now has guided suggestions while still allowing custom roles.',
    previewPosts: [
      {
        author: 'Leah Morgan',
        role: 'Screenwriter',
        body: 'Looking for a producer with festival short experience for a contained drama proof of concept.',
      },
      {
        author: 'Mara Soler',
        role: 'Producer',
        body: 'Packaging proof-of-concept shorts this month. Interested in grounded genre and strong performance beats.',
      },
    ],
    networkHighlights: [
      'Connection request lifecycle',
      'Accepted contacts',
      'Suggested professionals',
      'Profile-driven discovery',
    ],
  },
  es: {
    navSignIn: 'Entrar',
    navCreate: 'Crear perfil',
    eyebrow: 'Red profesional para cine, medios y equipos creativos',
    title: 'Creative Network',
    intro:
      'Construye un círculo creativo de trabajo: publica oportunidades, descubre colaboraciones, gestiona presentaciones y mantén vivos los proyectos.',
    create: 'Crear perfil',
    demo: 'Entrar a la demo',
    demoAccount: 'Cuenta demo: mara@creativenetwork.test',
    loungeTitle: 'Lounge',
    lounge:
      'Un feed centrado en oportunidades, preguntas, actualizaciones, comentarios y señales ligeras de colaboración.',
    networkTitle: 'Red',
    network:
      'Descubre profesionales, envía solicitudes, acepta presentaciones y mantén visibles los contactos útiles.',
    profilesTitle: 'Perfiles preparados para proyectos',
    profiles:
      'Los perfiles hacen más fácil leer oficio, ubicación, biografía y créditos antes de iniciar una conversación.',
    tryTitle: 'Qué pueden probar hoy los stakeholders',
    tryBody:
      'La demo autenticada ya incluye perfiles persistidos, actividad social y solicitudes de networking.',
    networkingPreview: 'Vista previa de red',
    openWorkspace: 'Abrir espacio de trabajo',
    knowledgeEyebrow: 'Open knowledge shelf',
    knowledgeTitle: 'Recursos públicos curados para investigación creativa',
    knowledgeBody:
      'Un primer indicio de la línea editorial de la plataforma: piezas externas concretas para cine, escena, voz, escritura y producción, reunidas con notas de revisión de derechos caso por caso.',
    knowledgeRightsNote:
      'Creative Network enlaza la fuente original. Cada recurso conserva sus propias notas de derechos, licencia y jurisdicción.',
    specialtiesTitle: 'Especialidades para el siguiente pulido',
    specialties:
      'La especialidad del perfil ya ofrece sugerencias guiadas y permite roles personalizados.',
    previewPosts: [
      {
        author: 'Leah Morgan',
        role: 'Guionista',
        body: 'Busco una productora con experiencia en cortos de festival para una prueba de concepto dramática y contenida.',
      },
      {
        author: 'Mara Soler',
        role: 'Productora',
        body: 'Estoy armando varios cortos de prueba de concepto este mes. Me interesan dirección de género realista e interpretación sólida.',
      },
    ],
    networkHighlights: [
      'Ciclo de solicitudes de conexión',
      'Contactos aceptados',
      'Sugerencias profesionales',
      'Descubrimiento desde perfiles',
    ],
  },
  ca: {
    navSignIn: 'Entra',
    navCreate: 'Crea perfil',
    eyebrow: 'Xarxa professional per a cinema, mitjans i equips creatius',
    title: 'Creative Network',
    intro:
      'Construeix un cercle creatiu de treball: publica oportunitats, descobreix col·laboracions, gestiona presentacions i mantén vius els projectes.',
    create: 'Crea perfil',
    demo: 'Entra a la demo',
    demoAccount: 'Compte demo: mara@creativenetwork.test',
    loungeTitle: 'Lounge',
    lounge:
      'Un feed centrat en oportunitats, preguntes, actualitzacions, comentaris i senyals lleugers de col·laboració.',
    networkTitle: 'Xarxa',
    network:
      'Descobreix professionals, envia sol·licituds, accepta presentacions i mantén visibles els contactes útils.',
    profilesTitle: 'Perfils preparats per a projectes',
    profiles:
      'Els perfils faciliten llegir ofici, ubicació, biografia i crèdits abans de començar una conversa.',
    tryTitle: 'Què poden provar avui els stakeholders',
    tryBody:
      'La demo autenticada ja inclou perfils persistits, activitat social i sol·licituds de networking.',
    networkingPreview: 'Vista prèvia de xarxa',
    openWorkspace: 'Obre l’espai de treball',
    knowledgeEyebrow: 'Open knowledge shelf',
    knowledgeTitle: 'Recursos públics curats per a recerca creativa',
    knowledgeBody:
      'Un primer senyal de la línia editorial de la plataforma: peces externes concretes per a cinema, escena, veu, escriptura i producció, reunides amb notes de revisió de drets cas per cas.',
    knowledgeRightsNote:
      'Creative Network enllaça la font original. Cada recurs conserva les seves pròpies notes de drets, llicència i jurisdicció.',
    specialtiesTitle: 'Especialitats per al següent poliment',
    specialties:
      'L’especialitat del perfil ja ofereix suggeriments guiats i permet rols personalitzats.',
    previewPosts: [
      {
        author: 'Leah Morgan',
        role: 'Guionista',
        body: 'Busco una productora amb experiència en curts de festival per a una prova de concepte dramàtica i continguda.',
      },
      {
        author: 'Mara Soler',
        role: 'Productora',
        body: 'Estic empaquetant diversos curts de prova de concepte aquest mes. M’interessen direcció de gènere realista i interpretació sòlida.',
      },
    ],
    networkHighlights: [
      'Cicle de sol·licituds de connexió',
      'Contactes acceptats',
      'Suggeriments professionals',
      'Descobriment des dels perfils',
    ],
  },
  eu: {
    navSignIn: 'Sartu',
    navCreate: 'Sortu profila',
    eyebrow: 'Zinema, hedabide eta sormen taldeentzako sare profesionala',
    title: 'Creative Network',
    intro:
      'Eraiki lanerako sormen zirkulu bat: argitaratu aukerak, aurkitu lankideak, kudeatu aurkezpenak eta mantendu proiektuak martxan.',
    create: 'Sortu profila',
    demo: 'Sartu demoan',
    demoAccount: 'Demo kontua: mara@creativenetwork.test',
    loungeTitle: 'Lounge',
    lounge:
      'Aukerak, galderak, eguneraketak, iruzkinak eta lankidetza seinale arinak biltzeko feed fokuratua.',
    networkTitle: 'Sarea',
    network:
      'Ezagutu profesionalak, bidali eskaerak, onartu aurkezpenak eta mantendu kontaktu erabilgarriak ikusgai.',
    profilesTitle: 'Proiektuetarako prest dauden profilak',
    profiles:
      'Profilek errazago erakusten dute lanbidea, kokapena, biografia eta kredituak elkarrizketa hasi aurretik.',
    tryTitle: 'Stakeholderrek gaur probatu dezaketena',
    tryBody:
      'Autentifikatutako demoak profil iraunkorrak, jarduera soziala eta networking eskaerak ditu dagoeneko.',
    networkingPreview: 'Sarearen aurrebista',
    openWorkspace: 'Ireki lan-eremua',
    knowledgeEyebrow: 'Open knowledge shelf',
    knowledgeTitle: 'Sormen ikerketarako baliabide publiko hautatuak',
    knowledgeBody:
      'Plataformaren norabide editorialaren lehen seinalea: zinema, eszena, ahotsa, idazketa eta ekoizpen taldeentzako kanpoko pieza zehatzak, eskubideen kasuz kasuko berrikuspen-oharrekin.',
    knowledgeRightsNote:
      'Creative Networkek jatorrizko iturrira estekatzen du. Baliabide bakoitzak bere eskubide, lizentzia eta jurisdikzio oharrak mantentzen ditu.',
    specialtiesTitle: 'Hurrengo fintzerako espezialitateak',
    specialties:
      'Profil espezialitateak iradokizun gidatuak ditu eta rol pertsonalizatuak ere onartzen ditu.',
    previewPosts: [
      {
        author: 'Leah Morgan',
        role: 'Gidoilaria',
        body: 'Jaialdietako film laburretan esperientzia duen ekoizle bat bilatzen dut drama kontzeptu-proba trinko baterako.',
      },
      {
        author: 'Mara Soler',
        role: 'Ekoizlea',
        body: 'Hilabete honetan kontzeptu-proba labur batzuk prestatzen ari naiz. Genero errealista eta interpretazio sendoa interesatzen zaizkit.',
      },
    ],
    networkHighlights: [
      'Konexio eskaeren zikloa',
      'Onartutako kontaktuak',
      'Profesionalen iradokizunak',
      'Profilen bidezko aurkikuntza',
    ],
  },
} satisfies Record<
  LandingLocale,
  {
    navSignIn: string;
    navCreate: string;
    eyebrow: string;
    title: string;
    intro: string;
    create: string;
    demo: string;
    demoAccount: string;
    loungeTitle: string;
    lounge: string;
    networkTitle: string;
    network: string;
    profilesTitle: string;
    profiles: string;
    tryTitle: string;
    tryBody: string;
    networkingPreview: string;
    openWorkspace: string;
    knowledgeEyebrow: string;
    knowledgeTitle: string;
    knowledgeBody: string;
    knowledgeRightsNote: string;
    specialtiesTitle: string;
    specialties: string;
    previewPosts: Array<{ author: string; role: string; body: string }>;
    networkHighlights: string[];
  }
>;
