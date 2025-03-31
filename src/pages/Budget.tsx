
import { memo } from 'react';
import { Layout } from '@/components/layout/Layout';
import BudgetPage from '@/components/budget/BudgetPage';
import { Helmet } from 'react-helmet-async';
import { SidebarProvider } from '@/components/ui/sidebar';

const Budget = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>Budget | FinWise</title>
        <meta name="description" content="Manage your budgets and track spending against limits" />
      </Helmet>
      <BudgetPage />
    </div>
  );
};

export default memo(Budget);
