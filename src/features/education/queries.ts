import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import type {
  LearningCatalogItem,
  LearningDetail,
  LearningFilterOptions,
  LearningFilters,
} from './types';

function buildLearningWhere(filters: LearningFilters): Prisma.LearningItemWhereInput {
  const query = filters.q?.trim();

  return {
    status: 'PUBLISHED',
    language: filters.language ? { equals: filters.language } : undefined,
    level: filters.level ? { equals: filters.level } : undefined,
    discipline: filters.discipline ? { equals: filters.discipline } : undefined,
    OR: query
      ? [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { discipline: { contains: query, mode: 'insensitive' } },
          { instructorName: { contains: query, mode: 'insensitive' } },
          { language: { contains: query, mode: 'insensitive' } },
        ]
      : undefined,
  };
}

function withViewerBookmark<T extends { bookmarks: Array<{ userId: string }> }>(
  item: T,
  viewerId: string,
) {
  return {
    ...item,
    isBookmarkedByViewer: item.bookmarks.some((bookmark) => bookmark.userId === viewerId),
  };
}

export async function getLearningCatalog(
  viewerId: string,
  filters: LearningFilters,
): Promise<LearningCatalogItem[]> {
  const items = await prisma.learningItem.findMany({
    where: buildLearningWhere(filters),
    include: {
      bookmarks: {
        where: { userId: viewerId },
        select: {
          id: true,
          userId: true,
        },
      },
      _count: {
        select: {
          bookmarks: true,
        },
      },
    },
    orderBy: [{ startsAt: 'asc' }, { createdAt: 'desc' }],
  });

  return items.map((item) => withViewerBookmark(item, viewerId));
}

export async function getLearningItemBySlug(
  slug: string,
  viewerId: string,
): Promise<LearningDetail | null> {
  const item = await prisma.learningItem.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      bookmarks: {
        where: { userId: viewerId },
        select: {
          id: true,
          userId: true,
        },
      },
      _count: {
        select: {
          bookmarks: true,
        },
      },
    },
  });

  return item ? withViewerBookmark(item, viewerId) : null;
}

export async function getLearningFilterOptions(): Promise<LearningFilterOptions> {
  const items = await prisma.learningItem.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      language: true,
      level: true,
      discipline: true,
    },
    orderBy: [{ language: 'asc' }, { level: 'asc' }, { discipline: 'asc' }],
  });

  return {
    languages: Array.from(new Set(items.map((item) => item.language))).sort(),
    levels: Array.from(new Set(items.map((item) => item.level))).sort(),
    disciplines: Array.from(new Set(items.map((item) => item.discipline))).sort(),
  };
}
