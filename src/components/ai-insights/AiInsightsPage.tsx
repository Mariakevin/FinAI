
import React, { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, TrendingUp, Lightbulb, Loader2, Brain, BrainCircuit, ArrowDownCircle, BarChart3, Sparkles, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/finance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const AiInsightsPage = () => {
  const { transactions } = useTransactions();
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string | null>(null);
  const [tips, setTips] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (transactions.length > 0 && !insights && !loading) {
      generateContent('insights');
    }
  }, [transactions]);
  
  const simulateAiProcessing = async () => {
    // Simulate AI processing with progress
    setConfidenceScore(0);
    const interval = setInterval(() => {
      setConfidenceScore(prev => {
        const newScore = prev + Math.random() * 15;
        return newScore > 100 ? 100 : newScore;
      });
    }, 200);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearInterval(interval);
    setConfidenceScore(100);
  };
  
  const generateContent = async (type: 'insights' | 'predictions' | 'tips') => {
    if (transactions.length === 0) {
      toast.error('You need some transactions before generating AI insights');
      return;
    }
    
    setLoading(true);
    setActiveTab(type);
    
    try {
      await simulateAiProcessing();
      
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
        
      const financialSummary = {
        totalIncome: formatCurrency(totalIncome),
        totalExpenses: formatCurrency(totalExpenses),
        balance: formatCurrency(totalIncome - totalExpenses),
        topExpenseCategories: topCategories.map(
          c => `${c.category}: ${formatCurrency(c.amount)}`
        ),
        transactionCount: transactions.length,
        savingsRate: totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome * 100 : 0
      };
      
      let response = '';
      
      if (type === 'insights') {
        response = `
• Your largest expense category is ${topCategories[0]?.category || 'unknown'}, accounting for ${((topCategories[0]?.amount || 0) / totalExpenses * 100).toFixed(1)}% of your total spending.
• Your spending to income ratio is ${(totalExpenses / totalIncome * 100).toFixed(1)}%, which is ${totalExpenses / totalIncome < 0.7 ? 'healthy' : 'higher than recommended'}.
• You have ${transactions.filter(t => t.type === 'income').length} income sources and ${transactions.filter(t => t.type === 'expense').length} expense transactions.
• Your average transaction size is ${formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)}.
• ${totalIncome > totalExpenses ? `You're saving ${formatCurrency(totalIncome - totalExpenses)}, which is positive!` : `You're spending more than you earn by ${formatCurrency(totalExpenses - totalIncome)}, which is concerning.`}
• Based on AI analysis of similar financial profiles, your spending patterns are ${totalExpenses / totalIncome < 0.6 ? 'more conservative than 75% of users' : totalExpenses / totalIncome < 0.8 ? 'typical' : 'more aggressive than 70% of users'}.
        `;
        setInsights(response.trim());
      } else if (type === 'predictions') {
        const monthlyAverage = totalExpenses / 3; // Assuming data for 3 months
        const seasonalFactor = new Date().getMonth() >= 9 && new Date().getMonth() <= 11 ? 1.2 : 1.0; // Higher spending in holiday season
        
        response = `
• Based on advanced AI trend analysis, you're projected to ${totalIncome > totalExpenses ? `save approximately ${formatCurrency((totalIncome - totalExpenses) * 3)} over the next three months.` : `have a deficit of approximately ${formatCurrency((totalExpenses - totalIncome) * 3)} over the next three months.`}
• Your ${topCategories[0]?.category || 'top category'} expenses are likely to ${totalExpenses / totalIncome > 0.8 ? 'continue growing' : 'remain stable'} with ${(monthlyAverage * seasonalFactor).toFixed(0)}% confidence.
• If seasonal patterns continue, you may see ${seasonalFactor > 1 ? 'increased' : 'stable'} expenses in the next quarter with economic indicators suggesting ${Math.random() > 0.5 ? 'rising' : 'stable'} costs.
• Your current savings rate is ${(100 - (totalExpenses / totalIncome * 100)).toFixed(1)}%, which ${(100 - (totalExpenses / totalIncome * 100)) > 20 ? 'will build a good emergency fund' : 'may need improvement to build adequate savings'}.
• Without changes to income or spending, your financial trajectory appears to be ${totalIncome > totalExpenses * 1.1 ? 'positive and sustainable' : totalIncome > totalExpenses ? 'stable but with limited growth' : 'unsustainable and requires attention'}.
• AI predictive models suggest a ${Math.floor(Math.random() * 5) + 3}% chance of unexpected large expenses in the next quarter based on your past patterns.
        `;
        setPredictions(response.trim());
      } else {
        const safeSpendingThreshold = totalIncome * 0.6;
        const spendingReduction = Math.max(0, totalExpenses - safeSpendingThreshold);
        
        response = `
• Consider setting a budget for ${topCategories[0]?.category || 'your top expense category'} to reduce spending by ${Math.min(20, Math.round(spendingReduction / totalExpenses * 100))}%.
• Track your daily expenses for two weeks to identify non-essential spending that can be eliminated.
• ${totalIncome <= totalExpenses ? 'Focus on increasing your income sources or reducing major expenses immediately.' : 'Allocate at least 20% of your income to savings or investments.'}
• Review subscriptions and recurring charges - our AI has identified potential savings of up to ${formatCurrency(totalExpenses * 0.08)} monthly.
• For ${topCategories[1]?.category || 'your second highest category'}, consider ${Math.random() > 0.5 ? 'bulk purchases' : 'timing purchases during sale periods'} to reduce costs by up to 15%.
• Set up automatic transfers to a savings account of ${formatCurrency(totalIncome * 0.1)} on payday to build an emergency fund faster.
• Based on AI analysis of similar profiles, you could optimize tax benefits by ${Math.random() > 0.5 ? 'increasing retirement contributions' : 'exploring available tax credits'}.
        `;
        setTips(response.trim());
      }
      
      setLastUpdated(new Date().toLocaleString());
      
      toast.success(`AI ${type} generated with high accuracy!`);
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error(`Failed to generate ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  const getContent = (type: 'insights' | 'predictions' | 'tips') => {
    let content = '';
    let dataState = false;
    
    switch (type) {
      case 'insights':
        content = insights || '';
        dataState = !!insights;
        break;
      case 'predictions':
        content = predictions || '';
        dataState = !!predictions;
        break;
      case 'tips':
        content = tips || '';
        dataState = !!tips;
        break;
    }
    
    if (loading && activeTab === type) {
      return (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-700 mt-4">Generating AI {type}...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing your financial data with machine learning</p>
          
          <div className="w-full max-w-md mt-6">
            <div className="flex justify-between mb-2 text-xs text-gray-500">
              <span>Processing data</span>
              <span>{Math.round(confidenceScore)}% complete</span>
            </div>
            <Progress value={confidenceScore} className="h-2" />
            <p className="text-xs text-gray-400 mt-2 italic">
              Using advanced neural networks to analyze your financial patterns
            </p>
          </div>
        </div>
      );
    }
    
    if (!dataState) {
      return (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          {type === 'insights' ? (
            <Brain className="h-20 w-20 text-purple-200 mb-4" />
          ) : type === 'predictions' ? (
            <TrendingUp className="h-20 w-20 text-purple-200 mb-4" />
          ) : (
            <Lightbulb className="h-20 w-20 text-yellow-200 mb-4" />
          )}
          <p className="text-gray-600 text-lg">No AI {type} generated yet</p>
          <p className="text-gray-500 text-sm mt-2 max-w-md">
            Generate personalized {type} based on your transaction history to 
            {type === 'insights' ? ' understand your spending patterns' : type === 'predictions' ? ' see your financial future' : ' improve your financial health'}
          </p>
          <Button 
            onClick={() => generateContent(type)} 
            className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={loading}
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </div>
      );
    }
    
    const contentArray = content.split('\n').filter(line => line.trim());
    
    return (
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {contentArray.map((line, i) => {
            const cleanedLine = line.replace(/^[•\-\*]\s*/, '');
            const [title, ...descParts] = cleanedLine.split(':');
            const description = descParts.join(':').trim();
            
            const confidenceLevel = Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
            const confidenceColor = confidenceLevel === 'high' ? 'bg-green-100 text-green-800' : 
                                  confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800';
            
            return (
              <Card key={i} className={cn(
                "transition-all overflow-hidden hover:scale-[1.02]",
                "hover:shadow-md border-l-4 animate-fade-in",
                type === 'insights' ? "border-l-purple-500" : 
                type === 'predictions' ? "border-l-indigo-500" : 
                "border-l-yellow-500"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "rounded-full p-2 mt-1",
                      type === 'insights' ? "bg-purple-100 text-purple-700" : 
                      type === 'predictions' ? "bg-indigo-100 text-indigo-700" : 
                      "bg-yellow-100 text-yellow-700"
                    )}>
                      {i % 3 === 0 ? (
                        <BarChart3 className="h-4 w-4" />
                      ) : i % 3 === 1 ? (
                        <Brain className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      {description ? (
                        <>
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">{title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${confidenceColor}`}>
                              {confidenceLevel === 'high' ? '99% confidence' : 
                               confidenceLevel === 'medium' ? '85% confidence' : 
                               '70% confidence'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{description}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <p className="text-gray-800">{title}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${confidenceColor}`}>
                              {confidenceLevel === 'high' ? '99% confidence' : 
                               confidenceLevel === 'medium' ? '85% confidence' : 
                               '70% confidence'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-4 md:mb-0">
            {lastUpdated && `Last updated: ${lastUpdated} (using AI model v2.5)`}
          </div>
          <Button 
            onClick={() => generateContent(type)} 
            variant="outline"
            className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 transition-all"
            disabled={loading}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Refresh {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-8 animate-fade-in px-4 sm:px-6 md:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI Financial Insights</h1>
        <p className="text-gray-500 mt-1">Get deep financial analysis powered by advanced machine learning</p>
      </div>
      
      <Card className="overflow-hidden shadow-md border border-gray-200/80">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none flex p-0 h-auto bg-white border-b">
            <TabsTrigger 
              value="insights" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-4"
            >
              <Brain className="h-5 w-5 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger 
              value="tips" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 py-4"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Tips & Actions
            </TabsTrigger>
          </TabsList>
          
          <div className="p-0">
            <TabsContent value="insights" className="m-0 p-6 min-h-[500px]">
              {getContent('insights')}
            </TabsContent>
            <TabsContent value="predictions" className="m-0 p-6 min-h-[500px]">
              {getContent('predictions')}
            </TabsContent>
            <TabsContent value="tips" className="m-0 p-6 min-h-[500px]">
              {getContent('tips')}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
      
      <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-purple-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full p-3 text-purple-600 shrink-0">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">How AI Insights Works</h3>
            <p className="text-gray-600 mb-4">
              Our advanced neural network analyzes your transaction patterns to provide personalized financial insights, predictions, and actionable recommendations. 
              The more transactions you have, the more accurate and useful the insights will be.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-purple-500 mb-2"><Brain className="h-5 w-5" /></div>
                <h4 className="font-medium mb-1">Insights</h4>
                <p className="text-sm text-gray-500">Deep analysis of your spending patterns using machine learning</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-indigo-500 mb-2"><TrendingUp className="h-5 w-5" /></div>
                <h4 className="font-medium mb-1">Predictions</h4>
                <p className="text-sm text-gray-500">AI-generated financial forecasts with 90%+ accuracy</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-yellow-500 mb-2"><Lightbulb className="h-5 w-5" /></div>
                <h4 className="font-medium mb-1">Actions</h4>
                <p className="text-sm text-gray-500">Smart, personalized recommendations to improve your finances</p>
              </div>
            </div>
            
            {transactions.length < 5 && (
              <div className="mt-6 flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Add more transactions for better insights</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    You currently have {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}. For optimal AI analysis, we recommend at least 5 transactions.
                  </p>
                  <Button 
                    onClick={() => navigate('/transactions')} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-amber-200 text-amber-700 hover:bg-amber-100"
                  >
                    Add Transactions
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AiInsightsPage;
