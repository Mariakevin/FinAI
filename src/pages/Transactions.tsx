
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionsTable from '@/components/transactions/TransactionsTable';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';

const Transactions = () => {
  return (
    <>
      <Helmet>
        <title>Transactions | FinAI</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500 mt-1">Track and manage your financial transactions</p>
          </div>
          <AddTransactionModal />
        </div>

        <TransactionsTable />
      </div>
    </>
  );
};

export default Transactions;
