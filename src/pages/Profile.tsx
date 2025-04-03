
import { memo } from 'react';
import ProfilePage from '@/components/profile/ProfilePage';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  return (
    <div className="w-full">
      <Helmet>
        <title>Profile | FinAI</title>
        <meta name="description" content="Manage your profile settings and account information" />
      </Helmet>
      <ProfilePage />
    </div>
  );
};

export default memo(Profile);
