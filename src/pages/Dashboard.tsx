
import { memo } from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>Dashboard | FinAI</title>
        <meta name="description" content="Your financial overview dashboard" />
      </Helmet>
      <DashboardPage />
    </div>
  );
};

export default memo(Dashboard);
