import type { ServiceInquiry, ServiceListing, User } from '@prisma/client';

export type MarketplaceUser = Pick<User, 'id' | 'name' | 'username' | 'profession' | 'location'>;

export type ServiceListingSummary = ServiceListing & {
  owner: MarketplaceUser;
  _count: {
    inquiries: number;
  };
};

export type ServiceListingDetail = ServiceListingSummary & {
  inquiries: Array<
    ServiceInquiry & {
      sender: MarketplaceUser;
    }
  >;
};

export interface MarketplaceFilters {
  q?: string;
  category?: string;
}
