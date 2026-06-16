import Link from 'next/link';
import { ArrowLeft, Edit3, Pin, Reply, Send } from 'lucide-react';
import { notFound } from 'next/navigation';
import { auth } from '@/core/auth/auth';
import {
  editMessageAction,
  pinMessageAction,
  sendMessageAction,
  updateConversationTitleAction,
} from '@/features/messaging/actions';
import { getConversationThread } from '@/features/messaging/queries';
import type { ThreadMessage } from '@/features/messaging/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

function getMessageAuthorLabel(message: ThreadMessage, viewerId: string) {
  return message.senderId === viewerId ? 'You' : message.sender.name ?? message.sender.username;
}

function MessageBubble({
  message,
  conversationId,
  viewerId,
  isPinned,
}: {
  message: ThreadMessage;
  conversationId: string;
  viewerId: string;
  isPinned: boolean;
}) {
  const isOwnMessage = message.senderId === viewerId;
  const messageActionButtonClass = 'h-8 border-border bg-white text-foreground hover:bg-muted';

  return (
    <div className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[min(38rem,90%)] rounded-lg border p-4',
          isOwnMessage
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-white',
        )}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs opacity-80">
          <span className="font-semibold">{getMessageAuthorLabel(message, viewerId)}</span>
          <span>
            {message.createdAt.toLocaleString('en', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.editedAt ? <span>edited</span> : null}
          {isPinned ? <span>pinned</span> : null}
          {message.editCount > 0 ? <span>{message.editCount} revision(s)</span> : null}
        </div>

        {message.replyTo ? (
          <div
            className={cn(
              'mb-3 rounded-md border px-3 py-2 text-xs leading-5',
              isOwnMessage ? 'border-white/30 bg-white/10' : 'border-border bg-muted',
            )}
          >
            <div className="font-semibold">
              Replying to {message.replyTo.sender.name ?? message.replyTo.sender.username}
            </div>
            <div className="mt-1 line-clamp-2 opacity-80">{message.replyTo.content}</div>
          </div>
        ) : null}

        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <details className="group">
            <summary
              className={cn(
                'inline-flex h-8 cursor-pointer list-none items-center gap-2 rounded-md border px-3 text-xs font-medium',
                isOwnMessage ? 'border-white/30 hover:bg-white/10' : 'border-border hover:bg-muted',
              )}
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </summary>
            <form action={sendMessageAction} className="mt-3 space-y-2">
              <input type="hidden" name="conversationId" value={conversationId} />
              <input type="hidden" name="replyToId" value={message.id} />
              <Textarea
                name="content"
                placeholder="Write a reply..."
                className={cn('min-h-24', isOwnMessage ? 'text-foreground' : '')}
                required
                maxLength={2000}
              />
              <Button variant="outline" className={messageActionButtonClass}>
                <Send className="h-3.5 w-3.5" />
                Send reply
              </Button>
            </form>
          </details>

          <form action={pinMessageAction}>
            <input type="hidden" name="conversationId" value={conversationId} />
            <input type="hidden" name="messageId" value={message.id} />
            <Button variant="outline" className={messageActionButtonClass}>
              <Pin className="h-3.5 w-3.5" />
              {isPinned ? 'Pinned' : 'Pin'}
            </Button>
          </form>

          {isOwnMessage ? (
            <details className="group w-full">
              <summary
                className={cn(
                  'inline-flex h-8 cursor-pointer list-none items-center gap-2 rounded-md border px-3 text-xs font-medium',
                  isOwnMessage ? 'border-white/30 hover:bg-white/10' : 'border-border hover:bg-muted',
                )}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </summary>
              <form action={editMessageAction} className="mt-3 space-y-2">
                <input type="hidden" name="messageId" value={message.id} />
                <Textarea
                  name="content"
                  defaultValue={message.content}
                  className="min-h-24 text-foreground"
                  required
                  maxLength={2000}
                />
                <Input
                  name="reason"
                  placeholder="Optional edit note"
                  className="text-foreground"
                  maxLength={160}
                />
                <Button variant="outline" className={messageActionButtonClass}>
                  <Edit3 className="h-3.5 w-3.5" />
                  Save edit
                </Button>
              </form>
              {message.editHistory.length > 0 ? (
                <p className="mt-2 text-xs opacity-80">
                  Previous version stored for internal review.
                </p>
              ) : null}
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
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
  const fallbackTitle =
    otherParticipants.map((user) => user.name ?? user.username).join(', ') || 'Conversation';
  const title = conversation.title ?? fallbackTitle;

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
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Private collaboration thread with edits, replies, and pinned context.
              </p>
            </div>
          </div>
          <form action={updateConversationTitleAction} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input type="hidden" name="conversationId" value={conversation.id} />
            <Input
              name="title"
              defaultValue={conversation.title ?? ''}
              placeholder={`Title, e.g. ${fallbackTitle}`}
              maxLength={120}
            />
            <Button variant="outline" className="sm:w-36">
              Save title
            </Button>
          </form>
        </CardContent>
      </Card>

      {conversation.pinnedMessage ? (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Pin className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0">
                <h2 className="font-semibold">Pinned context</h2>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {conversation.pinnedMessage.content}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {getMessageAuthorLabel(conversation.pinnedMessage, userId)}
                  {conversation.pinnedMessage.editedAt ? ' · edited' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-3">
        {conversation.messages.length > 0 ? (
          conversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              conversationId={conversation.id}
              viewerId={userId}
              isPinned={message.id === conversation.pinnedMessageId}
            />
          ))
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
