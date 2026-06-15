'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';

const startConversationSchema = z.object({
  recipientId: z.string().min(1),
});

const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().trim().min(1).max(2000),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

async function assertAcceptedConnection(userId: string, recipientId: string) {
  return prisma.connection.findFirst({
    where: {
      status: 'ACCEPTED',
      OR: [
        { userAId: userId, userBId: recipientId },
        { userAId: recipientId, userBId: userId },
      ],
    },
    select: { id: true },
  });
}

export async function startConversationAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = startConversationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success || parsed.data.recipientId === userId) {
    redirect('/messages?error=start');
  }

  const acceptedConnection = await assertAcceptedConnection(userId, parsed.data.recipientId);

  if (!acceptedConnection) {
    redirect('/messages?error=start');
  }

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: parsed.data.recipientId } } },
      ],
    },
    select: { id: true },
  });

  const conversation =
    existingConversation ??
    (await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: parsed.data.recipientId }],
        },
      },
      select: { id: true },
    }));

  revalidatePath('/messages');
  redirect(`/messages/${conversation.id}`);
}

export async function sendMessageAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = sendMessageSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/messages?error=send');
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: parsed.data.conversationId,
        userId,
      },
    },
    select: { id: true },
  });

  if (!participant) {
    redirect('/messages?error=send');
  }

  await prisma.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: userId,
      content: parsed.data.content,
    },
  });

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath('/messages');
  revalidatePath(`/messages/${parsed.data.conversationId}`);
  redirect(`/messages/${parsed.data.conversationId}`);
}
