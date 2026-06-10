import Link from 'next/link';
import { MessageSquare, Send, Trash2, ThumbsUp } from 'lucide-react';
import { auth } from '@/core/auth/auth';
import {
  createCommentAction,
  createPostAction,
  deletePostAction,
  toggleLikeAction,
} from '@/features/social-feed/actions';
import { getFeedPosts, getFeedStats } from '@/features/social-feed/queries';
import type { FeedPost } from '@/features/social-feed/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FeedPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

function getInitials(name: string | null | undefined, fallback = 'CN') {
  return (name ?? fallback)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function PostCard({ post, viewerId }: { post: FeedPost; viewerId: string }) {
  const canDelete = post.authorId === viewerId;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-muted font-semibold">
            {getInitials(post.author.name, post.author.username)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link href={`/profile/${post.author.id}`} className="font-semibold hover:text-primary">
                  {post.author.name ?? post.author.username}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {post.author.profession ?? 'Creative professional'} · {formatDate(post.createdAt)}
                </div>
              </div>
              {canDelete ? (
                <form action={deletePostAction}>
                  <input type="hidden" name="postId" value={post.id} />
                  <Button variant="ghost" aria-label="Delete post" className="h-9 w-9 px-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              ) : null}
            </div>

            <p className="mt-4 whitespace-pre-wrap leading-7">{post.content}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{post._count.likes} likes</span>
              <span>{post._count.comments} comments</span>
            </div>

            <div className="mt-4 flex gap-2">
              <form action={toggleLikeAction}>
                <input type="hidden" name="postId" value={post.id} />
                <Button variant={post.isLikedByViewer ? 'secondary' : 'ghost'}>
                  <ThumbsUp className="h-4 w-4" />
                  {post.isLikedByViewer ? 'Liked' : 'Like'}
                </Button>
              </form>
              <Button variant="ghost">
                <MessageSquare className="h-4 w-4" />
                Comment
              </Button>
            </div>

            {post.comments.length > 0 ? (
              <div className="mt-5 space-y-3 border-t border-border pt-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="rounded-md bg-muted p-3">
                    <div className="text-sm font-medium">
                      {comment.author.name ?? comment.author.username}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <form action={createCommentAction} className="mt-4 flex gap-2">
              <input type="hidden" name="postId" value={post.id} />
              <Input name="content" placeholder="Write a comment..." required />
              <Button aria-label="Send comment" className="h-10 w-10 px-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const viewerId = session?.user?.id;

  if (!viewerId) {
    return null;
  }

  const [posts, stats] = await Promise.all([getFeedPosts(viewerId), getFeedStats()]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Lounge</h1>
          <p className="mt-2 text-muted-foreground">
            Share updates, ask for collaborators, and keep the creative network moving.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start a conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createPostAction} className="space-y-3">
              <Textarea
                name="content"
                placeholder="Share an update, opportunity, or question..."
                required
              />
              {params?.error ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Something in that action could not be saved. Check the content and try again.
                </div>
              ) : null}
              <div className="flex justify-end">
                <Button type="submit">
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} viewerId={viewerId} />)
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No posts yet. Publish the first Lounge update for this demo space.
            </CardContent>
          </Card>
        )}
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Social Feed MVP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Posts, likes, comments, and delete-own-post are now persisted in PostgreSQL.</p>
            <p>Next: pagination, richer media, notifications, and network-aware ranking.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Posts</span>
              <span className="font-semibold">{stats.posts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comments</span>
              <span className="font-semibold">{stats.comments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Likes</span>
              <span className="font-semibold">{stats.likes}</span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
