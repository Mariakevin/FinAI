
import React, { useState, useEffect } from 'react';
import FinanceSummary from './FinanceSummary';
import BalanceChart from './BalanceChart';
import RecentTransactions from './RecentTransactions';
import UpiIntegration from './UpiIntegration';
import { useTransactions } from '@/hooks/useTransactions';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChartBig, PieChart, TrendingUp, Wallet, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeChartView, setActiveChartView] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Force a refresh of chart components when transactions or UPI connection status changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [isUpiConnected, transactions.length]);
  
  // Handle UPI connection/disconnection with refresh
  const handleUpiConnect = (upiId: string) => {
    connectUpiId(upiId);
    // We'll set a small timeout to ensure transactions are updated before refresh
    setTimeout(() => setRefreshKey(prev => prev + 1), 100);
  };

  // Handle chart view change with refresh to ensure proper rendering
  const handleChartViewChange = (view: string) => {
    setActiveChartView(view);
    // Small delay to ensure view change takes effect
    setTimeout(() => setRefreshKey(prev => prev + 1), 50);
  };

  // Quick actions
  const quickActions = [
    {
      title: 'Add Transaction',
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: () => navigate('/transactions'),
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'View Budget',
      icon: <Wallet className="h-5 w-5" />,
      onClick: () => navigate('/budget'),
      color: 'bg-blue-50 text-blue-600'
    }
  ];
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm"
              onClick={action.onClick}
              className={`${action.color} border-none shadow-sm hover:shadow-md transition-all duration-200`}
            >
              {action.icon}
              <span className="ml-1">{action.title}</span>
            </Button>
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
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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
          />
        </div>
        <div className={`${isMobile ? '' : 'col-span-3'}`}>
          <UpiIntegration 
            onUpiConnect={handleUpiConnect}
            isConnected={isUpiConnected}
            connectedUpiId={connectedUpiId}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
