import type { ModuleStatus } from '@/core/modules/types';

export const demoSession = {
  user: {
    id: 'demo-user',
    name: 'Mara Soler',
    email: 'mara@creativenetwork.test',
    username: 'marasoler',
    profession: 'Producer',
    location: 'Madrid',
  },
};

export const stakeholderMetrics = [
  { label: 'Members', value: '128', trend: '+18 this week' },
  { label: 'Open projects', value: '24', trend: '6 hiring now' },
  { label: 'Introductions', value: '312', trend: '42 pending' },
];

export const featuredPeople = [
  {
    name: 'Leah Morgan',
    role: 'Screenwriter',
    location: 'London',
    focus: 'Drama pilots, pitch decks',
  },
  {
    name: 'Nico Reyes',
    role: 'Composer',
    location: 'Barcelona',
    focus: 'Indie features, trailers',
  },
  {
    name: 'Aisha Grant',
    role: 'Casting Director',
    location: 'Los Angeles',
    focus: 'Shortlists, talent discovery',
  },
];

export const moduleStatuses: ModuleStatus[] = [
  {
    key: 'core',
    name: 'CORE',
    status: 'showable',
    description: 'Authentication, profiles, dashboard, navigation, and design language.',
  },
  {
    key: 'social-feed',
    name: 'SOCIAL_FEED',
    status: 'showable',
    description: 'Posts, comments, likes, and a lounge timeline.',
  },
  {
    key: 'networking',
    name: 'NETWORKING',
    status: 'showable',
    description: 'Connections, requests, suggestions, and professional discovery.',
  },
  {
    key: 'messaging',
    name: 'MESSAGING',
    status: 'showable',
    description: 'Private persisted conversations between accepted contacts.',
  },
  {
    key: 'projects',
    name: 'PROJECTS',
    status: 'showable',
    description: 'Portfolio projects, external resources, and collaboration signals.',
  },
];
