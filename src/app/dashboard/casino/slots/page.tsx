
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem, Cherry, BarChart, DollarSign, Crown } from 'lucide-react';

const symbols = [
  { icon: Gem, color: 'text-blue-400' },
  { icon: Cherry, color: 'text-red-500' },
  { icon: BarChart, color: 'text-yellow-400' },
  { icon: DollarSign, color: 'text-green-500' },
  { icon: Crown, color: 'text-purple-500' },
];

export default function SlotsPage() {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);

  const spin = () => {
    if (balance < betAmount) {
      // toast notification here
      return;
    }

    setSpinning(true);
    setBalance(balance - betAmount);

    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const newReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(newReels);
      setSpinning(false);
      // Payout logic
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        setBalance(balance + betAmount * 10);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline text-center">Diamond Slots</h1>
        <p className="text-muted-foreground text-center">Line up the gems for a big win!</p>
      </div>
      
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="bg-background/50 rounded-lg p-4 mb-6">
             <div className="flex justify-around items-center h-40 border-2 border-primary/20 rounded-lg bg-black/20">
              {reels.map((S, index) => (
                <S.icon key={index} className={`w-20 h-20 ${S.color} ${spinning ? 'animate-spin' : ''}`} />
              ))}
            </div>
          </div>
         
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="bet-amount">Bet Amount</Label>
              <Input
                id="bet-amount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="text-lg font-bold"
              />
            </div>
            <Button onClick={spin} disabled={spinning} className="w-full h-16 text-2xl font-bold">
              {spinning ? 'Spinning...' : 'SPIN'}
            </Button>
          </div>

        </CardContent>
      </Card>

       <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Game Info</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center text-lg">
            <div className="font-semibold">
                Your Balance:
            </div>
             <div className="font-bold text-green-400">
                ${balance.toFixed(2)}
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
