
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import SettingsPage from '@/components/settings/SettingsPage';
import { Helmet } from 'react-helmet-async';
import { SidebarProvider } from '@/components/ui/sidebar';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Settings | FinWise</title>
        <meta name="description" content="Manage your account preferences and settings" />
      </Helmet>
      <SettingsPage />
    </div>
  );
};

export default Settings;
