
import React from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getCategoryTotals, formatCurrency } from '@/lib/finance';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartIcon, BarChartIcon, ArrowUpDown } from 'lucide-react';

// Ensure formatter always receives number type
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {formatCurrency(Number(payload[0].value))}
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-md overflow-hidden border-gray-200/80">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg font-semibold">Expense Distribution</CardTitle>
                </div>
                <CardDescription>Breakdown of your spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="total"
                        paddingAngle={3}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md overflow-hidden border-gray-200/80">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <BarChartIcon className="h-5 w-5 text-indigo-500" />
                  <CardTitle className="text-lg font-semibold">Category Spending</CardTitle>
                </div>
                <CardDescription>Top expense categories by amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData.slice(0, 5)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickFormatter={(value) => `$${Number(value)}`} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${formatCurrency(Number(value))}`, 'Amount']} />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                        {categoryData.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-md overflow-hidden border-gray-200/80">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-lg font-semibold">Detailed Breakdown</CardTitle>
              </div>
              <CardDescription>Spending distribution across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
