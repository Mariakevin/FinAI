
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  Menu, 
  X,
  User,
  LogOut,
  LogIn,
  Calculator,
  Bot,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      variant: "default",
    });
    navigate('/login');
  };

  if (!mounted) return null;
  
  const authenticatedRoutes = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: 'View your financial overview'
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <Receipt className="w-5 h-5" />,
      description: 'Manage your transactions'
    },
    {
      name: 'Budget',
      path: '/budget',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Plan and track your budget'
    },
    {
      name: 'AI Insights',
      path: '/ai-insights',
      icon: <Bot className="w-5 h-5" />,
      description: 'Get AI-powered financial insights'
    },
  ];
  
  const unauthenticatedRoutes = [
    {
      name: 'Login',
      path: '/login',
      icon: <LogIn className="w-5 h-5" />,
      description: 'Sign in to your account'
    },
    {
      name: 'Register',
      path: '/register',
      icon: <User className="w-5 h-5" />,
      description: 'Create a new account'
    },
  ];
  
  const routes = isAuthenticated ? authenticatedRoutes : unauthenticatedRoutes;
  
  // User menu items
  const userMenuItems = [
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-lg">F</span>
                </div>
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                  Finwise
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <TooltipProvider delayDuration={300}>
                {routes.map((route) => (
                  <Tooltip key={route.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={route.path}
                        className={cn(
                          "px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium",
                          location.pathname === route.path
                            ? "text-blue-600 bg-blue-50 shadow-sm"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        )}
                        aria-label={route.name}
                      >
                        {route.icon}
                        <span>{route.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{route.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                
                {isAuthenticated && (
                  <div className="ml-2 pl-2 border-l border-gray-200 flex items-center gap-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "p-2 rounded-lg flex items-center justify-center transition-all duration-200",
                          location.pathname === item.path
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                        )}
                        aria-label={item.name}
                      >
                        {item.icon}
                      </Link>
                    ))}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50 ml-1"
                      aria-label="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </TooltipProvider>
            </div>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-base">F</span>
              </div>
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Finwise
              </span>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="py-4 px-2 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-medium",
                location.pathname === route.path
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              )}
            >
              {route.icon}
              <span>{route.name}</span>
            </Link>
          ))}
          
          {isAuthenticated && (
            <>
              <div className="border-t border-gray-200 my-2 pt-2">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-medium",
                      location.pathname === item.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 mt-1 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
              
              <div className="mt-4 px-4 py-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Need help?</p>
                    <p className="text-blue-600 text-xs">Check the help section in settings</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
