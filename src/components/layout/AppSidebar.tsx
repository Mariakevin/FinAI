
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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Main navigation items - removed Settings
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
    <Sidebar className="border-r">
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">FinAI</span>
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
                      isActive(item.path) && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
