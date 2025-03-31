
import React from 'react';
import EnhancedAIInsights from '@/components/ai-insights/EnhancedAIInsights';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const AiInsights = () => {
  return (
    <Layout requireAuth={true}>
      <Helmet>
        <title>AI Insights | FinWise</title>
        <meta name="description" content="Get AI-powered insights about your financial habits" />
      </Helmet>
      <div className="w-full max-w-6xl mx-auto">
        <EnhancedAIInsights />
      </div>
    </Layout>
  );
};

export default AiInsights;
