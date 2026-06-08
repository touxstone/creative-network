import Link from 'next/link';
import { ArrowRight, CircleDot, Plus, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentSession } from '@/core/auth/session';
import { moduleStatuses, stakeholderMetrics } from '@/lib/demo-data';

export default async function DashboardPage() {
  const session = await getCurrentSession();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-white p-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold">{session.user.name}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Your workspace is ready for the CORE demo. The next slices add persistence,
              social activity, and professional discovery.
            </p>
          </div>
          <Link href="/feed">
            <Button>
              <Plus className="h-4 w-4" />
              Draft post
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stakeholderMetrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-5">
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="mt-1 font-medium">{metric.label}</div>
                <div className="mt-3 text-sm text-muted-foreground">{metric.trend}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Implementation slices</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {moduleStatuses.map((module) => (
              <div
                key={module.key}
                className="flex items-start gap-3 rounded-md border border-border p-4"
              >
                <CircleDot className="mt-0.5 h-4 w-4 text-accent" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{module.name}</h2>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {module.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid h-24 w-24 place-items-center rounded-lg bg-foreground text-2xl font-bold text-white">
              MS
            </div>
            <h2 className="mt-4 font-semibold">{session.user.profession}</h2>
            <p className="text-sm text-muted-foreground">{session.user.location}</p>
            <Link href="/profile/demo-user" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              View public profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next stakeholder demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Show landing, workspace shell, profile direction, and the modular roadmap.</p>
            <div className="flex items-center gap-2 text-foreground">
              <UsersRound className="h-4 w-4" />
              Target: CORE plus SOCIAL_FEED
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
