
import { DashboardNav } from '@/components/DashboardNav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { BalanceProvider } from '@/hooks/use-balance';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BalanceProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardNav />
          <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </BalanceProvider>
  );
}
