import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import type { ProjectCallDetail, ProjectCallSummary } from './types';

const userSelect = {
  id: true,
  name: true,
  username: true,
  profession: true,
  location: true,
};

const callInclude = {
  project: {
    select: {
      id: true,
      title: true,
      slug: true,
      language: true,
      location: true,
      ownerId: true,
      owner: { select: userSelect },
    },
  },
  creator: { select: userSelect },
  applications: {
    select: {
      id: true,
      applicantId: true,
      status: true,
    },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ProjectCallInclude;

const callDetailInclude = {
  ...callInclude,
  applications: {
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      applicantId: true,
      applicant: { select: userSelect },
    },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ProjectCallInclude;

export async function getProjectCalls(): Promise<ProjectCallSummary[]> {
  return prisma.projectCall.findMany({
    include: callInclude,
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 40,
  });
}

export async function getProjectCallById(id: string): Promise<ProjectCallDetail | null> {
  return prisma.projectCall.findUnique({
    where: { id },
    include: callDetailInclude,
  });
}
