
import React, { useState, useEffect, useCallback, memo } from 'react';
import FinanceSummary from './FinanceSummary';
import BalanceChart from './BalanceChart';
import RecentTransactions from './RecentTransactions';
import UpiIntegration from './UpiIntegration';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  BarChartBig, 
  PieChart, 
  TrendingUp, 
  Wallet, 
  LayoutDashboard, 
  LogIn, 
  Sparkles, 
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const QuickAction = memo(({ 
  title, 
  icon, 
  onClick, 
  color,
  disabled = false,
}: { 
  title: string; 
  icon: React.ReactNode; 
  onClick: () => void; 
  color: string;
  disabled?: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <Button 
      variant="outline" 
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`${color} border-none shadow-sm hover:shadow-md transition-all duration-200 gap-2`}
    >
      {icon}
      <span>{title}</span>
    </Button>
  </motion.div>
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
  const [showRefreshAnimation, setShowRefreshAnimation] = useState(false);
  
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [isUpiConnected, transactions.length]);
  
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

  const refreshData = useCallback(() => {
    setShowRefreshAnimation(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setShowRefreshAnimation(false);
      toast.success('Dashboard data refreshed');
    }, 800);
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
  
  const quickActions = [
    {
      title: 'Add Transaction',
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: navigateToTransactions,
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
      disabled: false
    },
    {
      title: 'View Budget',
      icon: <Wallet className="h-5 w-5" />,
      onClick: navigateToBudget,
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      disabled: false
    },
    {
      title: 'AI Insights',
      icon: <Sparkles className="h-5 w-5" />,
      onClick: navigateToAiInsights,
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      disabled: false
    }
  ];
  
  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };
  
  return (
    <div className="space-y-6 pb-8 animate-fade-in pt-2 bg-gradient-to-b from-white to-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div {...fadeInAnimation}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1">Welcome to your financial command center</p>
        </motion.div>
        
        <div className="flex flex-wrap gap-2">
          <motion.div {...fadeInAnimation} transition={{ delay: 0.1 }}>
            {!isAuthenticated && (
              <Button 
                onClick={navigateToLogin}
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-600 border-none shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-100"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Sign in to edit
              </Button>
            )}
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <QuickAction
                  title={action.title}
                  icon={action.icon}
                  onClick={action.onClick}
                  color={action.color}
                  disabled={action.disabled}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FinanceSummary 
          balance={getBalance()}
          income={getTotalIncome()}
          expenses={getTotalExpenses()}
          isLoading={isLoading}
          key={`summary-${refreshKey}`}
        />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white p-4 rounded-xl shadow-md border border-gray-100/80 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">Financial Overview</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`ml-2 h-8 w-8 text-gray-500 hover:text-blue-600 ${showRefreshAnimation ? 'animate-spin' : ''}`}
              onClick={refreshData}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <span className="ml-2 text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
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
      </motion.div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-7 gap-6'}`}>
        <motion.div 
          className={`${isMobile ? '' : 'col-span-4'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <RecentTransactions 
            transactions={transactions}
            isLoading={isLoading}
            key={`transactions-${refreshKey}`}
            isReadOnly={!isAuthenticated}
          />
        </motion.div>
        <motion.div 
          className={`${isMobile ? '' : 'col-span-3'}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <UpiIntegration 
            onUpiConnect={handleUpiConnect}
            isConnected={isUpiConnected}
            connectedUpiId={connectedUpiId}
            isReadOnly={!isAuthenticated}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default memo(DashboardPage);
