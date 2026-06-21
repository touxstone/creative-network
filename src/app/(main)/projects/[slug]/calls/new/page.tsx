import { notFound, redirect } from 'next/navigation';
import { auth } from '@/core/auth/auth';
import { getProjectBySlug } from '@/features/projects/queries';
import { CallForm } from '@/components/project-calls/call-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <CallForm project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
