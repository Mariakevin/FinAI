
import React from 'react';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/components/dashboard/DashboardPage';

const Dashboard = () => {
  return (
    <Layout requireAuth={true}>
      <DashboardPage />
    </Layout>
  );
};

export default Dashboard;
