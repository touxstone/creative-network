import type { ProjectOwner } from '@/features/projects/types';

export interface CallProject {
  id: string;
  title: string;
  slug: string;
  language: string | null;
  location: string | null;
  ownerId: string;
  owner: ProjectOwner;
}

export interface ProjectCallSummary {
  id: string;
  title: string;
  role: string;
  discipline: string | null;
  description: string;
  language: string | null;
  location: string | null;
  status: string;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  project: CallProject;
  creator: ProjectOwner;
  applications: Array<{
    id: string;
    applicantId: string;
    status: string;
  }>;
}

export interface ProjectCallDetail extends ProjectCallSummary {
  applications: Array<{
    id: string;
    message: string;
    status: string;
    createdAt: Date;
    applicantId: string;
    applicant: ProjectOwner;
  }>;
}
