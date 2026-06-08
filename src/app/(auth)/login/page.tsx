import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <p className="text-sm text-muted-foreground">
            Demo credentials are not enforced in this first showable slice.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <Link href="/dashboard" className="block">
              <Button type="button" className="w-full">
                <LogIn className="h-4 w-4" />
                Continue to workspace
              </Button>
            </Link>
          </form>
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
