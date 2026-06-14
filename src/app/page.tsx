import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  MessageSquare,
  Network,
  Play,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import { FEATURED_SPECIALTIES } from '@/core/shared/taxonomies/specialties';
import {
  LANDING_LOCALES,
  LOCALE_LABELS,
  getLandingLocale,
  landingCopy,
} from '@/lib/landing-i18n';

interface HomePageProps {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
}

function localizedHref(path: string, locale: string) {
  return locale === 'en' ? path : `${path}?lang=${locale}`;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const locale = getLandingLocale(params?.lang);
  const copy = landingCopy[locale];

  return (
    <main className="min-h-screen bg-background" lang={locale}>
      <section className="relative min-h-[88vh] overflow-hidden bg-foreground text-white">
        <Image
          src="/media/landing-poster.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.42),rgba(0,0,0,0.12))]" />

        <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href={localizedHref('/', locale)} className="flex items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-white text-sm text-foreground">
              CN
            </span>
            <span>Creative Network</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              {copy.navSignIn}
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white/90"
            >
              {copy.navCreate}
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto flex max-w-7xl justify-end px-4 sm:px-6">
          <div className="flex flex-wrap justify-end gap-1 rounded-md border border-white/20 bg-black/20 p-1 backdrop-blur">
            {LANDING_LOCALES.map((item) => (
              <Link
                key={item}
                href={localizedHref('/', item)}
                aria-current={item === locale ? 'page' : undefined}
                className={
                  item === locale
                    ? 'rounded px-2 py-1 text-xs font-semibold text-white'
                    : 'rounded px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white'
                }
              >
                {LOCALE_LABELS[item]}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(88vh-6.75rem)] max-w-7xl items-center px-4 py-16 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur">
              <Play className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              {copy.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-red-700"
              >
                {copy.create}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {copy.demo}
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/70">
              {copy.demoAccount}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border p-5">
            <MessageSquare className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{copy.loungeTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy.lounge}
            </p>
          </div>
          <div className="rounded-lg border border-border p-5">
            <Network className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{copy.networkTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy.network}
            </p>
          </div>
          <div className="rounded-lg border border-border p-5">
            <Clapperboard className="h-5 w-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{copy.profilesTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy.profiles}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{copy.tryTitle}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {copy.tryBody}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {copy.previewPosts.map((post) => (
              <article key={post.author} className="rounded-lg border border-border bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-muted font-semibold">
                    {post.author
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{post.author}</h3>
                    <p className="text-sm text-muted-foreground">{post.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">{copy.networkingPreview}</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {copy.networkHighlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-muted p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/login"
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-white transition hover:bg-black"
          >
            {copy.openWorkspace}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{copy.specialtiesTitle}</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {copy.specialties}
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-semibold transition hover:bg-muted"
            >
              <UserPlus className="h-4 w-4" />
              {copy.create}
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {FEATURED_SPECIALTIES.map((specialty) => (
              <span key={specialty} className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
