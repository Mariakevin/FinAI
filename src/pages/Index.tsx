
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, User, CreditCard, Sparkles, TrendingUp, CheckCircle, BarChart, Shield, Zap, Lock, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from '@/components/ui/animated';
import PiggyBank from '@/components/ui/PiggyBank';

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
      {/* Hero Section with Gradient Background */}
      <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden">
        {/* Gradient background with animated circles */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 to-purple-100 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-300/20 animate-pulse-light"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-indigo-300/20 animate-pulse-light" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-pink-300/20 animate-pulse-light" style={{ animationDelay: '2s' }}></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(113, 99, 186, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
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
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
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
      </div>

      {/* Features Section with Card Design */}
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
      
      {/* Benefits Section with Alternating Layout */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique benefits to help you succeed financially
            </p>
          </motion.div>
          
          {[
            {
              title: "Save Smarter",
              description: "Our AI analyzes your spending patterns and suggests personalized saving strategies that fit your lifestyle.",
              icon: <PiggyBank className="h-12 w-12 text-indigo-600" />,
              align: "right",
              points: [
                { icon: <DollarSign className="h-5 w-5 text-green-500 mr-2" />, text: "Automated savings recommendations" },
                { icon: <Zap className="h-5 w-5 text-green-500 mr-2" />, text: "Smart goal-based saving plans" },
                { icon: <TrendingUp className="h-5 w-5 text-green-500 mr-2" />, text: "Personalized spending insights" }
              ]
            },
            {
              title: "Insightful Analytics",
              description: "Transform complex financial data into easy-to-understand visualizations that help you make better decisions.",
              icon: <BarChart className="h-12 w-12 text-purple-600" />,
              align: "left",
              points: [
                { icon: <BarChart className="h-5 w-5 text-purple-500 mr-2" />, text: "Interactive spending charts" },
                { icon: <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />, text: "Predictive trend analysis" },
                { icon: <Sparkles className="h-5 w-5 text-purple-500 mr-2" />, text: "AI-driven financial forecasting" }
              ]
            },
            {
              title: "Secure & Private",
              description: "Your financial data is protected with bank-level encryption and strict privacy controls.",
              icon: <Shield className="h-12 w-12 text-blue-600" />,
              align: "right",
              points: [
                { icon: <Lock className="h-5 w-5 text-blue-500 mr-2" />, text: "End-to-end data encryption" },
                { icon: <Shield className="h-5 w-5 text-blue-500 mr-2" />, text: "Robust privacy controls" },
                { icon: <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />, text: "Compliance with financial regulations" }
              ]
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${benefit.align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center mb-20 gap-8`}
              initial={{ opacity: 0, x: benefit.align === 'left' ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex-1">
                <div className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-purple-100 to-indigo-100' : 'from-indigo-100 to-blue-100'} p-8 rounded-2xl h-64 flex items-center justify-center`}>
                  {benefit.icon}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-lg text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-3">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="flex items-center">
                      {point.icon}
                      <span className="text-gray-700">{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their financial health
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This app has completely changed how I manage my finances. The insights are incredibly valuable!",
                name: "Sarah J.",
                role: "Small Business Owner",
                delay: 0
              },
              {
                quote: "I've tried many finance apps, but this one stands out with its AI capabilities and clean design.",
                name: "Michael T.",
                role: "Marketing Professional",
                delay: 0.2
              },
              {
                quote: "The personalized savings recommendations helped me save for my dream vacation in just 6 months!",
                name: "Elena R.",
                role: "Healthcare Worker",
                delay: 0.4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 text-purple-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104-6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.855-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
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
