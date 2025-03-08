
import React from 'react';
import FinanceSummary from './FinanceSummary';
import BalanceChart from './BalanceChart';
import RecentTransactions from './RecentTransactions';
import { useTransactions } from '@/hooks/useTransactions';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardPage = () => {
  const { 
    transactions, 
    isLoading, 
    getBalance, 
    getTotalIncome, 
    getTotalExpenses 
  } = useTransactions();
  
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your finances and spending habits</p>
      </div>
      
      <FinanceSummary 
        balance={getBalance()}
        income={getTotalIncome()}
        expenses={getTotalExpenses()}
        isLoading={isLoading}
      />
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-7 gap-6'}`}>
        <div className={`${isMobile ? '' : 'col-span-4'}`}>
          <BalanceChart 
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
        <div className={`${isMobile ? '' : 'col-span-3'}`}>
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
