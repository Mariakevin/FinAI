
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProfilePage from '@/components/profile/ProfilePage';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not loading and not authenticated, redirect to login page
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-gray-600">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  // Only render ProfilePage if authenticated
  return (
    <Layout>
      {isAuthenticated ? (
        <ProfilePage />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-gray-600">Redirecting to login...</div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
