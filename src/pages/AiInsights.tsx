
import React from 'react';
import Layout from '@/components/layout/Layout';
import AiInsightsPage from '@/components/ai-insights/AiInsightsPage';
import { Helmet } from 'react-helmet-async';

const AiInsights = () => {
  return (
    <Layout>
      <Helmet>
        <title>AI Insights | FinWise</title>
        <meta name="description" content="Get personalized financial analysis, predictions, and tips powered by AI" />
      </Helmet>
      <AiInsightsPage />
    </Layout>
  );
};

export default AiInsights;
