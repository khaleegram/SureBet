import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 font-headline', className)}>
      <Image src="/Logo.png" alt="CrypDict Logo" width={50} height={50} className="rounded-full" />
      <span className="text-2xl font-bold text-foreground">CrypDict</span>
    </div>
  );
}
