
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const PlayerCard = ({ name, balance, cards, isTurn, status }: { name: string; balance: number; cards?: string[]; isTurn?: boolean; status?: string; }) => (
    <div className={`p-4 rounded-lg border-2 ${isTurn ? 'border-primary shadow-lg shadow-primary/50' : 'border-border'} bg-card/80 relative`}>
        <div className="flex items-center justify-between">
             <p className="font-bold text-lg">{name}</p>
             {status && <Badge variant="secondary">{status}</Badge>}
        </div>
       
        <p className="font-mono text-green-400">${balance.toLocaleString()}</p>
         <div className="flex gap-2 mt-2 h-24">
            {cards ? cards.map((card, index) => (
                 <div key={`${card}-${index}`} className="w-16 h-24 rounded-md bg-white flex items-center justify-center relative overflow-hidden">
                    <Image src={`/cards/${card}.svg`} alt={card} layout="fill" />
                 </div>
            )) : (
                 <div className="w-16 h-24 rounded-md bg-card-foreground/10 flex items-center justify-center"></div>
            )}
        </div>
    </div>
)

const CommunityCard = ({ card }: { card: string }) => (
    <div className="w-20 h-28 rounded-md bg-white flex items-center justify-center relative overflow-hidden shadow-lg">
         <Image src={`/cards/${card}.svg`} alt={card} layout="fill" />
    </div>
)

export default function PokerPage() {
    const [betAmount, setBetAmount] = useState(100);

    return (
        <div className="min-h-[80vh] flex flex-col justify-between">
            <div className="flex justify-center gap-8 items-end">
                <PlayerCard name="Player 3" balance={18500} cards={['back', 'back']} />
                <PlayerCard name="Player 4" balance={25000} cards={['back', 'back']} />
                <PlayerCard name="Player 5" balance={7300} cards={['back', 'back']} isTurn status="Thinking..."/>
            </div>

            <div className="my-8">
                <Card className="w-fit mx-auto bg-transparent border-none shadow-none">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold font-headline">Texas Hold'em</CardTitle>
                        <CardDescription className="text-2xl font-mono text-amber-300">Pot: $2,400</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center gap-4">
                        <CommunityCard card="AS" />
                        <CommunityCard card="KD" />
                        <CommunityCard card="7C" />
                        <CommunityCard card="2H" />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-around items-start">
                <PlayerCard name="Player 2" balance={9800} cards={['back', 'back']} status="Folded" />

                <div className="flex flex-col gap-4 items-center">
                    <PlayerCard name="You" balance={12500} cards={['AH', 'KH']} isTurn/>
                     <Card className="w-full max-w-sm">
                        <CardContent className="p-4 flex flex-col gap-2">
                             <div className="flex gap-2 items-center">
                                <Label htmlFor="bet-amount" className="sr-only">Bet</Label>
                                <Input 
                                    id="bet-amount" 
                                    type="number" 
                                    value={betAmount} 
                                    onChange={(e) => setBetAmount(Number(e.target.value))}
                                    className="w-24"
                                />
                                <Button className="flex-1" variant="secondary">Bet</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline">Check</Button>
                                <Button variant="outline">Call $100</Button>
                                <Button variant="destructive">Fold</Button>
                                <Button>Raise</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <PlayerCard name="Player 6" balance={0} status="All In" />

            </div>
        </div>
    );
}
