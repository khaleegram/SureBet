
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, FileClock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { getIdToken } from 'firebase/auth';

type Status = 'success' | 'failure' | 'review';

interface Step5ResultProps {
  status: Status;
  messages: string[];
}

const statusConfig = {
  success: {
    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
    title: 'Verification Successful!',
    description: 'Welcome to CrypDict. You will be redirected to your dashboard shortly.',
  },
  failure: {
    icon: <XCircle className="h-16 w-16 text-destructive" />,
    title: 'Verification Failed',
    description: 'We were unable to verify your identity based on the information provided.',
  },
  review: {
    icon: <FileClock className="h-16 w-16 text-yellow-500" />,
    title: 'Verification Pending Review',
    description: 'Your application requires a quick manual review. This usually takes less than 24 hours. We will notify you via email once it is complete.',
  },
};

export function Step5Result({ status, messages }: Step5ResultProps) {
  const config = statusConfig[status];
  const [isBypassOpen, setIsBypassOpen] = useState(false);
  const [bypassCode, setBypassCode] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBypass = async () => {
    if (bypassCode === 'GOOSE123$') {
      if (!user) {
        toast({
            variant: 'destructive',
            title: 'Bypass Failed',
            description: 'No user session found to bypass.',
        });
        return;
      }
      try {
        const idToken = await getIdToken(user);
        const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) throw new Error('Failed to create session.');

        toast({
            title: 'Bypass Successful',
            description: 'Redirecting to dashboard...',
        });
        
        window.location.href = '/dashboard';
      } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Bypass Error',
            description: 'An error occurred during the bypass process.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect Code',
        description: 'The bypass code you entered is incorrect.',
      });
    }
    setIsBypassOpen(false);
    setBypassCode('');
  };


  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center min-h-[300px]">
      {config.icon}
      <h3 className="text-2xl font-semibold font-headline">{config.title}</h3>
      <p className="text-muted-foreground max-w-md">{config.description}</p>

      {messages.length > 0 && (
        <Card className="w-full text-left bg-muted/50 border-border">
            <CardHeader>
                <CardTitle className="text-base">Issues Detected</CardTitle>
                <CardDescription className="text-xs">Our system flagged the following potential issues for review:</CardDescription>
            </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
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
            <>
                <Button variant="outline" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
                <Button variant="secondary" onClick={() => setIsBypassOpen(true)}>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Admin Bypass
                </Button>
            </>
        )}
      </div>

       <Dialog open={isBypassOpen} onOpenChange={setIsBypassOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Administrator Bypass</DialogTitle>
                    <DialogDescription>
                        Enter the bypass code to manually approve this verification and log in.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label htmlFor="bypass-code">Bypass Code</Label>
                    <Input
                        id="bypass-code"
                        type="password"
                        value={bypassCode}
                        onChange={(e) => setBypassCode(e.target.value)}
                        placeholder="Enter code..."
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleBypass}>Submit & Login</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
