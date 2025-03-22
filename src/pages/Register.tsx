
import { memo } from 'react';
import RegisterPage from '@/components/auth/RegisterPage';
import AuthLayout from '@/components/layout/AuthLayout';
import { Helmet } from 'react-helmet-async';

const Register = () => {
  return (
    <AuthLayout>
      <Helmet>
        <title>Create Account | FinWise</title>
        <meta name="description" content="Create a new FinWise account to start managing your finances" />
      </Helmet>
      <RegisterPage />
    </AuthLayout>
  );
};

export default memo(Register);
