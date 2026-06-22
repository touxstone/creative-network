import Link from 'next/link';
import { Bookmark, BookmarkCheck, Clock, GraduationCap, Languages } from 'lucide-react';
import { toggleLearningBookmarkAction } from '@/features/education/actions';
import type { LearningCatalogItem } from '@/features/education/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function LearningCard({ item }: { item: LearningCatalogItem }) {
  return (
    <Card>
      <CardContent className="flex h-full flex-col p-5">
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

        <Link href={`/education/${item.slug}`} className="mt-4 block text-xl font-semibold hover:text-primary">
          {item.title}
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

        <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {item.instructorName}
            {item.instructorRole ? ` · ${item.instructorRole}` : null}
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {item.language}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formatDuration(item.durationMinutes)}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{item._count.bookmarks} interested</span>
          <form action={toggleLearningBookmarkAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <Button variant={item.isBookmarkedByViewer ? 'secondary' : 'outline'}>
              {item.isBookmarkedByViewer ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {item.isBookmarkedByViewer ? 'Saved' : 'Save'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
