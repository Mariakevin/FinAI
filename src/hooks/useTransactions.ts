import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define the transaction type
export type TransactionType = 'income' | 'expense';

// Define the transaction interface
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: TransactionType;
}

// Define the type for the filter
export type FilterType = 'all' | 'income' | 'expense';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTransactions = localStorage.getItem('transactions');
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isUpiConnected, setIsUpiConnected] = useState<boolean>(false);
  const [connectedUpiId, setConnectedUpiId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((description: string, amount: number, date: Date, category: string, type: TransactionType) => {
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
    const randomTransactions = [
      {
        id: `upi-${Date.now()}-1`,
        description: 'Salary Deposit',
        amount: 4250.00,
        date: new Date(2023, 9, 15), // Oct 15, 2023
        category: 'Salary',
        type: 'income' as const, // Fixed type
      },
      {
        id: `upi-${Date.now()}-2`,
        description: 'Grocery Shopping',
        amount: 122.50,
        date: new Date(2023, 10, 3), // Nov 3, 2023
        category: 'Groceries',
        type: 'expense' as const, // Fixed type
      },
      {
        id: `upi-${Date.now()}-3`,
        description: 'Freelance Payment',
        amount: 845.00,
        date: new Date(2023, 11, 7), // Dec 7, 2023
        category: 'Income',
        type: 'income' as const, // Fixed type
      },
      {
        id: `upi-${Date.now()}-4`,
        description: 'Restaurant Dinner',
        amount: 78.35,
        date: new Date(2024, 0, 12), // Jan 12, 2024
        category: 'Dining',
        type: 'expense' as const, // Fixed type
      },
      {
        id: `upi-${Date.now()}-5`,
        description: 'Utility Bill Payment',
        amount: 145.20,
        date: new Date(2024, 1, 5), // Feb 5, 2024
        category: 'Utilities',
        type: 'expense' as const, // Fixed type
      },
      {
        id: `upi-${Date.now()}-6`,
        description: 'Bonus Payment',
        amount: 1200.00,
        date: new Date(2024, 2, 18), // Mar 18, 2024
        category: 'Bonus',
        type: 'income' as const, // Fixed type
      },
      {
        id: `upi-${Date.now()}-7`,
        description: 'Online Shopping',
        amount: 89.95,
        date: new Date(), // Current date
        category: 'Shopping',
        type: 'expense' as const, // Fixed type
      },
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
    isLoading: false, // Mock loading state
  };
};
