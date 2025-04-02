
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, TrendingUp, LineChart, Brain } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>FinAI - AI-Powered Financial Management</title>
      </Helmet>
      
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full flex items-center justify-center gap-1 w-fit mx-auto mb-6">
              <Sparkles className="h-3 w-3" /> AI-Powered Finance
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Manage your finances with AI precision
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            FinAI uses artificial intelligence to analyze your spending patterns, provide personalized insights, and help you make smarter financial decisions.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link to="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">
                Login to Account
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Track & Analyze</h3>
              <p className="text-gray-500">Monitor transactions and spending patterns with powerful analytics.</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-indigo-100 rounded-full mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">AI Insights</h3>
              <p className="text-gray-500">Get personalized financial recommendations powered by artificial intelligence.</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-full mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Secure & Private</h3>
              <p className="text-gray-500">Your financial data is encrypted and never shared with third parties.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Index;
