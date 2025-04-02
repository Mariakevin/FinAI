
import { memo } from 'react';
import BudgetPage from '@/components/budget/BudgetPage';
import { Helmet } from 'react-helmet-async';

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
