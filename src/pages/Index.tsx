
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, User, CreditCard, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import FinancialScene from '@/components/home/FinancialScene';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll('.feature-item');
    featureElements.forEach((el) => observer.observe(el));

    return () => {
      featureElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section with 3D Visual */}
      <div 
        ref={heroRef} 
        className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* 3D Financial Scene */}
        <div className="absolute inset-0 -z-10">
          <FinancialScene />
        </div>
        
        {/* Content overlay */}
        <div className="text-center max-w-3xl mx-auto px-4 z-10 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 mb-6 backdrop-blur-sm border border-blue-200/20">
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Financial Insights</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight">
            Master Your Finances
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 px-4 py-2 rounded-lg">
            Visualize, analyze, and optimize your financial journey with intelligent AI insights and beautiful analytics.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/login">
                <Button size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <LogIn className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto border-2 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-300">
                  <User className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Create Account</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="animate-pulse-light bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group">
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-gray-400 flex items-start justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            <div className="feature-item opacity-0 p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Transaction Tracking</h3>
              <p className="text-gray-600">
                Automatically categorize and track your spending patterns with AI-powered insights.
              </p>
            </div>
            
            <div className="feature-item opacity-0 p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col items-center text-center" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Analytics</h3>
              <p className="text-gray-600">
                Beautiful charts and graphs that help you visualize your financial health at a glance.
              </p>
            </div>
            
            <div className="feature-item opacity-0 p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col items-center text-center" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and forecasts to optimize your financial decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your finances?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join thousands of users who have taken control of their financial future with Finwise.
          </p>
          
          <Link to="/register">
            <Button size="lg" variant="secondary" className="group text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <span className="font-medium">Get Started For Free</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
