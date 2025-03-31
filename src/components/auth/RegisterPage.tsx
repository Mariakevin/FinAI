
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, Shield, Sparkles, User, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PasswordField } from '@/components/auth/PasswordField';
import { motion } from '@/components/ui/animated';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const validateName = (name: string) => {
    setNameError('');
    if (!name.trim()) {
      setNameError('Please enter your name');
      return false;
    }
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) validateEmail(newEmail);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (newName) validateName(newName);
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isNameValid = validateName(name);
    
    if (password.length < 8) {
      setGeneralError('Password must be at least 8 characters');
      return false;
    }

    return isEmailValid && isNameValid && password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(email, password, name);
      if (success) {
        toast.success('Account created successfully! Welcome to FinWise.');
        navigate('/dashboard');
      } else {
        setGeneralError('Failed to create account. The email may already be registered.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setGeneralError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Create account
        </h1>
        <p className="mt-2 text-gray-600">Start your AI-powered financial journey today</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg relative will-change-transform">
          {/* Gradient border at top */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
          
          {/* Background blurs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-80 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full opacity-80 blur-3xl" />
          
          <CardHeader className="space-y-1 pb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="flex justify-center mb-2"
            >
              <div className="p-2 bg-blue-50 rounded-xl">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
            </motion.div>
            <CardTitle className="text-xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Enter your details below
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {generalError}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              {/* Name field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={handleNameChange}
                    onBlur={() => validateName(name)}
                    className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      nameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                  />
                </div>
                {nameError && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {nameError}
                  </motion.p>
                )}
              </motion.div>
              
              {/* Email field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
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
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {emailError}
                  </motion.p>
                )}
              </motion.div>
              
              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <PasswordField
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (generalError) setGeneralError('');
                  }}
                  id="password"
                  label="Password"
                  showStrength={true}
                />
              </motion.div>
            </CardContent>
            
            <CardFooter>
              <div className="w-full space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="w-full"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 will-change-transform group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="space-y-3"
                >
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="flex-shrink-0 rounded-full bg-green-100 p-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </span>
                      AI-powered financial insights and recommendations
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="flex-shrink-0 rounded-full bg-green-100 p-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </span>
                      Secure and encrypted personal data
                    </li>
                  </ul>
                  
                  <p className="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-center text-xs text-gray-500 mt-8"
      >
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </motion.p>
    </div>
  );
};

export default RegisterPage;
