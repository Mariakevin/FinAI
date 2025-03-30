
import React, { useState, useEffect, useCallback, memo } from 'react';
import FinanceSummary from './FinanceSummary';
import BalanceChart from './BalanceChart';
import RecentTransactions from './RecentTransactions';
import UpiIntegration from './UpiIntegration';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChartBig, PieChart, TrendingUp, Wallet, LayoutDashboard, LogIn, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// QuickAction component for better organization
const QuickAction = memo(({ 
  title, 
  icon, 
  onClick, 
  color 
}: { 
  title: string; 
  icon: React.ReactNode; 
  onClick: () => void; 
  color: string;
}) => (
  <Button 
    variant="outline" 
    size="sm"
    onClick={onClick}
    className={`${color} border-none shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
  >
    {icon}
    <span className="ml-1">{title}</span>
  </Button>
));

const DashboardPage = () => {
  const { 
    transactions, 
    isLoading, 
    getBalance, 
    getTotalIncome, 
    getTotalExpenses,
    connectUpiId,
    isUpiConnected,
    connectedUpiId
  } = useTransactions();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeChartView, setActiveChartView] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Force a refresh of chart components when transactions or UPI connection status changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [isUpiConnected, transactions.length]);
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleUpiConnect = useCallback((upiId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to connect UPI');
      navigate('/login');
      return;
    }
    
    connectUpiId(upiId);
    setTimeout(() => setRefreshKey(prev => prev + 1), 100);
  }, [isAuthenticated, connectUpiId, navigate]);

  const handleChartViewChange = useCallback((view: string) => {
    setActiveChartView(view);
    setTimeout(() => setRefreshKey(prev => prev + 1), 50);
  }, []);

  const navigateToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const navigateToTransactions = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add transactions');
      navigate('/login');
      return;
    }
    navigate('/transactions');
  }, [isAuthenticated, navigate]);

  const navigateToBudget = useCallback(() => {
    navigate('/budget');
  }, [navigate]);

  const navigateToAiInsights = useCallback(() => {
    navigate('/ai-insights');
  }, [navigate]);
  
  // Quick actions
  const quickActions = [
    {
      title: 'Add Transaction',
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: navigateToTransactions,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'View Budget',
      icon: <Wallet className="h-5 w-5" />,
      onClick: navigateToBudget,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'AI Insights',
      icon: <Sparkles className="h-5 w-5" />,
      onClick: navigateToAiInsights,
      color: 'bg-purple-50 text-purple-600'
    }
  ];
  
  return (
    <div className="space-y-6 pb-8 animate-fade-in pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-purple-600" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome! Here's your financial overview.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!isAuthenticated && (
            <Button 
              onClick={navigateToLogin}
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-none shadow-sm hover:shadow-md transition-all duration-200"
            >
              <LogIn className="h-5 w-5 mr-1" />
              Sign in to edit
            </Button>
          )}
          
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              icon={action.icon}
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>
      </div>
      
      <FinanceSummary 
        balance={getBalance()}
        income={getTotalIncome()}
        expenses={getTotalExpenses()}
        isLoading={isLoading}
        key={`summary-${refreshKey}`}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100/80 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Financial Overview</h2>
          
          <Tabs value={activeChartView} onValueChange={handleChartViewChange} className="w-auto">
            <TabsList className="bg-gray-100/70 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                <LineChart className="w-4 h-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                <BarChartBig className="w-4 h-4 mr-1" />
                Monthly
              </TabsTrigger>
              <TabsTrigger value="category" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                <PieChart className="w-4 h-4 mr-1" />
                Categories
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mt-2">
          <BalanceChart 
            transactions={transactions}
            isLoading={isLoading}
            chartView={activeChartView}
            key={`chart-${activeChartView}-${refreshKey}`}
          />
        </div>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-7 gap-6'}`}>
        <div className={`${isMobile ? '' : 'col-span-4'}`}>
          <RecentTransactions 
            transactions={transactions}
            isLoading={isLoading}
            key={`transactions-${refreshKey}`}
            isReadOnly={!isAuthenticated}
          />
        </div>
        <div className={`${isMobile ? '' : 'col-span-3'}`}>
          <UpiIntegration 
            onUpiConnect={handleUpiConnect}
            isConnected={isUpiConnected}
            connectedUpiId={connectedUpiId}
            isReadOnly={!isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardPage);
