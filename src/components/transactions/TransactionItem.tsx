
import React from 'react';
import { Transaction, formatCurrency, formatDate, CATEGORIES } from '@/lib/finance';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { id, description, amount, category, date, type } = transaction;
  
  const categoryColor = CATEGORIES[category as keyof typeof CATEGORIES] || CATEGORIES['Other'];
  
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
          
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Delete transaction"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
