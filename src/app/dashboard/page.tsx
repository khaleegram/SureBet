
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useBalance } from '@/hooks/use-balance';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { balance } = useBalance();
  const { user } = useAuth();
  
  const getVerificationDate = () => {
    if (user?.metadata?.creationTime) {
      return format(new Date(user.metadata.creationTime), 'yyyy-MM-dd');
    }
    return '2025-10-26';
  }


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome Back, Player
        </h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your activity on SureBet.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Available to bet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bets
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58.3%</div>
            <p className="text-xs text-muted-foreground">
              -1.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verification Status
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Verified</div>
            <p className="text-xs text-muted-foreground">
              Completed on {getVerificationDate()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A log of your recent deposits, withdrawals, and betting activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Bitcoin Deposit</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="ml-auto font-medium text-green-400">+0.5 BTC</div>
              </div>
               <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Roulette Win</p>
                  <p className="text-sm text-muted-foreground">Casino Game</p>
                </div>
                <div className="ml-auto font-medium text-green-400">+$1,200.00</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Fiat Withdrawal</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="ml-auto font-medium text-yellow-400">-$500.00</div>
              </div>
                 <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">P2P Bet Placed</p>
                  <p className="text-sm text-muted-foreground">MMA Fight Night</p>
                </div>
                <div className="ml-auto font-medium text-red-400">-$250.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild>
                <Link href="/dashboard/wallet">Deposit Funds</Link>
            </Button>
            <Button variant="secondary" asChild>
                <Link href="/dashboard/p2p-betting">Find a Bet</Link>
            </Button>
            <Button variant="secondary" asChild>
                <Link href="/dashboard/casino">Play Games</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
