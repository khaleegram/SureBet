'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Swords, Zap, Bot, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateP2pBetScenarios } from '@/ai/flows/generate-p2p-bet-scenarios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


type Bet = {
    id: string;
    event: string;
    market: string;
    odds: number;
    stake: number;
    stakeCurrency: 'ETH' | 'ADA' | 'BTC' | 'USDT';
    createdBy: string;
    matchedBy?: string;
    status: 'Open' | 'Matched' | 'Settling' | 'Settled';
    winner?: string; // 'creator' or 'matcher'
};

const initialOpenBets: Bet[] = [
    { id: 'ob1', event: 'MMA Fight Night: Titan vs. Goliath', market: 'Goliath to Win', odds: 1.85, stake: 0.1, stakeCurrency: 'ETH', createdBy: 'UserA', status: 'Open' },
    { id: 'ob2', event: 'E-Sports Finals: CyberDragons vs. QuantumLeap', market: 'Map 3 Winner: CyberDragons', odds: 2.50, stake: 500, stakeCurrency: 'ADA', createdBy: 'UserB', status: 'Open' },
    { id: 'ob3', event: 'Crypto Price Prediction: BTC > $75k by EOD', market: 'Yes', odds: 1.50, stake: 0.05, stakeCurrency: 'BTC', createdBy: 'UserC', status: 'Open' },
    { id: 'ob4', event: 'Presidential Election 2024', market: 'Candidate Z Wins', odds: 3.20, stake: 1000, stakeCurrency: 'USDT', createdBy: 'UserD', status: 'Open' },
]

