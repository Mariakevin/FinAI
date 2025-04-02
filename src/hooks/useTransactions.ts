
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
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
  upiId?: string; // Optional upiId field for transactions connected to UPI
}

// Define the type for the filter
export type FilterType = 'all' | 'income' | 'expense';

// Create context type
interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (description: string, amount: number, date: string, category: string, type: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  getBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  connectUpiId: (upiId: string) => void;
  isUpiConnected: boolean;
  connectedUpiId: string | null;
  isLoading: boolean;
}

// Create the context with a default value
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Create the TransactionsProvider component
export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [isLoading, setIsLoading] = useState(false);

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

  const connectUpiId = useCallback((upiId: string) => {
    setIsUpiConnected(!!upiId);
    setConnectedUpiId(upiId || null);
    
    if (!upiId) return;
    
    // Generate more transactions across different dates for demo purposes
    const generateRandomTransactions = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      
      // Create array with months from the past year
      const months = [];
      for (let i = 12; i >= 0; i--) {
        let targetMonth = currentMonth - i;
        let targetYear = currentYear;
        
        if (targetMonth < 0) {
          targetMonth = 12 + targetMonth;
          targetYear = currentYear - 1;
        }
        
        months.push({ month: targetMonth, year: targetYear });
      }
      
      // Categories for income
      const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Side Project', 'Refund', 'Dividend', 'Rental Income'];
      
      // Categories for expenses
      const expenseCategories = ['Groceries', 'Dining', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Education', 'Travel', 'Housing', 'Insurance', 'Subscriptions'];
      
      // Transaction descriptions
      const incomeDescriptions = {
        'Salary': ['Monthly Salary', 'Paycheck', 'Employment Income', 'Direct Deposit - Employer'],
        'Freelance': ['Client Payment', 'Freelance Project', 'Consulting Fee', 'Contract Work'],
        'Investment': ['Stock Dividend', 'ETF Return', 'Investment Growth', 'Portfolio Income'],
        'Bonus': ['Performance Bonus', 'Year-End Bonus', 'Holiday Bonus', 'Incentive Payment'],
        'Gift': ['Birthday Gift', 'Holiday Gift', 'Family Support', 'Friend Gift'],
        'Side Project': ['Side Business Income', 'Part-time Work', 'Online Store Sales', 'Digital Product Sale'],
        'Refund': ['Tax Refund', 'Product Return', 'Service Refund', 'Deposit Return'],
        'Dividend': ['Company Dividend', 'Stock Yield', 'Investment Return', 'Profit Share'],
        'Rental Income': ['Property Rent', 'Space Rental', 'Equipment Rental', 'Rental Deposit']
      };
      
      const expenseDescriptions = {
        'Groceries': ['Supermarket', 'Grocery Shopping', 'Fresh Market', 'Local Store'],
        'Dining': ['Restaurant Bill', 'Cafe Visit', 'Fast Food', 'Food Delivery'],
        'Transport': ['Fuel', 'Public Transport', 'Taxi Ride', 'Car Maintenance'],
        'Shopping': ['Clothing Purchase', 'Electronics Store', 'Home Items', 'Online Shopping'],
        'Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Gas Bill'],
        'Entertainment': ['Movie Tickets', 'Concert', 'Game Purchase', 'Streaming Subscription'],
        'Health': ['Pharmacy', 'Doctor Visit', 'Health Insurance', 'Fitness Membership'],
        'Education': ['Course Fee', 'Book Purchase', 'Learning Materials', 'Tuition'],
        'Travel': ['Flight Tickets', 'Hotel Booking', 'Vacation Expense', 'Travel Insurance'],
        'Housing': ['Rent Payment', 'Mortgage', 'Home Repair', 'Property Tax'],
        'Insurance': ['Car Insurance', 'Health Insurance Premium', 'Life Insurance', 'Property Insurance'],
        'Subscriptions': ['Streaming Service', 'Software Subscription', 'News Subscription', 'App Purchase']
      };
      
      // Generate transactions for each month
      const transactions = [];
      
      months.forEach(({ month, year }) => {
        // Number of transactions per month (between 1-3)
        const incomeCount = Math.floor(Math.random() * 2) + 1;
        
        // Generate income transactions
        for (let i = 0; i < incomeCount; i++) {
          const categoryIndex = Math.floor(Math.random() * incomeCategories.length);
          const category = incomeCategories[categoryIndex];
          
          const descriptions = incomeDescriptions[category as keyof typeof incomeDescriptions];
          const descriptionIndex = Math.floor(Math.random() * descriptions.length);
          const description = descriptions[descriptionIndex];
          
          // Random day of month (1-28 to avoid date issues)
          const day = Math.floor(Math.random() * 28) + 1;
          
          // Amount range based on category
          let amountMin = 0;
          let amountMax = 0;
          
          if (category === 'Salary') {
            amountMin = 2000;
            amountMax = 5000;
          } else if (category === 'Bonus') {
            amountMin = 500;
            amountMax = 2000;
          } else if (category === 'Investment' || category === 'Dividend') {
            amountMin = 100;
            amountMax = 800;
          } else if (category === 'Rental Income') {
            amountMin = 1000;
            amountMax = 3000;
          } else {
            amountMin = 50;
            amountMax = 500;
          }
          
          const amount = Math.floor(Math.random() * (amountMax - amountMin + 1)) + amountMin;
          
          transactions.push({
            id: `upi-${Date.now()}-income-${i}-${month}-${year}`,
            description,
            amount,
            date: new Date(year, month, day).toISOString(),
            category,
            type: 'income' as const,
            upiId
          });
        }
        
        // Generate expense transactions (3-6 per month)
        const expenseCount = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < expenseCount; i++) {
          const categoryIndex = Math.floor(Math.random() * expenseCategories.length);
          const category = expenseCategories[categoryIndex];
          
          const descriptions = expenseDescriptions[category as keyof typeof expenseDescriptions];
          const descriptionIndex = Math.floor(Math.random() * descriptions.length);
          const description = descriptions[descriptionIndex];
          
          // Random day of month (1-28 to avoid date issues)
          const day = Math.floor(Math.random() * 28) + 1;
          
          // Amount range based on category
          let amountMin = 0;
          let amountMax = 0;
          
          if (category === 'Housing') {
            amountMin = 800;
            amountMax = 2500;
          } else if (category === 'Travel') {
            amountMin = 200;
            amountMax = 1000;
          } else if (category === 'Shopping') {
            amountMin = 50;
            amountMax = 300;
          } else if (category === 'Groceries') {
            amountMin = 40;
            amountMax = 200;
          } else if (category === 'Dining') {
            amountMin = 20;
            amountMax = 150;
          } else if (category === 'Utilities' || category === 'Insurance') {
            amountMin = 50;
            amountMax = 250;
          } else {
            amountMin = 10;
            amountMax = 100;
          }
          
          const amount = Math.floor(Math.random() * (amountMax - amountMin + 1)) + amountMin;
          
          transactions.push({
            id: `upi-${Date.now()}-expense-${i}-${month}-${year}`,
            description,
            amount,
            date: new Date(year, month, day).toISOString(),
            category,
            type: 'expense' as const,
            upiId
          });
        }
      });
      
      return transactions;
    };
    
    const newTransactions = generateRandomTransactions();
    setTransactions((prev) => [...prev, ...newTransactions]);
    toast.success(`UPI ID ${upiId} connected successfully`);
    toast.success(`Imported ${newTransactions.length} transactions`);
  }, []);

  return (
    <TransactionsContext.Provider 
      value={{
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
        clearAllTransactions,
        isLoading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
