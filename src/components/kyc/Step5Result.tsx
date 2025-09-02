'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, FileClock } from 'lucide-react';
import Link from 'next/link';

type Status = 'success' | 'failure' | 'review';

interface Step5ResultProps {
  status: Status;
  messages: string[];
}

const statusConfig = {
  success: {
    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
    title: 'Verification Successful!',
    description: 'Welcome to SureBet. You can now access all features.',
  },
  failure: {
    icon: <XCircle className="h-16 w-16 text-destructive" />,
    title: 'Verification Failed',
    description: 'We were unable to verify your identity. Please see the reasons below.',
  },
  review: {
    icon: <FileClock className="h-16 w-16 text-yellow-500" />,
    title: 'Verification Pending Review',
    description: 'Your application requires manual review. This usually takes 24-48 hours. We will notify you via email.',
  },
};

export function Step5Result({ status, messages }: Step5ResultProps) {
  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center min-h-[300px]">
      {config.icon}
      <h3 className="text-2xl font-semibold font-headline">{config.title}</h3>
      <p className="text-muted-foreground max-w-md">{config.description}</p>

      {messages.length > 0 && (
        <Card className="w-full text-left">
          <CardContent className="p-4">
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  {status === 'failure' ? <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" /> : <FileClock className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500" />}
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 pt-4">
        {status === 'success' && (
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
        {(status === 'failure' || status === 'review') && (
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        )}
        {status === 'failure' && (
            <Button onClick={() => window.location.reload()}>Try Again</Button>
        )}
      </div>
    </div>
  );
}
