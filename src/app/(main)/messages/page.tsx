import Link from 'next/link';
import { MessageSquare, Send, UsersRound } from 'lucide-react';
import { auth } from '@/core/auth/auth';
import { startConversationAction } from '@/features/messaging/actions';
import { getMessagingOverview } from '@/features/messaging/queries';
import type { ConversationPreview, MessagingUser } from '@/features/messaging/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function getInitials(name: string | null | undefined, fallback = 'CN') {
  return (name ?? fallback)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getOtherParticipant(conversation: ConversationPreview, userId: string) {
  return conversation.participants.find((participant) => participant.user.id !== userId)?.user;
}

function UserAvatar({ user }: { user: MessagingUser }) {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-foreground font-semibold text-white">
      {getInitials(user.name, user.username)}
    </div>
  );
}

function ConversationCard({
  conversation,
  viewerId,
}: {
  conversation: ConversationPreview;
  viewerId: string;
}) {
  const otherUser = getOtherParticipant(conversation, viewerId);
  const latestMessage = conversation.messages[0];

  if (!otherUser) {
    return null;
  }

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="block rounded-lg border border-border bg-white p-5 shadow-panel transition hover:border-accent hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <UserAvatar user={otherUser} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{otherUser.name ?? otherUser.username}</h2>
            <span className="text-xs text-muted-foreground">
              {conversation.updatedAt.toLocaleDateString('en', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {otherUser.profession ?? 'Creative professional'}
          </p>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {latestMessage
              ? `${latestMessage.senderId === viewerId ? 'You: ' : ''}${latestMessage.content}`
              : 'Conversation ready. Send the first message.'}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ContactStartCard({ contact }: { contact: MessagingUser }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <UserAvatar user={contact} />
          <div className="min-w-0">
            <h2 className="font-semibold">{contact.name ?? contact.username}</h2>
            <p className="text-sm text-muted-foreground">
              {contact.profession ?? 'Creative professional'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {contact.location ?? 'Location pending'}
            </p>
          </div>
        </div>
        <form action={startConversationAction}>
          <input type="hidden" name="recipientId" value={contact.id} />
          <Button className="mt-5 w-full" variant="outline">
            <Send className="h-4 w-4" />
            Start conversation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default async function MessagesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const overview = await getMessagingOverview(userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="mt-2 text-muted-foreground">
            Continue private conversations with accepted creative contacts.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-72">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{overview.stats.conversations}</div>
              <p className="mt-1 text-xs text-muted-foreground">Threads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{overview.stats.availableContacts}</div>
              <p className="mt-1 text-xs text-muted-foreground">Contacts ready</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Inbox</h2>
        </div>
        {overview.conversations.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {overview.conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                viewerId={userId}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">No conversations yet</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start with an accepted contact below. Realtime delivery can be added later without
                changing the basic message model.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Start with a contact</h2>
        </div>
        {overview.contactsWithoutConversation.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.contactsWithoutConversation.map((contact) => (
              <ContactStartCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">No new contacts available</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Accept or create connections in Network to open more private conversations.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
