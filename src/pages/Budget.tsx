
import React from 'react';
import Layout from '@/components/layout/Layout';
import BudgetPage from '@/components/budget/BudgetPage';
import { Helmet } from 'react-helmet-async';

const Budget = () => {
  return (
    <Layout>
      <Helmet>
        <title>Budget | FinWise</title>
        <meta name="description" content="Manage your budgets and track spending against limits" />
      </Helmet>
      <BudgetPage />
    </Layout>
  );
};

export default Budget;
