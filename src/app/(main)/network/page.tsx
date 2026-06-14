import Link from 'next/link';
import { Check, Clock, MapPin, Search, UserPlus, UsersRound, X } from 'lucide-react';
import { auth } from '@/core/auth/auth';
import {
  respondConnectionRequestAction,
  sendConnectionRequestAction,
} from '@/features/networking/actions';
import { getNetworkOverview } from '@/features/networking/queries';
import type { ConnectionWithUsers, NetworkUser } from '@/features/networking/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function getInitials(name: string | null | undefined, fallback = 'CN') {
  return (name ?? fallback)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getOtherUser(connection: ConnectionWithUsers, viewerId: string) {
  return connection.userAId === viewerId ? connection.userB : connection.userA;
}

function UserSummary({ user }: { user: NetworkUser }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-foreground font-semibold text-white">
        {getInitials(user.name, user.username)}
      </div>
      <div className="min-w-0">
        <Link href={`/profile/${user.id}`} className="font-semibold hover:text-primary">
          {user.name ?? user.username}
        </Link>
        <p className="text-sm text-muted-foreground">{user.profession ?? 'Creative professional'}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {user.location ?? 'Location pending'}
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ user }: { user: NetworkUser }) {
  return (
    <Card>
      <CardContent className="p-5">
        <UserSummary user={user} />
        <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">
          {user.bio ?? 'Open to new introductions and creative collaboration.'}
        </p>
        <form action={sendConnectionRequestAction}>
          <input type="hidden" name="recipientId" value={user.id} />
          <Button className="mt-5 w-full" variant="outline">
            <UserPlus className="h-4 w-4" />
            Connect
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReceivedRequestCard({ connection }: { connection: ConnectionWithUsers }) {
  return (
    <Card>
      <CardContent className="p-5">
        <UserSummary user={connection.userA} />
        <div className="mt-5 flex gap-2">
          <form action={respondConnectionRequestAction} className="flex-1">
            <input type="hidden" name="connectionId" value={connection.id} />
            <input type="hidden" name="intent" value="accept" />
            <Button className="w-full">
              <Check className="h-4 w-4" />
              Accept
            </Button>
          </form>
          <form action={respondConnectionRequestAction} className="flex-1">
            <input type="hidden" name="connectionId" value={connection.id} />
            <input type="hidden" name="intent" value="reject" />
            <Button variant="outline" className="w-full">
              <X className="h-4 w-4" />
              Reject
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function NetworkPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const overview = await getNetworkOverview(userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Network</h1>
          <p className="mt-2 text-muted-foreground">
            Discover professionals, manage requests, and grow a working creative network.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search coming in a later slice" disabled />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{overview.stats.connections}</div>
            <p className="mt-1 text-sm text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{overview.stats.receivedRequests}</div>
            <p className="mt-1 text-sm text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{overview.stats.sentRequests}</div>
            <p className="mt-1 text-sm text-muted-foreground">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{overview.stats.suggestions}</div>
            <p className="mt-1 text-sm text-muted-foreground">Suggestions</p>
          </CardContent>
        </Card>
      </div>

      {overview.receivedRequests.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Requests waiting for you</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.receivedRequests.map((connection) => (
              <ReceivedRequestCard key={connection.id} connection={connection} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Your connections</h2>
        </div>
        {overview.connections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.connections.map((connection) => {
              const user = getOtherUser(connection, userId);
              return (
                <Card key={connection.id}>
                  <CardContent className="p-5">
                    <UserSummary user={user} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">No accepted connections yet</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start with a suggested professional or accept a pending request when one appears.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {overview.sentRequests.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Pending sent requests</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.sentRequests.map((connection) => {
              const user = getOtherUser(connection, userId);
              return (
                <Card key={connection.id}>
                  <CardContent className="p-5">
                    <UserSummary user={user} />
                    <p className="mt-4 text-sm text-muted-foreground">Waiting for response</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Suggested professionals</h2>
        </div>
        {overview.suggestions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.suggestions.map((user) => (
              <SuggestionCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">No suggestions right now</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                New profiles and richer specialty data will expand this list as the network grows.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
