
import { memo } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <Layout requireAuth={true}>
      <Helmet>
        <title>Dashboard | FinWise</title>
        <meta name="description" content="Your financial overview dashboard" />
      </Helmet>
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <DashboardPage />
      </div>
    </Layout>
  );
};

export default memo(Dashboard);
