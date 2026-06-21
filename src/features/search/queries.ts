import { prisma } from '@/lib/db/prisma';
import type { SearchResults } from './types';

const MIN_QUERY_LENGTH = 2;

function normalizeQuery(query: string) {
  return query.trim().slice(0, 80);
}

function containsQuery(query: string) {
  return {
    contains: query,
    mode: 'insensitive' as const,
  };
}

export async function searchWorkspace(rawQuery: string): Promise<SearchResults> {
  const query = normalizeQuery(rawQuery);

  if (query.length < MIN_QUERY_LENGTH) {
    return {
      profiles: [],
      posts: [],
      projects: [],
      calls: [],
      total: 0,
    };
  }

  const [profiles, posts, projects, calls] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: containsQuery(query) },
          { username: containsQuery(query) },
          { profession: containsQuery(query) },
          { location: containsQuery(query) },
          { bio: containsQuery(query) },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        profession: true,
        location: true,
        bio: true,
      },
      orderBy: [{ profession: 'asc' }, { name: 'asc' }],
      take: 8,
    }),
    prisma.post.findMany({
      where: {
        content: containsQuery(query),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profession: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { title: containsQuery(query) },
          { logline: containsQuery(query) },
          { description: containsQuery(query) },
          { language: containsQuery(query) },
          { location: containsQuery(query) },
          { ownerRole: containsQuery(query) },
          { owner: { name: containsQuery(query) } },
          { owner: { username: containsQuery(query) } },
          { members: { some: { role: containsQuery(query) } } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        logline: true,
        description: true,
        status: true,
        language: true,
        location: true,
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            profession: true,
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: 8,
    }),
    prisma.projectCall.findMany({
      where: {
        OR: [
          { title: containsQuery(query) },
          { role: containsQuery(query) },
          { discipline: containsQuery(query) },
          { description: containsQuery(query) },
          { language: containsQuery(query) },
          { location: containsQuery(query) },
          { project: { title: containsQuery(query) } },
        ],
      },
      select: {
        id: true,
        title: true,
        role: true,
        discipline: true,
        description: true,
        language: true,
        location: true,
        status: true,
        project: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: 8,
    }),
  ]);

  return {
    profiles,
    posts,
    projects,
    calls,
    total: profiles.length + posts.length + projects.length + calls.length,
  };
}
