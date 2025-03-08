
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categorizeTransactionWithAI, CATEGORIES, Transaction } from '@/lib/finance';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const TransactionForm = ({ onAddTransaction, onCancel }: TransactionFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAiCategorizing, setIsAiCategorizing] = useState(false);
  
  // AI categorization when description changes
  useEffect(() => {
    const categorizeTransaction = async () => {
      if (description.length > 3) {
        setIsAiCategorizing(true);
        try {
          const suggestedCategory = await categorizeTransactionWithAI(description);
          setCategory(suggestedCategory);
        } catch (error) {
          console.error('Error categorizing transaction:', error);
        } finally {
          setIsAiCategorizing(false);
        }
      }
    };
    
    const timer = setTimeout(categorizeTransaction, 800);
    return () => clearTimeout(timer);
  }, [description]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!description || !amount || !category || !date) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Create transaction object
    const newTransaction: Omit<Transaction, 'id'> = {
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      type
    };
    
    // Add transaction
    onAddTransaction(newTransaction);
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
  };
  
  return (
    <GlassCard className="max-w-md mx-auto w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Add New Transaction</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this transaction for?"
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <span>Category</span>
            {isAiCategorizing && (
              <span className="ml-2 flex items-center text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                AI is categorizing...
              </span>
            )}
          </label>
          <div className="relative">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CATEGORIES).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
                className="w-4 h-4 text-blue-600"
              />
              <span>Expense</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
                className="w-4 h-4 text-blue-600"
              />
              <span>Income</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            Add Transaction
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};

export default TransactionForm;
