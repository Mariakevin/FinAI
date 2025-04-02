
// Add any additional functionality needed for finance.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define the transaction type
export type TransactionType = 'income' | 'expense';

// Interface for transaction data
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
  upiId?: string;
}

// Export format currency function
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Export format date function
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Categories mapping
export const CATEGORIES: Record<string, string> = {
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

// Helper function to turn Category and color mapping into array
export const getCategoryArray = () => {
  return Object.entries(CATEGORIES).map(([category, color]) => ({
    name: category,
    color: color
  }));
};

// Format for Monthly totals
interface MonthData {
  month: string;
  income: number;
  expense: number;
}

// Calculate monthly totals for transactions
export const getMonthlyTotals = (transactions: Transaction[]): MonthData[] => {
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Group transactions by month and calculate totals
  sortedTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      monthlyData[monthYear].income += transaction.amount;
    } else {
      monthlyData[monthYear].expense += transaction.amount;
    }
  });
  
  // Convert to array format for charts
  return Object.entries(monthlyData).map(([monthYear, data]) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    return {
      month: `${monthName} ${year}`,
      income: data.income,
      expense: data.expense
    };
  });
};

// Mock AI categorization function
export const categorizeTransactionWithAI = async (description: string): Promise<string> => {
  // This would normally call an API, but for now we'll use a simple keyword matching
  description = description.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    'Salary': ['salary', 'paycheck', 'wage', 'income', 'payday'],
    'Groceries': ['grocery', 'supermarket', 'food', 'market', 'fruit', 'vegetable'],
    'Dining': ['restaurant', 'cafe', 'dinner', 'lunch', 'breakfast', 'coffee', 'bar'],
    'Transport': ['uber', 'lyft', 'taxi', 'bus', 'train', 'metro', 'gas', 'fuel', 'car'],
    'Shopping': ['mall', 'store', 'shop', 'amazon', 'clothing', 'purchase'],
    'Utilities': ['electric', 'water', 'gas', 'bill', 'utility', 'internet', 'phone'],
    'Entertainment': ['movie', 'theater', 'netflix', 'spotify', 'concert', 'game'],
    'Health': ['doctor', 'medical', 'pharmacy', 'fitness', 'gym', 'healthcare'],
    'Education': ['school', 'course', 'book', 'class', 'tuition', 'tutorial']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => description.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
};

// Utilities for className merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
