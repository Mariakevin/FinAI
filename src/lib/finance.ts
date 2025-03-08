
import { toast } from "sonner";

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
};

export type CategoryWithTotal = {
  name: string;
  total: number;
  percentage: number;
  color: string;
};

// Predefined transaction categories with colors
export const CATEGORIES = {
  'Food & Dining': '#4CAF50', // Green
  'Shopping': '#2196F3', // Blue
  'Transportation': '#FF9800', // Orange
  'Bills & Utilities': '#9C27B0', // Purple
  'Entertainment': '#F44336', // Red
  'Health & Fitness': '#00BCD4', // Cyan
  'Travel': '#3F51B5', // Indigo
  'Education': '#795548', // Brown
  'Personal': '#607D8B', // Blue Grey
  'Salary': '#4CAF50', // Green
  'Investment': '#009688', // Teal
  'Gifts': '#E91E63', // Pink
  'Other': '#9E9E9E', // Grey
};

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateID = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Get category with AI (mock implementation)
export const categorizeTransactionWithAI = async (description: string): Promise<string> => {
  // This would normally be an API call to an AI service
  // For now, we'll simulate it with a simple algorithm
  
  const lowerDescription = description.toLowerCase();
  
  // Map of keywords to categories
  const keywordToCategoryMap: Record<string, string> = {
    'restaurant': 'Food & Dining',
    'cafe': 'Food & Dining',
    'coffee': 'Food & Dining',
    'uber eats': 'Food & Dining',
    'grocery': 'Food & Dining',
    'market': 'Food & Dining',
    
    'amazon': 'Shopping',
    'store': 'Shopping',
    'clothing': 'Shopping',
    'mall': 'Shopping',
    
    'uber': 'Transportation',
    'lyft': 'Transportation',
    'gas': 'Transportation',
    'parking': 'Transportation',
    'transit': 'Transportation',
    
    'netflix': 'Entertainment',
    'hbo': 'Entertainment',
    'disney': 'Entertainment',
    'movie': 'Entertainment',
    'spotify': 'Entertainment',
    
    'rent': 'Bills & Utilities',
    'electric': 'Bills & Utilities',
    'water': 'Bills & Utilities',
    'internet': 'Bills & Utilities',
    'phone': 'Bills & Utilities',
    
    'doctor': 'Health & Fitness',
    'gym': 'Health & Fitness',
    'fitness': 'Health & Fitness',
    'medical': 'Health & Fitness',
    'pharmacy': 'Health & Fitness',
    
    'hotel': 'Travel',
    'flight': 'Travel',
    'vacation': 'Travel',
    'airbnb': 'Travel',
    
    'tuition': 'Education',
    'course': 'Education',
    'book': 'Education',
    'school': 'Education',
    
    'salary': 'Salary',
    'paycheck': 'Salary',
    'wage': 'Salary',
    'deposit': 'Salary',
    
    'stock': 'Investment',
    'dividend': 'Investment',
    'interest': 'Investment',
    'crypto': 'Investment',
  };
  
  // Find matching category
  for (const [keyword, category] of Object.entries(keywordToCategoryMap)) {
    if (lowerDescription.includes(keyword)) {
      return category;
    }
  }
  
  // Simulate some "thinking" time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Random category if no match (simulating AI's best guess)
  const categoryKeys = Object.keys(CATEGORIES);
  const randomIndex = Math.floor(Math.random() * (categoryKeys.length - 1)); // Exclude "Other"
  
  // This is where you'd actually call an AI API in a real implementation
  toast.success("AI categorized your transaction!");
  
  return categoryKeys[randomIndex];
};

// Analytics functions
export const getCategoryTotals = (transactions: Transaction[]): CategoryWithTotal[] => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryTotals: Record<string, number> = {};
  
  // Calculate totals per category
  for (const transaction of expenses) {
    const { category, amount } = transaction;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  }
  
  // Convert to array with percentages and colors
  return Object.entries(categoryTotals).map(([name, total]) => ({
    name,
    total,
    percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
    color: CATEGORIES[name as keyof typeof CATEGORIES] || CATEGORIES['Other'],
  }))
  .sort((a, b) => b.total - a.total);
};

