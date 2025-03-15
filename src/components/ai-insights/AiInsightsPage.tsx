
import React, { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, TrendingUp, Lightbulb, Loader2, Brain, BrainCircuit, ArrowDownCircle, BarChart3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/finance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AiInsightsPage = () => {
  const { transactions } = useTransactions();
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string | null>(null);
  const [tips, setTips] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Check if we need to generate insights automatically
  useEffect(() => {
    if (transactions.length > 0 && !insights && !loading) {
      // Only auto-generate for the first tab on initial load
      generateContent('insights');
    }
  }, [transactions]);
  
  const generateContent = async (type: 'insights' | 'predictions' | 'tips') => {
    if (transactions.length === 0) {
      toast.error('You need some transactions before generating AI insights');
      return;
    }
    
    setLoading(true);
    setActiveTab(type);
    
    try {
      // Create a summary of the user's financial data
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      // Get top 5 expense categories
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
        
      // Create a financial summary
      const financialSummary = {
        totalIncome: formatCurrency(totalIncome),
        totalExpenses: formatCurrency(totalExpenses),
        balance: formatCurrency(totalIncome - totalExpenses),
        topExpenseCategories: topCategories.map(
          c => `${c.category}: ${formatCurrency(c.amount)}`
        ),
        transactionCount: transactions.length,
      };
      
      // Prepare the prompt based on the type of content requested
      let prompt = '';
      
      if (type === 'insights') {
        prompt = `Based on this financial data: ${JSON.stringify(financialSummary)}, 
          provide 3-5 specific insights about the spending patterns. 
          Focus on identifying unusual spending, potential savings opportunities, and general financial health.
          Format your response in bullet points and keep it concise.`;
      } else if (type === 'predictions') {
        prompt = `Based on this financial data: ${JSON.stringify(financialSummary)}, 
          predict the future financial trends for this user in the next 3 months.
          Consider seasonal spending patterns, current saving/spending rate, and potential financial risks.
          Format your response in bullet points and keep it concise.`;
      } else {
        prompt = `Based on this financial data: ${JSON.stringify(financialSummary)}, 
          provide 3-5 actionable tips to improve financial health.
          Focus on specific advice that could help the user save money, reduce spending in top categories, 
          or improve their overall financial situation.
          Format your response in bullet points and keep it concise.`;
      }
      
      // In a real application, this would be a call to the Gemini API
      // For this demo, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate response based on type
      let response = '';
      
      if (type === 'insights') {
        response = `
• Your largest expense category is ${topCategories[0]?.category || 'unknown'}, accounting for ${((topCategories[0]?.amount || 0) / totalExpenses * 100).toFixed(1)}% of your total spending.
• Your spending to income ratio is ${(totalExpenses / totalIncome * 100).toFixed(1)}%, which is ${totalExpenses / totalIncome < 0.7 ? 'healthy' : 'higher than recommended'}.
• You have ${transactions.filter(t => t.type === 'income').length} income sources and ${transactions.filter(t => t.type === 'expense').length} expense transactions.
• Your average transaction size is ${formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)}.
• ${totalIncome > totalExpenses ? `You're saving ${formatCurrency(totalIncome - totalExpenses)}, which is positive!` : `You're spending more than you earn by ${formatCurrency(totalExpenses - totalIncome)}, which is concerning.`}
        `;
        setInsights(response.trim());
      } else if (type === 'predictions') {
        response = `
• Based on your current spending pattern, you're projected to ${totalIncome > totalExpenses ? `save approximately ${formatCurrency((totalIncome - totalExpenses) * 3)} over the next three months.` : `have a deficit of approximately ${formatCurrency((totalExpenses - totalIncome) * 3)} over the next three months.`}
• Your ${topCategories[0]?.category || 'top category'} expenses are likely to remain your largest spending area.
• If seasonal patterns continue, you may see increased expenses in Q4 due to holiday shopping and travel.
• Your current savings rate is ${(100 - (totalExpenses / totalIncome * 100)).toFixed(1)}%, which ${(100 - (totalExpenses / totalIncome * 100)) > 20 ? 'will build a good emergency fund' : 'may need improvement to build adequate savings'}.
• Without changes to income or spending, your financial trajectory appears to be ${totalIncome > totalExpenses * 1.1 ? 'positive and sustainable' : totalIncome > totalExpenses ? 'stable but with limited growth' : 'unsustainable and requires attention'}.
        `;
        setPredictions(response.trim());
      } else {
        response = `
• Consider setting a budget for ${topCategories[0]?.category || 'your top expense category'} to reduce spending by 15-20%.
• Track your daily expenses for two weeks to identify non-essential spending that can be eliminated.
• ${totalIncome <= totalExpenses ? 'Focus on increasing your income sources or reducing major expenses immediately.' : 'Allocate at least 20% of your income to savings or investments.'}
• Review subscriptions and recurring charges - eliminate those you rarely use.
• For ${topCategories[1]?.category || 'your second highest category'}, look for discounts, bulk purchases, or alternatives to reduce costs.
• Set up automatic transfers to a savings account on payday before you can spend the money.
        `;
        setTips(response.trim());
      }
      
      // Set the last updated timestamp
      setLastUpdated(new Date().toLocaleString());
      
      toast.success(`AI ${type} generated successfully!`);
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
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-700 mt-4">Generating AI {type}...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing your financial data</p>
        </div>
      );
    }
    
    if (!dataState) {
      return (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          {type === 'insights' ? (
            <Brain className="h-20 w-20 text-blue-200 mb-4" />
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
            className="mt-6"
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
            // Remove bullet point if present
            const cleanedLine = line.replace(/^[•\-\*]\s*/, '');
            // Split by colon to get title and description
            const [title, ...descParts] = cleanedLine.split(':');
            const description = descParts.join(':').trim();
            
            return (
              <Card key={i} className={cn(
                "transition-all overflow-hidden",
                "hover:shadow-md border-l-4",
                type === 'insights' ? "border-l-blue-500" : 
                type === 'predictions' ? "border-l-purple-500" : 
                "border-l-yellow-500"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "rounded-full p-2 mt-1",
                      type === 'insights' ? "bg-blue-100 text-blue-700" : 
                      type === 'predictions' ? "bg-purple-100 text-purple-700" : 
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
                    <div>
                      {description ? (
                        <>
                          <h4 className="font-medium text-gray-900">{title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{description}</p>
                        </>
                      ) : (
                        <p className="text-gray-800">{title}</p>
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
            {lastUpdated && `Last updated: ${lastUpdated}`}
          </div>
          <Button 
            onClick={() => generateContent(type)} 
            variant="outline"
            className="flex items-center gap-2"
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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Financial Insights</h1>
        <p className="text-gray-500 mt-1">Get personalized financial analysis, predictions, and tips</p>
      </div>
      
      <Card className="overflow-hidden shadow-sm border border-gray-200/80">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none flex p-0 h-auto bg-white border-b">
            <TabsTrigger 
              value="insights" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
            >
              <Brain className="h-5 w-5 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-4"
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
      
      <GlassCard className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-full p-3 text-blue-600">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">How AI Insights Works</h3>
            <p className="text-gray-600 mb-4">
              Our AI analyzes your transaction patterns to provide personalized financial insights, predictions, and actionable recommendations. 
              The more transactions you have, the more accurate the insights will be.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-blue-500 mb-2"><Brain className="h-5 w-5" /></div>
                <h4 className="font-medium mb-1">Insights</h4>
                <p className="text-sm text-gray-500">Analysis of your spending patterns and financial habits</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-purple-500 mb-2"><TrendingUp className="h-5 w-5" /></div>
                <h4 className="font-medium mb-1">Predictions</h4>
                <p className="text-sm text-gray-500">Future financial trends based on your historical data</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-yellow-500 mb-2"><Lightbulb className="h-5 w-5" /></div>
                <h4 className="font-medium mb-1">Actions</h4>
                <p className="text-sm text-gray-500">Personalized tips to improve your financial health</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AiInsightsPage;
