
import React from 'react';
import AiInsightsPage from '@/components/ai-insights/AiInsightsPage';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const AiInsights = () => {
  return (
    <Layout requireAuth={true}>
      <Helmet>
        <title>AI Insights | FinWise</title>
        <meta name="description" content="Get AI-powered insights about your financial habits" />
      </Helmet>
      <AiInsightsPage />
    </Layout>
  );
};

export default AiInsights;
