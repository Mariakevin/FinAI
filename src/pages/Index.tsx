
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, User, CreditCard, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import FinancialScene from '@/components/home/FinancialScene';
import { motion, AnimatePresence } from '@/components/ui/animated';

const Index = () => {
  const { isAuthenticated } = useAuth();

  // Intersection Observer setup for animations
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

    const animateElements = document.querySelectorAll('.feature-item');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section with 3D Visual */}
      <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden">
        {/* Improved 3D Scene */}
        <div className="absolute inset-0 -z-10">
          <FinancialScene />
        </div>
        
        {/* Content overlay with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto px-4 z-10"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600 mb-6 backdrop-blur-sm border border-purple-200/20">
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Financial Insights</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6 tracking-tight">
            Master Your Finances
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 px-4 py-2 rounded-lg">
            Visualize, analyze, and optimize your financial journey with intelligent AI insights and beautiful analytics.
          </p>
          
          <AnimatePresence>
            {!isAuthenticated ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link to="/login">
                  <Button size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                    <LogIn className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="group w-full sm:w-auto border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-300">
                    <User className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                    <span>Create Account</span>
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-purple-400 flex items-start justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {[
              {
                icon: <CreditCard className="h-8 w-8 text-purple-600" />,
                title: "Smart Transaction Tracking",
                description: "Automatically categorize and track your spending patterns with AI-powered insights.",
                delay: 0
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
                title: "Visual Analytics",
                description: "Beautiful charts and graphs that help you visualize your financial health at a glance.",
                delay: 0.2
              },
              {
                icon: <Sparkles className="h-8 w-8 text-blue-600" />,
                title: "AI-Powered Insights",
                description: "Get personalized recommendations and forecasts to optimize your financial decisions.",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your finances?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-indigo-100">
            Join thousands of users who have taken control of their financial future with Finwise.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/register">
              <Button size="lg" variant="secondary" className="group text-indigo-700 hover:text-indigo-800 bg-white hover:bg-indigo-50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <span className="font-medium">Get Started For Free</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
