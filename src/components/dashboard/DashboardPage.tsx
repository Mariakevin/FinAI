
import React, { useState } from 'react';
import FinanceSummary from './FinanceSummary';
import BalanceChart from './BalanceChart';
import RecentTransactions from './RecentTransactions';
import UpiIntegration from './UpiIntegration';
import { useTransactions } from '@/hooks/useTransactions';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChartBig, PieChart } from 'lucide-react';

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
  
  const isMobile = useIsMobile();
  const [activeChartView, setActiveChartView] = useState('overview');
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your finances and spending habits</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100/70 p-1 rounded-lg">
          <button 
            onClick={() => setActiveChartView('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
              activeChartView === 'overview' 
                ? 'bg-white shadow-sm text-blue-600' 
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveChartView('monthly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
              activeChartView === 'monthly' 
                ? 'bg-white shadow-sm text-blue-600' 
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            <BarChartBig className="w-4 h-4" />
            <span>Monthly</span>
          </button>
          <button 
            onClick={() => setActiveChartView('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
              activeChartView === 'category' 
                ? 'bg-white shadow-sm text-blue-600' 
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </div>
      </div>
      
      <FinanceSummary 
        balance={getBalance()}
        income={getTotalIncome()}
        expenses={getTotalExpenses()}
        isLoading={isLoading}
      />
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-7 gap-6'}`}>
        <div className={`${isMobile ? '' : 'col-span-4'}`}>
          <Card className="border border-gray-200/50 shadow-sm bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">Financial Overview</CardTitle>
              <CardDescription>
                Track your income, expenses, and balance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BalanceChart 
                transactions={transactions}
                isLoading={isLoading}
                chartView={activeChartView}
              />
            </CardContent>
          </Card>
        </div>
        <div className={`${isMobile ? '' : 'col-span-3'} space-y-6`}>
          <UpiIntegration 
            onUpiConnect={connectUpiId}
            isConnected={isUpiConnected}
            connectedUpiId={connectedUpiId}
          />
          <RecentTransactions 
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
