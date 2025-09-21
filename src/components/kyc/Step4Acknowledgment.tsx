
'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

interface Step4AcknowledgmentProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step4Acknowledgment({ onNext, onBack }: Step4AcknowledgmentProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center min-h-[400px]">
      <Logo className="scale-125" />
      <h2 className="text-2xl font-bold text-primary font-headline mt-4">
        KYC Acknowledgment Screen
      </h2>
      <p className="max-w-md text-muted-foreground leading-relaxed">
        By uploading a fake or stolen ID, you are committing identity fraud. you may be fined, jailed, sued or all three. If we detect it, we report it to the authorities and freeze your wallet. No refunds. No mercy. No second Chances. You acknowledge this risk by proceeding.
      </p>
      <div className="flex w-full max-w-md gap-4 pt-4">
        <Button
          className="flex-1 h-14 bg-lime-500 hover:bg-lime-600 text-black text-base"
          onClick={onNext}
        >
          I accept the terms and wish to continue
        </Button>
        <Button
          className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white text-base"
          onClick={onBack}
        >
          I do not accept the terms and do not wish to proceed.
        </Button>
      </div>
    </div>
  );
}
