
import React from 'react';
import { Transaction, formatCurrency } from '@/lib/finance';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Format date function that was missing from finance.ts
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Categories mapping that was missing from finance.ts
const CATEGORIES: Record<string, string> = {
  'Salary': '#4CAF50',      // Green
  'Freelance': '#8BC34A',   // Light Green
  'Investment': '#009688',  // Teal
  'Bonus': '#00BCD4',       // Cyan
  'Gift': '#03A9F4',        // Light Blue
  'Side Project': '#3F51B5', // Indigo
  'Refund': '#2196F3',      // Blue
  'Dividend': '#673AB7',    // Deep Purple
  'Rental Income': '#9C27B0', // Purple
  
  'Groceries': '#F44336',   // Red
  'Dining': '#FF5722',      // Deep Orange
  'Transport': '#FF9800',   // Orange
  'Shopping': '#FFC107',    // Amber
  'Utilities': '#FFEB3B',   // Yellow
  'Entertainment': '#CDDC39', // Lime
  'Health': '#E91E63',      // Pink
  'Education': '#9E9E9E',   // Grey
  'Travel': '#795548',      // Brown
  'Housing': '#607D8B',     // Blue Grey
  'Insurance': '#C2185B',   // Dark Pink
  'Subscriptions': '#D32F2F', // Dark Red
  'Other': '#757575'        // Dark Grey
};

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
}

const TransactionItem = ({ transaction, onDelete, isReadOnly = false }: TransactionItemProps) => {
  const { id, description, amount, category, date, type } = transaction;
  
  const categoryColor = CATEGORIES[category] || CATEGORIES['Other'];
  
  return (
    <div className="transition-all duration-300 hover:bg-gray-50/80 rounded-lg p-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            type === 'income' ? 'bg-green-100' : 'bg-red-100'
          )}>
            {type === 'income' ? (
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{description}</h4>
            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
              <span>{formatDate(date)}</span>
              <span>•</span>
              <div 
                className="px-2 py-0.5 rounded-full text-xs" 
                style={{ 
                  backgroundColor: `${categoryColor}20`, 
                  color: categoryColor 
                }}
              >
                {category}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className={cn(
            "font-semibold",
            type === 'income' ? 'text-green-600' : 'text-red-600'
          )}>
            {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
          </div>
          
          {!isReadOnly && (
            <button
              onClick={() => onDelete(id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
