import Link from 'next/link';
import { ArrowRight, Clapperboard, UsersRound, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredPeople, stakeholderMetrics } from '@/lib/demo-data';

const workstreams = [
  {
    title: 'Find creative collaborators',
    description: 'Browse talent by craft, location, availability, and project fit.',
    icon: UsersRound,
  },
  {
    title: 'Package projects',
    description: 'Keep pitches, roles, shortlists, and next steps visible to the team.',
    icon: Clapperboard,
  },
  {
    title: 'Grow paid access later',
    description: 'Leave room for classes, marketplace services, and premium networking.',
    icon: WalletCards,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid min-h-[72vh] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex rounded-md border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
              Stage-ready professional network for creative teams
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Creative Network
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              A modular web platform for film, media, and entertainment professionals:
              profiles first, community next, then networking, projects, education, and premium access.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button>
                  Open demo workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Create demo profile</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              {stakeholderMetrics.map((metric) => (
                <Card key={metric.label}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="mt-1 text-sm font-medium">{metric.label}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{metric.trend}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Talent discovery preview</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {featuredPeople.map((person) => (
                  <div
                    key={person.name}
                    className="flex items-start justify-between gap-4 rounded-md border border-border p-3"
                  >
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {person.role} · {person.location}
                      </div>
                    </div>
                    <div className="max-w-[13rem] text-right text-xs text-muted-foreground">
                      {person.focus}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
        {workstreams.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-lg border border-border bg-white p-5">
              <Icon className="h-5 w-5 text-accent" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
