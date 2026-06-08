import { MapPin, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { featuredPeople } from '@/lib/demo-data';

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Network</h1>
          <p className="mt-2 text-muted-foreground">
            Discovery and connection requests become live after the Social Feed slice.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by craft or city" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featuredPeople.map((person) => (
          <Card key={person.name}>
            <CardContent className="p-5">
              <div className="grid h-14 w-14 place-items-center rounded-md bg-foreground font-semibold text-white">
                {person.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <h2 className="mt-4 font-semibold">{person.name}</h2>
              <p className="text-sm text-muted-foreground">{person.role}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {person.location}
              </div>
              <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{person.focus}</p>
              <Button className="mt-5 w-full" variant="outline">
                <UserPlus className="h-4 w-4" />
                Connect
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Networking module milestones</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-4">
          <p>Connection request lifecycle</p>
          <p>Accepted contacts list</p>
          <p>Suggestions by profession</p>
          <p>Blocking and privacy controls</p>
        </CardContent>
      </Card>
    </div>
  );
}
