import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Edit,
  ExternalLink,
  Globe2,
  LinkIcon,
  MapPin,
  Megaphone,
  Plus,
  Trash2,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import {
  addProjectLinkAction,
  addProjectMemberAction,
  deleteProjectAction,
  deleteProjectLinkAction,
  removeProjectMemberAction,
} from '@/features/projects/actions';
import { getProjectBySlug } from '@/features/projects/queries';
import { projectStatusLabels } from '@/features/projects/constants';
import { auth } from '@/core/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {project.members.map((member) => (
                <div key={member.id} className="rounded-md border border-border p-4">
                  <Link href={`/profile/${member.user.id}`} className="font-semibold hover:text-primary">
                    {member.user.name ?? member.user.username}
                  </Link>
                  <div className="mt-1 text-sm text-muted-foreground">{member.role}</div>
                  {isOwner && member.user.id !== project.owner.id ? (
                    <form action={removeProjectMemberAction} className="mt-3">
                      <input type="hidden" name="memberId" value={member.id} />
                      <Button variant="outline" className="h-8">
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>
            {isOwner ? (
              <form action={addProjectMemberAction} className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="projectId" value={project.id} />
                <div className="space-y-2">
                  <Label htmlFor="identifier">Username or email</Label>
                  <Input id="identifier" name="identifier" placeholder="leahmorgan" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" placeholder="Writer, producer..." required />
                </div>
                <Button className="self-end">
                  <UserPlus className="h-4 w-4" />
                  Add
                </Button>
              </form>
            ) : null}
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
                <div key={link.id} className="flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-md border border-border p-3 text-sm font-medium hover:border-accent"
                  >
                    <span className="truncate">{link.label}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                  {isOwner ? (
                    <form action={deleteProjectLinkAction}>
                      <input type="hidden" name="linkId" value={link.id} />
                      <Button variant="outline" aria-label={`Remove ${link.label}`} className="h-10 w-10 px-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
        {isOwner ? (
          <Card>
            <CardHeader>
              <CardTitle>Add resource</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addProjectLinkAction} className="space-y-3">
                <input type="hidden" name="projectId" value={project.id} />
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input id="label" name="label" placeholder="Pitch deck, reel, moodboard..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" name="url" type="url" placeholder="https://..." required />
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add resource
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}
        {!isOwner && project.links.length === 0 ? (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <LinkIcon className="mt-1 h-4 w-4 text-accent" />
                No external resources have been linked yet.
              </div>
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
