import type { Comment, Like, Post, User } from '@prisma/client';

export type FeedPost = Post & {
  author: Pick<User, 'id' | 'name' | 'username' | 'profession'>;
  comments: Array<
    Comment & {
      author: Pick<User, 'id' | 'name' | 'username'>;
    }
  >;
  likes: Array<Pick<Like, 'userId'>>;
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByViewer: boolean;
};
