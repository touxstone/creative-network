import Link from 'next/link';
import { FolderKanban, Plus } from 'lucide-react';
import { ProjectCard } from '@/components/projects/project-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProjectSummaries } from '@/features/projects/queries';

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Discover work in development, portfolio pieces, and collaboration-ready creative ideas.
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4" />
            New project
          </Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FolderKanban className="mt-1 h-5 w-5 text-accent" />
              <div>
                <h2 className="font-semibold">No projects yet</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create the first project to turn profiles and conversations into a visible working slate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
