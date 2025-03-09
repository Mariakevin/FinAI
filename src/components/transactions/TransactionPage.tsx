
import React, { useState } from 'react';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import TransactionAnalytics from './TransactionAnalytics';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, XCircle, BarChart3, ListFilter } from 'lucide-react';

const TransactionPage = () => {
  const { 
    transactions, 
    isLoading, 
    addTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
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
      
      <div className="animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="list" className="mt-0">
            <TransactionList 
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="analytics" className="mt-0">
            <TransactionAnalytics 
              transactions={transactions}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionPage;
