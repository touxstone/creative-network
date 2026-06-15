import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { notFound } from 'next/navigation';
import { auth } from '@/core/auth/auth';
import { sendMessageAction } from '@/features/messaging/actions';
import { getConversationThread } from '@/features/messaging/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

function getInitials(name: string | null | undefined, fallback = 'CN') {
  return (name ?? fallback)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const { id } = await params;
  const conversation = await getConversationThread(userId, id);

  if (!conversation) {
    notFound();
  }

  const otherParticipants = conversation.participants
    .map((participant) => participant.user)
    .filter((user) => user.id !== userId);
  const title =
    otherParticipants.map((user) => user.name ?? user.username).join(', ') || 'Conversation';

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link
        href="/messages"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to messages
      </Link>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-foreground font-semibold text-white">
              {getInitials(title)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Private MVP thread. Refresh or send a message to see the latest activity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        {conversation.messages.length > 0 ? (
          conversation.messages.map((message) => {
            const isOwnMessage = message.senderId === userId;
            return (
              <div
                key={message.id}
                className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[min(38rem,90%)] rounded-lg border p-4',
                    isOwnMessage
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-white',
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs opacity-80">
                    <span className="font-semibold">
                      {isOwnMessage ? 'You' : message.sender.name ?? message.sender.username}
                    </span>
                    <span>
                      {message.createdAt.toLocaleString('en', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold">This thread is ready</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Send the first message to start a private conversation with this contact.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <Card>
        <CardContent className="p-5">
          <form action={sendMessageAction} className="space-y-3">
            <input type="hidden" name="conversationId" value={conversation.id} />
            <Textarea
              name="content"
              placeholder="Write a focused message..."
              className="min-h-28"
              required
              maxLength={2000}
            />
            <div className="flex justify-end">
              <Button>
                <Send className="h-4 w-4" />
                Send message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
