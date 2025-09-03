
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem, Cherry, BarChart, DollarSign, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBalance } from '@/hooks/use-balance';

const symbols = [
  { icon: Gem, color: 'text-blue-400', name: 'Gem', payout: { two: 2, three: 20 } },
  { icon: Cherry, color: 'text-red-500', name: 'Cherry', payout: { two: 3, three: 30 } },
  { icon: BarChart, color: 'text-yellow-400', name: 'Bar', payout: { two: 5, three: 50 } },
  { icon: DollarSign, color: 'text-green-500', name: 'Dollar', payout: { two: 10, three: 100 } },
  { icon: Crown, color: 'text-purple-500', name: 'Crown', payout: { two: 20, three: 250 } },
];

export default function SlotsPage() {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [spinning, setSpinning] = useState(false);
  const { balance, addToBalance, subtractFromBalance } = useBalance();
  const [betAmount, setBetAmount] = useState(10);
  const { toast } = useToast();

  const spin = () => {
    if (betAmount <= 0) {
     toast({ variant: 'destructive', title: 'Invalid Bet', description: 'Bet amount must be greater than zero.' });
     return;
   }

    if (!subtractFromBalance(betAmount)) {
      toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'You do not have enough balance to place that bet.' });
      return;
    }


    setSpinning(true);

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
      let winAmount = 0;
      let winTitle = '';

      if (newReels[0].name === newReels[1].name && newReels[1].name === newReels[2].name) {
        winAmount = betAmount * newReels[0].payout.three;
        winTitle = `Jackpot! Three ${newReels[0].name}s!`;
      } else if (newReels[0].name === newReels[1].name) {
        winAmount = betAmount * newReels[0].payout.two;
        winTitle = `Winner! Two ${newReels[0].name}s!`;
      }
      
      if (winAmount > 0) {
        addToBalance(winAmount);
        toast({ title: winTitle, description: `You won $${winAmount.toFixed(2)}!` });
      } else {
        toast({ title: 'No Luck!', description: 'Try again.' });
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
             <div className="flex justify-around items-center h-40 border-2 border-primary/20 rounded-lg bg-black/20 overflow-hidden">
              {reels.map((S, index) => (
                <div key={index} className="w-1/3 h-full flex items-center justify-center">
                    <S.icon className={`w-20 h-20 ${S.color} ${spinning ? 'animate-spin' : ''}`} />
                </div>
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
                min="1"
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
