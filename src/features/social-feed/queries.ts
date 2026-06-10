import { prisma } from '@/lib/db/prisma';
import type { FeedPost } from './types';

export async function getFeedPosts(viewerId: string): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profession: true,
        },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        take: 5,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      likes: {
        where: { userId: viewerId },
        select: { userId: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    isLikedByViewer: post.likes.some((like) => like.userId === viewerId),
  }));
}

export async function getFeedStats() {
  const [posts, comments, likes] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
    prisma.like.count(),
  ]);

  return { posts, comments, likes };
}
