
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PasswordField } from '@/components/auth/PasswordField';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { login, requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isForgotPassword) {
        const success = await requestPasswordReset(email);
        if (success) {
          setResetEmailSent(true);
          toast.success("Password reset instructions sent to your email");
        }
      } else {
        const success = await login(email, password);
        if (success) {
          navigate('/dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setResetEmailSent(false);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {isForgotPassword ? 'Reset Password' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isForgotPassword 
            ? 'Enter your email to reset your password' 
            : 'Access your financial dashboard'}
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg relative">
        {/* Gradient border at top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
        
        {/* Background blurs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-80 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full opacity-80 blur-3xl" />
        
        <CardHeader className="space-y-1 pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-center">
            {isForgotPassword ? 'Reset Password' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-center">
            {isForgotPassword 
              ? 'We\'ll send you instructions via email' 
              : 'Enter your credentials below'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button 
                    type="button" 
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleForgotPassword();
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordField
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <div className="w-full space-y-4">
              {resetEmailSent ? (
                <div className="text-center space-y-4">
                  <p className="text-green-600">Check your email for reset instructions</p>
                  <Button 
                    type="button" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 will-change-transform"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                  >
                    Back to login
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 will-change-transform"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (isForgotPassword ? 'Sending...' : 'Signing in...') 
                      : (isForgotPassword ? 'Send reset instructions' : 'Sign in')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {isForgotPassword ? (
                    <p className="text-center text-sm text-gray-600">
                      <button 
                        type="button" 
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleForgotPassword();
                        }}
                      >
                        Back to login
                      </button>
                    </p>
                  ) : (
                    <p className="text-center text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                        Create an account
                      </Link>
                    </p>
                  )}
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
