import { prisma } from '@/lib/db/prisma';
import type { ConversationPreview, MessageThread, MessagingOverview, MessagingUser } from './types';

const messagingUserSelect = {
  id: true,
  name: true,
  username: true,
  profession: true,
  location: true,
} satisfies Record<keyof MessagingUser, true>;

function getOtherParticipant(conversation: ConversationPreview, userId: string) {
  return conversation.participants.find((participant) => participant.user.id !== userId)?.user;
}

export async function getMessagingOverview(userId: string): Promise<MessagingOverview> {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        include: {
          user: { select: messagingUserSelect },
        },
        orderBy: { createdAt: 'asc' },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const conversationContactIds = new Set(
    conversations
      .map((conversation) => getOtherParticipant(conversation, userId)?.id)
      .filter((id): id is string => Boolean(id)),
  );

  const acceptedConnections = await prisma.connection.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: messagingUserSelect },
      userB: { select: messagingUserSelect },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const contactsWithoutConversation = acceptedConnections
    .map((connection) => (connection.userAId === userId ? connection.userB : connection.userA))
    .filter((contact) => !conversationContactIds.has(contact.id));

  return {
    conversations,
    contactsWithoutConversation,
    stats: {
      conversations: conversations.length,
      availableContacts: contactsWithoutConversation.length,
    },
  };
}

export async function getConversationThread(
  userId: string,
  conversationId: string,
): Promise<MessageThread | null> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        include: {
          user: { select: messagingUserSelect },
        },
        orderBy: { createdAt: 'asc' },
      },
      pinnedMessage: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          editHistory: {
            select: {
              id: true,
              createdAt: true,
              reason: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          editHistory: {
            select: {
              id: true,
              createdAt: true,
              reason: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return conversation;
}
