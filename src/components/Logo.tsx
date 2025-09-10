import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 font-headline', className)}>
      <Image src="/logo.png" alt="CrypDict Logo" width={28} height={28} />
      <span className="text-xl font-bold text-foreground">CrypDict</span>
    </div>
  );
}
