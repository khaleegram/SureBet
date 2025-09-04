
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dices, Gem, ShieldCheck, Swords, Users, Zap, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/use-auth';

const popularGames = [
    { 
        title: 'Live Sports Betting', 
        description: 'Bet on live sports events as they happen.',
        image: 'https://picsum.photos/600/400?random=6',
        aiHint: 'stadium lights',
        href: '/dashboard/sports-betting',
    },
    { 
        title: 'Slots', 
        description: 'Spin the reels for a chance at massive jackpots.',
        image: 'https://picsum.photos/600/400?random=1',
        aiHint: 'casino slot machine',
        href: '/dashboard/casino/slots',
    },
    { 
        title: 'Poker', 
        description: 'Join a table and test your skills against other players.',
        image: 'https://picsum.photos/600/400?random=2',
        aiHint: 'poker cards',
        href: '/dashboard/casino/poker',
    },
];

export default function Home() {
  const { user, loading } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href={user ? "/dashboard/casino" : "/signin"}>Games</Link>
            </Button>
            {user ? (
               <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
            ) : (
              <>
                 <Button variant="ghost" asChild>
                   <Link href="/signin">Sign In</Link>
                 </Button>
                 <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
          <Image
              src="https://picsum.photos/1600/900"
              alt="Hero background"
              data-ai-hint="stadium lights dark"
              fill
              className="object-cover"
            />
          <div className="container px-4 md:px-6 relative z-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  The Future of High-Stakes Betting is Here
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Experience a cutting-edge gambling platform with P2P betting, casino classics, and seamless crypto transactions. Built for the modern gambler.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/signup">Verify Your Identity</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard/investor">Investor Dashboard</Link>
                  </Button>
                </div>
              </div>
               <div className="relative h-auto">
                 <Card className="bg-card/60 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                           <span>Featured Event</span>
                            <div className="flex items-center gap-2 text-sm text-red-400 animate-pulse">
                                <Zap className="w-4 h-4" />
                                LIVE
                            </div>
                        </CardTitle>
                        <CardDescription>MMA Fight Night: Titan vs. Goliath</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                             <Image
                              src="https://picsum.photos/600/400"
                              alt="MMA Fight"
                              data-ai-hint="sports mma"
                              fill
                              className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" size="lg" className="flex flex-col h-auto">
                                <span>Titan</span>
                                <span className="text-lg font-bold">1.85</span>
                            </Button>
                             <Button variant="secondary" size="lg" className="flex flex-col h-auto">
                                <span>Goliath</span>
                                <span className="text-lg font-bold">2.15</span>
                            </Button>
                        </div>
                         <Button className="w-full mt-4" asChild><Link href={user ? "/dashboard/p2p-betting" : "/signin"}>Place Bet</Link></Button>
                    </CardContent>
                 </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full bg-background py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Popular Games</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Jump into the action with our most popular casino and betting options.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularGames.map(game => (
                         <Card key={game.title} className="overflow-hidden group relative">
                            <Link href={user ? game.href : '/signin'}>
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors z-10"></div>
                                <Image src={game.image} data-ai-hint={game.aiHint} alt={game.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
                                <CardHeader className="relative z-20">
                                    <CardTitle className="text-white">{game.title}</CardTitle>
                                    <CardDescription className="text-gray-300">{game.description}</CardDescription>
                                </CardHeader>
                            </Link>
                         </Card>
                    ))}
                </div>
            </div>
        </section>

        <section id="features" className="w-full bg-card/30 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">An Unmatched Platform</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines cutting-edge technology with a seamless user experience, setting a new standard for online betting.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Automated KYC/AML</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">AI-powered identity verification, facial recognition, and age estimation to ensure compliance.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Gem className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Crypto & Fiat Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A polished wallet interface for crypto and fiat deposits/withdrawals, showcasing a seamless user financial experience.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">P2P Betting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">An intuitive marketplace for users to create and accept peer-to-peer bets on a variety of events.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Dices className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Casino Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Classic casino games like slots, poker, and roulette with flashy UIs to drive user engagement.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                   <div className="rounded-full bg-primary/10 p-3">
                    <Swords className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Live Sports Betting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A dynamic interface for live sports betting, complete with real-time odds and event tracking.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                 <CardHeader className="flex flex-row items-center gap-4">
                   <div className="rounded-full bg-primary/10 p-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Investor Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A comprehensive dashboard showcasing compliance metrics and platform performance for investor confidence.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by SureBet. A legitimate and secure online betting platform.
          </p>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SureBet</p>
        </div>
      </footer>
    </div>
  );
}
