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
        const upiTransactions = generateUpiTransactions(upiId);
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

  // Generate different UPI transactions across different months based on the UPI ID
  const generateUpiTransactions = (upiId: string): Transaction[] => {
    const transactions: Transaction[] = [];
    const currentDate = new Date();
    
    // Generate transactions for the past 6 months
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(currentDate.getMonth() - i);
      
      // Generate 3-8 transactions per month
      const transactionsPerMonth = Math.floor(Math.random() * 5) + 3;
      
      for (let j = 0; j < transactionsPerMonth; j++) {
        const day = Math.floor(Math.random() * 28) + 1; // Random day between 1-28
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        
        transactions.push(generateRandomTransaction(upiId, date));
      }
    }
    
    // Sort transactions by date (newest first)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  // Helper function to generate a random transaction
  const generateRandomTransaction = (upiId: string, date: Date): Transaction => {
    const categories = [
      { type: 'expense', category: 'Food & Dining', descriptions: ['Restaurant bill', 'Food delivery', 'Grocery shopping', 'Coffee shop'] },
      { type: 'expense', category: 'Shopping', descriptions: ['Online purchase', 'Clothes shopping', 'Electronics', 'Home goods'] },
      { type: 'expense', category: 'Bills & Utilities', descriptions: ['Electricity bill', 'Water bill', 'Internet bill', 'Phone bill', 'Gas bill'] },
      { type: 'expense', category: 'Entertainment', descriptions: ['Movie tickets', 'Concert tickets', 'Streaming subscription', 'Gaming'] },
      { type: 'expense', category: 'Housing', descriptions: ['Rent payment', 'Maintenance fee', 'Property tax', 'Home insurance'] },
      { type: 'expense', category: 'Transportation', descriptions: ['Fuel', 'Public transport', 'Cab fare', 'Vehicle service'] },
      { type: 'expense', category: 'Health', descriptions: ['Medical check-up', 'Medicines', 'Health insurance', 'Fitness subscription'] },
      { type: 'expense', category: 'Education', descriptions: ['Course fee', 'Books', 'School supplies', 'Tuition'] },
      { type: 'income', category: 'Salary', descriptions: ['Monthly salary', 'Bonus payment', 'Overtime pay'] },
      { type: 'income', category: 'Business Income', descriptions: ['Client payment', 'Sales revenue', 'Consulting fee'] },
      { type: 'income', category: 'Investment', descriptions: ['Dividend', 'Interest income', 'Stock profits'] },
      { type: 'income', category: 'Gifts', descriptions: ['Birthday gift', 'Holiday gift', 'Cash gift'] },
    ];
    
    // Choose a random category based on UPI ID
    let categorySelection = categories;
    
    if (upiId.includes('business') || upiId.includes('corp')) {
      categorySelection = categories.filter(c => 
        ['Business Income', 'Investment', 'Office Supplies', 'Business Expenses', 'Transportation'].includes(c.category)
      );
    } else if (upiId.includes('bank') || upiId.includes('hdfc')) {
      categorySelection = categories.filter(c => 
        ['Housing', 'Bills & Utilities', 'Salary', 'Investment'].includes(c.category)
      );
    } else if (upiId.includes('paytm') || upiId.includes('gpay') || upiId.includes('phonepe')) {
      categorySelection = categories.filter(c => 
        ['Food & Dining', 'Shopping', 'Entertainment', 'Transportation', 'Bills & Utilities'].includes(c.category)
      );
    }
    
    if (categorySelection.length === 0) categorySelection = categories;
    
    const randomCategoryIndex = Math.floor(Math.random() * categorySelection.length);
    const selectedCategory = categorySelection[randomCategoryIndex];
    
    const descriptionIndex = Math.floor(Math.random() * selectedCategory.descriptions.length);
    const description = selectedCategory.descriptions[descriptionIndex];
    
    // Generate a realistic amount based on category
    let amount: number;
    
    switch (selectedCategory.category) {
      case 'Housing':
        amount = Math.floor(Math.random() * 15000) + 8000; // 8000-23000
        break;
      case 'Salary':
        amount = Math.floor(Math.random() * 30000) + 25000; // 25000-55000
        break;
      case 'Business Income':
        amount = Math.floor(Math.random() * 50000) + 10000; // 10000-60000
        break;
      case 'Investment':
        amount = Math.floor(Math.random() * 10000) + 1000; // 1000-11000
        break;
      case 'Food & Dining':
        amount = Math.floor(Math.random() * 1500) + 200; // 200-1700
        break;
      case 'Bills & Utilities':
        amount = Math.floor(Math.random() * 2000) + 500; // 500-2500
        break;
      case 'Shopping':
        amount = Math.floor(Math.random() * 5000) + 500; // 500-5500
        break;
      case 'Entertainment':
        amount = Math.floor(Math.random() * 2000) + 300; // 300-2300
        break;
      case 'Transportation':
        amount = Math.floor(Math.random() * 2000) + 200; // 200-2200
        break;
      case 'Health':
        amount = Math.floor(Math.random() * 3000) + 500; // 500-3500
        break;
      case 'Education':
        amount = Math.floor(Math.random() * 10000) + 1000; // 1000-11000
        break;
      case 'Gifts':
        amount = Math.floor(Math.random() * 5000) + 500; // 500-5500
        break;
      default:
        amount = Math.floor(Math.random() * 2000) + 100; // 100-2100
    }
    
    return {
      id: 'upi-' + Math.random().toString(36).substring(2, 9),
      amount,
      description,
      category: selectedCategory.category,
      date: date.toISOString(),
      type: selectedCategory.type,
      upiId
    };
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
