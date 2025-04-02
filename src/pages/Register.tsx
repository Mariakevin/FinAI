
import React from 'react';
import { Helmet } from 'react-helmet-async';
import RegisterPage from '@/components/auth/RegisterPage';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Register | FinAI</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center">
        <RegisterPage />
      </div>
    </>
  );
};

export default Register;
