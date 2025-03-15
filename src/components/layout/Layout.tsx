
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-50/30 to-white">
      <Navbar />
      <main className="pt-20 pb-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto animate-fade-in">
        <div 
          className={cn(
            "animate-scale-in transition-all duration-300 rounded-xl"
          )}
          key={pageKey}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
