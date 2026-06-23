import { ServiceForm } from '@/components/marketplace/service-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewServiceListingPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Publish a creative service</CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe a professional offer. Creative Network records interest only; no payments are
            processed in this preview.
          </p>
        </CardHeader>
        <CardContent>
          <ServiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
