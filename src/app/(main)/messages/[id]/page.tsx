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
import {
  pinnedColorLabels,
  pinnedColorValues,
  type PinnedColor,
} from '@/features/messaging/constants';
import { getConversationThread } from '@/features/messaging/queries';
import type { ThreadMessage } from '@/features/messaging/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CancelEditButton } from '@/components/messages/cancel-edit-button';
import { cn } from '@/lib/utils';

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

const pinnedToneStyles: Record<
  PinnedColor,
  {
    card: string;
    icon: string;
    badge: string;
    bubble: string;
    swatch: string;
  }
> = {
  rose: {
    card: 'border-rose-200 bg-rose-50',
    icon: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-900',
    bubble: 'border-rose-200 bg-rose-50 text-rose-950',
    swatch: 'border-rose-300 bg-rose-200 hover:bg-rose-300',
  },
  amber: {
    card: 'border-amber-200 bg-amber-50',
    icon: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-950',
    bubble: 'border-amber-200 bg-amber-50 text-amber-950',
    swatch: 'border-amber-300 bg-amber-200 hover:bg-amber-300',
  },
  teal: {
    card: 'border-teal-200 bg-teal-50',
    icon: 'text-teal-700',
    badge: 'bg-teal-100 text-teal-950',
    bubble: 'border-teal-200 bg-teal-50 text-teal-950',
    swatch: 'border-teal-300 bg-teal-200 hover:bg-teal-300',
  },
  sky: {
    card: 'border-sky-200 bg-sky-50',
    icon: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-950',
    bubble: 'border-sky-200 bg-sky-50 text-sky-950',
    swatch: 'border-sky-300 bg-sky-200 hover:bg-sky-300',
  },
  violet: {
    card: 'border-violet-200 bg-violet-50',
    icon: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-950',
    bubble: 'border-violet-200 bg-violet-50 text-violet-950',
    swatch: 'border-violet-300 bg-violet-200 hover:bg-violet-300',
  },
};

function getPinnedTone(color: string | null | undefined) {
  const pinnedColor = pinnedColorValues.includes(color as PinnedColor)
    ? (color as PinnedColor)
    : 'rose';

  return {
    color: pinnedColor,
    label: pinnedColorLabels[pinnedColor],
    styles: pinnedToneStyles[pinnedColor],
  };
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
  pinnedColor,
}: {
  message: ThreadMessage;
  conversationId: string;
  viewerId: string;
  isPinned: boolean;
  pinnedColor: string;
}) {
  const isOwnMessage = message.senderId === viewerId;
  const pinnedTone = getPinnedTone(pinnedColor);
  const isInvertedBubble = isOwnMessage && !isPinned;
  const messageActionButtonClass = 'h-8 border-border bg-white text-foreground hover:bg-muted';

  return (
    <div className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[min(38rem,90%)] rounded-lg border p-4',
          isPinned
            ? pinnedTone.styles.bubble
            : isOwnMessage
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
          {isPinned ? (
            <span className={cn('rounded-full px-2 py-0.5 text-[0.7rem] font-medium', pinnedTone.styles.badge)}>
              pinned
            </span>
          ) : null}
          {message.editCount > 0 ? <span>{message.editCount} revision(s)</span> : null}
        </div>

        {message.replyTo ? (
          <div
            className={cn(
              'mb-3 rounded-md border px-3 py-2 text-xs leading-5',
              isInvertedBubble ? 'border-white/30 bg-white/10' : 'border-border bg-white/70',
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
                isInvertedBubble ? 'border-white/30 hover:bg-white/10' : 'border-border bg-white hover:bg-muted',
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

          <details className="group">
            <summary
              className={cn(
                'inline-flex h-8 cursor-pointer list-none items-center gap-2 rounded-md border px-3 text-xs font-medium',
                isInvertedBubble ? 'border-white/30 hover:bg-white/10' : 'border-border bg-white hover:bg-muted',
              )}
            >
              <Pin className="h-3.5 w-3.5" />
              {isPinned ? 'Pinned' : 'Pin'}
            </summary>
            <div className="mt-3 flex w-fit flex-wrap gap-1 rounded-md border border-border bg-white p-2 shadow-sm">
              {pinnedColorValues.map((color) => {
                const tone = getPinnedTone(color);

                return (
                  <form key={color} action={pinMessageAction}>
                    <input type="hidden" name="conversationId" value={conversationId} />
                    <input type="hidden" name="messageId" value={message.id} />
                    <input type="hidden" name="pinnedColor" value={color} />
                    <button
                      type="submit"
                      aria-label={`Pin as ${tone.label}`}
                      title={tone.label}
                      className={cn(
                        'grid h-7 w-7 place-items-center rounded-full border text-[0.65rem] font-semibold text-transparent transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        tone.styles.swatch,
                        isPinned && pinnedTone.color === color ? 'ring-2 ring-foreground/40 ring-offset-2' : '',
                      )}
                    >
                      {tone.label[0]}
                    </button>
                  </form>
                );
              })}
            </div>
          </details>

          {isOwnMessage ? (
            <details className="group w-full">
              <summary
                className={cn(
                  'inline-flex h-8 cursor-pointer list-none items-center gap-2 rounded-md border px-3 text-xs font-medium',
                  isInvertedBubble ? 'border-white/30 hover:bg-white/10' : 'border-border bg-white hover:bg-muted',
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
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" variant="outline" className={messageActionButtonClass}>
                    <Edit3 className="h-3.5 w-3.5" />
                    Save edit
                  </Button>
                  <CancelEditButton />
                </div>
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
  const pinnedTone = getPinnedTone(conversation.pinnedColor);

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
        <Card className={cn('border', pinnedTone.styles.card)}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Pin className={cn('mt-1 h-4 w-4 shrink-0', pinnedTone.styles.icon)} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">Pinned context</h2>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
                      pinnedTone.styles.badge,
                    )}
                  >
                    {pinnedTone.label}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                  {conversation.pinnedMessage.content}
                </p>
                <p className="mt-2 text-xs text-foreground/60">
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
              pinnedColor={conversation.pinnedColor}
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
