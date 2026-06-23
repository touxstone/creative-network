import Link from 'next/link';
import { ArrowRight, Globe2, MapPin, MessageSquare, UserRound } from 'lucide-react';
import { deliveryModeLabels, serviceStatusLabels } from '@/features/marketplace/constants';
import type { ServiceListingSummary } from '@/features/marketplace/types';
import { Card, CardContent } from '@/components/ui/card';

export function ServiceCard({ listing }: { listing: ServiceListingSummary }) {
  return (
    <Card>
      <CardContent className="flex h-full flex-col p-5">
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

        <Link href={`/marketplace/${listing.slug}`} className="mt-4 block text-xl font-semibold hover:text-primary">
          {listing.title}
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{listing.summary}</p>

        <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {listing.owner.name ?? listing.owner.username}
            {listing.owner.profession ? ` · ${listing.owner.profession}` : null}
          </div>
          {listing.language ? (
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              {listing.language}
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {listing.owner.location ?? 'Location flexible'}
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {listing._count.inquiries} inquiry signal(s)
          </div>
        </div>

        <Link
          href={`/marketplace/${listing.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          View service
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
