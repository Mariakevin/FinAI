
import { memo } from 'react';
import Layout from '@/components/layout/Layout';
import TransactionPage from '@/components/transactions/TransactionPage';
import { Helmet } from 'react-helmet-async';

const Transactions = () => {
  return (
    <Layout requireAuth={true}>
      <Helmet>
        <title>Transactions | FinWise</title>
        <meta name="description" content="Manage and track your financial transactions" />
      </Helmet>
      <TransactionPage />
    </Layout>
  );
};

export default memo(Transactions);
