
import React from 'react';
import Layout from '@/components/layout/Layout';
import SettingsPage from '@/components/settings/SettingsPage';

const Settings = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SettingsPage />
      </div>
    </Layout>
  );
};

export default Settings;
