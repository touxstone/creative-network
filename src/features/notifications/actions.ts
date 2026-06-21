'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';
import type { NotificationType } from './constants';

const notificationIdSchema = z.object({
  notificationId: z.string().min(1),
});

interface CreateNotificationInput {
  recipientId: string;
  actorId?: string | null;
  type: NotificationType;
  title: string;
  body?: string | null;
  href?: string | null;
  dedupeKey?: string | null;
}

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

export async function createNotification(input: CreateNotificationInput) {
  if (input.actorId && input.actorId === input.recipientId) {
    return;
  }

  try {
    const data = {
      recipientId: input.recipientId,
      actorId: input.actorId ?? null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      href: input.href ?? null,
      dedupeKey: input.dedupeKey ?? null,
      readAt: null,
    };

    if (input.dedupeKey) {
      await prisma.notification.upsert({
        where: { dedupeKey: input.dedupeKey },
        create: data,
        update: {
          title: input.title,
          body: input.body ?? null,
          href: input.href ?? null,
          readAt: null,
          createdAt: new Date(),
        },
      });
    } else {
      await prisma.notification.create({ data });
    }

    revalidatePath('/notifications');
  } catch {
    return;
  }
}

export async function markNotificationReadAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = notificationIdSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/notifications?error=read');
  }

  await prisma.notification.updateMany({
    where: {
      id: parsed.data.notificationId,
      recipientId: userId,
    },
    data: {
      readAt: new Date(),
    },
  });

  revalidatePath('/notifications');
  redirect('/notifications');
}

export async function markAllNotificationsReadAction() {
  const userId = await requireUserId();

  await prisma.notification.updateMany({
    where: {
      recipientId: userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  revalidatePath('/notifications');
  redirect('/notifications');
}
