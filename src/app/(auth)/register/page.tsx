import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { registerAction } from '@/core/auth/actions';
import { SPECIALTY_OPTIONS } from '@/core/shared/taxonomies/specialties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create your creative profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Profiles are now persisted in PostgreSQL for the PR-02 CORE data slice.
          </p>
        </CardHeader>
        <CardContent>
          <form action={registerAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Mara Soler" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="marasoler" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" name="profession" list="specialty-options" placeholder="Producer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Madrid" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            {params?.error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
                {params.error}
              </div>
            ) : null}
            <Button type="submit" className="w-full sm:col-span-2">
              <UserPlus className="h-4 w-4" />
              Create profile
            </Button>
            <datalist id="specialty-options">
              {SPECIALTY_OPTIONS.map((specialty) => (
                <option key={specialty} value={specialty} />
              ))}
            </datalist>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already registered?{' '}
            <Link className="font-medium text-primary" href="/login">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
