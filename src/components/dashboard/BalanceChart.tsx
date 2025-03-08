
import React, { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Transaction, getMonthlyTotals, formatCurrency } from '@/lib/finance';
import { useIsMobile } from '@/hooks/use-mobile';

interface BalanceChartProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-sm text-gray-700">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BalanceChart = ({ transactions, isLoading }: BalanceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (transactions.length > 0) {
      const { labels, incomeData, expenseData } = getMonthlyTotals(transactions);
      
      const formattedData = labels.map((label, index) => ({
        name: label,
        Income: incomeData[index],
        Expenses: expenseData[index],
        Balance: incomeData[index] - expenseData[index]
      }));
      
      setChartData(formattedData);
    }
  }, [transactions]);
  
  if (isLoading) {
    return (
      <GlassCard className="h-80">
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="h-64 w-full bg-gray-100 rounded animate-pulse" />
      </GlassCard>
    );
  }
  
  return (
    <GlassCard>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Financial Overview</h3>
        
        <div className="h-80">
          {isMobile ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Bar dataKey="Income" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={isMobile ? 12 : 20} />
                <Bar dataKey="Expenses" fill="#FF5252" radius={[4, 4, 0, 0]} barSize={isMobile ? 12 : 20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 30,
                }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5252" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196F3" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Area 
                  type="monotone" 
                  dataKey="Income" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Expenses" 
                  stroke="#FF5252" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Balance" 
                  stroke="#2196F3" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default BalanceChart;
