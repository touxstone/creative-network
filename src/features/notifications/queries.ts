import { prisma } from '@/lib/db/prisma';
import type { NotificationItem } from './types';

const actorSelect = {
  id: true,
  name: true,
  username: true,
  profession: true,
};

export async function getNotificationsForUser(userId: string): Promise<NotificationItem[]> {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      actor: {
        select: actorSelect,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 60,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({
    where: {
      recipientId: userId,
      readAt: null,
    },
  });
}
