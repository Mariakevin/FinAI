
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
  const connectUpiId = (upiId: string, includeTransactionId = true) => {
    if (upiId) {
      localStorage.setItem(UPI_STORAGE_KEY, upiId);
      setConnectedUpiId(upiId);
      setIsUpiConnected(true);
      
      // Simulate adding some UPI transactions
      if (upiId) {
        const upiTransactions = generateUpiTransactions(upiId, includeTransactionId);
        // Remove previous UPI transactions before adding new ones
        setTransactions(prev => [...upiTransactions, ...prev.filter(t => !t.upiId)]);
      }
    } else {
      localStorage.removeItem(UPI_STORAGE_KEY);
      setConnectedUpiId(null);
      setIsUpiConnected(false);
      
      // Remove UPI transactions
      setTransactions(prev => prev.filter(t => !t.upiId));
    }
  };

  // Generate a random transaction ID
  const generateTransactionId = () => {
    const prefix = 'UPI';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Generate different UPI transactions based on the UPI ID
  const generateUpiTransactions = (upiId: string, includeTransactionId = true): Transaction[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    // Common transaction properties
    const commonProps = includeTransactionId ? { 
      transactionId: generateTransactionId(),
      status: 'completed'
    } : {};
    
    // Different transactions for different UPI IDs
    if (upiId.includes('hdfc') || upiId.includes('bank')) {
      return [
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 7500,
          description: 'Rent Payment',
          category: 'Housing',
          date: yesterday.toISOString(),
          type: 'expense',
          upiId,
          payee: 'landlord@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 2800,
          description: 'Car Insurance',
          category: 'Insurance',
          date: today.toISOString(),
          type: 'expense',
          upiId,
          payee: 'insurance@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 35000,
          description: 'Salary Credit',
          category: 'Salary',
          date: lastWeek.toISOString(),
          type: 'income',
          upiId,
          payee: 'employer@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 1200,
          description: 'Electricity Bill',
          category: 'Bills & Utilities',
          date: twoWeeksAgo.toISOString(),
          type: 'expense',
          upiId,
          payee: 'electricity@upi',
          ...commonProps
        }
      ] as Transaction[];
    } 
    else if (upiId.includes('paytm') || upiId.includes('gpay')) {
      return [
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 1200,
          description: 'Online Shopping',
          category: 'Shopping',
          date: yesterday.toISOString(),
          type: 'expense',
          upiId,
          payee: 'ecommerce@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 599,
          description: 'Food Delivery',
          category: 'Food & Dining',
          date: today.toISOString(),
          type: 'expense',
          upiId,
          payee: 'foodapp@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 850,
          description: 'Mobile Recharge',
          category: 'Bills & Utilities',
          date: lastWeek.toISOString(),
          type: 'expense',
          upiId,
          payee: 'telecom@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 5000,
          description: 'Friend Payment',
          category: 'Personal',
          date: yesterday.toISOString(),
          type: 'income',
          upiId,
          payee: 'friend@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 299,
          description: 'Movie Ticket',
          category: 'Entertainment',
          date: twoWeeksAgo.toISOString(),
          type: 'expense',
          upiId,
          payee: 'movieticket@upi',
          ...commonProps
        }
      ] as Transaction[];
    }
    else if (upiId.includes('business') || upiId.includes('corp')) {
      return [
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 15000,
          description: 'Office Supplies',
          category: 'Business Expenses',
          date: yesterday.toISOString(),
          type: 'expense',
          upiId,
          payee: 'officesupplies@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 8500,
          description: 'Business Travel',
          category: 'Travel',
          date: today.toISOString(),
          type: 'expense',
          upiId,
          payee: 'travelagency@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 25000,
          description: 'Client Payment',
          category: 'Business Income',
          date: lastWeek.toISOString(),
          type: 'income',
          upiId,
          payee: 'client@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 42000,
          description: 'Consulting Fee',
          category: 'Business Income',
          date: yesterday.toISOString(),
          type: 'income',
          upiId,
          payee: 'client2@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 7800,
          description: 'Software Subscription',
          category: 'Business Expenses',
          date: twoWeeksAgo.toISOString(),
          type: 'expense',
          upiId,
          payee: 'software@upi',
          ...commonProps
        }
      ] as Transaction[];
    }
    else {
      // Default transactions for other UPI IDs
      return [
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 3500,
          description: 'Grocery Store Payment',
          category: 'Food & Dining',
          date: yesterday.toISOString(),
          type: 'expense',
          upiId,
          payee: 'grocerystore@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 799,
          description: 'Movie Tickets',
          category: 'Entertainment',
          date: today.toISOString(),
          type: 'expense',
          upiId,
          payee: 'moviebooking@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 1200,
          description: 'Electric Bill',
          category: 'Bills & Utilities',
          date: lastWeek.toISOString(),
          type: 'expense',
          upiId,
          payee: 'electricbill@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 20000,
          description: 'Salary Credit',
          category: 'Salary',
          date: lastWeek.toISOString(),
          type: 'income',
          upiId,
          payee: 'company@upi',
          ...commonProps
        },
        {
          id: 'upi-' + Math.random().toString(36).substring(2, 9),
          amount: 2500,
          description: 'Health Insurance',
          category: 'Insurance',
          date: twoWeeksAgo.toISOString(),
          type: 'expense',
          upiId,
          payee: 'insurance@upi',
          ...commonProps
        }
      ] as Transaction[];
    }
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

  // Update the clearAllTransactions function
  const clearAllTransactions = () => {
    // Clear state
    setTransactions([]);
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    // Show success message
    toast.success('All transactions have been cleared');
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
