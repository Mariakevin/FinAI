
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Check if the current path is a public route (login, register, home)
  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-white to-blue-50">
      {isAuthenticated && !isPublicRoute && <AppSidebar />}
      <main className={cn(
        "flex-1 flex flex-col w-full",
        isAuthenticated && !isPublicRoute ? "ml-16" : ""
      )}>
        {isAuthenticated && !isPublicRoute && (
          <header className="h-14 border-b flex items-center px-4 w-full bg-white/80 backdrop-blur-sm">
            <SidebarTrigger />
            <div className="ml-4 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              FinAI
            </div>
          </header>
        )}
        <div className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
