import Link from 'next/link';
import { KeyRound, LogIn } from 'lucide-react';
import { loginAction } from '@/core/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <p className="text-sm text-muted-foreground">
            Access your workspace and continue building your creative network.
          </p>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            {params?.error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {params.error}
              </div>
            ) : null}
            <Button type="submit" className="w-full">
              <LogIn className="h-4 w-4" />
              Continue to workspace
            </Button>
          </form>
          <div className="mt-5 rounded-md border border-border bg-muted p-3 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <KeyRound className="h-4 w-4 text-accent" />
              Demo access
            </div>
            <p className="mt-2 text-muted-foreground">
              Use <span className="font-medium text-foreground">mara@creativenetwork.test</span>{' '}
              with the shared demo password from the project notes.
            </p>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link className="font-medium text-primary" href="/register">
              Create a profile
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
