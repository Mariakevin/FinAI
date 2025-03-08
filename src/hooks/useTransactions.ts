
import { useState, useEffect } from 'react';
import { Transaction, generateSampleTransactions } from '@/lib/finance';
import { toast } from 'sonner';

const STORAGE_KEY = 'finwise_transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          // Generate and store sample data if nothing exists
          const sampleData = generateSampleTransactions();
          setTransactions(sampleData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
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
    if (!isLoading && transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

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

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getTotalIncome,
    getTotalExpenses,
  };
};
