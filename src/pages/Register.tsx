
import React from 'react';
import RegisterPage from '@/components/auth/RegisterPage';
import AuthLayout from '@/components/layout/AuthLayout';

const Register = () => {
  return (
    <AuthLayout>
      <RegisterPage />
    </AuthLayout>
  );
};

export default Register;
