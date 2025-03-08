
import React from 'react';
import LoginPage from '@/components/auth/LoginPage';
import AuthLayout from '@/components/layout/AuthLayout';

const Login = () => {
  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  );
};

export default Login;
