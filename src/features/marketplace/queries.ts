import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import type { MarketplaceFilters, ServiceListingDetail, ServiceListingSummary } from './types';

const marketplaceUserSelect = {
  id: true,
  name: true,
  username: true,
  profession: true,
  location: true,
};

function buildMarketplaceWhere(filters: MarketplaceFilters): Prisma.ServiceListingWhereInput {
  const query = filters.q?.trim();

  return {
    status: 'ACTIVE',
    category: filters.category ? { equals: filters.category } : undefined,
    OR: query
      ? [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { language: { contains: query, mode: 'insensitive' } },
          { owner: { name: { contains: query, mode: 'insensitive' } } },
          { owner: { username: { contains: query, mode: 'insensitive' } } },
        ]
      : undefined,
  };
}

export async function getServiceListings(
  filters: MarketplaceFilters,
): Promise<ServiceListingSummary[]> {
  return prisma.serviceListing.findMany({
    where: buildMarketplaceWhere(filters),
    include: {
      owner: { select: marketplaceUserSelect },
      _count: {
        select: { inquiries: true },
      },
    },
    orderBy: [{ createdAt: 'desc' }],
    take: 50,
  });
}

export async function getMyServiceListings(userId: string): Promise<ServiceListingSummary[]> {
  return prisma.serviceListing.findMany({
    where: { ownerId: userId },
    include: {
      owner: { select: marketplaceUserSelect },
      _count: {
        select: { inquiries: true },
      },
    },
    orderBy: [{ updatedAt: 'desc' }],
  });
}

export async function getServiceListingBySlug(slug: string): Promise<ServiceListingDetail | null> {
  return prisma.serviceListing.findUnique({
    where: { slug },
    include: {
      owner: { select: marketplaceUserSelect },
      inquiries: {
        include: {
          sender: { select: marketplaceUserSelect },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { inquiries: true },
      },
    },
  });
}
