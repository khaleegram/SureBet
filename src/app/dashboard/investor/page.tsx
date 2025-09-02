'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ShieldCheck, Globe, Users, TrendingUp } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';


const dailyActiveUsersData = [
  { date: 'Mon', users: 550 },
  { date: 'Tue', users: 620 },
  { date: 'Wed', users: 780 },
  { date: 'Thu', users: 710 },
  { date: 'Fri', users: 950 },
  { date: 'Sat', users: 1200 },
  { date: 'Sun', users: 1100 },
];

const kycVerificationData = [
    { result: 'Auto-Approved', count: 850, fill: 'var(--color-approved)' },
    { result: 'Manual Review', count: 120, fill: 'var(--color-review)' },
    { result: 'Failed', count: 30, fill: 'var(--color-failed)' },
]

const kycChartConfig = {
  count: {
    label: "Count",
  },
  approved: {
    label: "Auto-Approved",
    color: "hsl(var(--chart-1))",
  },
  review: {
    label: "Manual Review",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

const dauChartConfig = {
  users: {
    label: "Active Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


export default function InvestorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Investor Dashboard</h1>
        <p className="text-muted-foreground">
          Simulated platform metrics demonstrating compliance, growth, and market readiness.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Pass Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">97.0%</div>
            <p className="text-xs text-muted-foreground">
              (Auto-approved + Manual approval)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Geo-Blocks Triggered
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">
              In the last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,100</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Simulated GGR
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">
              Gross Gaming Revenue (Last 30 days)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Daily Active Users (Simulated)</CardTitle>
                <CardDescription>A look at user engagement over the last week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={dauChartConfig} className="h-[250px] w-full">
                    <LineChart data={dailyActiveUsersData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis />
                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line dataKey="users" type="monotone" stroke="var(--color-users)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>KYC Verification Funnel</CardTitle>
                <CardDescription>Breakdown of user verification outcomes.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={kycChartConfig} className="h-[250px] w-full">
                  <BarChart data={kycVerificationData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="result" type="category" tickLine={false} axisLine={false} tickMargin={10} width={100} />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={5} />
                  </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
