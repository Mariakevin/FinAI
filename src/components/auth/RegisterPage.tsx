
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PasswordField } from '@/components/auth/PasswordField';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    setEmailError('');
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) validateEmail(newEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await register(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Create account
        </h1>
        <p className="mt-2 text-gray-600">Start your financial journey today</p>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg relative will-change-transform">
        {/* Gradient border at top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
        
        {/* Background blurs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-80 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full opacity-80 blur-3xl" />
        
        <CardHeader className="space-y-1 pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Enter your details below
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
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                    emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
            
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              label="Password"
            />
          </CardContent>
          
          <CardFooter>
            <div className="w-full space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 will-change-transform"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
