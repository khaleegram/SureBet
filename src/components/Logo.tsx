import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 font-headline mt-1', className)}>
      <Image src="/goose-logo.png" alt="House of the Royal Goose Logo" width={80} height={80} />
      <span className="text-2xl font-bold text-foreground">House of the Royal Goose</span>
    </div>
  );
}
