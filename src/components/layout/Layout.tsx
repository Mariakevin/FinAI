
import React from 'react';
import { Sidebar, SidebarToggle } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TransactionsProvider } from '@/hooks/useTransactions';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';
  
  if (isLandingPage || isAuthPage) {
    return (
      <main className="min-h-screen">
        {!isAuthPage && (
          <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    FinAI
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign up</Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    );
  }
  
  return (
    <TransactionsProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <SidebarToggle />
                <div className="ml-2 lg:ml-0 flex-shrink-0">
                  <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    FinAI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 overflow-auto">
            <main className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </TransactionsProvider>
  );
};
