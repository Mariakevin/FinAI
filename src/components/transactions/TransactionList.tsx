
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import TransactionItem from './TransactionItem';
import { Transaction } from '@/lib/finance';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  isLoading: boolean;
}

const TransactionList = ({ transactions, onDeleteTransaction, isLoading }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setcategoryFilter] = useState('all');
  
  // Get all unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))].sort();
  
  // Filter transactions based on search, type, and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  if (isLoading) {
    return (
      <GlassCard>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse mb-6" />
        
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </GlassCard>
    );
  }
  
  return (
    <GlassCard>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Transactions</h3>
      
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <div className="flex items-center mb-1 text-sm text-gray-500">
              <Filter className="w-4 h-4 mr-1" />
              <span>Transaction Type</span>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <div className="flex items-center mb-1 text-sm text-gray-500">
              <Filter className="w-4 h-4 mr-1" />
              <span>Category</span>
            </div>
            <Select value={categoryFilter} onValueChange={setcategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </GlassCard>
  );
};

export default TransactionList;
