
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
      <DashboardPage />
    </Layout>
  );
};

export default memo(Dashboard);
