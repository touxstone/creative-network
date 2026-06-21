import { Megaphone, Save } from 'lucide-react';
import { saveProjectCallAction } from '@/features/project-calls/actions';
import { callStatusLabels, callStatusValues } from '@/features/project-calls/constants';
import type { ProjectCallDetail } from '@/features/project-calls/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CallFormProject {
  id: string;
  title: string;
  language: string | null;
  location: string | null;
}

interface CallFormProps {
  project: CallFormProject;
  call?: ProjectCallDetail;
}

function formatDateInput(date?: Date | null) {
  return date ? date.toISOString().slice(0, 10) : '';
}

export function CallForm({ project, call }: CallFormProps) {
  const isEditing = Boolean(call);

  return (
    <form action={saveProjectCallAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="projectId" value={project.id} />
      {call ? <input type="hidden" name="callId" value={call.id} /> : null}

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="title">Call title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={call?.title ?? ''}
          placeholder="Casting lead performer for proof of concept"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role needed</Label>
        <Input
          id="role"
          name="role"
          required
          defaultValue={call?.role ?? ''}
          placeholder="Actor, composer, script editor..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="discipline">Discipline</Label>
        <Input
          id="discipline"
          name="discipline"
          defaultValue={call?.discipline ?? ''}
          placeholder="Casting, writing, music, production..."
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          className="min-h-40"
          defaultValue={call?.description ?? ''}
          placeholder="Describe the role, tone, availability, submission expectations, and useful references."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Input id="language" name="language" defaultValue={call?.language ?? project.language ?? ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" defaultValue={call?.location ?? project.location ?? ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={call?.status ?? 'OPEN'}
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
        <Input id="deadline" name="deadline" type="date" defaultValue={formatDateInput(call?.deadline)} />
      </div>
      <Button className="sm:col-span-2">
        {isEditing ? <Save className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
        {isEditing ? 'Save call' : 'Publish call'}
      </Button>
    </form>
  );
}
