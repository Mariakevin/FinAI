
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Brain, 
  User,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  title = "finAI"
}) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Transactions', 
      path: '/transactions', 
      icon: <ArrowLeftRight className="w-5 h-5" /> 
    },
    { 
      name: 'Budget', 
      path: '/budget', 
      icon: <CreditCard className="w-5 h-5" /> 
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: <PieChart className="w-5 h-5" /> 
    },
    { 
      name: 'AI Insights', 
      path: '/ai-insights', 
      icon: <Brain className="w-5 h-5" /> 
    },
  ];
  
  const userNavItems = [
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];
  
  return (
    <>
      <Helmet>
        <title>{title} | Financial AI Assistant</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">finAI</h1>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-2">
              Main
            </p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 ml-2">
                  Account
                </p>
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </aside>
        
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={closeSidebar}
        />
        
        <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-30 md:hidden transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">finAI</h1>
            </Link>
            <button onClick={closeSidebar} className="p-1">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-2">
              Main
            </p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 ml-2">
                  Account
                </p>
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => {
                    navigate('/login');
                    closeSidebar();
                  }}
                >
                  Sign in
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigate('/register');
                    closeSidebar();
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </aside>
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 bg-white shadow-sm border-b border-gray-200 px-4 py-2 z-10">
            <div className="flex items-center justify-between">
              <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">finAI</h1>
              </Link>
              {isAuthenticated ? (
                <Link to="/profile" className="p-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
              )}
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
