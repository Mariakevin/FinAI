
import {
  ShoppingBag,
  UtensilsCrossed,
  Home,
  Car,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Plane,
  Smartphone,
  Shirt,
  Gift,
  CreditCard,
  Receipt,
  Landmark,
  DollarSign,
  Banknote,
  Building,
  UsersRound
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'groceries', name: 'Groceries', color: '#4caf50', icon: ShoppingBag },
  { id: 'dining', name: 'Dining Out', color: '#ff9800', icon: UtensilsCrossed },
  { id: 'housing', name: 'Housing', color: '#2196f3', icon: Home },
  { id: 'transportation', name: 'Transportation', color: '#f44336', icon: Car },
  { id: 'income', name: 'Income', color: '#4caf50', icon: Briefcase },
  { id: 'healthcare', name: 'Healthcare', color: '#e91e63', icon: Stethoscope },
  { id: 'education', name: 'Education', color: '#9c27b0', icon: GraduationCap },
  { id: 'travel', name: 'Travel', color: '#03a9f4', icon: Plane },
  { id: 'utilities', name: 'Utilities', color: '#607d8b', icon: Smartphone },
  { id: 'clothing', name: 'Clothing', color: '#9e9e9e', icon: Shirt },
  { id: 'entertainment', name: 'Entertainment', color: '#673ab7', icon: Gift },
  { id: 'debt', name: 'Debt Payments', color: '#ff5722', icon: CreditCard },
  { id: 'bills', name: 'Bills', color: '#795548', icon: Receipt },
  { id: 'investments', name: 'Investments', color: '#009688', icon: Landmark },
  { id: 'salary', name: 'Salary', color: '#8bc34a', icon: DollarSign },
  { id: 'bonus', name: 'Bonus', color: '#cddc39', icon: Banknote },
  { id: 'rent', name: 'Rent Income', color: '#3f51b5', icon: Building },
  { id: 'gifts', name: 'Gifts Received', color: '#ffc107', icon: Gift },
  { id: 'dividends', name: 'Dividends', color: '#00bcd4', icon: Landmark },
  { id: 'other', name: 'Other', color: '#9e9e9e', icon: UsersRound }
];

export const getCategoryById = (id: string) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1]; // Default to "Other"
};

export const getCategoryColor = (categoryId: string): string => {
  return getCategoryById(categoryId).color;
};

export const getCategoryIcon = (categoryId: string) => {
  return getCategoryById(categoryId).icon;
};
