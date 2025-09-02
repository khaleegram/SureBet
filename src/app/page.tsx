import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dices, Gem, ShieldCheck, Swords, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Home() {
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
              <Link href="/dashboard/casino">Games</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  The Future of High-Stakes Betting is Here
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Experience a cutting-edge gambling prototype with P2P betting, casino classics, and simulated crypto transactions. Built for the discerning investor.
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
              <div className="relative h-64 lg:h-auto">
                 <Image
                  src="https://picsum.photos/800/600"
                  alt="Abstract gambling-themed background"
                  data-ai-hint="casino abstract"
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-background py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Unmatched Platform Simulation</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our prototype demonstrates a robust and compliant platform, ready to capture the market. Explore the features that set us apart.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Mock KYC/AML</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Simulated AI-powered identity verification, facial recognition, and age estimation to demonstrate compliance readiness.</p>
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
                  <p className="text-muted-foreground">A polished wallet interface simulating crypto and fiat deposits/withdrawals, showcasing a seamless user financial experience.</p>
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
                  <p className="text-muted-foreground">Classic casino games like slots, poker, and roulette with flashy UIs to demonstrate user engagement potential.</p>
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
                  <p className="text-muted-foreground">A dynamic interface for live sports betting, complete with mock real-time odds and event tracking.</p>
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
                  <p className="text-muted-foreground">A comprehensive dashboard showcasing simulated compliance metrics and platform performance for investor confidence.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by SureBet. For demonstration purposes only. Not a real gambling platform.
          </p>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SureBet Simulator</p>
        </div>
      </footer>
    </div>
  );
}
