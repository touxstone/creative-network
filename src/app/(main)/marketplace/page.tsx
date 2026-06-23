import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BriefcaseBusiness, Filter, Plus, Search } from 'lucide-react';
import { ServiceCard } from '@/components/marketplace/service-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { auth } from '@/core/auth/auth';
import { serviceCategories } from '@/features/marketplace/constants';
import { getMyServiceListings, getServiceListings } from '@/features/marketplace/queries';

interface MarketplacePageProps {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    error?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const viewerId = session.user.id;
  const filters = {
    q: params?.q?.trim() ?? '',
    category: params?.category ?? '',
  };

  const [listings, myListings] = await Promise.all([
    getServiceListings(filters),
    getMyServiceListings(viewerId),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              <BriefcaseBusiness className="h-4 w-4" />
              Marketplace preview
            </div>
            <h1 className="mt-2 text-3xl font-bold">Creative services</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Discover script notes, casting help, music, editing, coaching, and production support.
              Interest is recorded here; payments are not processed yet.
            </p>
          </div>
          <Link href="/marketplace/new">
            <Button>
              <Plus className="h-4 w-4" />
              Publish service
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-5">
            <form action="/marketplace" className="grid gap-4 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
              <label className="space-y-2 text-sm">
                <span className="font-medium">Search</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="q"
                    defaultValue={filters.q}
                    placeholder="script notes, casting, composer, Català..."
                    className="pl-9"
                  />
                </div>
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium">Category</span>
                <select
                  name="category"
                  defaultValue={filters.category}
                  className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">All</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <Button>
                <Filter className="h-4 w-4" />
                Apply
              </Button>
            </form>
            {params?.error ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                That marketplace action could not be saved. Check the details and try again.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          {listings.length > 0 ? (
            listings.map((listing) => <ServiceCard key={listing.id} listing={listing} />)
          ) : (
            <Card className="xl:col-span-2">
              <CardContent className="p-8 text-center">
                <BriefcaseBusiness className="mx-auto h-8 w-8 text-accent" />
                <h2 className="mt-4 font-semibold">No services match these filters</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Try another category or publish the first service for this niche.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Your services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myListings.length > 0 ? (
              myListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/marketplace/${listing.slug}`}
                  className="block rounded-md border border-border p-3 text-sm hover:border-accent"
                >
                  <div className="font-semibold">{listing.title}</div>
                  <div className="mt-1 text-muted-foreground">
                    {listing.status} · {listing._count.inquiries} inquiry signal(s)
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Publish a service to test demand.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>No payments yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            PR-11 records interest and contact context only. Stripe, invoicing, escrow, and reviews
            remain out of scope.
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
