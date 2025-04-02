
import { getCategoryColor } from './categories';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
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
