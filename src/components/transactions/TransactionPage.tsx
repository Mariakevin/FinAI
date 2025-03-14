import React, { useState } from 'react';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import TransactionAnalytics from './TransactionAnalytics';
import TransactionTable from './TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  XCircle, 
  List, 
  TableProperties, 
  Download,
  FileJson,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { exportTransactions, ExportFormat } from '@/lib/export';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TransactionPage = () => {
  const { 
    transactions, 
    isLoading, 
    addTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleAddTransaction = (newTransaction: any) => {
    addTransaction(newTransaction);
    setShowForm(false);
  };
  
  const handleExportTransactions = (format: ExportFormat) => {
    try {
      exportTransactions(transactions, format);
    } catch (error) {
      toast.error('Failed to export transactions');
      console.error('Export error:', error);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage your income and expenses</p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportTransactions('csv')}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportTransactions('json')}>
                <FileJson className="h-4 w-4 mr-2" />
                <span>Export as JSON</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportTransactions('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Export as HTML (for PDF)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="bg-gray-100 rounded-md p-1 flex">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              <TableProperties className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2"
          >
            {showForm ? (
              <>
                <XCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Cancel</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Add</span>
                <span className="hidden md:inline">Transaction</span>
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
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <TabsList>
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 ml-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>
              
              <TabsContent value="all" className="m-0">
                {viewMode === 'list' ? (
                  <TransactionList 
                    transactions={transactions}
                    onDeleteTransaction={deleteTransaction}
                    isLoading={isLoading}
                    showFilters={showFilters}
                  />
                ) : (
                  <TransactionTable 
                    transactions={transactions}
                    onDeleteTransaction={deleteTransaction}
                    isLoading={isLoading}
                    showFilters={showFilters}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="income" className="m-0">
                {viewMode === 'list' ? (
                  <TransactionList 
                    transactions={transactions.filter(t => t.type === 'income')}
                    onDeleteTransaction={deleteTransaction}
                    isLoading={isLoading}
                    showFilters={showFilters}
                  />
                ) : (
                  <TransactionTable 
                    transactions={transactions.filter(t => t.type === 'income')}
                    onDeleteTransaction={deleteTransaction}
                    isLoading={isLoading}
                    showFilters={showFilters}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="expense" className="m-0">
                {viewMode === 'list' ? (
                  <TransactionList 
                    transactions={transactions.filter(t => t.type === 'expense')}
                    onDeleteTransaction={deleteTransaction}
                    isLoading={isLoading}
                    showFilters={showFilters}
                  />
                ) : (
                  <TransactionTable 
                    transactions={transactions.filter(t => t.type === 'expense')}
                    onDeleteTransaction={deleteTransaction}
                    isLoading={isLoading}
                    showFilters={showFilters}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
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
