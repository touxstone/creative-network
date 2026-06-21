import Link from 'next/link';
import {
  FileText,
  FolderKanban,
  Megaphone,
  Search,
  UserRound,
} from 'lucide-react';
import { searchWorkspace } from '@/features/search/queries';
import type {
  SearchCall,
  SearchPost,
  SearchProfile,
  SearchProject,
} from '@/features/search/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string;
    type?: string;
  }>;
}

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'profiles', label: 'Profiles' },
  { id: 'projects', label: 'Projects' },
  { id: 'calls', label: 'Calls' },
  { id: 'posts', label: 'Posts' },
];

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold">{hasQuery ? 'No matching results' : 'Start a search'}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {hasQuery
            ? 'Try a profession, language, city, project title, or production role.'
            : 'Search across profiles, posts, projects, and casting calls.'}
        </p>
      </CardContent>
    </Card>
  );
}

function ResultSection({
  title,
  icon: Icon,
  children,
  count,
}: {
  title: string;
  icon: typeof UserRound;
  children: React.ReactNode;
  count: number;
}) {
  if (count === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function ProfileResult({ profile }: { profile: SearchProfile }) {
  return (
    <Link href={`/profile/${profile.id}`} className="rounded-lg border border-border bg-white p-4 hover:border-accent">
      <div className="font-semibold">{profile.name ?? profile.username}</div>
      <p className="mt-1 text-sm text-muted-foreground">
        {profile.profession ?? 'Creative professional'} · {profile.location ?? 'Location pending'}
      </p>
      {profile.bio ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{profile.bio}</p> : null}
    </Link>
  );
}

function ProjectResult({ project }: { project: SearchProject }) {
  return (
    <Link href={`/projects/${project.slug}`} className="rounded-lg border border-border bg-white p-4 hover:border-accent">
      <div className="flex flex-wrap items-center gap-2">
        <div className="font-semibold">{project.title}</div>
        {project.language ? (
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {project.language}
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {project.logline ?? project.description}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {project.owner.name ?? project.owner.username} · {project.location ?? 'Location flexible'}
      </p>
    </Link>
  );
}

function CallResult({ call }: { call: SearchCall }) {
  return (
    <Link href={`/calls/${call.id}`} className="rounded-lg border border-border bg-white p-4 hover:border-accent">
      <div className="flex flex-wrap items-center gap-2">
        <div className="font-semibold">{call.title}</div>
        {call.language ? (
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {call.language}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{call.role}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {call.description}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {call.project.title} · {call.location ?? 'Location flexible'}
      </p>
    </Link>
  );
}

function PostResult({ post }: { post: SearchPost }) {
  return (
    <Link href="/feed" className="rounded-lg border border-border bg-white p-4 hover:border-accent">
      <div className="font-semibold">{post.author.name ?? post.author.username}</div>
      <p className="mt-1 text-xs text-muted-foreground">
        {post.author.profession ?? 'Creative professional'} ·{' '}
        {post.createdAt.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.content}</p>
    </Link>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? '';
  const activeType = params?.type ?? 'all';
  const results = await searchWorkspace(query);
  const hasQuery = query.length >= 2;

  const showProfiles = activeType === 'all' || activeType === 'profiles';
  const showProjects = activeType === 'all' || activeType === 'projects';
  const showCalls = activeType === 'all' || activeType === 'calls';
  const showPosts = activeType === 'all' || activeType === 'posts';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="mt-2 text-muted-foreground">
          Find creative people, project signals, open calls, and community posts.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <form action="/search" className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search actor, Català, composer, Madrid, casting..."
                className="pl-9"
              />
            </div>
            <input type="hidden" name="type" value={activeType} />
            <Button>Search</Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/search?q=${encodeURIComponent(query)}&type=${tab.id}`}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  activeType === tab.id
                    ? 'border-foreground bg-foreground text-white'
                    : 'border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {hasQuery && results.total > 0 ? (
        <div className="text-sm text-muted-foreground">
          {results.total} result(s) for <span className="font-medium text-foreground">{query}</span>
        </div>
      ) : null}

      {!hasQuery || results.total === 0 ? <EmptyState hasQuery={hasQuery} /> : null}

      <div className="space-y-7">
        {showProfiles ? (
          <ResultSection title="Profiles" icon={UserRound} count={results.profiles.length}>
            {results.profiles.map((profile) => (
              <ProfileResult key={profile.id} profile={profile} />
            ))}
          </ResultSection>
        ) : null}

        {showProjects ? (
          <ResultSection title="Projects" icon={FolderKanban} count={results.projects.length}>
            {results.projects.map((project) => (
              <ProjectResult key={project.id} project={project} />
            ))}
          </ResultSection>
        ) : null}

        {showCalls ? (
          <ResultSection title="Calls" icon={Megaphone} count={results.calls.length}>
            {results.calls.map((call) => (
              <CallResult key={call.id} call={call} />
            ))}
          </ResultSection>
        ) : null}

        {showPosts ? (
          <ResultSection title="Posts" icon={FileText} count={results.posts.length}>
            {results.posts.map((post) => (
              <PostResult key={post.id} post={post} />
            ))}
          </ResultSection>
        ) : null}
      </div>
    </div>
  );
}
