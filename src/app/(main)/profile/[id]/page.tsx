import { BriefcaseBusiness, Globe, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentSession } from '@/core/auth/session';

export default async function ProfilePage() {
  const session = await getCurrentSession();
  const user = session.user;

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="grid h-28 w-28 place-items-center rounded-lg bg-foreground text-3xl font-bold text-white">
              MS
            </div>
            <h1 className="mt-5 text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                {user.profession}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {user.location}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                creativenetwork.test/{user.username}
              </div>
            </div>
            <Button className="mt-6 w-full">
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="leading-7 text-muted-foreground">
            Producer focused on international co-productions, short-form proof of concepts, and
            connecting writers with technical teams. This profile is static in PR-01 and becomes
            editable once the CORE data/auth slice lands.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current priorities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {['Find directors', 'Package pilots', 'Meet composers'].map((item) => (
              <div key={item} className="rounded-md border border-border p-4 text-sm">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
