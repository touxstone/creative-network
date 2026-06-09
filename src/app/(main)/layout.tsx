import { redirect } from 'next/navigation';
import { PageShell } from '@/components/layouts/page-shell';
import { auth } from '@/core/auth/auth';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <PageShell user={session.user}>{children}</PageShell>;
}
