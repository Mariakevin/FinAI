
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Landmark, User, BarChart, Receipt, Settings, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AI-Powered Finance Tracker
          </h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Easily track your finances, analyze spending patterns, and get AI-powered insights to better manage your money.
          </p>
          
          {!isAuthenticated && (
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/login">
                <Button size="lg">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Landmark className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Dashboard</h3>
                <p className="text-gray-600 mb-4">Get a quick overview of your finances with summaries and visual charts.</p>
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button className="mt-2">
                    {isAuthenticated ? "View Dashboard" : "Sign in to continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Transactions</h3>
                <p className="text-gray-600 mb-4">Record and manage your income and expenses with easy categorization.</p>
                <Link to={isAuthenticated ? "/transactions" : "/login"}>
                  <Button className="mt-2" variant="secondary">
                    {isAuthenticated ? "Manage Transactions" : "Sign in to continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Analytics</h3>
                <p className="text-gray-600 mb-4">Visualize your spending patterns and get insights to optimize your budget.</p>
                <Link to={isAuthenticated ? "/analytics" : "/login"}>
                  <Button className="mt-2" variant="outline">
                    {isAuthenticated ? "View Analytics" : "Sign in to continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">Profile</h3>
                <p className="text-gray-600 mb-4">Manage your personal information and account preferences.</p>
                <Link to={isAuthenticated ? "/profile" : "/login"}>
                  <Button className="mt-2" variant="outline">
                    {isAuthenticated ? "View Profile" : "Sign in to continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
