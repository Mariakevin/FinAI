
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define the transaction type
export type TransactionType = 'income' | 'expense';

// Define the transaction interface - making date string to match finance.ts
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;  // Changed from Date to string for compatibility
  category: string;
  type: TransactionType;
}

// Define the type for the filter
export type FilterType = 'all' | 'income' | 'expense';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      try {
        return JSON.parse(storedTransactions);
      } catch (error) {
        console.error('Error parsing stored transactions:', error);
        return [];
      }
    }
    return [];
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isUpiConnected, setIsUpiConnected] = useState<boolean>(false);
  const [connectedUpiId, setConnectedUpiId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((description: string, amount: number, date: string, category: string, type: TransactionType) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      description,
      amount,
      date,
      category,
      type,
    };

    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    toast.success('Transaction added successfully');
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
    toast.success('Transaction deleted successfully');
  }, []);

  // Add the missing clearAllTransactions function
  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
    toast.success('All transactions have been cleared');
  }, []);

  const getBalance = useCallback(() => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
    }, 0);
  }, [transactions]);

  const getTotalIncome = useCallback(() => {
    return transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const getTotalExpenses = useCallback(() => {
    return transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const filteredTransactions = useCallback(() => {
    if (filter === 'all') {
      return transactions;
    }
    return transactions.filter((transaction) => transaction.type === filter);
  }, [transactions, filter]);

  const connectUpiId = (upiId: string) => {
    setIsUpiConnected(true);
    setConnectedUpiId(upiId);
    
    // Generate some random transactions for demo purposes
    const currentDate = new Date();
    const randomTransactions = [
      {
        id: `upi-${Date.now()}-1`,
        description: 'Salary Deposit',
        amount: 4250.00,
        date: new Date(2023, 9, 15).toISOString(), // Oct 15, 2023
        category: 'Salary',
        type: 'income' as const,
      },
      {
        id: `upi-${Date.now()}-2`,
        description: 'Grocery Shopping',
        amount: 122.50,
        date: new Date(2023, 10, 3).toISOString(), // Nov 3, 2023
        category: 'Groceries',
        type: 'expense' as const,
      },
      {
        id: `upi-${Date.now()}-3`,
        description: 'Freelance Payment',
        amount: 845.00,
        date: new Date(2023, 11, 7).toISOString(), // Dec 7, 2023
        category: 'Income',
        type: 'income' as const,
      },
      {
        id: `upi-${Date.now()}-4`,
        description: 'Restaurant Dinner',
        amount: 78.35,
        date: new Date(2024, 0, 12).toISOString(), // Jan 12, 2024
        category: 'Dining',
        type: 'expense' as const,
      },
      {
        id: `upi-${Date.now()}-5`,
        description: 'Utility Bill Payment',
        amount: 145.20,
        date: new Date(2024, 1, 5).toISOString(), // Feb 5, 2024
        category: 'Utilities',
        type: 'expense' as const,
      },
      {
        id: `upi-${Date.now()}-6`,
        description: 'Bonus Payment',
        amount: 1200.00,
        date: new Date(2024, 2, 18).toISOString(), // Mar 18, 2024
        category: 'Bonus',
        type: 'income' as const,
      },
      {
        id: `upi-${Date.now()}-7`,
        description: 'Online Shopping',
        amount: 89.95,
        date: new Date().toISOString(), // Current date
        category: 'Shopping',
        type: 'expense' as const,
      },
      // Adding more transactions across different months
      {
        id: `upi-${Date.now()}-8`,
        description: 'Internet Bill',
        amount: 59.99,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 10).toISOString(),
        category: 'Utilities',
        type: 'expense' as const,
      },
      {
        id: `upi-${Date.now()}-9`,
        description: 'Side Project Income',
        amount: 350.00,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth()-2, 22).toISOString(),
        category: 'Income',
        type: 'income' as const,
      },
      {
        id: `upi-${Date.now()}-10`,
        description: 'Coffee Shop',
        amount: 12.85,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5).toISOString(),
        category: 'Food & Dining',
        type: 'expense' as const,
      },
      {
        id: `upi-${Date.now()}-11`,
        description: 'Tax Refund',
        amount: 780.25,
        date: new Date(currentDate.getFullYear(), 3, 15).toISOString(), // April 15
        category: 'Income',
        type: 'income' as const,
      },
      {
        id: `upi-${Date.now()}-12`,
        description: 'Health Insurance',
        amount: 189.50,
        date: new Date(currentDate.getFullYear(), 4, 2).toISOString(), // May 2
        category: 'Health & Fitness',
        type: 'expense' as const,
      }
    ];
    
    setTransactions((prev) => [...prev, ...randomTransactions]);
    toast.success(`UPI ID ${upiId} connected successfully`);
  };

  return {
    transactions: filteredTransactions(),
    addTransaction,
    deleteTransaction,
    getBalance,
    getTotalIncome,
    getTotalExpenses,
    filter,
    setFilter,
    connectUpiId,
    isUpiConnected,
    connectedUpiId,
    clearAllTransactions, // Add the missing function to the returned object
    isLoading: false, // Mock loading state
  };
};
