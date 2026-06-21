'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { createNotification } from '@/features/notifications/actions';

const recipientSchema = z.object({
  recipientId: z.string().min(1),
});

const connectionActionSchema = z.object({
  connectionId: z.string().min(1),
  intent: z.enum(['accept', 'reject']),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

export async function sendConnectionRequestAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = recipientSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success || parsed.data.recipientId === userId) {
    redirect('/network?error=request');
  }

  const recipient = await prisma.user.findUnique({
    where: { id: parsed.data.recipientId },
    select: { id: true },
  });

  if (!recipient) {
    redirect('/network?error=request');
  }

  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAId: userId, userBId: parsed.data.recipientId },
        { userAId: parsed.data.recipientId, userBId: userId },
      ],
    },
  });

  if (!existingConnection) {
    const connection = await prisma.connection.create({
      data: {
        userAId: userId,
        userBId: parsed.data.recipientId,
        status: 'PENDING',
      },
      select: { id: true },
    });

    await createNotification({
      recipientId: parsed.data.recipientId,
      actorId: userId,
      type: 'CONNECTION_REQUEST',
      title: 'New connection request',
      body: 'A creative wants to connect with you.',
      href: '/network',
      dedupeKey: `connection-request:${connection.id}`,
    });
  }

  revalidatePath('/network');
  redirect('/network');
}

export async function respondConnectionRequestAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = connectionActionSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/network?error=response');
  }

  const connection = await prisma.connection.findUnique({
    where: { id: parsed.data.connectionId },
    select: {
      id: true,
      userAId: true,
      userBId: true,
      status: true,
    },
  });

  if (!connection || connection.userBId !== userId || connection.status !== 'PENDING') {
    redirect('/network?error=response');
  }

  await prisma.connection.update({
    where: { id: connection.id },
    data: {
      status: parsed.data.intent === 'accept' ? 'ACCEPTED' : 'REJECTED',
    },
  });

  if (parsed.data.intent === 'accept') {
    await createNotification({
      recipientId: connection.userAId,
      actorId: userId,
      type: 'CONNECTION_ACCEPTED',
      title: 'Connection accepted',
      body: 'You can now message each other from Network or Messages.',
      href: '/network',
      dedupeKey: `connection-accepted:${connection.id}`,
    });
  }

  revalidatePath('/network');
  redirect('/network');
}
