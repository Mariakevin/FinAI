
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Wallet, PiggyBank, CreditCard, ArrowRight } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'spending' | 'saving' | 'investment' | 'income';
  icon: React.ReactNode;
  actionLabel?: string;
  actionLink?: string;
}

interface SpendingPattern {
  category: string;
  percentage: number;
  amount: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface SavingGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
}

const EnhancedAIInsights = () => {
  const { transactions, getBalance, getTotalIncome, getTotalExpenses } = useTransactions();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [selectedTab, setSelectedTab] = useState('insights');

  // Function to generate insights based on transaction data
  const generateInsights = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      const balance = getBalance();
      const totalIncome = getTotalIncome();
      const totalExpenses = getTotalExpenses();
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      // Categorize transactions
      const categories = new Map<string, number>();
      transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          const currentAmount = categories.get(transaction.category) || 0;
          categories.set(transaction.category, currentAmount + transaction.amount);
        }
      });
      
      // Find largest expense category
      let largestCategory = '';
      let largestAmount = 0;
      categories.forEach((amount, category) => {
        if (amount > largestAmount) {
          largestAmount = amount;
          largestCategory = category;
        }
      });
      
      // Generate monthly spending trend
      const monthlySpending = new Map<string, number>();
      transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          const date = new Date(transaction.date);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          const currentAmount = monthlySpending.get(monthYear) || 0;
          monthlySpending.set(monthYear, currentAmount + transaction.amount);
        }
      });
      
      // Sort months and check for trend
      const sortedMonths = Array.from(monthlySpending.entries())
        .sort((a, b) => {
          const [monthA, yearA] = a[0].split('/').map(Number);
          const [monthB, yearB] = b[0].split('/').map(Number);
          return yearA !== yearB ? yearA - yearB : monthA - monthB;
        });
      
      const isSpendingIncreasing = sortedMonths.length > 1 && 
        sortedMonths[sortedMonths.length - 1][1] > sortedMonths[sortedMonths.length - 2][1];
      
      // Generate insights based on data
      const generatedInsights: Insight[] = [
        {
          id: '1',
          title: 'Savings Rate Analysis',
          description: `Your current savings rate is ${savingsRate.toFixed(1)}%. ${
            savingsRate < 20 
              ? 'This is below the recommended 20%. Consider reducing discretionary spending.' 
              : 'Great job! You\'re above the recommended 20% savings threshold.'
          }`,
          impact: savingsRate >= 20 ? 'positive' : 'negative',
          category: 'saving',
          icon: <PiggyBank className="h-5 w-5" />
        },
        {
          id: '2',
          title: 'Spending Pattern Detected',
          description: `Your highest spending category is ${largestCategory} (₹${largestAmount.toFixed(2)}). ${
            largestAmount > totalExpenses * 0.4 
              ? 'This represents a significant portion of your expenses. Consider if you can optimize this area.' 
              : 'Your spending appears well-distributed across categories.'
          }`,
          impact: largestAmount > totalExpenses * 0.4 ? 'negative' : 'positive',
          category: 'spending',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          id: '3',
          title: 'Monthly Trend Alert',
          description: `Your monthly spending is ${
            isSpendingIncreasing 
              ? 'increasing compared to previous months. Review your recent expenses to identify areas to cut back.' 
              : 'stable or decreasing compared to previous months. Keep up the good financial habits!'
          }`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'spending',
          icon: isSpendingIncreasing ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />
        },
        {
          id: '4',
          title: 'Investment Opportunity',
          description: `Based on your current balance (₹${balance.toFixed(2)}), you may have an opportunity to invest. Consider putting some money into a high-yield savings account or other investment vehicles.`,
          impact: 'neutral',
          category: 'investment',
          icon: <Lightbulb className="h-5 w-5" />,
          actionLabel: 'Explore Investment Options',
          actionLink: '#'
        },
        {
          id: '5',
          title: 'Income Stability',
          description: transactions.filter(t => t.type === 'income').length > 1 
            ? 'You have multiple sources of income. This diversification is excellent for financial stability.' 
            : 'You appear to have a single income source. Consider developing additional income streams for greater financial security.',
          impact: transactions.filter(t => t.type === 'income').length > 1 ? 'positive' : 'neutral',
          category: 'income',
          icon: <Wallet className="h-5 w-5" />
        }
      ];
      
      // Generate spending patterns
      const generatedPatterns: SpendingPattern[] = Array.from(categories).map(([category, amount]) => {
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        // Generate random trend data for demonstration
        const trend = ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable';
        const change = Math.random() * 10;
        
        return {
          category,
          percentage,
          amount,
          trend,
          change
        };
      }).sort((a, b) => b.amount - a.amount);
      
      // Generate savings goals based on spending patterns
      const generatedGoals: SavingGoal[] = [
        {
          id: '1',
          name: 'Emergency Fund',
          target: totalIncome * 6, // 6 months of income
          current: balance > 0 ? balance : 0,
          deadline: '2024-12-31'
        },
        {
          id: '2',
          name: 'Vacation Fund',
          target: 50000,
          current: 15000, // Placeholder value
        },
        {
          id: '3',
          name: 'New Tech Gadget',
          target: 25000,
          current: 5000, // Placeholder value
        }
      ];
      
      setInsights(generatedInsights);
      setSpendingPatterns(generatedPatterns);
      setSavingGoals(generatedGoals);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  useEffect(() => {
    // Generate insights when transactions change
    if (transactions.length > 0) {
      generateInsights();
    } else {
      setIsAnalyzing(false);
    }
  }, [transactions]);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              AI-Powered Financial Insights
            </h2>
            <p className="text-gray-600">
              Our AI analyzes your financial data to provide personalized insights and recommendations
            </p>
          </div>
        </div>
      </motion.div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-2 bg-muted/20">
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="spending" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
            <CreditCard className="h-4 w-4 mr-2" />
            Spending
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            <Target className="h-4 w-4 mr-2" />
            Goals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          {isAnalyzing ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10">
                  <Sparkles className="h-10 w-10 text-purple-500 animate-pulse mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analyzing your financial data</h3>
                  <p className="text-gray-500 mb-4">Our AI is generating personalized insights...</p>
                  <Progress value={65} className="w-64 h-2" />
                </div>
              </CardContent>
            </Card>
          ) : insights.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {insights.map((insight) => (
                <motion.div key={insight.id} variants={fadeIn}>
                  <Card className={`hover:shadow-md transition-all ${
                    insight.impact === 'positive' ? 'border-l-4 border-l-green-500' :
                    insight.impact === 'negative' ? 'border-l-4 border-l-red-500' :
                    'border-l-4 border-l-blue-500'
                  }`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className={`p-1.5 rounded-full ${
                          insight.impact === 'positive' ? 'bg-green-100 text-green-600' :
                          insight.impact === 'negative' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {insight.icon}
                        </span>
                        {insight.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{insight.description}</p>
                      {insight.actionLabel && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto mt-2 text-purple-600"
                          onClick={() => window.open(insight.actionLink, '_blank')}
                        >
                          {insight.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No data to analyze</h3>
                  <p className="text-gray-500 mb-4">Add some transactions to get personalized insights</p>
                  <Button 
                    onClick={() => navigate('/transactions')} 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
              <CardDescription>
                Analysis of your spending patterns across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex justify-center items-center py-10">
                  <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
                </div>
              ) : spendingPatterns.length > 0 ? (
                <div className="space-y-4">
                  {spendingPatterns.map((pattern, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pattern.category}</span>
                          {pattern.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : pattern.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          ) : null}
                          {pattern.trend !== 'stable' && (
                            <span className={`text-xs ${pattern.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                              {pattern.change.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">₹{pattern.amount.toFixed(2)}</span>
                          <span className="text-gray-500 text-xs ml-1">({pattern.percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <Progress value={pattern.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No spending data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Smart suggestions to optimize your spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isAnalyzing && spendingPatterns.length > 0 && (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50">
                      <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">Optimize {spendingPatterns[0].category}</h4>
                        <p className="text-sm text-amber-700">
                          This is your highest spending category. Look for ways to reduce expenses here for maximum impact.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Budget Allocation</h4>
                        <p className="text-sm text-blue-700">
                          Consider using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          {!isAnalyzing && savingGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savingGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    {goal.deadline && (
                      <CardDescription>Target date: {new Date(goal.deadline).toLocaleDateString()}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      <div className="flex justify-between text-sm pt-1">
                        <span>₹{goal.current.toLocaleString()}</span>
                        <span className="text-gray-500">₹{goal.target.toLocaleString()}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium mb-2">AI Suggestion</h4>
                        <p className="text-xs text-gray-600">
                          {goal.current / goal.target < 0.25
                            ? `To reach your ${goal.name} goal, consider allocating ₹${((goal.target - goal.current) / 12).toFixed(0)} per month.`
                            : goal.current / goal.target < 0.75
                            ? `You're making good progress! Keep saving consistently to reach your goal.`
                            : `You're almost there! Just need ₹${(goal.target - goal.current).toFixed(0)} more to reach your goal.`
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <Target className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No savings goals set</h3>
                  <p className="text-gray-500 mb-4">Create savings goals to track your progress</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Create Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIInsights;
