
import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  Sidebar,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Wallet, 
  LineChart, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  CreditCard,
  FileText,
  LifeBuoy,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const pageKey = location.pathname;
  const isIndexPage = location.pathname === '/';
  const isProfilePage = location.pathname === '/profile';
  const { open } = useSidebar();
  
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

  // Navigation items for the sidebar
  const navigationItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      path: '/dashboard', 
      active: location.pathname === '/dashboard' 
    },
    { 
      title: 'Transactions', 
      icon: <CreditCard className="h-5 w-5" />, 
      path: '/transactions', 
      active: location.pathname === '/transactions' 
    },
    { 
      title: 'Budget', 
      icon: <Wallet className="h-5 w-5" />, 
      path: '/budget', 
      active: location.pathname === '/budget' 
    },
    { 
      title: 'Analytics', 
      icon: <BarChart3 className="h-5 w-5" />, 
      path: '/analytics', 
      active: location.pathname === '/analytics' 
    },
    { 
      title: 'AI Insights', 
      icon: <Sparkles className="h-5 w-5" />, 
      path: '/ai-insights', 
      active: location.pathname === '/ai-insights' 
    },
  ];

  const profileItems = [
    { 
      title: 'Profile', 
      icon: <User className="h-5 w-5" />, 
      path: '/profile', 
      active: location.pathname === '/profile' 
    },
    { 
      title: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      path: '/settings', 
      active: location.pathname === '/settings' 
    },
  ];

  const supportItems = [
    { 
      title: 'Help & Support', 
      icon: <LifeBuoy className="h-5 w-5" />, 
      path: '/support', 
      active: location.pathname === '/support' 
    },
    { 
      title: 'Documentation', 
      icon: <FileText className="h-5 w-5" />, 
      path: '/docs', 
      active: location.pathname === '/docs' 
    },
  ];

  const fadeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-teal-50 via-blue-50/30 to-white",
      isProfilePage && "bg-gradient-to-b from-teal-100/50 via-blue-50/20 to-white"
    )}>
      <Navbar />
      <div className="flex pt-16">
        {isAuthenticated && !isIndexPage && (
          <AnimatePresence mode="wait">
            <Sidebar>
              <SidebarHeader className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <div className="font-semibold text-gray-900">FinWise</div>
                </div>
                <SidebarTrigger />
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            isActive={item.active}
                            tooltip={item.title}
                          >
                            <button onClick={() => navigate(item.path)}>
                              {item.icon}
                              <span>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Account</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {profileItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            isActive={item.active}
                            tooltip={item.title}
                          >
                            <button onClick={() => navigate(item.path)}>
                              {item.icon}
                              <span>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Support</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {supportItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                          >
                            <button onClick={() => navigate(item.path)}>
                              {item.icon}
                              <span>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              
              <SidebarFooter>
                <div className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50/50"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </SidebarFooter>
            </Sidebar>
          </AnimatePresence>
        )}
        
        <main className={cn(
          "pt-0 pb-8 w-full transition-all duration-300",
          open ? "pl-0" : "pl-0",
          isIndexPage 
            ? "px-0" 
            : "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pageKey}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="rounded-xl max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <footer className="py-4 text-center text-xs text-gray-500 bg-gradient-to-t from-teal-50/40 to-transparent">
        <p>Powered by FinWise AI • Analyzing your finances for smarter decisions</p>
      </footer>
    </div>
  );
};

export default Layout;
