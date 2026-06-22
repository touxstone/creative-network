import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Clock,
  ExternalLink,
  GraduationCap,
  Languages,
} from 'lucide-react';
import { toggleLearningBookmarkAction } from '@/features/education/actions';
import { getLearningItemBySlug } from '@/features/education/queries';
import { auth } from '@/core/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EducationDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export default async function EducationDetailPage({ params }: EducationDetailPageProps) {
  const [{ slug }, session] = await Promise.all([params, auth()]);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const item = await getLearningItemBySlug(slug, session.user.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/education" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to education
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {item.format}
                </span>
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {item.level}
                </span>
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {item.discipline}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-bold">{item.title}</h1>
              <p className="mt-3 text-lg leading-7 text-muted-foreground">{item.summary}</p>
              <p className="mt-6 whitespace-pre-wrap leading-7 text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What this preview validates</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <p>
                This PR records interest before Creative Network commits to video hosting, payments,
                certificates, or a full learning management system.
              </p>
              <p>
                Saved sessions are an early signal for which languages, disciplines, and formats are
                most valuable to the creative community.
              </p>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {item.instructorName}
              </div>
              {item.instructorRole ? (
                <div className="text-xs text-muted-foreground">{item.instructorRole}</div>
              ) : null}
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {item.language}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatDuration(item.durationMinutes)}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {item.startsAt
                  ? item.startsAt.toLocaleDateString('en', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'On demand preview'}
              </div>
              {item.provider ? <div>Provider: {item.provider}</div> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interest</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {item._count.bookmarks} creative(s) saved this session.
              </p>
              <form action={toggleLearningBookmarkAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <Button variant={item.isBookmarkedByViewer ? 'secondary' : 'primary'} className="w-full">
                  {item.isBookmarkedByViewer ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {item.isBookmarkedByViewer ? 'Saved' : 'Save interest'}
                </Button>
              </form>
              {item.externalUrl ? (
                <a href={item.externalUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    External reference
                  </Button>
                </a>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
