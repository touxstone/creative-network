import { notFound, redirect } from 'next/navigation';
import { Megaphone } from 'lucide-react';
import { createProjectCallAction } from '@/features/project-calls/actions';
import { callStatusLabels, callStatusValues } from '@/features/project-calls/constants';
import { auth } from '@/core/auth/auth';
import { getProjectBySlug } from '@/features/projects/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NewCallPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewProjectCallPage({ params }: NewCallPageProps) {
  const [{ slug }, session] = await Promise.all([params, auth()]);
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  if (project.owner.id !== session?.user?.id) {
    redirect(`/projects/${project.slug}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>New call for {project.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Publish a focused call for casting, crew, writers, composers, or collaborators.
          </p>
        </CardHeader>
        <CardContent>
          <form action={createProjectCallAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="projectId" value={project.id} />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Call title</Label>
              <Input id="title" name="title" required placeholder="Casting lead performer for proof of concept" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role needed</Label>
              <Input id="role" name="role" required placeholder="Actor, composer, script editor..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discipline">Discipline</Label>
              <Input id="discipline" name="discipline" placeholder="Casting, writing, music, production..." />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                className="min-h-40"
                placeholder="Describe the role, tone, availability, submission expectations, and useful references."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" name="language" defaultValue={project.language ?? ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={project.location ?? ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue="OPEN"
                className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {callStatusValues.map((status) => (
                  <option key={status} value={status}>
                    {callStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" />
            </div>
            <Button className="sm:col-span-2">
              <Megaphone className="h-4 w-4" />
              Publish call
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
