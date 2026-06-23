import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Globe2,
  MapPin,
  MessageSquare,
  Pause,
  Play,
  Send,
  UserRound,
} from 'lucide-react';
import {
  createServiceInquiryAction,
  updateServiceListingStatusAction,
} from '@/features/marketplace/actions';
import { deliveryModeLabels, serviceStatusLabels } from '@/features/marketplace/constants';
import { getServiceListingBySlug } from '@/features/marketplace/queries';
import { auth } from '@/core/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ServiceListingPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ inquiry?: string; error?: string }>;
}

export default async function ServiceListingPage({ params, searchParams }: ServiceListingPageProps) {
  const [{ slug }, session, query] = await Promise.all([params, auth(), searchParams]);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const listing = await getServiceListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const isOwner = listing.ownerId === session.user.id;

  if (listing.status !== 'ACTIVE' && !isOwner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {listing.category}
                </span>
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {deliveryModeLabels[listing.deliveryMode as keyof typeof deliveryModeLabels] ?? listing.deliveryMode}
                </span>
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {serviceStatusLabels[listing.status as keyof typeof serviceStatusLabels] ?? listing.status}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-bold">{listing.title}</h1>
              <p className="mt-3 text-lg leading-7 text-muted-foreground">{listing.summary}</p>
              <p className="mt-6 whitespace-pre-wrap leading-7 text-muted-foreground">
                {listing.description}
              </p>
            </CardContent>
          </Card>

          {!isOwner && listing.status === 'ACTIVE' ? (
            <Card>
              <CardHeader>
                <CardTitle>Send interest</CardTitle>
              </CardHeader>
              <CardContent>
                {query?.inquiry === 'sent' ? (
                  <div className="mb-4 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
                    Inquiry sent. The service owner can review it from this listing.
                  </div>
                ) : null}
                {query?.error ? (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    That inquiry could not be saved. Check the message and try again.
                  </div>
                ) : null}
                <form action={createServiceInquiryAction} className="space-y-3">
                  <input type="hidden" name="listingId" value={listing.id} />
                  <Textarea
                    name="message"
                    required
                    maxLength={1600}
                    className="min-h-32"
                    placeholder="Introduce the project, timeline, language, references, and what kind of collaboration you are exploring."
                  />
                  <Button>
                    <Send className="h-4 w-4" />
                    Send inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}

          {isOwner ? (
            <Card>
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.inquiries.length > 0 ? (
                  listing.inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="rounded-md border border-border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link href={`/profile/${inquiry.sender.id}`} className="font-semibold hover:text-primary">
                          {inquiry.sender.name ?? inquiry.sender.username}
                        </Link>
                        <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {inquiry.sender.profession ?? 'Creative professional'} ·{' '}
                        {inquiry.sender.location ?? 'Location pending'}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {inquiry.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No inquiries yet.</p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Link href={`/profile/${listing.owner.id}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                <UserRound className="h-4 w-4" />
                {listing.owner.name ?? listing.owner.username}
              </Link>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                {listing.owner.profession ?? 'Creative professional'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {listing.owner.location ?? 'Location flexible'}
              </div>
              {listing.language ? (
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4" />
                  {listing.language}
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {listing._count.inquiries} inquiry signal(s)
              </div>
              {listing.rateNote ? <div>Rate note: {listing.rateNote}</div> : null}
              {listing.availability ? <div>Availability: {listing.availability}</div> : null}
            </CardContent>
          </Card>

          {isOwner ? (
            <Card>
              <CardHeader>
                <CardTitle>Manage service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <form action={updateServiceListingStatusAction}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <input type="hidden" name="status" value={listing.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'} />
                  <Button variant="outline" className="w-full">
                    {listing.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {listing.status === 'ACTIVE' ? 'Pause listing' : 'Activate listing'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
