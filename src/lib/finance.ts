
import { getCategoryColor } from './categories';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

// Add missing CATEGORIES export
export const CATEGORIES: Record<string, string> = {
  'Food & Dining': '#FF5733',
  'Groceries': '#33FF57',
  'Transportation': '#3357FF',
  'Entertainment': '#F033FF',
  'Shopping': '#FF33A8',
  'Utilities': '#33FFF0',
  'Housing': '#FFB533',
  'Healthcare': '#33FFAA',
  'Education': '#AA33FF',
  'Personal': '#FF3366',
  'Travel': '#33AAFF',
  'Insurance': '#FFFF33',
  'Investments': '#33FF33',
  'Income': '#33FF57',
  'Other': '#C0C0C0'
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Add missing formatDate function
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getCategoryTotals = (transactions: Transaction[]) => {
  // Only include expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate total for each category
  const categoryTotals: Record<string, number> = {};
  expenseTransactions.forEach(transaction => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    categoryTotals[transaction.category] += transaction.amount;
  });
  
  // Calculate total expenses
  const totalExpenses = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  
  // Convert to array and add percentage and color
  const result = Object.entries(categoryTotals).map(([name, total]) => {
    const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
    const color = getCategoryColor(name);
    
    return {
      name,
      total,
      percentage,
      color,
    };
  });
  
  // Sort by total (descending)
  return result.sort((a, b) => b.total - a.total);
};

// Add missing getMonthlyTotals function
export const getMonthlyTotals = (transactions: Transaction[]) => {
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  
  // Process transactions by month
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { 
        income: 0, 
        expense: 0,
        label: monthLabel
      };
    }
    
    if (transaction.type === 'income') {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expense += transaction.amount;
    }
  });
  
  // Convert to arrays for charting
  const sortedKeys = Object.keys(monthlyData).sort();
  const labels = sortedKeys.map(key => monthlyData[key].label);
  const incomeData = sortedKeys.map(key => monthlyData[key].income);
  const expenseData = sortedKeys.map(key => monthlyData[key].expense);
  
  return {
    labels,
    incomeData,
    expenseData
  };
};

// Add missing categorizeTransactionWithAI function (simplified mock implementation)
export const categorizeTransactionWithAI = async (description: string): Promise<string> => {
  // In a real app, this would call an AI service
  // This is a mock implementation that does basic keyword matching
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('grocery') || lowerDesc.includes('supermarket')) {
    return 'Groceries';
  } else if (lowerDesc.includes('restaurant') || lowerDesc.includes('food')) {
    return 'Food & Dining';
  } else if (lowerDesc.includes('uber') || lowerDesc.includes('lyft') || lowerDesc.includes('taxi')) {
    return 'Transportation';
  } else if (lowerDesc.includes('movie') || lowerDesc.includes('netflix')) {
    return 'Entertainment';
  } else if (lowerDesc.includes('amazon') || lowerDesc.includes('shop')) {
    return 'Shopping';
  } else if (lowerDesc.includes('electric') || lowerDesc.includes('water') || lowerDesc.includes('gas')) {
    return 'Utilities';
  } else if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage')) {
    return 'Housing';
  } else if (lowerDesc.includes('doctor') || lowerDesc.includes('hospital')) {
    return 'Healthcare';
  } else if (lowerDesc.includes('school') || lowerDesc.includes('course')) {
    return 'Education';
  }
  
  return 'Other';
};
