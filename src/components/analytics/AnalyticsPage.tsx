
import React from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getCategoryTotals, formatCurrency } from '@/lib/finance';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-xs text-gray-500">
          {payload[0].payload.percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const { transactions, isLoading } = useTransactions();
  
  const categoryData = getCategoryTotals(transactions);
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Visualize your spending patterns</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <GlassCard className="h-96">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-8" />
            <div className="h-80 w-full bg-gray-100 rounded animate-pulse" />
          </GlassCard>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Visualize your spending patterns</p>
      </div>
      
      {categoryData.length === 0 ? (
        <GlassCard>
          <div className="py-16 text-center">
            <p className="text-gray-500">Add some transactions to see analytics</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Expense Breakdown</h3>
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
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Spending</h3>
            {categoryData.map((category) => (
              <div key={category.name} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm">{formatCurrency(category.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
