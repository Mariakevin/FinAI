
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
        "pt-16 pb-8 w-full",
        isIndexPage 
          ? "px-0" 
          : "px-4 md:px-6 lg:px-8 mx-auto"
      )}>
        <div 
          className="animate-scale-in transition-all duration-300 rounded-xl max-w-7xl mx-auto"
          key={pageKey}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
