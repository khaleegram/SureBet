import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Swords, Zap } from 'lucide-react';
import Image from 'next/image';

const liveEvents = [
    { id: 1, sport: 'Soccer', league: 'Champions League', teams: ['FC Real', 'AC Inter'], odds: ['1.90', '3.50', '4.00'], time: "78'" },
    { id: 2, sport: 'Basketball', league: 'NBA', teams: ['Lakers', 'Celtics'], odds: ['1.85', '2.05', ''], time: "4th Qtr" },
    { id: 3, sport: 'Tennis', league: 'Grand Slam', teams: ['Player A', 'Player B'], odds: ['1.50', '2.50', ''], time: "Set 3" },
    { id: 4, sport: 'E-Sports', league: 'CS:GO Major', teams: ['Team Fury', 'Team Apex'], odds: ['1.65', '2.20', ''], time: "Map 2" },
];

export default function SportsBettingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2"><Swords /> Live Sports Betting</h1>
                <p className="text-muted-foreground">Bet on your favorite teams and events in real-time.</p>
            </div>

            <Card className="bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Live Now</CardTitle>
                        <CardDescription>Odds are updated in real-time. All bets are final.</CardDescription>
                    </div>
                     <Badge variant="destructive" className="bg-red-500/20 text-red-300 animate-pulse">
                        <Zap className="w-3 h-3 mr-1" />
                        LIVE
                    </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                    {liveEvents.map(event => (
                        <Card key={event.id} className="p-4 flex flex-col md:flex-row items-center gap-4">
                            <div className="w-full md:w-1/4 flex items-center gap-4">
                               <div className="p-2 bg-primary/10 rounded-full">
                                <Swords className="h-6 w-6 text-primary" />
                               </div>
                               <div>
                                 <p className="font-semibold">{event.sport}</p>
                                 <p className="text-xs text-muted-foreground">{event.league}</p>
                               </div>
                                <Badge variant="secondary" className="ml-auto">{event.time}</Badge>
                            </div>

                            <div className="w-full md:w-1/2 font-semibold text-lg text-center">
                                {event.teams[0]} vs {event.teams[1]}
                            </div>
                            
                            <div className="w-full md:w-1/2 grid grid-cols-3 gap-2">
                                <Button variant="outline" className="flex flex-col h-auto py-2">
                                    <span className="text-xs text-muted-foreground">1</span>
                                    <span className="font-bold text-lg">{event.odds[0]}</span>
                                </Button>
                                {event.odds[1] && (
                                     <Button variant="outline" className="flex flex-col h-auto py-2">
                                        <span className="text-xs text-muted-foreground">{event.odds[2] ? 'X' : '2'}</span>
                                        <span className="font-bold text-lg">{event.odds[1]}</span>
                                    </Button>
                                )}
                                {event.odds[2] && (
                                     <Button variant="outline" className="flex flex-col h-auto py-2">
                                        <span className="text-xs text-muted-foreground">2</span>
                                        <span className="font-bold text-lg">{event.odds[2]}</span>
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
