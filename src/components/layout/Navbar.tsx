
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart, 
  Settings, 
  Menu, 
  X,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!mounted) return null;
  
  const authenticatedRoutes = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart className="w-5 h-5" />,
    },
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
  
  const unauthenticatedRoutes = [
    {
      name: 'Login',
      path: '/login',
      icon: <LogIn className="w-5 h-5" />,
    },
    {
      name: 'Register',
      path: '/register',
      icon: <User className="w-5 h-5" />,
    },
  ];
  
  const routes = isAuthenticated ? authenticatedRoutes : unauthenticatedRoutes;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">F</span>
                </div>
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                  Finwise
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium",
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
                <Button 
                  variant="ghost" 
                  className="ml-2 text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span>Logout</span>
                </Button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden",
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
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