export const getMonthlyTotals = (transactions: Transaction[], months = 6) => {
  const now = new Date();
  const labels: string[] = [];
  const incomeData: number[] = [];
  const expenseData: number[] = [];
  
  // Generate the last X months
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthYear = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    labels.push(monthYear);
    
    // Month boundaries for filtering
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    
    // Filter transactions for this month and calculate totals
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd;
    });
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    incomeData.push(monthlyIncome);
    expenseData.push(monthlyExpense);
  }
  
  return { labels, incomeData, expenseData };
};

// Sample data generator
export const generateSampleTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  const categories = Object.keys(CATEGORIES);
  
  // Create some income transactions
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 15);
    
    transactions.push({
      id: generateID(),
      amount: 3000 + Math.random() * 500,
      description: 'Monthly Salary',
      category: 'Salary',
      date: date.toISOString(),
      type: 'income'
    });
    
    // Some months have additional income
    if (Math.random() > 0.7) {
      const bonusDate = new Date(date);
      bonusDate.setDate(date.getDate() + Math.floor(Math.random() * 5));
      
      transactions.push({
        id: generateID(),
        amount: 100 + Math.random() * 400,
        description: 'Freelance Work',
        category: 'Other',
        date: bonusDate.toISOString(),
        type: 'income'
      });
    }
  }
  
  // Create expense transactions
  const expenseDescriptions = [
    'Restaurant Dinner',
    'Grocery Shopping',
    'Gas Station',
    'Netflix Subscription',
    'Amazon Purchase',
    'Utility Bill',
    'Phone Bill',
    'Coffee Shop',
    'Public Transport',
    'Gym Membership',
    'Book Store',
    'Home Depot',
    'Pharmacy',
    'Doctor Visit',
    'Movie Tickets',
    'Parking Fee',
    'Hair Salon',
    'Online Course',
  ];
  
  // Generate 40-60 expense transactions
  const numTransactions = 40 + Math.floor(Math.random() * 20);
  
  for (let i = 0; i < numTransactions; i++) {
    const monthOffset = Math.floor(Math.random() * 6); // 0-5 months ago
    const dayOfMonth = 1 + Math.floor(Math.random() * 28);
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, dayOfMonth);
    
    const descriptionIndex = Math.floor(Math.random() * expenseDescriptions.length);
    const description = expenseDescriptions[descriptionIndex];
    
    // Make expense amount depend somewhat on the description
    let amount;
    if (description.includes('Bill') || description.includes('Subscription')) {
      amount = 20 + Math.random() * 80;
    } else if (description.includes('Shopping') || description.includes('Amazon')) {
      amount = 50 + Math.random() * 150;
    } else if (description.includes('Restaurant')) {
      amount = 40 + Math.random() * 100;
    } else {
      amount = 10 + Math.random() * 90;
    }
    
    // Determine category (this would be done by AI in a real app)
    let category = 'Other';
    for (const [keyword, mappedCategory] of Object.entries({
      'Restaurant': 'Food & Dining',
      'Grocery': 'Food & Dining',
      'Coffee': 'Food & Dining',
      'Netflix': 'Entertainment',
      'Movie': 'Entertainment',
      'Amazon': 'Shopping',
      'Bill': 'Bills & Utilities',
      'Gas': 'Transportation',
      'Transport': 'Transportation',
      'Parking': 'Transportation',
      'Gym': 'Health & Fitness',
      'Doctor': 'Health & Fitness',
      'Pharmacy': 'Health & Fitness',
      'Book': 'Education',
      'Course': 'Education',
    })) {
      if (description.includes(keyword)) {
        category = mappedCategory;
        break;
      }
    }
    
    transactions.push({
      id: generateID(),
      amount,
      description,
      category,
      date: date.toISOString(),
      type: 'expense'
    });
  }
  
  // Sort by date, newest first
  return transactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
