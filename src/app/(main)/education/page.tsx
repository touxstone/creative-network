import { BookOpen, Filter, Search } from 'lucide-react';
import { redirect } from 'next/navigation';
import { LearningCard } from '@/components/education/learning-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { auth } from '@/core/auth/auth';
import { getLearningCatalog, getLearningFilterOptions } from '@/features/education/queries';

interface EducationPageProps {
  searchParams?: Promise<{
    q?: string;
    language?: string;
    level?: string;
    discipline?: string;
  }>;
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  options: string[];
}) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ''}
        className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function EducationPage({ searchParams }: EducationPageProps) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const filters = {
    q: params?.q?.trim() ?? '',
    language: params?.language ?? '',
    level: params?.level ?? '',
    discipline: params?.discipline ?? '',
  };

  const [items, filterOptions] = await Promise.all([
    getLearningCatalog(session.user.id, filters),
    getLearningFilterOptions(),
  ]);
  const savedCount = items.filter((item) => item.isBookmarkedByViewer).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <BookOpen className="h-4 w-4" />
            Education preview
          </div>
          <h1 className="mt-2 text-3xl font-bold">Classes and creative workshops</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            A curated preview of learning sessions for writers, performers, producers, composers,
            and collaborative project teams.
          </p>
        </div>
        <div className="grid gap-1 rounded-md border border-border bg-white px-4 py-3 text-sm">
          <span className="text-muted-foreground">Saved by you</span>
          <span className="text-2xl font-semibold">{savedCount}</span>
        </div>
      </section>

      <Card>
        <CardContent className="p-5">
          <form action="/education" className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={filters.q}
                  placeholder="writing, casting, Català, pitch..."
                  className="pl-9"
                />
              </div>
            </label>
            <FilterSelect
              name="language"
              label="Language"
              value={filters.language}
              options={filterOptions.languages}
            />
            <FilterSelect name="level" label="Level" value={filters.level} options={filterOptions.levels} />
            <FilterSelect
              name="discipline"
              label="Discipline"
              value={filters.discipline}
              options={filterOptions.disciplines}
            />
            <Button>
              <Filter className="h-4 w-4" />
              Apply
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        {items.length > 0 ? (
          items.map((item) => <LearningCard key={item.id} item={item} />)
        ) : (
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="font-semibold">No sessions match these filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another language, discipline, or search term.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
