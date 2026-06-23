import { BriefcaseBusiness } from 'lucide-react';
import { createServiceListingAction } from '@/features/marketplace/actions';
import { deliveryModeLabels, deliveryModes, serviceCategories } from '@/features/marketplace/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ServiceForm() {
  return (
    <form action={createServiceListingAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="title">Service title</Label>
        <Input id="title" name="title" required placeholder="Script notes for contained drama pilots" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="summary">Short summary</Label>
        <Input
          id="summary"
          name="summary"
          required
          maxLength={240}
          placeholder="Fast, practical notes for short scripts, pitch pilots, and proof-of-concepts."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          required
        >
          {serviceCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="deliveryMode">Delivery</Label>
        <select
          id="deliveryMode"
          name="deliveryMode"
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          required
        >
          {deliveryModes.map((mode) => (
            <option key={mode} value={mode}>
              {deliveryModeLabels[mode]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Input id="language" name="language" placeholder="English, Español, Català..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rateNote">Rate note</Label>
        <Input id="rateNote" name="rateNote" placeholder="Intro call free, quote after brief..." />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="availability">Availability</Label>
        <Input id="availability" name="availability" placeholder="2 slots in July, remote evenings, festival deadline..." />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          className="min-h-40"
          placeholder="Describe what you offer, ideal clients, expected inputs, deliverables, timeline, and boundaries. No payments are processed in Creative Network yet."
        />
      </div>
      <Button className="sm:col-span-2">
        <BriefcaseBusiness className="h-4 w-4" />
        Publish service
      </Button>
    </form>
  );
}
