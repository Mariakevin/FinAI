
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Wallet, CreditCard, RefreshCw, Brain } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

const EnhancedAIInsights = () => {
  const { transactions, getBalance, getTotalIncome, getTotalExpenses } = useTransactions();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictions, setPredictions] = useState<Insight[]>([]);
  const [tips, setTips] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const navigate = useNavigate();

  const generateInsights = () => {
    setIsAnalyzing(true);
    if (isRegenerating) {
      toast.success("Regenerating insights with latest data");
    }
    
    setTimeout(() => {
      const balance = getBalance();
      const totalIncome = getTotalIncome();
      const totalExpenses = getTotalExpenses();
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      const categories = new Map<string, number>();
      transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          const currentAmount = categories.get(transaction.category) || 0;
          categories.set(transaction.category, currentAmount + transaction.amount);
        }
      });
      
      let largestCategory = '';
      let largestAmount = 0;
      categories.forEach((amount, category) => {
        if (amount > largestAmount) {
          largestAmount = amount;
          largestCategory = category;
        }
      });
      
      const monthlySpending = new Map<string, number>();
      transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          const date = new Date(transaction.date);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          const currentAmount = monthlySpending.get(monthYear) || 0;
          monthlySpending.set(monthYear, currentAmount + transaction.amount);
        }
      });
      
      const sortedMonths = Array.from(monthlySpending.entries())
        .sort((a, b) => {
          const [monthA, yearA] = a[0].split('/').map(Number);
          const [monthB, yearB] = b[0].split('/').map(Number);
          return yearA !== yearB ? yearA - yearB : monthA - monthB;
        });
      
      const isSpendingIncreasing = sortedMonths.length > 1 && 
        sortedMonths[sortedMonths.length - 1][1] > sortedMonths[sortedMonths.length - 2][1];
      
      // Current insights
      const generatedInsights: Insight[] = [
        {
          id: '1',
          title: 'Savings Rate',
          description: `Your current savings rate is ${savingsRate.toFixed(1)}%. ${
            savingsRate < 20 
              ? 'Consider reducing discretionary spending to improve financial stability.' 
              : 'You\'re exceeding the recommended 20% threshold.'
          }`,
          impact: savingsRate >= 20 ? 'positive' : 'negative',
          category: 'saving',
          icon: <Wallet className="h-5 w-5" />
        },
        {
          id: '2',
          title: 'Top Expense Category',
          description: `Your highest spending is in ${largestCategory} (₹${largestAmount.toFixed(2)}). ${
            largestAmount > totalExpenses * 0.4 
              ? 'This concentration may create financial vulnerability.' 
              : 'Your spending appears well-distributed across categories.'
          }`,
          impact: largestAmount > totalExpenses * 0.4 ? 'negative' : 'positive',
          category: 'spending',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          id: '3',
          title: 'Monthly Trend',
          description: `Your monthly spending is ${
            isSpendingIncreasing 
              ? 'following an upward trajectory. Review recent expenses to identify opportunities.' 
              : 'showing a stable or decreasing pattern, indicating effective management.'
          }`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'spending',
          icon: isSpendingIncreasing ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />
        }
      ];
      
      // Future predictions
      const generatedPredictions: Insight[] = [
        {
          id: '4',
          title: 'Financial Trajectory',
          description: `Based on current patterns, we predict a ${savingsRate >= 15 ? 'positive financial trajectory. You are on track to build an emergency fund that covers 3-6 months of expenses.' : 'challenging financial period unless spending patterns are adjusted.'}`,
          impact: savingsRate >= 15 ? 'positive' : 'negative',
          category: 'saving',
          icon: <Lightbulb className="h-5 w-5" />
        },
        {
          id: '5',
          title: 'Cash Flow Prediction',
          description: `Cash flow analysis indicates ${isSpendingIncreasing ? 'a potential cash shortage within the next 2-3 months if current spending trends continue.' : 'sufficient liquidity to meet ongoing expenses and short-term financial goals.'}`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'spending',
          icon: <Wallet className="h-5 w-5" />
        }
      ];
      
      // Actionable tips
      const generatedTips: Insight[] = [
        {
          id: '6',
          title: 'Investment Recommendation',
          description: `With your current balance (₹${balance.toFixed(2)}), consider allocating resources to a diversified portfolio including high-yield savings and index funds.`,
          impact: 'neutral',
          category: 'investment',
          icon: <Lightbulb className="h-5 w-5" />,
          actionLabel: 'Learn More',
          actionLink: '#'
        },
        {
          id: '7',
          title: 'Income Diversification',
          description: transactions.filter(t => t.type === 'income').length > 1 
            ? 'Multiple income streams detected - this diversification is excellent for financial stability.' 
            : 'We recommend developing secondary income streams to enhance financial resilience.',
          impact: transactions.filter(t => t.type === 'income').length > 1 ? 'positive' : 'neutral',
          category: 'income',
          icon: <Wallet className="h-5 w-5" />,
          actionLabel: 'Explore Options',
          actionLink: '#'
        },
        {
          id: '8',
          title: 'Budget Optimization',
          description: `Opportunity to optimize your ${largestCategory} budget. Reducing this category by 10% could increase your savings rate by approximately ${((largestAmount * 0.1 / totalIncome) * 100).toFixed(1)}%.`,
          impact: 'neutral',
          category: 'spending',
          icon: <Lightbulb className="h-5 w-5" />,
          actionLabel: 'View Budget',
          actionLink: '/budget'
        }
      ];
      
      setInsights(generatedInsights);
      setPredictions(generatedPredictions);
      setTips(generatedTips);
      setIsAnalyzing(false);
      setIsRegenerating(false);
    }, 1500);
  };
  
  const handleRegenerate = () => {
    setIsRegenerating(true);
    generateInsights();
  };
  
  useEffect(() => {
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
  
  const renderInsightCards = (insightList: Insight[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insightList.map((insight) => (
        <Card key={insight.id} className={`hover:shadow-md transition-all border-l-4 ${
          insight.impact === 'positive' ? 'border-l-green-500' :
          insight.impact === 'negative' ? 'border-l-red-500' :
          'border-l-blue-500'
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
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
            <p className="text-sm text-gray-600">{insight.description}</p>
            {insight.actionLabel && (
              <Button 
                variant="link" 
                className="p-0 h-auto mt-2 text-purple-600 text-xs"
                onClick={() => navigate(insight.actionLink || '#')}
              >
                {insight.actionLabel}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  if (isAnalyzing) {
    return (
      <div className="w-full">
        <Card className="border-none shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Financial Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col items-center justify-center py-8">
              <h3 className="text-lg font-medium mb-2">Analyzing your financial data</h3>
              <p className="text-gray-500 mb-6 text-center max-w-md text-sm">
                Processing transaction patterns and generating insights...
              </p>
              <Progress value={65} className="w-64 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="w-full">
        <Card className="border-none shadow-sm mb-6">
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
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Financial Insights
          </span>
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
          onClick={handleRegenerate}
          disabled={isAnalyzing}
        >
          <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                Current Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className={`p-3 rounded-lg border-l-4 ${
                  insight.impact === 'positive' ? 'border-l-green-500 bg-green-50/30' :
                  insight.impact === 'negative' ? 'border-l-red-500 bg-red-50/30' :
                  'border-l-blue-500 bg-blue-50/30'
                }`}>
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictions.map((prediction) => (
                <div key={prediction.id} className={`p-3 rounded-lg border-l-4 ${
                  prediction.impact === 'positive' ? 'border-l-green-500 bg-green-50/30' :
                  prediction.impact === 'negative' ? 'border-l-red-500 bg-red-50/30' :
                  'border-l-blue-500 bg-blue-50/30'
                }`}>
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    {prediction.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{prediction.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.map((tip) => (
                <div key={tip.id} className="p-3 rounded-lg border-l-4 border-l-purple-500 bg-purple-50/30">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                  {tip.actionLabel && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-1 text-purple-600 text-xs"
                      onClick={() => navigate(tip.actionLink || '#')}
                    >
                      {tip.actionLabel}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIInsights;
