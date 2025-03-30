
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AiInsightsPage from '@/components/ai-insights/AiInsightsPage';
import { Helmet } from 'react-helmet-async';

const AiInsights = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>AI Insights | finAI</title>
      </Helmet>
      <AiInsightsPage />
    </MainLayout>
  );
};

export default AiInsights;
