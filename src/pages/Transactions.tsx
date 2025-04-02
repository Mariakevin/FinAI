
import { memo } from 'react';
import TransactionPage from '@/components/transactions/TransactionPage';
import { Helmet } from 'react-helmet-async';

const Transactions = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>Transactions | FinWise</title>
        <meta name="description" content="Manage and track your financial transactions" />
      </Helmet>
      <TransactionPage />
    </div>
  );
};

export default memo(Transactions);
