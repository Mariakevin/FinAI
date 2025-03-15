
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/lib/finance';

interface FinanceSummaryProps {
  balance: number;
  income: number;
  expenses: number;
  isLoading: boolean;
}

const FinanceSummary = ({ balance, income, expenses, isLoading }: FinanceSummaryProps) => {
  // Calculate savings rate
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  // Calculate net change and determine if it's positive
  const netChange = income - expenses;
  const isPositive = netChange >= 0;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index}
            className="h-32 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-2 border-blue-100">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-600" />
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-500 font-medium">Current Balance</p>
          <h3 className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
            <AnimatedNumber 
              value={balance} 
              formatter={(value) => formatCurrency(value)}
            />
          </h3>
          <div className="mt-3 text-xs font-medium flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(netChange).toFixed(0)}₹ {isPositive ? 'saved' : 'deficit'}</span>
            </div>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-2 border-green-100">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <ArrowUpRight className="w-6 h-6 text-green-600" />
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-500 font-medium">Total Income</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            <AnimatedNumber 
              value={income} 
              formatter={(value) => formatCurrency(value)}
            />
          </h3>
          <div className="mt-3 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full inline-flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Last 30 days
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-2 border-red-100">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <ArrowDownRight className="w-6 h-6 text-red-600" />
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            <AnimatedNumber 
              value={expenses} 
              formatter={(value) => formatCurrency(value)}
            />
          </h3>
          <div className="flex items-center mt-3 gap-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${savingsRate >= 20 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <PiggyBank className="w-3 h-3" />
              <span>{savingsRate.toFixed(0)}% savings rate</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default FinanceSummary;
