import Link from 'next/link';
import { ArrowRight, ExternalLink, MapPin, UsersRound } from 'lucide-react';
import type { ProjectSummary } from '@/features/projects/types';
import { projectStatusLabels } from '@/features/projects/constants';
import { Card, CardContent } from '@/components/ui/card';

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const ownerName = project.owner.name ?? project.owner.username;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {projectStatusLabels[project.status as keyof typeof projectStatusLabels] ?? project.status}
          </span>
          {project.language ? (
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {project.language}
            </span>
          ) : null}
        </div>
        <Link href={`/projects/${project.slug}`} className="mt-4 block text-xl font-semibold hover:text-primary">
          {project.title}
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {project.logline ?? project.description}
        </p>
        <div className="mt-5 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4" />
            {ownerName} · {project.ownerRole ?? project.owner.profession ?? 'Creator'}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {project.location ?? project.owner.location ?? 'Location flexible'}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            View project
            <ArrowRight className="h-4 w-4" />
          </Link>
          {project.links[0] ? (
            <a
              href={project.links[0].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent"
            >
              {project.links[0].label}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
