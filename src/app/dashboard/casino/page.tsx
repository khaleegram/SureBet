import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Dices, Swords } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const games = [
    { 
        title: 'Slots', 
        description: 'Spin the reels for a chance at massive jackpots.',
        image: 'https://picsum.photos/600/400?random=1',
        aiHint: 'casino slot machine',
        live: false,
        href: '/dashboard/casino/slots'
    },
    { 
        title: 'Poker', 
        description: 'Join a table and test your skills against other players.',
        image: 'https://picsum.photos/600/400?random=2',
        aiHint: 'poker cards',
        live: true,
        href: '/dashboard/casino/poker'
    },
    { 
        title: 'Roulette', 
        description: 'Place your bets and watch the wheel spin.',
        image: 'https://picsum.photos/600/400?random=3',
        aiHint: 'casino roulette wheel',
        live: true,
        href: '/dashboard/casino'
    },
    { 
        title: 'Blackjack', 
        description: 'Beat the dealer to 21 in this classic card game.',
        image: 'https://picsum.photos/600/400?random=4',
        aiHint: 'blackjack cards',
        live: false,
        href: '/dashboard/casino/blackjack'
    },
     { 
        title: 'Baccarat', 
        description: 'Bet on the Player, Banker, or a Tie in this elegant game.',
        image: 'https://picsum.photos/600/400?random=5',
        aiHint: 'baccarat table',
        live: false,
        href: '/dashboard/casino'
    },
     { 
        title: 'Live Sports Betting', 
        description: 'Bet on live sports events as they happen.',
        image: 'https://picsum.photos/600/400?random=6',
        aiHint: 'stadium lights',
        live: true,
        href: '/dashboard/sports-betting'
    },
]

export default function CasinoPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Casino</h1>
        <p className="text-muted-foreground">Experience the thrill of our exclusive casino games.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
             <Card key={game.title} className="overflow-hidden group">
                <Link href={game.href} className="block h-full flex flex-col">
                    <CardHeader className="p-0 relative h-48">
                        <Image src={game.image} data-ai-hint={game.aiHint} alt={game.title} fill objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
                        {game.live && <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold animate-pulse">LIVE</div>}
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                        <CardTitle className="font-headline flex items-center gap-2">
                            {game.title === 'Live Sports Betting' ? <Swords/> : <Dices/>}
                            {game.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{game.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">
                            Play Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Link>
             </Card>
        ))}
      </div>
    </div>
  );
}
