
import { Ban } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function BlockedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Ban className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-2xl font-headline">Access Denied</CardTitle>
          <CardDescription>
            Our services are not available in your region.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. Due to regulatory and legal restrictions, we are unable to offer our platform in your current location. This decision is based on our commitment to compliance with international and local laws.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
