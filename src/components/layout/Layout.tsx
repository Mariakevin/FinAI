
import React from 'react';
import { useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TransactionsProvider } from '@/hooks/useTransactions';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <TransactionsProvider>
      <div className="flex h-screen bg-gray-100/40 dark:bg-gray-900/40">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <Navbar />
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </TransactionsProvider>
  );
};
