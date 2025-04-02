
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/finance';
import { PiggyBank, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const { transactions, getBalance, getTotalIncome, getTotalExpenses } = useTransactions();
  
  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  
  return (
    <>
      <Helmet>
        <title>Dashboard | FinAI</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your financial status</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Balance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <PiggyBank className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <p className="text-xs text-gray-500 mt-1">
                As of {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          
          {/* Income Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {transactions.filter(t => t.type === 'income').length} income transactions
              </p>
            </CardContent>
          </Card>
          
          {/* Expenses Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {transactions.filter(t => t.type === 'expense').length} expense transactions
              </p>
            </CardContent>
          </Card>
          
          {/* Recent Transactions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Total transactions recorded
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="pt-4 text-center text-gray-500">
          {transactions.length === 0 ? (
            <p>No transactions yet. Add some to see your financial overview.</p>
          ) : (
            <p>Welcome to your financial dashboard. Add more transactions for better insights.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
