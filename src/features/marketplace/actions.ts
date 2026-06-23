'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { createNotification } from '@/features/notifications/actions';
import { prisma } from '@/lib/db/prisma';
import { deliveryModes, serviceCategories, serviceStatuses } from './constants';

const listingSchema = z.object({
  title: z.string().trim().min(4).max(140),
  summary: z.string().trim().min(12).max(240),
  description: z.string().trim().min(30).max(4000),
  category: z.enum(serviceCategories),
  language: z.string().trim().max(80).optional(),
  deliveryMode: z.enum(deliveryModes),
  rateNote: z.string().trim().max(160).optional(),
  availability: z.string().trim().max(160).optional(),
});

const listingStatusSchema = z.object({
  listingId: z.string().min(1),
  status: z.enum(serviceStatuses),
});

const inquirySchema = z.object({
  listingId: z.string().min(1),
  message: z.string().trim().min(20).max(1600),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

async function buildUniqueSlug(title: string, username: string) {
  const base = slugify(`${title}-${username}`) || `service-${username}`;
  let slug = base;
  let suffix = 2;

  while (await prisma.serviceListing.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createServiceListingAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = listingSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/marketplace?error=listing');
  }

  const owner = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  if (!owner) {
    redirect('/marketplace?error=listing');
  }

  const slug = await buildUniqueSlug(parsed.data.title, owner.username);

  const listing = await prisma.serviceListing.create({
    data: {
      ownerId: userId,
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      description: parsed.data.description,
      category: parsed.data.category,
      language: parsed.data.language || null,
      deliveryMode: parsed.data.deliveryMode,
      rateNote: parsed.data.rateNote || null,
      availability: parsed.data.availability || null,
      status: 'ACTIVE',
    },
    select: { slug: true },
  });

  revalidatePath('/marketplace');
  redirect(`/marketplace/${listing.slug}`);
}

export async function updateServiceListingStatusAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = listingStatusSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/marketplace?error=status');
  }

  const listing = await prisma.serviceListing.findUnique({
    where: { id: parsed.data.listingId },
    select: { id: true, ownerId: true, slug: true },
  });

  if (!listing || listing.ownerId !== userId) {
    redirect('/marketplace?error=status');
  }

  await prisma.serviceListing.update({
    where: { id: listing.id },
    data: { status: parsed.data.status },
  });

  revalidatePath('/marketplace');
  revalidatePath(`/marketplace/${listing.slug}`);
  redirect(`/marketplace/${listing.slug}`);
}

export async function createServiceInquiryAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/marketplace?error=inquiry');
  }

  const listing = await prisma.serviceListing.findUnique({
    where: { id: parsed.data.listingId },
    select: {
      id: true,
      slug: true,
      title: true,
      ownerId: true,
      status: true,
    },
  });

  if (!listing || listing.status !== 'ACTIVE' || listing.ownerId === userId) {
    redirect('/marketplace?error=inquiry');
  }

  const inquiry = await prisma.serviceInquiry.create({
    data: {
      listingId: listing.id,
      senderId: userId,
      recipientId: listing.ownerId,
      message: parsed.data.message,
    },
    select: { id: true },
  });

  await createNotification({
    recipientId: listing.ownerId,
    actorId: userId,
    type: 'SERVICE_INQUIRY',
    title: 'New marketplace inquiry',
    body: listing.title,
    href: `/marketplace/${listing.slug}`,
    dedupeKey: `service-inquiry:${inquiry.id}`,
  });

  revalidatePath('/marketplace');
  revalidatePath(`/marketplace/${listing.slug}`);
  redirect(`/marketplace/${listing.slug}?inquiry=sent`);
}
