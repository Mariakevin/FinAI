import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, User, CreditCard, Sparkles, Shield, BarChart3, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from '@/components/ui/animated';
import PiggyBank from '@/components/ui/PiggyBank';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>FinAI - AI-Powered Financial Intelligence</title>
        <meta name="description" content="Visualize, analyze, and optimize your financial journey with intelligent AI insights and beautiful analytics." />
      </Helmet>
      
      <section className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 to-blue-100 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-teal-300/20 animate-pulse-light"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-blue-300/20 animate-pulse-light" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-orange-300/20 animate-pulse-light" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto px-4 z-10"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 text-teal-600 mb-6 backdrop-blur-sm border border-teal-200/20">
            <BrainCircuit className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Financial Intelligence</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-primary-600 bg-clip-text text-transparent mb-6 tracking-tight">
            Smart Finance with AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Leverage artificial intelligence to analyze your spending, optimize savings, and reach your financial goals faster.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <LogIn className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50/30 transition-all duration-300">
                  <User className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Create Account</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group">
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="container px-4 sm:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">AI-Powered Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intelligent tools to take control of your financial future
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BrainCircuit className="h-8 w-8 text-teal-600" />,
                title: "AI Spending Analysis",
                description: "Our AI examines your transactions to find patterns and suggest smart ways to save money."
              },
              {
                icon: <PiggyBank className="h-8 w-8 text-blue-600" />,
                title: "Predictive Savings",
                description: "AI algorithms predict your future expenses and help set optimal savings goals."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
                title: "Intelligent Insights",
                description: "Get personalized financial advice based on your unique spending habits and goals."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600 text-white w-full">
        <div className="container px-4 sm:px-8 mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your finances with AI?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-teal-100">
            Join thousands of users who have taken control of their financial future with FinAI.
          </p>
          
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" variant="secondary" className="group text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <span className="font-medium">{isAuthenticated ? "Go to Dashboard" : "Get Started For Free"}</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
