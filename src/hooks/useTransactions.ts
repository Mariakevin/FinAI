
import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/finance';
import { toast } from 'sonner';

const STORAGE_KEY = 'finwise_transactions';
const UPI_STORAGE_KEY = 'finwise_upi_id';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUpiId, setConnectedUpiId] = useState<string | null>(null);
  const [isUpiConnected, setIsUpiConnected] = useState(false);

  // Load UPI ID from localStorage on component mount
  useEffect(() => {
    const storedUpiId = localStorage.getItem(UPI_STORAGE_KEY);
    if (storedUpiId) {
      setConnectedUpiId(storedUpiId);
      setIsUpiConnected(true);
    }
  }, []);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const loadTransactions = () => {
      setIsLoading(true);
      
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setTransactions(parsedData);
        } else {
          // Initialize with empty array
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error('Failed to load your transactions');
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to simulate network request for better UX
    const timer = setTimeout(loadTransactions, 600);
    return () => clearTimeout(timer);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  // Connect/disconnect UPI ID
  const connectUpiId = (upiId: string) => {
    if (upiId) {
      localStorage.setItem(UPI_STORAGE_KEY, upiId);
      setConnectedUpiId(upiId);
      setIsUpiConnected(true);
      
      // Simulate adding some UPI transactions
      if (upiId) {
        const upiTransactions = generateSampleUpiTransactions(upiId);
        setTransactions(prev => [...upiTransactions, ...prev]);
      }
    } else {
      localStorage.removeItem(UPI_STORAGE_KEY);
      setConnectedUpiId(null);
      setIsUpiConnected(false);
      
      // Remove UPI transactions
      setTransactions(prev => prev.filter(t => !t.upiId));
    }
  };

  // Generate sample UPI transactions for demo
  const generateSampleUpiTransactions = (upiId: string): Transaction[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return [
      {
        id: 'upi-' + Math.random().toString(36).substring(2, 9),
        amount: 3500,
        description: 'Grocery Store Payment',
        category: 'Food & Dining',
        date: yesterday.toISOString(),
        type: 'expense',
        upiId,
        payee: 'grocerystore@upi'
      },
      {
        id: 'upi-' + Math.random().toString(36).substring(2, 9),
        amount: 799,
        description: 'Movie Tickets',
        category: 'Entertainment',
        date: today.toISOString(),
        type: 'expense',
        upiId,
        payee: 'moviebooking@upi'
      },
      {
        id: 'upi-' + Math.random().toString(36).substring(2, 9),
        amount: 1200,
        description: 'Electric Bill',
        category: 'Bills & Utilities',
        date: lastWeek.toISOString(),
        type: 'expense',
        upiId,
        payee: 'electricbill@upi'
      },
      {
        id: 'upi-' + Math.random().toString(36).substring(2, 9),
        amount: 500,
        description: 'Friend Payment',
        category: 'Personal',
        date: yesterday.toISOString(),
        type: 'expense',
        upiId,
        payee: 'friend@upi'
      },
      {
        id: 'upi-' + Math.random().toString(36).substring(2, 9),
        amount: 20000,
        description: 'Salary Credit',
        category: 'Salary',
        date: lastWeek.toISOString(),
        type: 'income',
        upiId,
        payee: 'company@upi'
      }
    ] as Transaction[];
  };

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added successfully');
    return newTransaction;
  };

  // Update an existing transaction
  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
    toast.success('Transaction updated successfully');
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success('Transaction deleted successfully');
  };

  // Clear all transactions
  const clearAllTransactions = () => {
    setTransactions([]);
  };

  // Calculate total balance
  const getBalance = () => {
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'income') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  };

  // Calculate total income
  const getTotalIncome = () => {
    return transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Get UPI transactions only
  const getUpiTransactions = () => {
    return transactions.filter(transaction => transaction.upiId);
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    getBalance,
    getTotalIncome,
    getTotalExpenses,
    connectUpiId,
    isUpiConnected,
    connectedUpiId,
    getUpiTransactions
  };
};
