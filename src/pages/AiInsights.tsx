
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AiInsightsPage from '@/components/ai-insights/AiInsightsPage';

const AiInsights = () => {
  return (
    <>
      <Helmet>
        <title>AI Insights | FinAI</title>
      </Helmet>
      
      <AiInsightsPage />
    </>
  );
};

export default AiInsights;
