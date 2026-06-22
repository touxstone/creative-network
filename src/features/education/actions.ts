'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';

const bookmarkSchema = z.object({
  itemId: z.string().min(1),
  slug: z.string().min(1).optional(),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

export async function toggleLearningBookmarkAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = bookmarkSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/education?error=bookmark');
  }

  const item = await prisma.learningItem.findUnique({
    where: { id: parsed.data.itemId },
    select: {
      id: true,
      slug: true,
      status: true,
    },
  });

  if (!item || item.status !== 'PUBLISHED') {
    redirect('/education?error=bookmark');
  }

  const existingBookmark = await prisma.learningBookmark.findUnique({
    where: {
      itemId_userId: {
        itemId: item.id,
        userId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.learningBookmark.delete({
      where: {
        itemId_userId: {
          itemId: item.id,
          userId,
        },
      },
    });
  } else {
    await prisma.learningBookmark.create({
      data: {
        itemId: item.id,
        userId,
      },
    });
  }

  revalidatePath('/education');
  revalidatePath(`/education/${item.slug}`);
}
