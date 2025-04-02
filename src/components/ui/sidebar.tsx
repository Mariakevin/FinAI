
import React, { createContext, useContext, useState } from 'react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  Brain, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const Sidebar = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budget', href: '/budget', icon: PieChart },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
  ];

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // If not authenticated, don't render the sidebar
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:shrink-0 lg:flex lg:flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link 
            to="/dashboard" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={close}
          >
            FinAI
          </Link>
          <button 
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const ItemIcon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={close}
                >
                  <ItemIcon className={cn("mr-3 h-5 w-5", active ? "text-blue-500" : "text-gray-500")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8">
            <div className="px-4">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your Account
              </h3>
              <nav className="mt-2 space-y-1 px-2">
                {userNavigation.map((item) => {
                  const active = isActive(item.href);
                  const ItemIcon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={close}
                    >
                      <ItemIcon className={cn("mr-3 h-5 w-5", active ? "text-blue-500" : "text-gray-500")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          {isAuthenticated && user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-full">
                  <span className="text-blue-600 font-medium text-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  logout();
                  close();
                }}
              >
                <span className="sr-only">Logout</span>
                Log out
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const SidebarToggle = () => {
  const { isAuthenticated } = useAuth();
  const { toggle } = useSidebar();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="lg:hidden"
      onClick={toggle}
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};
