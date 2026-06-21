import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Edit, FolderKanban, MapPin, Send, Trash2, UserRound } from 'lucide-react';
import { applyToProjectCallAction, deleteProjectCallAction } from '@/features/project-calls/actions';
import { applicationStatusLabels, callStatusLabels } from '@/features/project-calls/constants';
import { getProjectCallById } from '@/features/project-calls/queries';
import { auth } from '@/core/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CallPageProps {
  params: Promise<{ id: string }>;
}

export default async function CallPage({ params }: CallPageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const call = await getProjectCallById(id);

  if (!call) {
    notFound();
  }

  const userId = session?.user?.id;
  const isOwner = userId === call.project.ownerId || userId === call.creator.id;
  const ownApplication = call.applications.find((application) => application.applicantId === userId);
  const canApply = Boolean(userId && !isOwner && call.status === 'OPEN');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                {callStatusLabels[call.status as keyof typeof callStatusLabels] ?? call.status}
              </span>
              {call.language ? (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {call.language}
                </span>
              ) : null}
              {call.discipline ? (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {call.discipline}
                </span>
              ) : null}
            </div>
            <h1 className="mt-5 text-3xl font-bold">{call.title}</h1>
            <p className="mt-2 text-lg font-medium text-muted-foreground">{call.role}</p>
            <p className="mt-5 whitespace-pre-wrap leading-7 text-muted-foreground">
              {call.description}
            </p>
          </CardContent>
        </Card>

        {canApply ? (
          <Card>
            <CardHeader>
              <CardTitle>{ownApplication ? 'Update application' : 'Apply to this call'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={applyToProjectCallAction} className="space-y-3">
                <input type="hidden" name="callId" value={call.id} />
                <Textarea
                  name="message"
                  defaultValue={ownApplication?.message ?? ''}
                  placeholder="Introduce yourself, relevant experience, availability, and useful links."
                  className="min-h-36"
                  required
                  maxLength={2000}
                />
                <Button>
                  <Send className="h-4 w-4" />
                  {ownApplication ? 'Update application' : 'Send application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {isOwner ? (
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {call.applications.length > 0 ? (
                call.applications.map((application) => (
                  <div key={application.id} className="rounded-md border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/profile/${application.applicant.id}`} className="font-semibold hover:text-primary">
                        {application.applicant.name ?? application.applicant.username}
                      </Link>
                      <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {applicationStatusLabels[application.status] ?? application.status}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {application.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </section>

      <aside className="space-y-4">
        {isOwner ? (
          <Card>
            <CardHeader>
              <CardTitle>Manage call</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/calls/${call.id}/edit`}>
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4" />
                  Edit call
                </Button>
              </Link>
              <form action={deleteProjectCallAction}>
                <input type="hidden" name="callId" value={call.id} />
                <Button variant="outline" className="w-full text-red-700 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                  Delete call
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Call details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <Link href={`/projects/${call.project.slug}`} className="flex items-center gap-2 text-foreground hover:text-primary">
              <FolderKanban className="h-4 w-4" />
              {call.project.title}
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {call.location ?? call.project.location ?? 'Location flexible'}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {call.deadline
                ? call.deadline.toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'No deadline set'}
            </div>
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              Posted by {call.creator.name ?? call.creator.username}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
