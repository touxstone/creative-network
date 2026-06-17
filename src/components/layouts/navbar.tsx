import Link from 'next/link';
import {
  Bell,
  BriefcaseBusiness,
  LogOut,
  MessagesSquare,
  MessageSquare,
  Network,
  Search,
  UserRound,
} from 'lucide-react';
import type { Session } from 'next-auth';
import { logoutAction } from '@/core/auth/actions';
import { Button } from '@/components/ui/button';

function getNavItems(userId: string) {
  return [
    { href: '/dashboard', label: 'Dashboard', icon: BriefcaseBusiness },
    { href: '/feed', label: 'Lounge', icon: MessageSquare },
    { href: '/network', label: 'Network', icon: Network },
    { href: '/messages', label: 'Messages', icon: MessagesSquare },
    { href: '/projects', label: 'Projects', icon: BriefcaseBusiness },
    { href: `/profile/${userId}`, label: 'Profile', icon: UserRound },
  ];
}

interface NavbarProps {
  user: Session['user'];
}

export function Navbar({ user }: NavbarProps) {
  const navItems = getNavItems(user.id);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-foreground text-sm text-white">CN</span>
          <span className="hidden sm:inline">Creative Network</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" aria-label="Search" className="h-10 w-10 px-0">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" aria-label="Notifications" className="h-10 w-10 px-0">
            <Bell className="h-4 w-4" />
          </Button>
          <form action={logoutAction}>
            <Button variant="outline" aria-label="Sign out" className="h-10 w-10 px-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