export default function P2PBettingPage() {
    const { toast } = useToast();
    const [openBets, setOpenBets] = useState<Bet[]>(initialOpenBets);
    const [myBets, setMyBets] = useState<Bet[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleCreateBet = (newBet: Omit<Bet, 'id' | 'createdBy' | 'status'>) => {
        const betToAdd: Bet = {
            ...newBet,
            id: `bet_${Date.now()}`,
            createdBy: 'You',
            status: 'Open',
        };
        setMyBets(prev => [...prev, betToAdd]);
        setOpenBets(prev => [betToAdd, ...prev]);
        toast({ title: 'Bet Created!', description: 'Your bet is now listed on the marketplace.' });
    };

    const handleMatchBet = (betId: string) => {
        const betToMatch = openBets.find(b => b.id === betId);
        if (!betToMatch) return;
        
        setOpenBets(prev => prev.filter(b => b.id !== betId));

        const matchedBet: Bet = { ...betToMatch, status: 'Matched', matchedBy: 'You' };
        setMyBets(prev => [...prev, matchedBet]);

        toast({ title: 'Bet Matched!', description: `You have accepted the bet on "${betToMatch.event}"` });

        // Change status to settling after a delay, triggering the useEffect
        setTimeout(() => {
            setMyBets(prev => prev.map(b => b.id === betId ? { ...b, status: 'Settling' } : b));
        }, 5000);
    };

    useEffect(() => {
        const betsToSettle = myBets.filter(bet => bet.status === 'Settling');

        if (betsToSettle.length > 0) {
            betsToSettle.forEach(bet => {
                const winner = Math.random() > 0.5 ? 'creator' : 'matcher';
                const didIWin = (bet.createdBy === 'You' && winner === 'creator') || (bet.matchedBy === 'You' && winner === 'matcher');

                toast({
                    title: `Bet Settled: ${bet.event}`,
                    description: `You ${didIWin ? 'won' : 'lost'} ${bet.stake} ${bet.stakeCurrency}.`,
                    variant: didIWin ? 'default' : 'destructive',
                });

                setMyBets(prev => prev.map(b => b.id === bet.id ? { ...b, status: 'Settled', winner } : b));
            });
        }
    }, [myBets, toast]);


    const handleGenerateBets = async () => {
        setIsAiLoading(true);
        try {
            const result = await generateP2pBetScenarios({ category: 'Any', count: 3 });
            const newBets: Bet[] = result.scenarios.map((scenario, i) => ({
                id: `ai_${Date.now()}_${i}`,
                event: scenario.event,
                market: scenario.market,
                odds: scenario.odds,
                stake: Math.floor(Math.random() * 100) + 10,
                stakeCurrency: 'USDT',
                createdBy: 'AI_Oddsmaker',
                status: 'Open'
            }));
            setOpenBets(prev => [...newBets, ...prev]);
            toast({ title: 'AI Bets Generated', description: 'New betting opportunities have been added to the marketplace.' });
        } catch (error) {
            toast({ title: 'Error', description: 'Could not generate AI bets.', variant: 'destructive' });
        } finally {
            setIsAiLoading(false);
        }
    }


  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">P2P Betting Marketplace</h1>
        <p className="text-muted-foreground">Create your own odds or accept bets from others.</p>
      </div>

       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Featured Event</CardTitle>
                <Badge variant="destructive" className="bg-red-500/20 text-red-300 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    LIVE
                </Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/3 relative h-48 rounded-lg overflow-hidden">
                    <Image src="https://picsum.photos/600/400" data-ai-hint="sports mma" alt="MMA Fight" layout="fill" objectFit="cover" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold font-headline">MMA Fight Night: Titan vs. Goliath</h3>
                    <p className="text-muted-foreground mt-1">A legendary clash of titans. Who will emerge victorious?</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-card rounded-lg text-center">
                            <p className="text-lg font-bold">Titan</p>
                            <p className="text-2xl font-bold text-accent">1.85</p>
                        </div>
                        <div className="p-4 bg-card rounded-lg text-center">
                            <p className="text-lg font-bold">Goliath</p>
                             <p className="text-2xl font-bold text-primary">2.15</p>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <div>
                    <CardTitle>Betting Exchange</CardTitle>
                    <CardDescription>Browse open bets or check on your own.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleGenerateBets} disabled={isAiLoading}>
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4" />}
                        Suggest Bets
                    </Button>
                    <CreateBetDialog onCreateBet={handleCreateBet} />
                </div>
            </div>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="open-bets">
             <TabsList>
               <TabsTrigger value="open-bets">Open Bets ({openBets.length})</TabsTrigger>
               <TabsTrigger value="my-bets">My Bets ({myBets.length})</TabsTrigger>
             </TabsList>
             <TabsContent value="open-bets" className="mt-4">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Event</TableHead>
                     <TableHead>Market</TableHead>
                     <TableHead>Odds</TableHead>
                     <TableHead>Stake</TableHead>
                     <TableHead>Created By</TableHead>
                     <TableHead className="text-right">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                    {openBets.map((bet) => (
                        <TableRow key={bet.id}>
                            <TableCell className="font-medium flex items-center gap-2"><Swords className="h-4 w-4 text-primary" /> {bet.event}</TableCell>
                            <TableCell>{bet.market}</TableCell>
                            <TableCell className="font-mono text-accent">{bet.odds.toFixed(2)}</TableCell>
                            <TableCell className="font-mono">{`${bet.stake} ${bet.stakeCurrency}`}</TableCell>
                             <TableCell>{bet.createdBy}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => handleMatchBet(bet.id)} disabled={bet.createdBy === 'You'}>
                                    Match Bet
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                 </TableBody>
               </Table>
             </TabsContent>
              <TabsContent value="my-bets" className="mt-4">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Event</TableHead>
                     <TableHead>Your Position</TableHead>
                     <TableHead>Odds</TableHead>
                     <TableHead>Stake</TableHead>
                     <TableHead className="text-right">Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                    {myBets.map((bet) => (
                        <TableRow key={bet.id}>
                            <TableCell className="font-medium">{bet.event}</TableCell>
                            <TableCell>{bet.market}</TableCell>
                            <TableCell className="font-mono text-accent">{bet.odds.toFixed(2)}</TableCell>
                            <TableCell className="font-mono">{`${bet.stake} ${bet.stakeCurrency}`}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={bet.status === 'Matched' || bet.status === 'Settling' ? 'secondary' : bet.status === 'Settled' ? 'default' : 'outline'}>
                                    {bet.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                 </TableBody>
               </Table>
             </TabsContent>
           </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


function CreateBetDialog({ onCreateBet }: { onCreateBet: (bet: Omit<Bet, 'id' | 'createdBy' | 'status'>) => void }) {
    const [event, setEvent] = useState('');
    const [market, setMarket] = useState('');
    const [odds, setOdds] = useState(1.01);
    const [stake, setStake] = useState(10);
    const [stakeCurrency, setStakeCurrency] = useState<'ETH' | 'ADA' | 'BTC' | 'USDT'>('USDT');

    const handleSubmit = () => {
        if (event && market && odds > 1 && stake > 0) {
            onCreateBet({ event, market, odds, stake, stakeCurrency });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Bet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a New Bet</DialogTitle>
                    <DialogDescription>
                        Set the terms for your bet and post it to the marketplace.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event" className="text-right">Event</Label>
                        <Input id="event" value={event} onChange={e => setEvent(e.target.value)} className="col-span-3" placeholder="e.g., MMA Fight Night: ..." />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="market" className="text-right">Market</Label>
                        <Input id="market" value={market} onChange={e => setMarket(e.target.value)} className="col-span-3" placeholder="e.g., Titan to Win" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="odds" className="text-right">Odds</Label>
                        <Input id="odds" type="number" value={odds} onChange={e => setOdds(parseFloat(e.target.value))} className="col-span-3" step="0.01" min="1.01" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stake" className="text-right">Stake</Label>
                        <Input id="stake" type="number" value={stake} onChange={e => setStake(parseFloat(e.target.value))} className="col-span-3" min="1" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" onClick={handleSubmit}>Post Bet to Marketplace</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
    