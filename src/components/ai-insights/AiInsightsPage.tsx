
import React, { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { 
  BrainCircuit, 
  Lightbulb, 
  TrendingUp, 
  ArrowDownCircle, 
  Sparkles, 
  LineChart, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw,
  Clock,
  Eye,
  AlertCircle,
  Banknote,
  ReceiptText,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/finance';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion } from '@/components/ui/animated';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const INSIGHT_CATEGORIES = [
  {
    id: 'overview',
    name: 'Financial Overview',
    description: 'Summary of your financial health and key metrics',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-blue-500/10 text-blue-500 border-blue-200'
  },
  {
    id: 'spending',
    name: 'Spending Analysis',
    description: 'Detailed breakdown of your spending patterns',
    icon: <PieChart className="h-5 w-5" />,
    color: 'bg-purple-500/10 text-purple-500 border-purple-200'
  },
  {
    id: 'savings',
    name: 'Savings Opportunities',
    description: 'Areas where you can potentially save money',
    icon: <Banknote className="h-5 w-5" />,
    color: 'bg-green-500/10 text-green-500 border-green-200'
  },
  {
    id: 'forecast',
    name: 'Financial Forecast',
    description: 'Predictions about your future financial situation',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-orange-500/10 text-orange-500 border-orange-200'
  },
  {
    id: 'alerts',
    name: 'Financial Alerts',
    description: 'Important notices about your finances',
    icon: <AlertCircle className="h-5 w-5" />,
    color: 'bg-red-500/10 text-red-500 border-red-200'
  }
];

const AiInsightsPage = () => {
  const { transactions } = useTransactions();
  const [activeCategory, setActiveCategory] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Record<string, any>>({});
  const [generationProgress, setGenerationProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  useEffect(() => {
    if (transactions.length > 0 && Object.keys(insights).length === 0) {
      generateInsightsForCategory('overview');
    }
  }, [transactions]);
  
  const resetProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    return () => clearInterval(interval);
  };
  
  const generateInsightsForCategory = async (category: string) => {
    if (transactions.length === 0) {
      toast.error('You need some transactions before generating AI insights');
      return;
    }
    
    setLoading(true);
    setActiveCategory(category);
    const cleanup = resetProgress();
    
    try {
      // Calculate financial metrics
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const categories: Record<string, number> = {};
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
        
      const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount }));
        
      const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
        
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let newInsights = { ...insights };
      
      if (category === 'overview') {
        newInsights.overview = {
          summary: {
            income: totalIncome,
            expenses: totalExpenses,
            balance: totalIncome - totalExpenses,
            savingsRate: savingsRate
          },
          topExpenses: topCategories,
          keyMetrics: [
            {
              title: "Expense to Income Ratio",
              value: `${(totalExpenses / (totalIncome || 1) * 100).toFixed(1)}%`,
              description: totalExpenses / totalIncome < 0.7 ? 
                "Your spending is within a healthy range" : 
                "Try to keep this below 70% for financial health",
              status: totalExpenses / totalIncome < 0.7 ? "good" : "warning",
              icon: <ReceiptText className="h-4 w-4" />
            },
            {
              title: "Largest Expense Category",
              value: topCategories[0]?.category || "N/A",
              description: `${formatCurrency(topCategories[0]?.amount || 0)} (${((topCategories[0]?.amount || 0) / totalExpenses * 100).toFixed(1)}% of spending)`,
              status: "neutral",
              icon: <PieChart className="h-4 w-4" />
            },
            {
              title: "Savings Rate",
              value: `${savingsRate.toFixed(1)}%`,
              description: savingsRate >= 20 ? 
                "Excellent savings rate" : 
                "Aim for at least 20% for long-term financial security",
              status: savingsRate >= 20 ? "good" : "warning",
              icon: <Banknote className="h-4 w-4" />
            }
          ]
        };
      } else if (category === 'spending') {
        // Calculate spending trends
        const monthlySpending: Record<string, number> = {};
        const lastThreeMonths = new Array(3).fill(0).map((_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        });
        
        lastThreeMonths.forEach(month => {
          monthlySpending[month] = 0;
        });
        
        transactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            const date = new Date(t.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (lastThreeMonths.includes(monthYear)) {
              monthlySpending[monthYear] = (monthlySpending[monthYear] || 0) + t.amount;
            }
          });
          
        const spendingTrends = Object.entries(monthlySpending)
          .map(([month, amount]) => ({ month, amount }))
          .sort((a, b) => {
            const [monthA, yearA] = a.month.split(' ');
            const [monthB, yearB] = b.month.split(' ');
            const dateA = new Date(`${monthA} 1, ${yearA}`);
            const dateB = new Date(`${monthB} 1, ${yearB}`);
            return dateA.getTime() - dateB.getTime();
          });
        
        newInsights.spending = {
          categoryBreakdown: topCategories,
          spendingTrends: spendingTrends,
          spendingInsights: [
            {
              title: `${topCategories[0]?.category || 'Unknown'} spending is your highest expense`,
              description: `At ${formatCurrency(topCategories[0]?.amount || 0)}, this represents ${((topCategories[0]?.amount || 0) / totalExpenses * 100).toFixed(1)}% of your total expenses.`,
              action: `Consider setting a budget limit for ${topCategories[0]?.category || 'this category'}.`
            },
            {
              title: spendingTrends.length > 1 && spendingTrends[spendingTrends.length - 1].amount > spendingTrends[0].amount ?
                "Your spending is increasing month over month" :
                "Your spending is stable or decreasing",
              description: spendingTrends.length > 1 ?
                `You spent ${formatCurrency(spendingTrends[spendingTrends.length - 1].amount - spendingTrends[0].amount)} ${spendingTrends[spendingTrends.length - 1].amount > spendingTrends[0].amount ? 'more' : 'less'} compared to ${spendingTrends[0].month}.` :
                "We need more transaction history to analyze spending trends.",
              action: spendingTrends.length > 1 && spendingTrends[spendingTrends.length - 1].amount > spendingTrends[0].amount ?
                "Review your recent expenses to identify areas to cut back." :
                "Continue your good spending habits to maintain financial health."
            }
          ]
        };
      } else if (category === 'savings') {
        const potentialSavings: any[] = [];
        
        // Look for recurring expenses
        const recurringExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc: Record<string, any[]>, t) => {
            const key = t.description.toLowerCase();
            if (!acc[key]) acc[key] = [];
            acc[key].push(t);
            return acc;
          }, {});
          
        Object.entries(recurringExpenses)
          .filter(([_, transactions]) => transactions.length > 1)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 3)
          .forEach(([description, items]) => {
            const totalAmount = items.reduce((sum, t) => sum + t.amount, 0);
            potentialSavings.push({
              description: `Recurring expense: ${description}`,
              frequency: `${items.length} times`,
              amount: totalAmount,
              suggestion: `Review if this subscription or recurring expense is necessary.`
            });
          });
        
        // Look for unusually large expenses
        const averageExpense = totalExpenses / (transactions.filter(t => t.type === 'expense').length || 1);
        const largeExpenses = transactions
          .filter(t => t.type === 'expense' && t.amount > averageExpense * 3)
          .slice(0, 3)
          .map(t => ({
            description: `Large expense: ${t.description}`,
            date: new Date(t.date).toLocaleDateString(),
            amount: t.amount,
            suggestion: `Consider if this expense could be reduced or eliminated in the future.`
          }));
          
        potentialSavings.push(...largeExpenses);
        
        newInsights.savings = {
          monthlySavingsTarget: totalIncome * 0.2,
          currentSavings: Math.max(0, totalIncome - totalExpenses),
          savingsRate: savingsRate,
          potentialSavings: potentialSavings.slice(0, 5)
        };
      } else if (category === 'forecast') {
        const monthlyIncome = totalIncome / Math.max(1, new Set(transactions.filter(t => t.type === 'income').map(t => new Date(t.date).toLocaleString('default', { month: 'numeric', year: 'numeric' }))).size);
        const monthlyExpenses = totalExpenses / Math.max(1, new Set(transactions.filter(t => t.type === 'expense').map(t => new Date(t.date).toLocaleString('default', { month: 'numeric', year: 'numeric' }))).size);
        
        newInsights.forecast = {
          projections: [
            {
              period: "1 Month",
              income: monthlyIncome,
              expenses: monthlyExpenses,
              balance: monthlyIncome - monthlyExpenses
            },
            {
              period: "3 Months",
              income: monthlyIncome * 3,
              expenses: monthlyExpenses * 3,
              balance: (monthlyIncome - monthlyExpenses) * 3
            },
            {
              period: "6 Months",
              income: monthlyIncome * 6,
              expenses: monthlyExpenses * 6,
              balance: (monthlyIncome - monthlyExpenses) * 6
            }
          ],
          forecastInsights: [
            {
              title: (monthlyIncome - monthlyExpenses) > 0 
                ? "You're on track to build savings" 
                : "Your current spending exceeds your income",
              description: (monthlyIncome - monthlyExpenses) > 0
                ? `At your current rate, you could save approximately ${formatCurrency((monthlyIncome - monthlyExpenses) * 12)} over the next year.`
                : `If this trend continues, you may accumulate ${formatCurrency((monthlyExpenses - monthlyIncome) * 12)} in debt over the next year.`,
              action: (monthlyIncome - monthlyExpenses) > 0
                ? "Consider setting up automatic transfers to a savings or investment account."
                : "Look for ways to increase income or reduce expenses to achieve a positive cash flow."
            },
            {
              title: "Emergency Fund Status",
              description: totalExpenses > 0
                ? `Based on your expenses, an adequate emergency fund would be ${formatCurrency(monthlyExpenses * 3)} to ${formatCurrency(monthlyExpenses * 6)} (3-6 months of expenses).`
                : "We recommend building an emergency fund of 3-6 months of expenses.",
              action: "Aim to set aside small amounts regularly until you reach this target."
            }
          ]
        };
      } else if (category === 'alerts') {
        const alerts = [];
        
        // Check for negative balance
        if (totalIncome < totalExpenses) {
          alerts.push({
            severity: "high",
            title: "Spending Exceeds Income",
            description: `You've spent ${formatCurrency(totalExpenses - totalIncome)} more than you've earned.`,
            action: "Review your expenses to identify areas where you can cut back."
          });
        }
        
        // Check for low savings rate
        if (savingsRate < 10) {
          alerts.push({
            severity: "medium",
            title: "Low Savings Rate",
            description: `Your current savings rate is ${savingsRate.toFixed(1)}%, which is below the recommended 20%.`,
            action: "Try to increase your savings rate by reducing discretionary spending."
          });
        }
        
        // Check for sudden increase in spending
        if (spendingTrends && spendingTrends.length > 1) {
          const latestMonth = spendingTrends[spendingTrends.length - 1];
          const previousMonth = spendingTrends[spendingTrends.length - 2];
          
          if (latestMonth.amount > previousMonth.amount * 1.3) { // 30% increase
            alerts.push({
              severity: "medium",
              title: "Spending Spike Detected",
              description: `Your spending in ${latestMonth.month} is ${((latestMonth.amount / previousMonth.amount - 1) * 100).toFixed(0)}% higher than in ${previousMonth.month}.`,
              action: "Check your recent transactions to identify the cause of this increase."
            });
          }
        }
        
        // Add a low severity alert if no other alerts
        if (alerts.length === 0) {
          alerts.push({
            severity: "low",
            title: "Financial Health Check",
            description: "No critical issues detected in your financial situation.",
            action: "Continue monitoring your finances and consider setting up automated savings."
          });
        }
        
        newInsights.alerts = {
          alerts: alerts
        };
      }
      
      setInsights(newInsights);
      setLastUpdated(new Date().toLocaleString());
      toast.success(`AI analysis for ${INSIGHT_CATEGORIES.find(c => c.id === category)?.name || category} generated successfully!`);
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error(`Failed to generate insights. Please try again.`);
    } finally {
      setLoading(false);
      cleanup();
    }
  };
  
  const renderCategoryContent = (category: string) => {
    if (loading && activeCategory === category) {
      return (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-md mb-8">
            <Progress value={generationProgress} className="h-2 w-full" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Analyzing data</span>
              <span>Generating insights</span>
              <span>Finalizing</span>
            </div>
          </div>
          <div className="relative">
            <BrainCircuit className="h-16 w-16 text-primary/30 animate-pulse" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-700 mt-4">Generating AI insights...</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Our AI is analyzing your financial data to provide personalized {INSIGHT_CATEGORIES.find(c => c.id === category)?.name.toLowerCase()} insights
          </p>
        </div>
      );
    }
    
    if (!insights[category]) {
      return (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          {INSIGHT_CATEGORIES.find(c => c.id === category)?.icon ? (
            <div className="mb-4 p-4 rounded-full bg-gray-50">
              {INSIGHT_CATEGORIES.find(c => c.id === category)?.icon}
            </div>
          ) : (
            <BrainCircuit className="h-16 w-16 text-gray-200 mb-4" />
          )}
          <p className="text-gray-600 text-lg font-medium">No insights generated yet</p>
          <p className="text-gray-500 text-sm mt-2 max-w-md">
            Generate personalized financial insights based on your transaction history
          </p>
          <Button 
            onClick={() => generateInsightsForCategory(category)} 
            className="mt-6 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={loading}
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate {INSIGHT_CATEGORIES.find(c => c.id === category)?.name || "Insights"}
          </Button>
        </div>
      );
    }
    
    switch (category) {
      case 'overview':
        return renderOverviewContent();
      case 'spending':
        return renderSpendingContent();
      case 'savings':
        return renderSavingsContent();
      case 'forecast':
        return renderForecastContent();
      case 'alerts':
        return renderAlertsContent();
      default:
        return <p>Select a category to view insights</p>;
    }
  };
  
  const renderOverviewContent = () => {
    const { summary, topExpenses, keyMetrics } = insights.overview;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Income</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.income)}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.expenses)}</h3>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Net Balance</p>
                <h3 className={`text-2xl font-bold mt-1 ${summary.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                  {formatCurrency(summary.balance)}
                </h3>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <LineChart className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Financial Metrics</CardTitle>
              <CardDescription>Important indicators of your financial health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyMetrics.map((metric, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className={cn(
                      "p-2 rounded-full", 
                      metric.status === "good" ? "bg-green-100 text-green-600" : 
                      metric.status === "warning" ? "bg-yellow-100 text-yellow-600" : 
                      "bg-gray-100 text-gray-600"
                    )}>
                      {metric.icon}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{metric.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "ml-2",
                            metric.status === "good" ? "bg-green-50 text-green-700 border-green-200" : 
                            metric.status === "warning" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                            "bg-gray-50 text-gray-700 border-gray-200"
                          )}
                        >
                          {metric.value}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{metric.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Expenses</CardTitle>
              <CardDescription>Your biggest spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpenses.map((expense, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{expense.category}</span>
                      <span className="text-sm">{formatCurrency(expense.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${(expense.amount / topExpenses[0].amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderSpendingContent = () => {
    const { categoryBreakdown, spendingTrends, spendingInsights } = insights.spending;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending Insights</CardTitle>
            <CardDescription>Analysis of your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {spendingInsights.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="border-l-4 border-purple-400 pl-4 py-1"
                >
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <p className="text-sm font-medium text-purple-600 mt-2">{insight.action}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-sm">{formatCurrency(category.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-${i % 2 === 0 ? 'purple' : 'indigo'}-500`}
                        style={{ width: `${(category.amount / categoryBreakdown[0].amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Spending</CardTitle>
              <CardDescription>How your spending has changed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingTrends.map((month, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-indigo-600">
                              {formatCurrency(month.amount)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200 w-full">
                            <div
                              style={{ width: `${(month.amount / Math.max(...spendingTrends.map(m => m.amount))) * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            ></div>
                          </div>
                          {i > 0 && month.amount > spendingTrends[i-1].amount ? (
                            <ArrowUpRight className="h-4 w-4 text-red-500 ml-2" />
                          ) : i > 0 ? (
                            <ArrowDownRight className="h-4 w-4 text-green-500 ml-2" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderSavingsContent = () => {
    const { monthlySavingsTarget, currentSavings, savingsRate, potentialSavings } = insights.savings;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Savings Overview</CardTitle>
              <CardDescription>Your progress towards your savings goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Current Monthly Savings</span>
                    <span className="text-sm">{formatCurrency(currentSavings)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${currentSavings >= monthlySavingsTarget ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(100, (currentSavings / monthlySavingsTarget) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Current: {savingsRate.toFixed(1)}%</span>
                    <span>Target: 20%</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 flex items-center">
                    <Banknote className="h-4 w-4 mr-2" />
                    Recommended Monthly Savings
                  </h4>
                  <p className="text-green-700 mt-1">
                    We recommend saving at least {formatCurrency(monthlySavingsTarget)} per month (20% of your income).
                  </p>
                  {currentSavings < monthlySavingsTarget ? (
                    <p className="text-sm mt-2 font-medium">
                      You need to save an additional {formatCurrency(monthlySavingsTarget - currentSavings)} per month to reach your target.
                    </p>
                  ) : (
                    <p className="text-sm mt-2 font-medium text-green-700">
                      Great job! You're exceeding your savings target by {formatCurrency(currentSavings - monthlySavingsTarget)} per month.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Potential Savings</CardTitle>
              <CardDescription>Areas where you might be able to save money</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {potentialSavings?.length > 0 ? (
                  potentialSavings.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="bg-green-100 p-2 rounded-full">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.frequency && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700">
                              {item.frequency}
                            </Badge>
                          )}
                          {item.date && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700">
                              {item.date}
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {formatCurrency(item.amount)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{item.suggestion}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No savings opportunities identified yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderForecastContent = () => {
    const { projections, forecastInsights } = insights.forecast;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Projections</CardTitle>
            <CardDescription>How your finances might look in the coming months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-1 font-medium text-gray-600">Period</th>
                    <th className="text-right py-2 px-1 font-medium text-green-600">Income</th>
                    <th className="text-right py-2 px-1 font-medium text-red-600">Expenses</th>
                    <th className="text-right py-2 px-1 font-medium text-blue-600">Net Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((projection, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-1 font-medium">{projection.period}</td>
                      <td className="py-3 px-1 text-right">{formatCurrency(projection.income)}</td>
                      <td className="py-3 px-1 text-right">{formatCurrency(projection.expenses)}</td>
                      <td className={`py-3 px-1 text-right font-medium ${projection.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(projection.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Forecast Insights</CardTitle>
            <CardDescription>What these projections mean for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {forecastInsights.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-indigo-500" />
                    {insight.title}
                  </h4>
                  <p className="text-gray-600 mt-2">{insight.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-indigo-600 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Recommendation: {insight.action}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderAlertsContent = () => {
    const { alerts } = insights.alerts;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Alerts</CardTitle>
            <CardDescription>Important notices about your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className={cn(
                    "border-l-4 rounded-r-lg p-4",
                    alert.severity === "high" ? "border-red-500 bg-red-50" : 
                    alert.severity === "medium" ? "border-yellow-500 bg-yellow-50" : 
                    "border-blue-500 bg-blue-50"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-1 rounded-full mt-0.5",
                      alert.severity === "high" ? "bg-red-200 text-red-600" : 
                      alert.severity === "medium" ? "bg-yellow-200 text-yellow-600" : 
                      "bg-blue-200 text-blue-600"
                    )}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-medium",
                        alert.severity === "high" ? "text-red-800" : 
                        alert.severity === "medium" ? "text-yellow-800" : 
                        "text-blue-800"
                      )}>
                        {alert.title}
                      </h4>
                      <p className={cn(
                        "mt-1",
                        alert.severity === "high" ? "text-red-700" : 
                        alert.severity === "medium" ? "text-yellow-700" : 
                        "text-blue-700"
                      )}>
                        {alert.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-gray-200/30">
                        <p className={cn(
                          "text-sm font-medium flex items-center",
                          alert.severity === "high" ? "text-red-700" : 
                          alert.severity === "medium" ? "text-yellow-700" : 
                          "text-blue-700"
                        )}>
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {alert.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Financial Insights
          </h1>
          <p className="text-gray-500 mt-1">Get personalized analysis and recommendations for your finances</p>
        </div>
        
        {lastUpdated && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="md:col-span-5">
          <div className="overflow-x-auto p-1">
            <div className="flex gap-2 p-2">
              {INSIGHT_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={cn(
                    "flex-1 justify-start gap-2 text-left",
                    activeCategory !== category.id && category.color
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  <div className="flex flex-col items-start text-left">
                    <span>{category.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Card>
        
        <Card className="p-6 md:col-span-5 min-h-[500px]">
          {renderCategoryContent(activeCategory)}
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full p-3 text-purple-600">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">About AI Insights</h3>
              <p className="text-gray-600 mb-4">
                Our AI analyzes your financial data to provide personalized insights, trends, and recommendations. 
                The more transactions you have, the more accurate and detailed these insights will be.
              </p>
              
              <div className="mt-4 flex items-center justify-start gap-4">
                <Button
                  variant="outline"
                  className="bg-white/80 border-gray-200"
                  onClick={() => generateInsightsForCategory(activeCategory)}
                  disabled={loading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Insights
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white/80 border-gray-200"
                  onClick={() => navigate('/transactions')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add More Transactions
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiInsightsPage;
