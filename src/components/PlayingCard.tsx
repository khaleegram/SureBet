import React from 'react';
import { cn } from '@/lib/utils';
import { Diamond, Club, Heart, Spade, Gem } from 'lucide-react';

type Suit = 'H' | 'D' | 'C' | 'S';
type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'T' | 'J' | 'Q' | 'K';

interface PlayingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  suit: Suit;
  value: Value;
}

const suitMap: Record<Suit, { icon: React.ElementType, color: string }> = {
  H: { icon: Heart, color: 'text-red-500' },
  D: { icon: Diamond, color: 'text-red-500' },
  C: { icon: Club, color: 'text-black' },
  S: { icon: Spade, color: 'text-black' },
};

const valueMap: Record<Value, string> = {
    'A': 'A', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10', 'T': '10', 'J': 'J', 'Q': 'Q', 'K': 'K'
};

export const PlayingCard = ({ suit, value, className, ...props }: PlayingCardProps) => {
  const { icon: SuitIcon, color } = suitMap[suit];
  const displayValue = valueMap[value];

  return (
    <div
      className={cn(
        'relative h-full w-full rounded-lg bg-white p-1 shadow-md transition-transform hover:scale-105',
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-200">
        <div className="absolute top-1 left-2 text-left">
          <p className={`font-bold text-lg leading-none ${color}`}>{displayValue}</p>
          <SuitIcon className={`h-4 w-4 ${color}`} fill={color} />
        </div>
        <div className="absolute bottom-1 right-2 rotate-180 text-left">
          <p className={`font-bold text-lg leading-none ${color}`}>{displayValue}</p>
          <SuitIcon className={`h-4 w-4 ${color}`} fill={color} />
        </div>
        <SuitIcon className={`h-8 w-8 ${color}`} fill={color} />
      </div>
    </div>
  );
};

export const CardBack = ({className}: {className?: string}) => {
    return (
         <div className={cn("relative h-full w-full rounded-lg bg-red-600 p-1 shadow-md", className)}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-red-800 bg-red-700">
                <Gem className="h-8 w-8 text-red-300/70" />
            </div>
        </div>
    )
}
