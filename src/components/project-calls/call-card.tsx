import Link from 'next/link';
import { ArrowRight, CalendarDays, FolderKanban, MapPin, UserRound } from 'lucide-react';
import { callStatusLabels } from '@/features/project-calls/constants';
import type { ProjectCallSummary } from '@/features/project-calls/types';
import { Card, CardContent } from '@/components/ui/card';

export function CallCard({ call }: { call: ProjectCallSummary }) {
  return (
    <Card>
      <CardContent className="p-5">
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
        <Link href={`/calls/${call.id}`} className="mt-4 block text-xl font-semibold hover:text-primary">
          {call.title}
        </Link>
        <p className="mt-2 font-medium text-muted-foreground">{call.role}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {call.description}
        </p>
        <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            {call.project.title}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {call.location ?? call.project.location ?? 'Location flexible'}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {call.deadline
              ? `Deadline ${call.deadline.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
              : 'No deadline set'}
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {call.applications.length} application(s)
          </div>
        </div>
        <Link href={`/calls/${call.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
          View call
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
