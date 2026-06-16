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
  replyToId: z.string().optional(),
});

const editMessageSchema = z.object({
  messageId: z.string().min(1),
  content: z.string().trim().min(1).max(2000),
  reason: z.string().trim().max(160).optional(),
});

const pinMessageSchema = z.object({
  conversationId: z.string().min(1),
  messageId: z.string().min(1),
});

const updateConversationTitleSchema = z.object({
  conversationId: z.string().min(1),
  title: z.string().trim().max(120),
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

  const replyToId = parsed.data.replyToId || undefined;

  if (replyToId) {
    const replyTarget = await prisma.message.findFirst({
      where: {
        id: replyToId,
        conversationId: parsed.data.conversationId,
      },
      select: { id: true },
    });

    if (!replyTarget) {
      redirect(`/messages/${parsed.data.conversationId}?error=reply`);
    }
  }

  await prisma.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: userId,
      content: parsed.data.content,
      replyToId,
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

export async function editMessageAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = editMessageSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/messages?error=edit');
  }

  const message = await prisma.message.findUnique({
    where: { id: parsed.data.messageId },
    select: {
      id: true,
      content: true,
      senderId: true,
      conversationId: true,
      editCount: true,
    },
  });

  if (!message || message.senderId !== userId) {
    redirect('/messages?error=edit');
  }

  if (message.content === parsed.data.content) {
    redirect(`/messages/${message.conversationId}`);
  }

  await prisma.$transaction([
    prisma.messageEditHistory.create({
      data: {
        messageId: message.id,
        editorId: userId,
        previousContent: message.content,
        reason: parsed.data.reason || undefined,
      },
    }),
    prisma.message.update({
      where: { id: message.id },
      data: {
        content: parsed.data.content,
        editedAt: new Date(),
        editCount: message.editCount + 1,
      },
    }),
    prisma.conversation.update({
      where: { id: message.conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  revalidatePath('/messages');
  revalidatePath(`/messages/${message.conversationId}`);
  redirect(`/messages/${message.conversationId}`);
}

export async function pinMessageAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = pinMessageSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/messages?error=pin');
  }

  const message = await prisma.message.findFirst({
    where: {
      id: parsed.data.messageId,
      conversationId: parsed.data.conversationId,
      conversation: {
        participants: {
          some: { userId },
        },
      },
    },
    select: { id: true, conversationId: true },
  });

  if (!message) {
    redirect('/messages?error=pin');
  }

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: {
      pinnedMessageId: parsed.data.messageId,
      updatedAt: new Date(),
    },
  });

  revalidatePath('/messages');
  revalidatePath(`/messages/${parsed.data.conversationId}`);
  redirect(`/messages/${parsed.data.conversationId}`);
}

export async function updateConversationTitleAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = updateConversationTitleSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/messages?error=title');
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
    redirect('/messages?error=title');
  }

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: {
      title: parsed.data.title || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath('/messages');
  revalidatePath(`/messages/${parsed.data.conversationId}`);
  redirect(`/messages/${parsed.data.conversationId}`);
}
