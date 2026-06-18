import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Edit, ExternalLink, Globe2, MapPin, Megaphone, Trash2, UsersRound } from 'lucide-react';
import { deleteProjectAction } from '@/features/projects/actions';
import { getProjectBySlug } from '@/features/projects/queries';
import { projectStatusLabels } from '@/features/projects/constants';
import { auth } from '@/core/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [{ slug }, session] = await Promise.all([params, auth()]);
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isOwner = session?.user?.id === project.owner.id;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                {projectStatusLabels[project.status as keyof typeof projectStatusLabels] ?? project.status}
              </span>
              {project.language ? (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {project.language}
                </span>
              ) : null}
            </div>
            <h1 className="mt-5 text-3xl font-bold">{project.title}</h1>
            {project.logline ? (
              <p className="mt-3 text-lg leading-8 text-muted-foreground">{project.logline}</p>
            ) : null}
            <p className="mt-5 whitespace-pre-wrap leading-7 text-muted-foreground">
              {project.description}
            </p>
            {isOwner ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/projects/${project.slug}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/projects/${project.slug}/calls/new`}>
                  <Button variant="outline">
                    <Megaphone className="h-4 w-4" />
                    New call
                  </Button>
                </Link>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <Button variant="outline">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </form>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {project.members.map((member) => (
              <Link
                key={member.id}
                href={`/profile/${member.user.id}`}
                className="rounded-md border border-border p-4 hover:border-accent"
              >
                <div className="font-semibold">{member.user.name ?? member.user.username}</div>
                <div className="mt-1 text-sm text-muted-foreground">{member.role}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Project signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4" />
              {project.owner.name ?? project.owner.username} · {project.ownerRole ?? 'Creator'}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {project.location ?? project.owner.location ?? 'Location flexible'}
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              {project.language ?? 'Language open'}
            </div>
          </CardContent>
        </Card>
        {project.links.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>External resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm font-medium hover:border-accent"
                >
                  {link.label}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
