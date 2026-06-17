import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@prisma/client';
import type { ProjectDetail, ProjectSummary } from './types';

const ownerSelect = {
  id: true,
  name: true,
  username: true,
  profession: true,
  location: true,
};

const projectInclude = {
  owner: { select: ownerSelect },
  links: {
    select: {
      id: true,
      label: true,
      url: true,
    },
    orderBy: { createdAt: 'asc' },
  },
  members: {
    select: {
      id: true,
      role: true,
      user: { select: ownerSelect },
    },
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.ProjectInclude;

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  return prisma.project.findMany({
    include: projectInclude,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    take: 24,
  });
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  return prisma.project.findUnique({
    where: { slug },
    include: projectInclude,
  });
}

export async function getProjectsForUser(userId: string): Promise<ProjectSummary[]> {
  return prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: projectInclude,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    take: 12,
  });
}
