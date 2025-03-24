
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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50/30 to-white">
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
