export interface ProjectOwner {
  id: string;
  name: string | null;
  username: string;
  profession: string | null;
  location: string | null;
}

export interface ProjectLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface ProjectMemberItem {
  id: string;
  role: string;
  user: ProjectOwner;
}

export interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  logline: string | null;
  description: string;
  status: string;
  language: string | null;
  location: string | null;
  ownerRole: string | null;
  createdAt: Date;
  updatedAt: Date;
  owner: ProjectOwner;
  links: ProjectLinkItem[];
  members: ProjectMemberItem[];
}

export interface ProjectDetail extends ProjectSummary {}
