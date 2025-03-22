
import { memo } from 'react';
import LoginPage from '@/components/auth/LoginPage';
import AuthLayout from '@/components/layout/AuthLayout';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  return (
    <AuthLayout>
      <Helmet>
        <title>Sign In | FinWise</title>
        <meta name="description" content="Sign in to your FinWise account to manage your finances" />
      </Helmet>
      <LoginPage />
    </AuthLayout>
  );
};

export default memo(Login);
