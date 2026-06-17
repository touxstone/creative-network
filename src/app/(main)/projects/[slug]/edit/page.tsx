import { notFound, redirect } from 'next/navigation';
import { ProjectForm } from '@/components/projects/project-form';
import { auth } from '@/core/auth/auth';
import { getProjectBySlug } from '@/features/projects/queries';

interface EditProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
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
      <ProjectForm project={project} />
    </div>
  );
}
