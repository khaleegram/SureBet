
'use client';
import { KYCForm } from '@/components/kyc/KYCForm';
import { Logo } from '@/components/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
       <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Become a Member</CardTitle>
          <CardDescription className="text-center">
            Complete the secure identity verification process to start playing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KYCForm />
        </CardContent>
      </Card>
    </div>
  );
}
