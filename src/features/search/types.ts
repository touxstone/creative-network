export interface SearchProfile {
  id: string;
  name: string | null;
  username: string;
  profession: string | null;
  location: string | null;
  bio: string | null;
}

export interface SearchPost {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string;
    profession: string | null;
  };
}

export interface SearchProject {
  id: string;
  title: string;
  slug: string;
  logline: string | null;
  description: string;
  status: string;
  language: string | null;
  location: string | null;
  owner: {
    id: string;
    name: string | null;
    username: string;
    profession: string | null;
  };
}

export interface SearchCall {
  id: string;
  title: string;
  role: string;
  discipline: string | null;
  description: string;
  language: string | null;
  location: string | null;
  status: string;
  project: {
    title: string;
    slug: string;
  };
}

export interface SearchResults {
  profiles: SearchProfile[];
  posts: SearchPost[];
  projects: SearchProject[];
  calls: SearchCall[];
  total: number;
}
