
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const pageKey = location.pathname;
  const isIndexPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-50/30 to-white">
      <Navbar />
      <main className={cn(
        "pt-16 pb-12 w-full",
        isIndexPage 
          ? "px-0" 
          : "px-2 sm:px-4 md:px-6 max-w-full mx-auto"
      )}>
        <div 
          className="animate-scale-in transition-all duration-300 rounded-xl"
          key={pageKey}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
