
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Users,
  Dices,
  ShieldCheck,
  Gavel,
  BarChartBig,
  LogOut,
  Swords,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/p2p-betting', label: 'P2P Betting', icon: Users },
  { href: '/dashboard/casino', label: 'Casino', icon: Dices },
  { href: '/dashboard/sports-betting', label: 'Sports Betting', icon: Swords },
];

const adminItems = [
  { href: '/dashboard/review', label: 'Manual Review', icon: Gavel },
  {
    href: '/dashboard/investor',
    label: 'Investor Dashboard',
    icon: BarChartBig,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { signOutUser } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="mt-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin
          </p>
          {adminItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Logout' }} onClick={signOutUser}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
