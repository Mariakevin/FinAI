
import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const pageKey = location.pathname;
  const isIndexPage = location.pathname === '/';
  const isProfilePage = location.pathname === '/profile';
  
  useEffect(() => {
    // If authentication is required and user is not authenticated, redirect to login
    if (requireAuth && !isLoading && !isAuthenticated) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [requireAuth, isAuthenticated, isLoading, navigate, location.pathname]);

  // Show loading state if checking authentication
  if (requireAuth && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 via-blue-50/30 to-white">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, show nothing (will redirect)
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 via-blue-50/30 to-white">
        <div className="text-lg text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-teal-50 via-blue-50/30 to-white",
      isProfilePage && "bg-gradient-to-b from-teal-100/50 via-blue-50/20 to-white"
    )}>
      <Navbar />
      <main className={cn(
        "pt-16 pb-8 w-full",
        isIndexPage 
          ? "px-0" 
          : "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto"
      )}>
        <div 
          className="animate-scale-in transition-all duration-300 rounded-xl max-w-7xl mx-auto"
          key={pageKey}
        >
          {children}
        </div>
      </main>
      
      <footer className="py-4 text-center text-xs text-gray-500 bg-gradient-to-t from-teal-50/40 to-transparent">
        <p>Powered by FinWise AI • Analyzing your finances for smarter decisions</p>
      </footer>
    </div>
  );
};

export default Layout;
