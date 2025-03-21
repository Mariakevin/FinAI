
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfilePage from '@/components/profile/ProfilePage';

const Profile = () => {
  return (
    <Layout requireAuth={true}>
      <ProfilePage />
    </Layout>
  );
};

export default Profile;
