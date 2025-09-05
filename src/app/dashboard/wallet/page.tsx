
'use client';

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
import { Bitcoin, Landmark, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useBalance } from '@/hooks/use-balance';

const cryptoTransactions = [
  { id: 't1', type: 'Deposit', amount: '+0.5 BTC', status: 'Completed', date: '2025-10-26' },
  { id: 't2', type: 'Withdrawal', amount: '-0.2 ETH', status: 'Pending', date: '2025-10-25' },
  { id: 't3', type: 'Bet Won', amount: '+1.5 SOL', status: 'Completed', date: '2025-10-24' },
  { id: 't4', type: 'Bet Placed', amount: '-100 ADA', status: 'Completed', date: '2025-10-23' },
];

const fiatTransactions = [
  { id: 'f1', type: 'Deposit', amount: '+$1,000.00 USD', status: 'Completed', date: '2025-10-22' },
  { id: 'f2', type: 'Withdrawal', amount: '-$500.00 EUR', status: 'Failed', date: '2025-10-21' },
  { id: 'f3', 'type': 'Game Win', amount: '+$250.00 USD', status: 'Completed', date: '2025-10-20' },
];


export default function WalletPage() {
  const { balance } = useBalance();

  // Assuming a split for demo purposes. In a real app this would be more complex.
  const cryptoBalance = balance * 0.8;
  const fiatBalance = balance * 0.2;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Wallet</h1>
        <p className="text-muted-foreground">Manage your crypto and fiat balances.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-tr from-primary/50 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bitcoin/> Crypto Balance</CardTitle>
            <CardDescription>Your combined cryptocurrency holdings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tighter">${cryptoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark/> Fiat Balance</CardTitle>
            <CardDescription>Your balance in traditional currencies.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tighter">${fiatBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            A complete history of your deposits, withdrawals, and game activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="crypto">
            <div className="flex justify-between items-center">
                <TabsList>
                    <TabsTrigger value="crypto">Crypto</TabsTrigger>
                    <TabsTrigger value="fiat">Fiat</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                    <Button variant="outline"><ArrowDownLeft className="mr-2 h-4 w-4"/>Deposit</Button>
                    <Button><ArrowUpRight className="mr-2 h-4 w-4"/>Withdraw</Button>
                </div>
            </div>
            <TabsContent value="crypto" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cryptoTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className={tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{tx.amount}</TableCell>
                      <TableCell><Badge variant={tx.status === 'Completed' ? 'default' : tx.status === 'Pending' ? 'secondary' : 'destructive'} className={tx.status === 'Completed' ? 'bg-green-500/20 text-green-300' : ''}>{tx.status}</Badge></TableCell>
                      <TableCell className="text-right">{tx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="fiat" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiatTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className={tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{tx.amount}</TableCell>
                      <TableCell><Badge variant={tx.status === 'Completed' ? 'default' : tx.status === 'Pending' ? 'secondary' : 'destructive'} className={tx.status === 'Completed' ? 'bg-green-500/20 text-green-300' : ''}>{tx.status}</Badge></TableCell>
                      <TableCell className="text-right">{tx.date}</TableCell>
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
