
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] animate-fade-in">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
            AI-Powered Finance Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Easily track your finances and get AI-powered insights to better manage your money.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <User className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="animate-pulse-light">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Simple decorative elements */}
        <div className="absolute -z-10 opacity-20">
          <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
