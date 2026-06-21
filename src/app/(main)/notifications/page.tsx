import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bell, Check, Circle, MessageSquare, Network, ThumbsUp, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/core/auth/auth';
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from '@/features/notifications/actions';
import { notificationTypeLabels } from '@/features/notifications/constants';
import { getNotificationsForUser } from '@/features/notifications/queries';
import type { NotificationItem } from '@/features/notifications/types';

const notificationIcons = {
  CONNECTION_REQUEST: UserPlus,
  CONNECTION_ACCEPTED: Network,
  POST_LIKE: ThumbsUp,
  POST_COMMENT: MessageSquare,
  MESSAGE: MessageSquare,
};

function getActorLabel(notification: NotificationItem) {
  return notification.actor?.name ?? notification.actor?.username ?? 'Creative Network';
}

function NotificationIcon({ type }: { type: string }) {
  const Icon = notificationIcons[type as keyof typeof notificationIcons] ?? Bell;

  return <Icon className="h-5 w-5" />;
}

function NotificationCard({ notification }: { notification: NotificationItem }) {
  const isUnread = !notification.readAt;
  const label =
    notificationTypeLabels[notification.type as keyof typeof notificationTypeLabels] ?? notification.type;

  return (
    <Card className={isUnread ? 'border-accent' : undefined}>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-foreground">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isUnread ? <Circle className="h-2.5 w-2.5 fill-accent text-accent" /> : null}
            <span className="text-xs font-medium uppercase text-muted-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">
              {notification.createdAt.toLocaleString('en', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <h2 className="mt-2 font-semibold">{notification.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {getActorLabel(notification)}
            {notification.body ? `: ${notification.body}` : null}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {notification.href ? (
              <Link href={notification.href}>
                <Button variant="outline">Open</Button>
              </Link>
            ) : null}
            {isUnread ? (
              <form action={markNotificationReadAction}>
                <input type="hidden" name="notificationId" value={notification.id} />
                <Button variant="ghost">
                  <Check className="h-4 w-4" />
                  Mark read
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const notifications = await getNotificationsForUser(session.user.id);
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Requests, comments, likes, and messages that need your attention.
          </p>
        </div>
        {unreadCount > 0 ? (
          <form action={markAllNotificationsReadAction}>
            <Button variant="outline">
              <Check className="h-4 w-4" />
              Mark all read
            </Button>
          </form>
        ) : null}
      </section>

      <section className="grid gap-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No notifications yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                New network requests, comments, likes, and messages will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
