
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {isAuthenticated && !isPublicRoute && <AppSidebar />}
        <main className={cn(
          "flex-1 flex flex-col",
          isAuthenticated && !isPublicRoute ? "lg:ml-64" : ""
        )}>
          {isAuthenticated && !isPublicRoute && (
            <header className="h-14 border-b flex items-center px-4">
              <SidebarTrigger />
            </header>
          )}
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
