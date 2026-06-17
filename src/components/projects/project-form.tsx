import { Save } from 'lucide-react';
import { saveProjectAction } from '@/features/projects/actions';
import { projectStatusLabels, projectStatusValues } from '@/features/projects/constants';
import type { ProjectDetail } from '@/features/projects/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProjectFormProps {
  project?: ProjectDetail;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const primaryLink = project?.links[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Edit project' : 'New project'}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Use external links for reels, decks, drafts, and references. File storage can come later.
        </p>
      </CardHeader>
      <CardContent>
        <form action={saveProjectAction} className="grid gap-4 sm:grid-cols-2">
          {project ? <input type="hidden" name="projectId" value={project.id} /> : null}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title ?? ''} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="logline">Logline</Label>
            <Input
              id="logline"
              name="logline"
              defaultValue={project?.logline ?? ''}
              maxLength={240}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project?.description ?? ''}
              required
              className="min-h-44"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? 'DEVELOPMENT'}
              className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {projectStatusValues.map((status) => (
                <option key={status} value={status}>
                  {projectStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerRole">Your role</Label>
            <Input
              id="ownerRole"
              name="ownerRole"
              defaultValue={project?.ownerRole ?? ''}
              placeholder="Producer, writer, composer..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" name="language" defaultValue={project?.language ?? ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={project?.location ?? ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkLabel">External link label</Label>
            <Input
              id="linkLabel"
              name="linkLabel"
              defaultValue={primaryLink?.label ?? ''}
              placeholder="Pitch deck, reel, script sample..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkUrl">External link URL</Label>
            <Input
              id="linkUrl"
              name="linkUrl"
              type="url"
              defaultValue={primaryLink?.url ?? ''}
              placeholder="https://..."
            />
          </div>
          <Button className="sm:col-span-2">
            <Save className="h-4 w-4" />
            Save project
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
