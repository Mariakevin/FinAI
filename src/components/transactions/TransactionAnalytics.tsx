
import React from 'react';
import { Transaction, formatCurrency, getCategoryTotals } from '@/lib/finance';
import GlassCard from '@/components/ui/GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TransactionAnalyticsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-xs text-gray-500">
          {payload[0].payload.percentage?.toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const TransactionAnalytics = ({ transactions, isLoading }: TransactionAnalyticsProps) => {
  const categoryData = getCategoryTotals(transactions);
  
  // Group transactions by month
  const monthlyData = React.useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!months[monthKey]) {
        months[monthKey] = { 
          income: 0, 
          expense: 0,
          name: monthName
        };
      }
      
      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
      } else {
        months[monthKey].expense += transaction.amount;
      }
    });
    
    return Object.values(months);
  }, [transactions]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard>
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="h-80 w-full bg-gray-100 rounded animate-pulse" />
        </GlassCard>
        <GlassCard>
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="h-80 w-full bg-gray-100 rounded animate-pulse" />
        </GlassCard>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <GlassCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Breakdown</h3>
        {categoryData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">Add some transactions to see analytics</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>
      
      <GlassCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Income vs Expense</h3>
        {monthlyData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">Add some transactions to see analytics</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4CAF50" />
                <Bar dataKey="expense" name="Expense" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default TransactionAnalytics;
