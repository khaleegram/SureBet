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
import { PlusCircle, Swords, Zap } from 'lucide-react';
import Image from 'next/image';

const openBets = [
    { event: 'MMA Fight Night: Titan vs. Goliath', market: 'Winner', odds: '1.85', stake: '0.1 ETH', by: 'UserA' },
    { event: 'E-Sports Finals: CyberDragons vs. QuantumLeap', market: 'Map 3 Winner', odds: '2.50', stake: '500 ADA', by: 'UserB' },
    { event: 'Crypto Price Prediction: BTC > $75k by EOD', market: 'Yes', odds: '1.50', stake: '0.05 BTC', by: 'UserC' },
    { event: 'Presidential Election 2024', market: 'Candidate Z Wins', odds: '3.20', stake: '1,000 USDT', by: 'UserD' },
]

const myBets = [
    { event: 'MMA Fight Night: Titan vs. Goliath', market: 'Goliath Wins', odds: '1.85', stake: '0.1 ETH', status: 'Matched' },
    { event: 'E-Sports Finals: CyberDragons vs. QuantumLeap', market: 'QuantumLeap Wins', odds: '2.10', stake: '250 ADA', status: 'Open' },
]


export default function P2PBettingPage() {
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
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Betting Exchange</CardTitle>
                    <CardDescription>Browse open bets or check on your own.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Bet
                </Button>
            </div>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="open-bets">
             <TabsList>
               <TabsTrigger value="open-bets">Open Bets</TabsTrigger>
               <TabsTrigger value="my-bets">My Bets</TabsTrigger>
             </TabsList>
             <TabsContent value="open-bets" className="mt-4">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Event</TableHead>
                     <TableHead>Market</TableHead>
                     <TableHead>Odds</TableHead>
                     <TableHead>Stake</TableHead>
                     <TableHead className="text-right">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                    {openBets.map((bet, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium flex items-center gap-2"><Swords className="h-4 w-4 text-primary" /> {bet.event}</TableCell>
                            <TableCell>{bet.market}</TableCell>
                            <TableCell className="font-mono text-accent">{bet.odds}</TableCell>
                            <TableCell className="font-mono">{bet.stake}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm">Match Bet</Button>
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
                     <TableHead>Market</TableHead>
                     <TableHead>Odds</TableHead>
                     <TableHead>Stake</TableHead>
                     <TableHead className="text-right">Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                    {myBets.map((bet, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{bet.event}</TableCell>
                            <TableCell>{bet.market}</TableCell>
                            <TableCell className="font-mono text-accent">{bet.odds}</TableCell>
                            <TableCell className="font-mono">{bet.stake}</TableCell>
                            <TableCell className="text-right">
                                <span className={`text-sm font-semibold ${bet.status === 'Matched' ? 'text-green-400' : 'text-yellow-400'}`}>{bet.status}</span>
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
