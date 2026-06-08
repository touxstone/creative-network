import { ImagePlus, MessageSquare, Send, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const posts = [
  {
    author: 'Leah Morgan',
    role: 'Screenwriter',
    body: 'Looking for a producer with festival short experience for a contained drama proof of concept.',
    stats: '18 likes · 7 comments',
  },
  {
    author: 'Nico Reyes',
    role: 'Composer',
    body: 'Shared a new cue pack for suspense trailers. Happy to collaborate with editors this week.',
    stats: '31 likes · 12 comments',
  },
];

export default function FeedPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Lounge</h1>
          <p className="mt-2 text-muted-foreground">
            Preview of the Social Feed module. The next implementation slice connects this to Prisma.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start a conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Share an update, opportunity, or question..." />
            <div className="flex justify-between gap-3">
              <Button variant="outline">
                <ImagePlus className="h-4 w-4" />
                Media
              </Button>
              <Button>
                <Send className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>

        {posts.map((post) => (
          <Card key={post.author}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-muted font-semibold">
                  {post.author
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{post.author}</div>
                  <div className="text-sm text-muted-foreground">{post.role}</div>
                  <p className="mt-4 leading-7">{post.body}</p>
                  <div className="mt-4 text-sm text-muted-foreground">{post.stats}</div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="ghost">
                      <ThumbsUp className="h-4 w-4" />
                      Like
                    </Button>
                    <Button variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Social Feed scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Posts, likes, comments, delete own posts, and pagination.</p>
            <p>Stakeholder goal: make the community habit visible before deeper modules.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
