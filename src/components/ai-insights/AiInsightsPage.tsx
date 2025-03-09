
import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/finance';

const AiInsightsPage = () => {
  const { transactions } = useTransactions();
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string | null>(null);
  const [tips, setTips] = useState<string | null>(null);
  
  const generateContent = async (type: 'insights' | 'predictions' | 'tips') => {
    if (transactions.length === 0) {
      toast.error('You need some transactions before generating AI insights');
      return;
    }
    
    setLoading(true);
    
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">Generating AI {type}...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      );
    }
    
    if (!dataState) {
      return (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Bot className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-600">No AI {type} generated yet</p>
          <Button 
            onClick={() => generateContent(type)} 
            className="mt-4"
            disabled={loading}
          >
            Generate {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="py-4">
        <div className="whitespace-pre-line text-gray-700">
          {content.split('\n').map((line, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {line}
            </p>
          ))}
        </div>
        <Button 
          onClick={() => generateContent(type)} 
          className="mt-6"
          disabled={loading}
        >
          Regenerate {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Financial Insights</h1>
        <p className="text-gray-500 mt-1">Get personalized financial analysis, predictions, and tips</p>
      </div>
      
      <GlassCard className="p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none flex p-0 h-auto">
            <TabsTrigger 
              value="insights" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
            >
              <Bot className="h-5 w-5 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger 
              value="tips" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-4"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Tips
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="insights" className="m-0">
              {getContent('insights')}
            </TabsContent>
            <TabsContent value="predictions" className="m-0">
              {getContent('predictions')}
            </TabsContent>
            <TabsContent value="tips" className="m-0">
              {getContent('tips')}
            </TabsContent>
          </div>
        </Tabs>
      </GlassCard>
    </div>
  );
};

export default AiInsightsPage;
