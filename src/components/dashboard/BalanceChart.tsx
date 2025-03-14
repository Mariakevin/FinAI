
import React, { useEffect, useState } from 'react';
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Transaction, getMonthlyTotals, formatCurrency, getCategoryTotals } from '@/lib/finance';
import { useIsMobile } from '@/hooks/use-mobile';

interface BalanceChartProps {
  transactions: Transaction[];
  isLoading: boolean;
  chartView: string;
}

const CHART_COLORS = {
  income: '#4CAF50',
  expenses: '#FF5252',
  balance: '#2196F3',
  category1: '#8884d8',
  category2: '#83a6ed',
  category3: '#8dd1e1',
  category4: '#82ca9d',
  category5: '#a4de6c',
  category6: '#d0ed57',
  category7: '#ffc658',
};

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

const CategoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].fill }}>
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

const BalanceChart = ({ transactions, isLoading, chartView }: BalanceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  // Reset chart data when transactions array changes
  useEffect(() => {
    if (transactions.length > 0) {
      // For line/area/bar charts
      const { labels, incomeData, expenseData } = getMonthlyTotals(transactions);
      
      const formattedData = labels.map((label, index) => ({
        name: label,
        Income: incomeData[index],
        Expenses: expenseData[index],
        Balance: incomeData[index] - expenseData[index]
      }));
      
      setChartData(formattedData);
      
      // For category pie chart
      const categories = getCategoryTotals(transactions);
      setCategoryData(categories);
    } else {
      // Clear chart data when no transactions exist
      setChartData([]);
      setCategoryData([]);
    }
  }, [transactions]);
  
  if (isLoading) {
    return (
      <div className="h-80">
        <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }
  
  const renderOverviewChart = () => (
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
            <stop offset="5%" stopColor={CHART_COLORS.income} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={CHART_COLORS.income} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.expenses} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={CHART_COLORS.expenses} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.balance} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={CHART_COLORS.balance} stopOpacity={0}/>
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
          stroke={CHART_COLORS.income} 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorIncome)" 
        />
        <Area 
          type="monotone" 
          dataKey="Expenses" 
          stroke={CHART_COLORS.expenses} 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorExpenses)" 
        />
        <Area 
          type="monotone" 
          dataKey="Balance" 
          stroke={CHART_COLORS.balance} 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorBalance)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
  
  const renderMonthlyChart = () => (
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
        <Bar 
          dataKey="Income" 
          fill={CHART_COLORS.income} 
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20} 
        />
        <Bar 
          dataKey="Expenses" 
          fill={CHART_COLORS.expenses} 
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20} 
        />
        <Bar 
          dataKey="Balance" 
          fill={CHART_COLORS.balance} 
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
  
  const renderCategoryChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill={CHART_COLORS.category1}
          dataKey="total"
          nameKey="category"
        >
          {categoryData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CategoryTooltip />} />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  );
  
  return (
    <div className="h-80">
      {chartData.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Add some transactions to see your financial overview</p>
        </div>
      ) : (
        <>
          {chartView === 'overview' && renderOverviewChart()}
          {chartView === 'monthly' && renderMonthlyChart()}
          {chartView === 'category' && renderCategoryChart()}
        </>
      )}
    </div>
  );
};

export default BalanceChart;
