
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Wallet, PiggyBank, CreditCard, ArrowRight, RefreshCw, Bot, Brain } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const generateInsights = () => {
    setIsAnalyzing(true);
    if (isRegenerating) {
      toast({
        title: "Regenerating insights",
        description: "Our AI is analyzing your financial data to provide fresh perspectives.",
      });
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
      
      const aiPhrases = [
        "After analyzing your financial patterns, I've observed that",
        "Based on my analysis of your transaction history,",
        "Looking at your spending behavior over time,",
        "My algorithms have detected that",
        "I've identified an interesting pattern in your finances:"
      ];
      
      const aiConclusions = [
        "This suggests you might benefit from a more structured budget approach.",
        "I recommend allocating resources more strategically in this area.",
        "Consider optimizing this aspect of your financial portfolio.",
        "This represents an opportunity for improving your financial health.",
        "A slight adjustment in this area could yield significant benefits."
      ];
      
      const getRandomPhrase = (array: string[]) => array[Math.floor(Math.random() * array.length)];
      
      // Current insights
      const generatedInsights: Insight[] = [
        {
          id: '1',
          title: 'Savings Rate Analysis',
          description: `${getRandomPhrase(aiPhrases)} your current savings rate is ${savingsRate.toFixed(1)}%. ${
            savingsRate < 20 
              ? 'This is below the recommended 20% threshold. My models suggest reducing discretionary spending in non-essential categories to improve financial stability.' 
              : 'This exceeds the recommended 20% threshold, indicating strong financial discipline. I project continued growth in your net worth if this trend continues.'
          } ${getRandomPhrase(aiConclusions)}`,
          impact: savingsRate >= 20 ? 'positive' : 'negative',
          category: 'saving',
          icon: <PiggyBank className="h-5 w-5" />
        },
        {
          id: '2',
          title: 'Spending Pattern Detected',
          description: `${getRandomPhrase(aiPhrases)} your highest spending category is ${largestCategory} (₹${largestAmount.toFixed(2)}). ${
            largestAmount > totalExpenses * 0.4 
              ? 'This represents a significant portion (over 40%) of your total expenses. My analysis suggests this concentration of spending may create financial vulnerability. Consider diversifying your expense distribution.' 
              : 'Your spending appears well-distributed across categories, which my algorithms identify as a positive indicator of financial balance and resilience against economic fluctuations.'
          }`,
          impact: largestAmount > totalExpenses * 0.4 ? 'negative' : 'positive',
          category: 'spending',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          id: '3',
          title: 'Monthly Trend Analysis',
          description: `${getRandomPhrase(aiPhrases)} your monthly spending is ${
            isSpendingIncreasing 
              ? 'following an upward trajectory compared to previous periods. I recommend a thorough review of recent expenses to identify optimization opportunities and prevent potential cash flow issues.' 
              : 'showing a stable or decreasing pattern compared to previous periods. This indicates effective financial management. My prediction models suggest this will positively impact your long-term savings goals.'
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
          title: 'Financial Trajectory Forecast',
          description: `Based on current spending patterns and income stability, my predictive models project a ${savingsRate >= 15 ? 'positive financial trajectory over the next 6 months. If current saving habits continue, you are on track to build an emergency fund that covers 3-6 months of expenses by year end.' : 'challenging financial period ahead unless spending patterns are adjusted. My recommendation is to increase your savings rate by at least 5% to build necessary financial buffers.'}`,
          impact: savingsRate >= 15 ? 'positive' : 'negative',
          category: 'saving',
          icon: <Lightbulb className="h-5 w-5" />
        },
        {
          id: '5',
          title: 'Cash Flow Prediction',
          description: `My cash flow predictive algorithm indicates ${isSpendingIncreasing ? 'a potential cash shortage within the next 2-3 months if current spending trends continue. I recommend creating a more restrictive budget for non-essential categories.' : 'sufficient liquidity to meet ongoing expenses and short-term financial goals. Your consistent financial management has created a stable cash flow projection.'}`,
          impact: isSpendingIncreasing ? 'negative' : 'positive',
          category: 'spending',
          icon: <Wallet className="h-5 w-5" />
        }
      ];
      
      // Actionable tips
      const generatedTips: Insight[] = [
        {
          id: '6',
          title: 'Investment Opportunity',
          description: `Based on my analysis of your current balance (₹${balance.toFixed(2)}) and spending patterns, I've identified potential for investment optimization. Consider allocating resources to a diversified portfolio including high-yield savings, index funds, or other investment vehicles aligned with your risk tolerance.`,
          impact: 'neutral',
          category: 'investment',
          icon: <Lightbulb className="h-5 w-5" />,
          actionLabel: 'Explore Investment Options',
          actionLink: '#'
        },
        {
          id: '7',
          title: 'Income Diversification',
          description: transactions.filter(t => t.type === 'income').length > 1 
            ? 'My algorithms have detected multiple income streams in your financial data. This diversification is excellent for financial stability and risk mitigation. I project reduced vulnerability to economic fluctuations based on this pattern.' 
            : 'I observe a single primary income source in your transaction history. This creates a potential single point of failure in your financial structure. My recommendation: develop secondary income streams to enhance financial resilience.',
          impact: transactions.filter(t => t.type === 'income').length > 1 ? 'positive' : 'neutral',
          category: 'income',
          icon: <Wallet className="h-5 w-5" />,
          actionLabel: 'Explore Side Income Ideas',
          actionLink: '#'
        },
        {
          id: '8',
          title: 'Budget Optimization Suggestion',
          description: `My advanced pattern recognition suggests an opportunity to optimize your ${largestCategory} budget. By reducing this category by just 10%, you could increase your savings rate by approximately ${((largestAmount * 0.1 / totalIncome) * 100).toFixed(1)}% without significantly impacting your lifestyle.`,
          impact: 'neutral',
          category: 'spending',
          icon: <Lightbulb className="h-5 w-5" />,
          actionLabel: 'View Budget Recommendations',
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
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {insightList.map((insight) => (
        <motion.div key={insight.id} variants={fadeIn}>
          <Card className={`hover:shadow-md transition-all border border-gray-100 ${
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
              <p className="text-gray-600 text-sm">{insight.description}</p>
              {insight.actionLabel && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-2 text-purple-600"
                  onClick={() => navigate(insight.actionLink || '#')}
                >
                  {insight.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
  
  if (isAnalyzing) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                AI-Powered Financial Insights
              </h2>
              <p className="text-gray-600">
                Our advanced AI analyzes your transaction patterns to provide personalized financial guidance
              </p>
            </div>
          </div>
        </motion.div>
        
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <Brain className="h-12 w-12 text-purple-200" />
                <Sparkles className="h-6 w-6 text-purple-500 absolute top-0 right-0 animate-pulse" />
              </div>
              <h3 className="text-lg font-medium mt-4 mb-2">AI is analyzing your financial data</h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Processing transaction patterns, identifying trends, and generating personalized insights...
              </p>
              <Progress value={65} className="w-64 h-2" />
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Analyzing Patterns</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-2 rounded-full mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Processing Data</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Creating Insights</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                AI-Powered Financial Insights
              </h2>
              <p className="text-gray-600">
                Our advanced AI analyzes your transaction patterns to provide personalized financial guidance
              </p>
            </div>
          </div>
        </motion.div>
        
        <Card className="border-none shadow-sm">
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
    <div className="space-y-8 max-w-6xl mx-auto w-full">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              AI-Powered Financial Insights
            </h2>
            <p className="text-gray-600">
              Our advanced AI analyzes your transaction patterns to provide personalized financial guidance
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={handleRegenerate}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </motion.div>
      
      <div className="space-y-8">
        {/* Current Insights Section */}
        <section>
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
              Current Financial Insights
            </h3>
            <div className="ml-auto flex gap-2">
              <div className="text-xs flex items-center gap-1 text-gray-500">
                <Bot className="h-3 w-3 text-purple-500" />
                <span>AI-powered analysis</span>
              </div>
            </div>
          </div>
          {renderInsightCards(insights)}
        </section>
        
        {/* Predictions Section */}
        <section>
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Financial Predictions
            </h3>
          </div>
          {renderInsightCards(predictions)}
        </section>
        
        {/* Tips & Actions Section */}
        <section>
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              Recommended Actions
            </h3>
          </div>
          {renderInsightCards(tips)}
        </section>
      </div>
    </div>
  );
};

export default EnhancedAIInsights;
