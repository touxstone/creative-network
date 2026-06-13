import { redirect } from 'next/navigation';
import { Save } from 'lucide-react';
import { updateProfileAction } from '@/core/auth/actions';
import { auth } from '@/core/auth/auth';
import { SPECIALTY_OPTIONS } from '@/core/shared/taxonomies/specialties';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EditProfilePageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function EditProfilePage({ searchParams }: EditProfilePageProps) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      profession: true,
      location: true,
      website: true,
      bio: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            These fields are persisted in PostgreSQL and shown on your public profile.
          </p>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" defaultValue={user.name ?? ''} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                name="profession"
                list="specialty-options"
                defaultValue={user.profession ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={user.location ?? ''} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={user.website ?? ''} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={user.bio ?? ''} />
            </div>
            {params?.error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
                Check the profile fields and try again.
              </div>
            ) : null}
            <Button type="submit" className="sm:col-span-2">
              <Save className="h-4 w-4" />
              Save profile
            </Button>
            <datalist id="specialty-options">
              {SPECIALTY_OPTIONS.map((specialty) => (
                <option key={specialty} value={specialty} />
              ))}
            </datalist>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
