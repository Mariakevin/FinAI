
import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginPage from '@/components/auth/LoginPage';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login | FinAI</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center">
        <LoginPage />
      </div>
    </>
  );
};

export default Login;
