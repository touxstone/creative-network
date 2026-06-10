'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';

const createPostSchema = z.object({
  content: z.string().trim().min(1, 'Post cannot be empty.').max(2000),
});

const postIdSchema = z.object({
  postId: z.string().min(1),
});

const createCommentSchema = postIdSchema.extend({
  content: z.string().trim().min(1, 'Comment cannot be empty.').max(600),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

export async function createPostAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = createPostSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/feed?error=post');
  }

  await prisma.post.create({
    data: {
      content: parsed.data.content,
      authorId: userId,
    },
  });

  revalidatePath('/feed');
  redirect('/feed');
}

export async function toggleLikeAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = postIdSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/feed?error=like');
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId: parsed.data.postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId: parsed.data.postId,
          userId,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId: parsed.data.postId,
        userId,
      },
    });
  }

  revalidatePath('/feed');
}

export async function createCommentAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = createCommentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/feed?error=comment');
  }

  await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      authorId: userId,
      content: parsed.data.content,
    },
  });

  revalidatePath('/feed');
}

export async function deletePostAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = postIdSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/feed?error=delete');
  }

  const post = await prisma.post.findUnique({
    where: { id: parsed.data.postId },
    select: { authorId: true },
  });

  if (!post || post.authorId !== userId) {
    redirect('/feed?error=delete');
  }

  await prisma.post.delete({
    where: { id: parsed.data.postId },
  });

  revalidatePath('/feed');
  redirect('/feed');
}
