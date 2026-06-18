import { Megaphone, Plus } from 'lucide-react';
import Link from 'next/link';
import { CallCard } from '@/components/project-calls/call-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProjectCalls } from '@/features/project-calls/queries';

export default async function CallsPage() {
  const calls = await getProjectCalls();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Casting & Calls</h1>
          <p className="mt-2 text-muted-foreground">
            Open roles, collaborators, casting needs, and creative calls connected to projects.
          </p>
        </div>
        <Link href="/projects">
          <Button variant="outline">
            <Plus className="h-4 w-4" />
            Start from project
          </Button>
        </Link>
      </div>

      {calls.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {calls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Megaphone className="mt-1 h-5 w-5 text-accent" />
              <div>
                <h2 className="font-semibold">No open calls yet</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Open a project and publish the first call for actors, writers, composers, or crew.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
