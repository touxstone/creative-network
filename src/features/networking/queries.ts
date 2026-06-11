import { prisma } from '@/lib/db/prisma';
import type { NetworkOverview, NetworkUser } from './types';

const userSelect = {
  id: true,
  name: true,
  username: true,
  profession: true,
  location: true,
  bio: true,
} satisfies Record<keyof NetworkUser, true>;

export async function getNetworkOverview(userId: string): Promise<NetworkOverview> {
  const [connections, receivedRequests, sentRequests, existingConnections] = await Promise.all([
    prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: { select: userSelect },
        userB: { select: userSelect },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.connection.findMany({
      where: {
        status: 'PENDING',
        userBId: userId,
      },
      include: {
        userA: { select: userSelect },
        userB: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.connection.findMany({
      where: {
        status: 'PENDING',
        userAId: userId,
      },
      include: {
        userA: { select: userSelect },
        userB: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.connection.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: {
        userAId: true,
        userBId: true,
      },
    }),
  ]);

  const excludedUserIds = new Set<string>([userId]);

  for (const connection of existingConnections) {
    excludedUserIds.add(connection.userAId);
    excludedUserIds.add(connection.userBId);
  }

  const suggestions = await prisma.user.findMany({
    where: {
      id: {
        notIn: Array.from(excludedUserIds),
      },
    },
    select: userSelect,
    orderBy: [{ profession: 'asc' }, { name: 'asc' }],
    take: 12,
  });

  return {
    suggestions,
    connections,
    receivedRequests,
    sentRequests,
    stats: {
      connections: connections.length,
      receivedRequests: receivedRequests.length,
      sentRequests: sentRequests.length,
      suggestions: suggestions.length,
    },
  };
}
