
import React, { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/finance';
import { PieChart, BarChart3, Plus, Pencil, Save, X, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Type definitions
interface Budget {
  id: string;
  category: string;
  limit: number;
  color: string;
}

const STORAGE_KEY = 'finwise_budgets';

// Sample initial budget data
const INITIAL_BUDGETS: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 15000, color: '#4CAF50' },
  { id: '2', category: 'Transportation', limit: 5000, color: '#FF9800' },
  { id: '3', category: 'Entertainment', limit: 3000, color: '#F44336' },
  { id: '4', category: 'Shopping', limit: 8000, color: '#2196F3' },
  { id: '5', category: 'Bills & Utilities', limit: 10000, color: '#9C27B0' },
];

const BudgetPage = () => {
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [activeView, setActiveView] = useState<'list' | 'chart'>('list');
  const [newBudget, setNewBudget] = useState<{ category: string; limit: number; color: string; }>({
    category: '',
    limit: 0,
    color: '#' + Math.floor(Math.random()*16777215).toString(16) // Generate random color
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Load budgets from localStorage on mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem(STORAGE_KEY);
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      setBudgets(INITIAL_BUDGETS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BUDGETS));
    }
  }, []);
  
  // Save budgets to localStorage when they change
  useEffect(() => {
    if (budgets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    }
  }, [budgets]);
  
  // Calculate spending by category for the current month
  const getCurrentMonthSpending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear &&
             t.type === 'expense';
    });
    
    const categorySpending: Record<string, number> = {};
    
    monthlyTransactions.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    
    return categorySpending;
  };
  
  const categorySpending = getCurrentMonthSpending();
  
  // Handle edit of budget amount
  const handleEdit = (id: string, currentLimit: number) => {
    setEditingId(id);
    setEditValue(currentLimit);
  };
  
  // Save edited budget amount
  const handleSave = (id: string) => {
    if (editValue <= 0) {
      toast.error('Budget amount must be greater than zero');
      return;
    }
    
    setBudgets(prev => 
      prev.map(budget => 
        budget.id === id ? { ...budget, limit: editValue } : budget
      )
    );
    setEditingId(null);
    toast.success('Budget updated successfully');
  };
  
  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
  };
  
  // Handle adding new budget
  const handleAddBudget = () => {
    if (!newBudget.category) {
      toast.error('Please enter a category name');
      return;
    }
    
    if (newBudget.limit <= 0) {
      toast.error('Budget amount must be greater than zero');
      return;
    }
    
    const newId = Date.now().toString();
    const budgetToAdd: Budget = {
      id: newId,
      category: newBudget.category,
      limit: newBudget.limit,
      color: newBudget.color
    };
    
    setBudgets(prev => [...prev, budgetToAdd]);
    setNewBudget({
      category: '',
      limit: 0,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
    setIsAddingNew(false);
    toast.success('New budget added successfully');
  };
  
  // Chart data preparation
  const getChartData = () => {
    return budgets.map(budget => {
      const spent = categorySpending[budget.category] || 0;
      const percentage = Math.min(100, (spent / budget.limit) * 100);
      return {
        name: budget.category,
        limit: budget.limit,
        spent: spent,
        remaining: Math.max(0, budget.limit - spent),
        percentage: percentage,
        color: budget.color
      };
    });
  };
  
  const chartData = getChartData();
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-500 mt-1">Track your spending against budget limits</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-md p-1 flex">
            <Button 
              variant={activeView === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveView('list')}
              className="rounded-r-none"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button 
              variant={activeView === 'chart' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveView('chart')}
              className="rounded-l-none"
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Chart</span>
            </Button>
          </div>
          
          <Button 
            onClick={() => setIsAddingNew(!isAddingNew)} 
            className="flex items-center gap-2"
          >
            {isAddingNew ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            <span>{isAddingNew ? 'Cancel' : 'Set New Budget'}</span>
          </Button>
        </div>
      </div>
      
      {isAddingNew && (
        <GlassCard className="animate-scale-in">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <Input
                value={newBudget.category}
                onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Groceries"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, limit: Number(e.target.value) }))}
                  placeholder="5000"
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newBudget.color}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, color: e.target.value }))}
                  className="h-10 w-10 border-0 p-0 cursor-pointer rounded"
                />
                <span className="text-sm text-gray-500">{newBudget.color}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddBudget}>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </div>
        </GlassCard>
      )}
      
      <Card className="overflow-hidden">
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start p-2 bg-muted/20">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="alert">Alert (≥90%)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="m-0">
            {activeView === 'list' ? (
              <CardContent className="p-6">
                <div className="space-y-6">
                  {budgets.map(budget => {
                    const spent = categorySpending[budget.category] || 0;
                    const percentage = Math.min(100, (spent / budget.limit) * 100);
                    const remaining = Math.max(0, budget.limit - spent);
                    
                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: budget.color }}
                            />
                            <span className="font-medium">{budget.category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              {editingId === budget.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                                    <Input
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(Number(e.target.value))}
                                      className="w-28 h-8 pl-7 py-1 text-sm"
                                    />
                                  </div>
                                  <Button size="icon" variant="ghost" onClick={() => handleSave(budget.id)} className="h-7 w-7">
                                    <Save className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={handleCancel} className="h-7 w-7">
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm font-medium">
                                    {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatCurrency(remaining)} remaining
                                  </div>
                                </>
                              )}
                            </div>
                            {editingId !== budget.id && (
                              <Button size="icon" variant="ghost" onClick={() => handleEdit(budget.id, budget.limit)} className="h-7 w-7">
                                <Pencil className="h-4 w-4 text-gray-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2" 
                          style={{ 
                            "--progress-background": percentage >= 90 ? "#ef4444" : budget.color 
                          } as React.CSSProperties}
                        />
                      </div>
                    );
                  })}
                  
                  {budgets.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No budgets set yet. Add your first budget to start tracking.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-6">
                <div className="h-96">
                  {budgets.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                      <GlassCard className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                          <PieChart className="h-5 w-5 text-blue-600 mr-2" />
                          Budget vs. Spending
                        </h3>
                        <div className="flex-1 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="spent"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => formatCurrency(Number(value))}
                                labelFormatter={(name) => `Category: ${name}`}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </GlassCard>
                      
                      <GlassCard className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                          Budget Utilization
                        </h3>
                        <div className="flex-1 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={chartData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                              <Bar dataKey="spent" name="Spent" fill="#8884d8">
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                              <Bar dataKey="remaining" name="Remaining" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </GlassCard>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No budgets set yet. Add your first budget to see charts.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </TabsContent>
          
          <TabsContent value="alert" className="m-0">
            <CardContent className="p-6">
              <div className="space-y-6">
                {budgets
                  .filter(budget => {
                    const spent = categorySpending[budget.category] || 0;
                    const percentage = (spent / budget.limit) * 100;
                    return percentage >= 90;
                  })
                  .map(budget => {
                    const spent = categorySpending[budget.category] || 0;
                    const percentage = Math.min(100, (spent / budget.limit) * 100);
                    const remaining = Math.max(0, budget.limit - spent);
                    
                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: budget.color }}
                            />
                            <span className="font-medium">{budget.category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              {editingId === budget.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                                    <Input
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(Number(e.target.value))}
                                      className="w-28 h-8 pl-7 py-1 text-sm"
                                    />
                                  </div>
                                  <Button size="icon" variant="ghost" onClick={() => handleSave(budget.id)} className="h-7 w-7">
                                    <Save className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={handleCancel} className="h-7 w-7">
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm font-medium">
                                    {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                                  </div>
                                  <div className="text-xs text-gray-500 text-red-500 font-medium">
                                    Alert: {percentage.toFixed(0)}% used
                                  </div>
                                </>
                              )}
                            </div>
                            {editingId !== budget.id && (
                              <Button size="icon" variant="ghost" onClick={() => handleEdit(budget.id, budget.limit)} className="h-7 w-7">
                                <Pencil className="h-4 w-4 text-gray-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2" 
                          style={{ 
                            "--progress-background": "#ef4444" 
                          } as React.CSSProperties}
                        />
                      </div>
                    );
                  })}
                
                {budgets.filter(budget => {
                  const spent = categorySpending[budget.category] || 0;
                  const percentage = (spent / budget.limit) * 100;
                  return percentage >= 90;
                }).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No budgets over 90% of limit. Great job managing your spending!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default BudgetPage;
