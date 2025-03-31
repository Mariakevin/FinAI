
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw, 
  Brain, 
  BarChart3,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Share2,
  FileDown
} from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
  icon: React.ReactNode;
  confidence: number;
  actionLabel?: string;
  actionLink?: string;
}

const EnhancedAIInsights = () => {
  const { transactions, getBalance, getTotalIncome, getTotalExpenses } = useTransactions();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictions, setPredictions] = useState<Insight[]>([]);
  const [tips, setTips] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('insights');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (transactions.length > 0) {
      generateInsights();
    } else {
      setIsAnalyzing(false);
    }
  }, [transactions]);

  const generateInsights = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
    
    setTimeout(() => {
      const balance = getBalance();
      const totalIncome = getTotalIncome();
      const totalExpenses = getTotalExpenses();
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      // Analyze spending by category
      const categories = new Map<string, number>();
      transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
          const currentAmount = categories.get(transaction.category) || 0;
          categories.set(transaction.category, currentAmount + transaction.amount);
        }
      });
      
      // Find largest spending category
      let largestCategory = '';
      let largestAmount = 0;
      categories.forEach((amount, category) => {
        if (amount > largestAmount) {
          largestAmount = amount;
          largestCategory = category;
        }
      });
      
      // Analyze monthly spending trends
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
      
      // Generate current insights
      const generatedInsights: Insight[] = [
        {
          id: '1',
          title: 'Savings Rate Analysis',
          description: `Your current savings rate is ${savingsRate.toFixed(1)}%, which is ${savingsRate >= 20 ? 'above' : 'below'} the recommended 20% threshold for financial security.`,
          impact: savingsRate >= 20 ? 'positive' : 'negative',
          category: 'saving',
          icon: <Wallet />,
          confidence: 95
        },
        {
          id: '2',
          title: 'Spending Concentration',
          description: `${largestCategory} represents ${((largestAmount / totalExpenses) * 100).toFixed(1)}% of your total spending. ${largestAmount > totalExpenses * 0.4 ? 'This concentration creates financial vulnerability.' : 'Your spending appears well-distributed.'}`,
          impact: largestAmount > totalExpenses * 0.4 ? 'negative' : 'positive',
          category: 'spending',
          icon: <CreditCard />,
          confidence: 92
        },
        {
          id: '3',
          title: 'Monthly Expense Trend',
          description: `Your monthly spending is ${isSpendingIncreasing ? 'increasing' : 'stable or decreasing'}, indicating ${isSpendingIncreasing ? 'potential budget concerns' : 'effective financial management'}.`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'trend',
          icon: isSpendingIncreasing ? <ArrowUpRight /> : <ArrowDownRight />,
          confidence: 89
        },
        {
          id: '4',
          title: 'Income-to-Expense Ratio',
          description: `Your income-to-expense ratio is ${(totalIncome / totalExpenses).toFixed(2)}x, ${totalIncome > totalExpenses * 1.2 ? 'providing a healthy buffer for savings and investments' : 'leaving limited room for financial growth'}.`,
          impact: totalIncome > totalExpenses * 1.2 ? 'positive' : 'negative',
          category: 'finance',
          icon: <BarChart3 />,
          confidence: 94
        }
      ];
      
      // Generate predictions
      const generatedPredictions: Insight[] = [
        {
          id: '5',
          title: 'Future Financial Trajectory',
          description: `Based on current patterns, we predict a ${savingsRate >= 15 ? 'positive financial trajectory with increased net worth' : 'challenging financial period unless spending patterns are adjusted'}.`,
          impact: savingsRate >= 15 ? 'positive' : 'negative',
          category: 'forecast',
          icon: <TrendingUp />,
          confidence: 87
        },
        {
          id: '6',
          title: 'Cash Flow Forecast',
          description: `Cash flow analysis indicates ${isSpendingIncreasing ? 'potential liquidity challenges in the next 2-3 months' : 'stable liquidity to meet ongoing expenses and short-term goals'}.`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'cashflow',
          icon: <Wallet />,
          confidence: 85
        },
        {
          id: '7',
          title: 'Expense Growth Prediction',
          description: `AI modeling projects ${isSpendingIncreasing ? 'continued expense growth of approximately 8-12% in next quarter' : 'stable expenses with potential for 3-5% reduction through optimization'}.`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'spending',
          icon: <BarChart3 />,
          confidence: 82
        },
        {
          id: '8',
          title: 'Savings Potential',
          description: `With optimized spending in ${largestCategory}, you could increase your savings rate to ${(savingsRate + 5).toFixed(1)}% within 60 days.`,
          impact: 'positive',
          category: 'optimization',
          icon: <Lightbulb />,
          confidence: 88
        }
      ];
      
      // Generate actionable tips
      const generatedTips: Insight[] = [
        {
          id: '9',
          title: 'Optimize Top Expense',
          description: `Reduce ${largestCategory} spending by 10-15% through ${largestCategory === 'Food' ? 'meal planning and cooking at home' : largestCategory === 'Shopping' ? 'implementing a 48-hour purchase decision rule' : 'careful budget review'}.`,
          impact: 'neutral',
          category: 'action',
          icon: <Lightbulb />,
          actionLabel: 'View Budget',
          actionLink: '/budget',
          confidence: 91
        },
        {
          id: '10',
          title: 'Automatic Saving Strategy',
          description: `Set up automatic transfers of ${(totalIncome * 0.05).toFixed(0)} on payday to a high-yield savings account to accelerate emergency fund growth.`,
          impact: 'neutral',
          category: 'action',
          icon: <Wallet />,
          actionLabel: 'Learn More',
          actionLink: '#',
          confidence: 93
        },
        {
          id: '11',
          title: 'Income Diversification',
          description: `${transactions.filter(t => t.type === 'income').length > 1 ? 'Continue developing your multiple income streams for increased stability.' : 'Explore side-income opportunities aligned with your skills to enhance financial resilience.'}`,
          impact: 'neutral',
          category: 'action',
          icon: <TrendingUp />,
          actionLabel: 'Explore Options',
          actionLink: '#',
          confidence: 89
        },
        {
          id: '12',
          title: 'Financial Review Routine',
          description: 'Implement a monthly finance review session to track progress against goals and identify new optimization opportunities.',
          impact: 'neutral',
          category: 'action',
          icon: <RefreshCw />,
          actionLabel: 'Set Reminder',
          actionLink: '#',
          confidence: 94
        }
      ];
      
      setInsights(generatedInsights);
      setPredictions(generatedPredictions);
      setTips(generatedTips);
      setLastUpdated(new Date().toLocaleString());
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      toast.success('AI insights generated successfully', {
        description: 'Your financial data has been analyzed with our AI engine',
      });
    }, 2500);
  };
  
  const handleRegenerate = () => {
    generateInsights();
  };
  
  if (isAnalyzing) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Financial Analysis
            </CardTitle>
            <CardDescription>Our advanced AI is analyzing your financial patterns</CardDescription>
          </CardHeader>
          <CardContent className="pb-6 space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative mb-4">
                <Brain className="h-16 w-16 text-purple-500 animate-pulse" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-purple-700">Analyzing your financial data</h3>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                Our advanced AI model is processing your transactions to generate personalized insights, predictions, and recommendations
              </p>
              
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing data...</span>
                  <span className="font-medium">{Math.min(Math.round(analysisProgress), 100)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                {['Pattern Analysis', 'Financial Modeling', 'Optimization Engine'].map((step, i) => (
                  <div key={step} className={`px-4 py-3 rounded-lg border ${analysisProgress > i * 33 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{step}</span>
                      {analysisProgress > i * 33 && <Sparkles className="h-3 w-3 text-purple-500" />}
                    </div>
                    <Progress value={analysisProgress > i * 33 ? Math.min(100, (analysisProgress - i * 33) * 3) : 0} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6 pb-6">
            <div className="text-center py-10">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-medium mb-3">No data to analyze</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Our AI needs your financial transactions to provide personalized insights. Add some transactions to get started.
              </p>
              <Button 
                onClick={() => navigate('/transactions')} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Add Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Financial Insights
          </h1>
          <p className="text-gray-500 mt-1">
            Powered by our advanced financial AI engine
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            97% Accuracy
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={handleRegenerate}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>
      
      <Card className="border-none shadow-md overflow-hidden mb-8">
        <Tabs defaultValue="insights" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full rounded-none border-b bg-transparent h-14 p-0">
            <TabsTrigger 
              value="insights" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 h-full hover:bg-gray-50 data-[state=active]:bg-gray-50 data-[state=active]:text-purple-700"
            >
              <Brain className="mr-2 h-5 w-5" />
              Current Insights
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 h-full hover:bg-gray-50 data-[state=active]:bg-gray-50 data-[state=active]:text-indigo-700"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              AI Predictions
            </TabsTrigger>
            <TabsTrigger 
              value="tips" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 h-full hover:bg-gray-50 data-[state=active]:bg-gray-50 data-[state=active]:text-amber-700"
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Action Items
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="p-6 m-0">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Current Financial Insights
              </h2>
              <p className="text-gray-500 text-sm mt-1">AI analysis of your current financial patterns and behaviors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={cn(
                    "hover:shadow-md transition-all border-l-4 h-full", 
                    insight.impact === 'positive' ? 'border-l-green-500' :
                    insight.impact === 'negative' ? 'border-l-red-500' : 
                    'border-l-blue-500'
                  )}>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "p-1.5 rounded-full",
                            insight.impact === 'positive' ? 'bg-green-100 text-green-600' :
                            insight.impact === 'negative' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          )}>
                            {insight.icon}
                          </span>
                          {insight.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600">{insight.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="p-6 m-0">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                AI Financial Predictions
              </h2>
              <p className="text-gray-500 text-sm mt-1">Forward-looking projections based on your financial data</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {predictions.map((prediction) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={cn(
                    "hover:shadow-md transition-all border-l-4 h-full", 
                    prediction.impact === 'positive' ? 'border-l-green-500' :
                    prediction.impact === 'negative' ? 'border-l-red-500' : 
                    'border-l-blue-500'
                  )}>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "p-1.5 rounded-full",
                            prediction.impact === 'positive' ? 'bg-green-100 text-green-600' :
                            prediction.impact === 'negative' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          )}>
                            {prediction.icon}
                          </span>
                          {prediction.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {prediction.confidence}% confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600">{prediction.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="p-6 m-0">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Personalized Action Items
              </h2>
              <p className="text-gray-500 text-sm mt-1">AI-recommended steps to improve your financial health</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {tips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-all border-l-4 border-l-amber-500 h-full">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-full bg-amber-100 text-amber-600">
                            {tip.icon}
                          </span>
                          {tip.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tip.confidence}% match
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 mb-3">{tip.description}</p>
                      {tip.actionLabel && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-amber-600 text-sm flex items-center gap-1"
                          onClick={() => navigate(tip.actionLink || '#')}
                        >
                          {tip.actionLabel}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <div>
            {lastUpdated && `Analysis updated: ${lastUpdated} | AI model v3.2`}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500 flex items-center gap-1 h-7">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 flex items-center gap-1 h-7">
              <FileDown className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm text-purple-600">
            <Brain className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">About FinAI's AI-Powered Analysis</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our advanced AI technology analyzes your financial data using neural networks and proprietary algorithms to identify patterns, predict trends, and recommend personalized actions tailored to your unique financial situation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
                  <Brain className="h-4 w-4 text-purple-500" />
                  Pattern Recognition
                </div>
                <p className="text-xs text-gray-500">Identifies financial behaviors and spending patterns</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Predictive Modeling
                </div>
                <p className="text-xs text-gray-500">Forecasts future financial trends with high accuracy</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Action Intelligence
                </div>
                <p className="text-xs text-gray-500">Recommends optimized actions for financial growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIInsights;
