import React, { useState, useCallback, memo } from 'react';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import TransactionAnalytics from './TransactionAnalytics';
import TransactionTable from './TransactionTable';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  XCircle, 
  List, 
  TableProperties, 
  Download,
  FileJson,
  FileText,
  SlidersHorizontal,
  LogIn
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { exportTransactions, ExportFormat } from '@/lib/export';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleAddTransaction = useCallback((newTransaction: any) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add transactions');
      navigate('/login');
      return;
    }
    
    addTransaction(
      newTransaction.description, 
      newTransaction.amount, 
      newTransaction.date, 
      newTransaction.category, 
      newTransaction.type
    );
    
    setShowForm(false);
  }, [isAuthenticated, addTransaction, navigate]);
  
  const handleExportTransactions = useCallback((format: ExportFormat) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to export transactions');
      navigate('/login');
      return;
    }
    
    try {
      exportTransactions(transactions, format);
    } catch (error) {
      toast.error('Failed to export transactions');
      console.error('Export error:', error);
    }
  }, [isAuthenticated, transactions, navigate]);

  const handleDeleteTransaction = useCallback((id: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to delete transactions');
      navigate('/login');
      return;
    }
    
    deleteTransaction(id);
  }, [isAuthenticated, deleteTransaction, navigate]);

  const handleAddClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add transactions');
      navigate('/login');
      return;
    }
    setShowForm(!showForm);
  }, [isAuthenticated, showForm, navigate]);
  
  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);
  
  const setView = useCallback((mode: 'list' | 'table') => {
    setViewMode(mode);
  }, []);
  
  return (
    <div className="space-y-8 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage your income and expenses</p>
        </div>
        
        <div className="flex gap-2">
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-none"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Sign in to edit
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                disabled={!isAuthenticated}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
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
              onClick={() => setView('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('table')}
              className="rounded-l-none"
            >
              <TableProperties className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
          
          <Button 
            onClick={handleAddClick}
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
      
      <TransactionTabs 
        transactions={transactions}
        handleDeleteTransaction={handleDeleteTransaction}
        isLoading={isLoading}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        viewMode={viewMode}
        isAuthenticated={isAuthenticated}
      />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
        <TransactionAnalytics 
          transactions={transactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

const TransactionTabs = memo(({ 
  transactions, 
  handleDeleteTransaction, 
  isLoading, 
  showFilters, 
  toggleFilters,
  viewMode,
  isAuthenticated
}: {
  transactions: any[],
  handleDeleteTransaction: (id: string) => void,
  isLoading: boolean,
  showFilters: boolean,
  toggleFilters: () => void,
  viewMode: 'list' | 'table',
  isAuthenticated: boolean
}) => {
  return (
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
                onClick={toggleFilters}
                className="flex items-center gap-1 ml-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
            
            <TabsContent value="all" className="m-0">
              <TransactionView 
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                isLoading={isLoading}
                showFilters={showFilters}
                viewMode={viewMode}
                isReadOnly={!isAuthenticated}
              />
            </TabsContent>
            
            <TabsContent value="income" className="m-0">
              <TransactionView 
                transactions={transactions.filter(t => t.type === 'income')}
                onDeleteTransaction={handleDeleteTransaction}
                isLoading={isLoading}
                showFilters={showFilters}
                viewMode={viewMode}
                isReadOnly={!isAuthenticated}
              />
            </TabsContent>
            
            <TabsContent value="expense" className="m-0">
              <TransactionView 
                transactions={transactions.filter(t => t.type === 'expense')}
                onDeleteTransaction={handleDeleteTransaction}
                isLoading={isLoading}
                showFilters={showFilters}
                viewMode={viewMode}
                isReadOnly={!isAuthenticated}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
});

const TransactionView = memo(({
  transactions,
  onDeleteTransaction,
  isLoading,
  showFilters,
  viewMode,
  isReadOnly
}: {
  transactions: any[],
  onDeleteTransaction: (id: string) => void,
  isLoading: boolean,
  showFilters: boolean,
  viewMode: 'list' | 'table',
  isReadOnly: boolean
}) => {
  return viewMode === 'list' ? (
    <TransactionList 
      transactions={transactions}
      onDeleteTransaction={onDeleteTransaction}
      isLoading={isLoading}
      showFilters={showFilters}
      isReadOnly={isReadOnly}
    />
  ) : (
    <TransactionTable 
      transactions={transactions}
      onDeleteTransaction={onDeleteTransaction}
      isLoading={isLoading}
      showFilters={showFilters}
      isReadOnly={isReadOnly}
    />
  );
});

export default memo(TransactionPage);
