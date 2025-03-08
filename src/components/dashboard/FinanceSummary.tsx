
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
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
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index}
            className="h-32 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-600" />
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-500 font-medium">Current Balance</p>
          <h3 className={`text-3xl font-bold mt-1 ${balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
            <AnimatedNumber 
              value={balance} 
              formatter={(value) => formatCurrency(value)}
            />
          </h3>
          <div className="mt-2 text-xs text-gray-500">
            Updated today
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <ArrowUpRight className="w-6 h-6 text-green-600" />
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-500 font-medium">Total Income</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">
            <AnimatedNumber 
              value={income} 
              formatter={(value) => formatCurrency(value)}
            />
          </h3>
          <div className="mt-2 text-xs text-gray-500">
            Last 6 months
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <ArrowDownRight className="w-6 h-6 text-red-600" />
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">
            <AnimatedNumber 
              value={expenses} 
              formatter={(value) => formatCurrency(value)}
            />
          </h3>
          <div className="flex items-center mt-2">
            <span className={`px-1.5 py-0.5 text-xs rounded ${savingsRate >= 20 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {savingsRate.toFixed(0)}% savings rate
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default FinanceSummary;
