
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { TransactionsProvider } from '@/hooks/useTransactions';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <TransactionsProvider>
      <div className="flex flex-col min-h-screen bg-gray-100/40 dark:bg-gray-900/40">
        <Navbar />
        <main className="flex-1 overflow-auto pt-16 pb-8">
          <div className="container mx-auto px-4 py-4">
            {children}
          </div>
        </main>
      </div>
    </TransactionsProvider>
  );
};
