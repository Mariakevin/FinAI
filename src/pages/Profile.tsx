
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProfilePage from '@/components/profile/ProfilePage';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-blue-50/30 to-white">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout requireAuth={true}>
      <ProfilePage />
    </Layout>
  );
};

export default Profile;
