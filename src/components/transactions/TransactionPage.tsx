
import React, { useState } from 'react';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import TransactionAnalytics from './TransactionAnalytics';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';

const TransactionPage = () => {
  const { 
    transactions, 
    isLoading, 
    addTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const [showForm, setShowForm] = useState(false);
  
  const handleAddTransaction = (newTransaction: any) => {
    addTransaction(newTransaction);
    setShowForm(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage your income and expenses</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2"
          >
            {showForm ? (
              <>
                <XCircle className="h-5 w-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Add Transaction</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {showForm && (
        <div className="animate-scale-in">
          <TransactionForm 
            onAddTransaction={handleAddTransaction}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      
      <div className="animate-fade-in space-y-8">
        <TransactionList 
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
          isLoading={isLoading}
        />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
          <TransactionAnalytics 
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
