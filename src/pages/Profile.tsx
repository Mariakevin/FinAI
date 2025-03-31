
import { memo } from 'react';
import { Layout } from '@/components/layout/Layout';
import ProfilePage from '@/components/profile/ProfilePage';
import { Helmet } from 'react-helmet-async';
import { SidebarProvider } from '@/components/ui/sidebar';

const Profile = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>Profile | FinWise</title>
        <meta name="description" content="Manage your profile settings and account information" />
      </Helmet>
      <ProfilePage />
    </div>
  );
};

export default memo(Profile);
