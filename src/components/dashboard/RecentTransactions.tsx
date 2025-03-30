
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Transaction, formatCurrency, formatDate } from '@/lib/finance';
import { ArrowUpRight, ArrowDownRight, CreditCard, LogIn, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  isReadOnly?: boolean;
}

const RecentTransactions = ({ transactions, isLoading, isReadOnly = false }: RecentTransactionsProps) => {
  const navigate = useNavigate();
  const recentTransactions = transactions.slice(0, 5);
  
  if (isLoading) {
    return (
      <GlassCard>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </GlassCard>
    );
  }
  
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        <div className="flex gap-2">
          {isReadOnly && (
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4 mr-1" />
              Sign in
            </Button>
          )}
          <button 
            onClick={() => navigate('/transactions')}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all
          </button>
        </div>
      </div>
      
      {recentTransactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="py-3 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50 rounded-lg px-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{transaction.category}</span>
                      {transaction.upiId && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <CreditCard className="w-3 h-3 mr-1" />
                            UPI
                          </span>
                        </>
                      )}
                    </div>
                    {transaction.payee && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        Payee: {transaction.payee}
                      </div>
                    )}
                    {transaction.transactionId && (
                      <div className="text-xs flex items-center text-green-600 mt-0.5">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        ID: {transaction.transactionId}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default RecentTransactions;
