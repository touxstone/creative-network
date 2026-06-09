import { Navbar } from '@/components/layouts/navbar';
import type { Session } from 'next-auth';

interface PageShellProps {
  children: React.ReactNode;
  user: Session['user'];
}

export function PageShell({ children, user }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
