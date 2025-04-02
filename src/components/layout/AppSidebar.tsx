
import { Home, PieChart, DollarSign, LogOut, Lightbulb, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Main navigation items
  const navItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: Home,
    },
    {
      title: 'Transactions',
      path: '/transactions',
      icon: DollarSign,
    },
    {
      title: 'Budget',
      path: '/budget',
      icon: PieChart,
    },
    {
      title: 'AI Insights',
      path: '/ai-insights',
      icon: Lightbulb,
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: User,
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div 
      className="fixed inset-y-0 left-0 z-40"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <Sidebar className={cn(
        "border-r transition-all duration-300 ease-in-out", 
        expanded ? "w-64" : "w-16"
      )}>
        <SidebarHeader className={cn(
          "px-6 py-4",
          !expanded && "flex justify-center px-2"
        )}>
          <div className={cn(
            "flex items-center gap-2",
            !expanded && "justify-center"
          )}>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              {expanded ? "FinAI" : "FA"}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      className={cn(
                        "flex justify-center",
                        expanded && "justify-start",
                        isActive(item.path) && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      {expanded && <span className="ml-2">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className={cn("p-4", !expanded && "flex justify-center p-2")}>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2", 
              expanded ? "w-full justify-start" : "w-auto justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {expanded && <span>Logout</span>}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
