
import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/finance';
import { PieChart, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample budget data - in a real app, this would be stored in a database
const INITIAL_BUDGETS = [
  { id: '1', category: 'Food & Dining', limit: 15000, color: '#4CAF50' },
  { id: '2', category: 'Transportation', limit: 5000, color: '#FF9800' },
  { id: '3', category: 'Entertainment', limit: 3000, color: '#F44336' },
  { id: '4', category: 'Shopping', limit: 8000, color: '#2196F3' },
  { id: '5', category: 'Bills & Utilities', limit: 10000, color: '#9C27B0' },
];

const BudgetPage = () => {
  const { transactions } = useTransactions();
  const [budgets] = useState(INITIAL_BUDGETS);
  
  // Calculate spending by category for the current month
  const getCurrentMonthSpending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear &&
             t.type === 'expense';
    });
    
    const categorySpending: Record<string, number> = {};
    
    monthlyTransactions.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    
    return categorySpending;
  };
  
  const categorySpending = getCurrentMonthSpending();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-500 mt-1">Track your spending against budget limits</p>
        </div>
        
        <Button className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span>Set New Budget</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Monthly Budget Tracking</h3>
          </div>
          
          <div className="space-y-6">
            {budgets.map(budget => {
              const spent = categorySpending[budget.category] || 0;
              const percentage = Math.min(100, (spent / budget.limit) * 100);
              const remaining = Math.max(0, budget.limit - spent);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: budget.color }}
                      />
                      <span className="font-medium">{budget.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(remaining)} remaining
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2" 
                    indicatorClassName={percentage >= 90 ? "bg-red-500" : ""}
                  />
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default BudgetPage;
