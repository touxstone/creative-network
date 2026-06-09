import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BriefcaseBusiness, Edit, Globe, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id }, { username: id }],
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      profession: true,
      location: true,
      website: true,
    },
  });

  if (!user) {
    notFound();
  }

  const initials = (user.name ?? user.username)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="grid h-28 w-28 place-items-center rounded-lg bg-foreground text-3xl font-bold text-white">
              {initials}
            </div>
            <h1 className="mt-5 text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                {user.profession ?? 'Creative professional'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {user.location ?? 'Location pending'}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {user.website ?? `creativenetwork.test/${user.username}`}
              </div>
            </div>
            {isOwnProfile ? (
              <Link href="/profile/edit" className="mt-6 block">
                <Button className="w-full">
                  <Edit className="h-4 w-4" />
                  Edit profile
                </Button>
              </Link>
            ) : (
              <Button className="mt-6 w-full">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            )}
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="leading-7 text-muted-foreground">
            {user.bio ??
              'This profile is ready for a bio. PR-02 persists profile edits in PostgreSQL.'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current priorities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {['Find directors', 'Package pilots', 'Meet composers'].map((item) => (
              <div key={item} className="rounded-md border border-border p-4 text-sm">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
