import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  User,
  LogOut,
  LogIn,
  Calculator,
  Bot,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
  }, []);

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
  
  const userMenuItems = [
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5" />,
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm h-16">
      <div className="w-full px-2 sm:px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-base">F</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              FinAI
            </span>
          </Link>

          {isAuthenticated && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0 w-[280px] sm:w-[320px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <Link to="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">f</span>
                        </div>
                        <span className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                          FinAI
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto py-3">
                    <div className="px-2 space-y-1">
                      {routes.map((route) => (
                        <Link
                          key={route.path}
                          to={route.path}
                          className={cn(
                            "px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-medium",
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
                                  "px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-medium",
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
                              className="w-full px-3 py-2 mt-1 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium"
                            >
                              <LogOut className="w-5 h-5" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {!isAuthenticated && (
            <div className="flex gap-2">
              <Link to="/login">
                <Button size="sm" variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="default">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
