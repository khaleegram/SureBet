
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dices, Gem, ShieldCheck, Swords, Users, Zap, LogIn, ArrowRight, UserPlus, Banknote, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/use-auth';

const popularGames = [
    { 
        title: 'Live Sports Betting', 
        description: 'Bet on live sports events as they happen.',
        image: 'https://picsum.photos/seed/6/600/400',
        aiHint: 'stadium lights',
        href: '/dashboard/sports-betting',
        icon: Swords
    },
    { 
        title: 'Slots', 
        description: 'Spin the reels for a chance at massive jackpots.',
        image: 'https://picsum.photos/seed/1/600/400',
        aiHint: 'casino slot machine',
        href: '/dashboard/casino/slots',
        icon: Gem
    },
    { 
        title: 'Poker', 
        description: 'Join a table and test your skills against other players.',
        image: 'https://picsum.photos/seed/2/600/400',
        aiHint: 'poker cards',
        href: '/dashboard/casino/poker',
        icon: Users
    },
];

const features = [
    {
      icon: ShieldCheck,
      title: "Automated KYC/AML",
      description: "AI-powered identity verification, facial recognition, and age estimation to ensure compliance."
    },
    {
      icon: Gem,
      title: "Crypto & Fiat Wallet",
      description: "A polished wallet interface for crypto and fiat deposits/withdrawals, showcasing a seamless user financial experience."
    },
    {
      icon: Users,
      title: "P2P Betting",
      description: "An intuitive marketplace for users to create and accept peer-to-peer bets on a variety of events."
    },
    {
      icon: Dices,
      title: "Casino Games",
      description: "Classic casino games like slots, poker, and roulette with flashy UIs to drive user engagement."
    },
    {
      icon: Swords,
      title: "Live Sports Betting",
      description: "A dynamic interface for live sports betting, complete with real-time odds and event tracking."
    },
    {
      icon: ShieldCheck,
      title: "Manual Review Queue",
      description: "A queue for flagged cases (mismatched ID, facial scan, or age issues) for human review."
    }
]

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
        <section className="relative w-full py-24 md:py-40 lg:py-48 bg-black">
          <div className="container px-4 md:px-6 relative z-20 text-center">
            <div className="flex flex-col justify-center space-y-6 items-center animate-fade-in-up">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  The Future of Online Betting is Here
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Experience a cutting-edge platform with P2P betting, casino classics, and seamless crypto transactions. Built for the modern user.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button size="lg" asChild>
                        <Link href="/signup">Get Started Now <ArrowRight className="ml-2" /></Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#games">Explore Games</Link>
                    </Button>
                </div>
              </div>
          </div>
        </section>

        <section className="w-full bg-background py-16 md:py-24">
             <Card className="container mx-auto max-w-6xl bg-card/60 backdrop-blur-md animate-fade-in-up">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                       <span className="font-headline text-2xl">Featured Event</span>
                        <div className="flex items-center gap-2 text-sm text-red-400 animate-pulse">
                            <Zap className="w-4 h-4" />
                            LIVE
                        </div>
                    </CardTitle>
                    <CardDescription>MMA Fight Night: Titan vs. Goliath</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="relative h-64 rounded-lg overflow-hidden">
                             <Image
                              src="https://picsum.photos/seed/mma/600/400"
                              alt="MMA Fight"
                              data-ai-hint="sports mma"
                              fill
                              className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-muted-foreground">A legendary clash of titans. Who will emerge victorious? Place your bets on the P2P exchange.</p>
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
                             <Button className="w-full" asChild><Link href={user ? "/dashboard/p2p-betting" : "/signin"}>Place Bet</Link></Button>
                        </div>
                    </div>
                </CardContent>
             </Card>
        </section>
        
        <section id="how-it-works" className="w-full bg-card/30 py-20 md:py-32">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Get Started in 3 Easy Steps</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Our streamlined process gets you from signup to the winner's circle in minutes.
                    </p>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3 lg:gap-12">
                    <Card className="text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                           <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">1. Verify Identity</h3>
                        <p className="text-muted-foreground mt-2">Complete our secure, AI-powered KYC process in under 2 minutes.</p>
                    </Card>
                     <Card className="text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                           <Banknote className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">2. Deposit Funds</h3>
                        <p className="text-muted-foreground mt-2">Instantly add funds to your wallet using crypto or traditional fiat currency.</p>
                    </Card>
                     <Card className="text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                           <Gamepad2 className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">3. Start Betting</h3>
                        <p className="text-muted-foreground mt-2">Explore the casino, P2P exchange, or live sports betting and place your first bet.</p>
                    </Card>
                </div>
            </div>
        </section>

        <section id="games" className="w-full bg-background py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Popular Games</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Jump into the action with our most popular casino and betting options.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularGames.map((game, i) => (
                         <Card key={game.title} className="overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                            <Link href={user ? game.href : '/signin'} className="block h-full flex flex-col">
                                <CardHeader className="p-0 relative h-48">
                                    <Image src={game.image} data-ai-hint={game.aiHint} alt={game.title} fill objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </CardHeader>
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                          <game.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <CardTitle className="font-headline text-lg">
                                            {game.title}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="mt-auto">{game.description}</CardDescription>
                                </CardContent>
                            </Link>
                         </Card>
                    ))}
                </div>
            </div>
        </section>

        <section id="features" className="w-full bg-card/30 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">An Unmatched Platform</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines cutting-edge technology with a seamless user experience, setting a new standard for online betting.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {features.map((feature, i) => (
                <div key={feature.title} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                    <div className="rounded-full bg-primary/10 p-3 mt-1">
                        <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-card/30">
        <div className="container py-12">
            <div className="grid gap-8 md:grid-cols-4">
                <div className="flex flex-col gap-4">
                    <Logo />
                    <p className="text-muted-foreground text-sm">The most secure and transparent online betting platform.</p>
                </div>
                <div className="text-sm">
                    <h4 className="font-semibold mb-2">Platform</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                        <li><Link href="#games" className="hover:text-primary">Games</Link></li>
                        <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                    </ul>
                </div>
                 <div className="text-sm">
                    <h4 className="font-semibold mb-2">Legal</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-primary">Responsible Gaming</Link></li>
                    </ul>
                </div>
                 <div className="text-sm">
                    <h4 className="font-semibold mb-2">Community</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="#" className="hover:text-primary">Twitter / X</Link></li>
                        <li><Link href="#" className="hovertext-primary">Telegram</Link></li>
                        <li><Link href="#" className="hover:text-primary">Discord</Link></li>
                    </ul>
                </div>
            </div>
             <div className="mt-8 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} CrypDict. All Rights Reserved.</p>
                  <p>This is a fictional platform for demonstration purposes.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

    
