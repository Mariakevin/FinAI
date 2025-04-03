
import React from 'react';
import EnhancedAIInsights from '@/components/ai-insights/EnhancedAIInsights';
import { Helmet } from 'react-helmet-async';

const AiInsights = () => {
  return (
    <div className="w-full mx-auto mt-6">
      <Helmet>
        <title>AI Insights | FinAI</title>
        <meta name="description" content="Get AI-powered insights about your financial habits" />
      </Helmet>
      <EnhancedAIInsights />
    </div>
  );
};

export default AiInsights;
