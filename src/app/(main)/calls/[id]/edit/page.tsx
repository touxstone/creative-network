import { notFound, redirect } from 'next/navigation';
import { CallForm } from '@/components/project-calls/call-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/core/auth/auth';
import { getProjectCallById } from '@/features/project-calls/queries';

interface EditCallPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCallPage({ params }: EditCallPageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const call = await getProjectCallById(id);

  if (!call) {
    notFound();
  }

  const userId = session?.user?.id;
  const canManage = userId === call.creator.id || userId === call.project.ownerId;

  if (!canManage) {
    redirect(`/calls/${call.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit call</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update the role, deadline, status, or details for {call.project.title}.
          </p>
        </CardHeader>
        <CardContent>
          <CallForm project={call.project} call={call} />
        </CardContent>
      </Card>
    </div>
  );
}
