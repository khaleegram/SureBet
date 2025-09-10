import { cn } from '@/lib/utils';
import { Gem } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 font-headline', className)}>
      <div className="rounded-full bg-primary/20 p-1.5 border-2 border-primary/50">
        <Gem className="h-5 w-5 text-primary" />
      </div>
      <span className="text-xl font-bold text-foreground">CrypDict</span>
    </div>
  );
}
