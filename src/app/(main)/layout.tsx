import { PageShell } from '@/components/layouts/page-shell';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
