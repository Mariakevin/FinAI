
import { memo } from 'react';
import { Layout } from '@/components/layout/Layout';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Helmet } from 'react-helmet-async';
import { SidebarProvider } from '@/components/ui/sidebar';

const Dashboard = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>Dashboard | FinWise</title>
        <meta name="description" content="Your financial overview dashboard" />
      </Helmet>
      <DashboardPage />
    </div>
  );
};

export default memo(Dashboard);
