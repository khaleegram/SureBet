
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBalance } from '@/hooks/use-balance';
import { cn } from '@/lib/utils';
import './roulette.css';

const wheelNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const redNumbers = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

type BetType = 'number' | 'red' | 'black' | 'even' | 'odd';
type Bet = {
    type: BetType;
    value: number | null;
    amount: number;
}

const getNumberColor = (num: number) => {
    if (num === 0) return 'green';
    return redNumbers.includes(num) ? 'red' : 'black';
}

const payouts: Record<BetType, number> = {
    number: 35,
    red: 1,
    black: 1,
    even: 1,
    odd: 1,
}

export default function RoulettePage() {
    const { toast } = useToast();
    const { balance, addToBalance, subtractFromBalance } = useBalance();
    const [bets, setBets] = useState<Bet[]>([]);
    const [chipAmount, setChipAmount] = useState(10);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    const placeBet = (type: BetType, value: number | null = null) => {
        if (spinning) {
            toast({ title: "Cannot place bet while wheel is spinning", variant: 'destructive'});
            return;
        }
        if (!subtractFromBalance(chipAmount)) {
            toast({ title: "Not enough balance", variant: 'destructive'});
            return;
        }

        const existingBetIndex = bets.findIndex(b => b.type === type && b.value === value);

        if (existingBetIndex > -1) {
            const newBets = [...bets];
            newBets[existingBetIndex].amount += chipAmount;
            setBets(newBets);
        } else {
            setBets(prev => [...prev, {type, value, amount: chipAmount}]);
        }
        toast({ title: `Bet Placed`, description: `$${chipAmount} on ${type === 'number' ? value : type}`});
    }

    const handleSpin = () => {
        if (bets.length === 0) {
            toast({ title: "No bets placed", description: "Please place a bet before spinning.", variant: 'destructive'});
            return;
        }
        setSpinning(true);
        setResult(null);

        // Calculate a random number and corresponding rotation
        const winningNumberIndex = Math.floor(Math.random() * wheelNumbers.length);
        const winningNumber = wheelNumbers[winningNumberIndex];
        const singleSliceAngle = 360 / wheelNumbers.length;
        const randomOffset = Math.random() * singleSliceAngle;
        const baseRotation = 360 * 5; // 5 full spins
        const finalRotation = baseRotation - (winningNumberIndex * singleSliceAngle) - randomOffset;
        
        const wheelElement = document.querySelector('.roulette-wheel') as HTMLElement;
        if (wheelElement) {
            wheelElement.style.transition = 'transform 6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            wheelElement.style.transform = `rotate(${finalRotation}deg)`;
        }

        setTimeout(() => {
            setSpinning(false);
            setResult(winningNumber);
            calculateWinnings(winningNumber);
        }, 7000); // 1s longer than animation
    }

    const calculateWinnings = (winningNumber: number) => {
        let totalWinnings = 0;
        let originalBetAmount = 0;

        bets.forEach(bet => {
            originalBetAmount += bet.amount;
            let isWin = false;
            if (bet.type === 'number' && bet.value === winningNumber) {
                isWin = true;
            } else if (bet.type === 'red' && getNumberColor(winningNumber) === 'red') {
                isWin = true;
            } else if (bet.type === 'black' && getNumberColor(winningNumber) === 'black') {
                isWin = true;
            } else if (bet.type === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) {
                isWin = true;
            } else if (bet.type === 'odd' && winningNumber % 2 !== 0) {
                isWin = true;
            }

            if (isWin) {
                const payout = bet.amount * payouts[bet.type];
                totalWinnings += payout + bet.amount; // return stake + winnings
            }
        });
        
        if (totalWinnings > 0) {
            addToBalance(totalWinnings);
            toast({ title: "You Win!", description: `The number was ${winningNumber}. You won $${totalWinnings.toFixed(2)}.`});
        } else {
             toast({ title: "No Luck!", description: `The number was ${winningNumber}.`, variant: 'destructive'});
        }
        
        // Reset for next round
        setBets([]);
    }

    const BettingGrid = () => (
        <div className="grid grid-cols-12 gap-1 p-2 bg-green-900/80 rounded-lg">
             {/* Numbers 1-36 */}
            {Array.from({ length: 36 }, (_, i) => i + 1).reverse().map(num => {
                 const color = getNumberColor(num);
                 return (
                    <button key={num} onClick={() => placeBet('number', num)} className={cn(
                        "h-16 text-white font-bold text-lg rounded-md flex items-center justify-center transition-colors",
                        color === 'red' ? 'bg-red-700 hover:bg-red-600' : 'bg-black hover:bg-gray-800'
                    )}>
                        {num}
                        {bets.find(b => b.type === 'number' && b.value === num) && <div className="absolute w-6 h-6 bg-yellow-400/80 rounded-full border-2 border-white">${bets.find(b => b.type === 'number' && b.value === num)!.amount}</div>}
                    </button>
                )
            })}
             {/* Zero */}
            <button onClick={() => placeBet('number', 0)} className="col-span-12 h-12 bg-green-700 hover:bg-green-600 text-white font-bold text-lg rounded-md flex items-center justify-center">
                0
                {bets.find(b => b.type === 'number' && b.value === 0) && <div className="absolute w-6 h-6 bg-yellow-400/80 rounded-full border-2 border-white">${bets.find(b => b.type === 'number' && b.value === 0)!.amount}</div>}
            </button>
            {/* Outside Bets */}
            <button onClick={() => placeBet('even')} className="col-span-6 h-12 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-md flex items-center justify-center">
                EVEN
                {bets.find(b => b.type === 'even') && <div className="absolute w-6 h-6 bg-yellow-400/80 rounded-full border-2 border-white">${bets.find(b => b.type === 'even')!.amount}</div>}
            </button>
            <button onClick={() => placeBet('odd')} className="col-span-6 h-12 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-md flex items-center justify-center">
                ODD
                {bets.find(b => b.type === 'odd') && <div className="absolute w-6 h-6 bg-yellow-400/80 rounded-full border-2 border-white">${bets.find(b => b.type === 'odd')!.amount}</div>}
            </button>
            <button onClick={() => placeBet('red')} className="col-span-6 h-12 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-md flex items-center justify-center">
                RED
                {bets.find(b => b.type === 'red') && <div className="absolute w-6 h-6 bg-yellow-400/80 rounded-full border-2 border-white">${bets.find(b => b.type === 'red')!.amount}</div>}
            </button>
            <button onClick={() => placeBet('black')} className="col-span-6 h-12 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-md flex items-center justify-center">
                BLACK
                {bets.find(b => b.type === 'black') && <div className="absolute w-6 h-6 bg-yellow-400/80 rounded-full border-2 border-white">${bets.find(b => b.type === 'black')!.amount}</div>}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-8">
            <h1 className="text-4xl font-bold tracking-tight font-headline text-center">Roulette</h1>
            
            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl items-start">
                {/* Roulette Wheel */}
                <Card className="w-full lg:w-1/3 bg-transparent border-none">
                    <CardHeader className="text-center">
                        <CardTitle>Place Your Bets</CardTitle>
                        {result !== null && (
                            <CardDescription className={cn("text-2xl font-bold", {
                                'text-primary': getNumberColor(result) === 'red',
                                'text-foreground': getNumberColor(result) === 'black',
                                'text-green-500': getNumberColor(result) === 'green',
                            })}>
                                Number is {result}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-80 h-80 mx-auto mb-8">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-300 z-20 pointer-events-none"></div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-white text-4xl pointer-events-none z-10">▼</div>
                            <div className="roulette-wheel w-full h-full">
                                {wheelNumbers.map((num, index) => {
                                    const angle = (index / wheelNumbers.length) * 360;
                                    const color = getNumberColor(num);
                                    return (
                                        <div key={num} className="roulette-slice" style={{ transform: `rotate(${angle}deg)` }}>
                                            <div className={cn("roulette-slice-content",
                                                color === 'red' ? 'bg-red-700' : color === 'black' ? 'bg-black' : 'bg-green-600'
                                            )}>
                                                <span className="text-white transform -rotate-90">{num}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                         <Button className="w-full text-xl h-14" onClick={handleSpin} disabled={spinning}>
                            {spinning ? 'Spinning...' : 'SPIN THE WHEEL'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Betting Table */}
                <Card className="w-full lg:w-2/3 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Betting Table</CardTitle>
                        <div className="flex items-center gap-2">
                             <p className="text-sm font-medium">Chip:</p>
                            {[10, 25, 50, 100].map(amount => (
                                <Button key={amount} variant={chipAmount === amount ? 'secondary' : 'outline'} size="sm" onClick={() => setChipAmount(amount)}>
                                    ${amount}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <BettingGrid />
                    </CardContent>
                </Card>
            </div>
             <Card className="w-full max-w-7xl">
                 <CardContent className="p-4 flex items-center justify-between">
                    <div>
                         <p className="font-semibold">Your Balance</p>
                         <p className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Total Bet</p>
                         <p className="text-2xl font-bold text-amber-400">${bets.reduce((acc, b) => acc + b.amount, 0).toFixed(2)}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
