
import { memo } from 'react';
import Layout from '@/components/layout/Layout';
import ProfilePage from '@/components/profile/ProfilePage';
import { Helmet } from 'react-helmet-async';

// No need for additional auth logic since Layout already handles it
const Profile = () => {
  return (
    <Layout requireAuth={true}>
      <Helmet>
        <title>Profile | FinWise</title>
        <meta name="description" content="Manage your profile settings and account information" />
      </Helmet>
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <ProfilePage />
      </div>
    </Layout>
  );
};

export default memo(Profile);
