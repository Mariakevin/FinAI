
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white lg:bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Brand area (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-600 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 opacity-10">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 800 800"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="a" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
              <path 
                fill="url(#a)" 
                d="M0 0h800v800H0z"
              />
              <g fill="#fff" fillOpacity=".4">
                <circle r="150" cx="400" cy="400"/>
                <circle r="100" cx="500" cy="300"/>
                <circle r="50" cx="300" cy="500"/>
                <circle r="75" cx="200" cy="200"/>
                <circle r="50" cx="600" cy="600"/>
                <circle r="25" cx="700" cy="300"/>
                <circle r="15" cx="250" cy="350"/>
                <circle r="40" cx="550" cy="450"/>
              </g>
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
            <div>
              <h1 className="text-4xl font-bold mb-6">FinWise</h1>
              <p className="text-xl font-light mb-8">
                The smart way to manage your finances with AI-powered insights
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <BrainIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI-Powered Analysis</h3>
                  </div>
                </div>
                <p className="text-white/80">
                  Our advanced AI analyzes your spending patterns and provides personalized insights to help you make better financial decisions.
                </p>
              </div>
              
              <div className="text-sm text-white/70">
                &copy; 2023 FinWise. All rights reserved.
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full">
            <div className="mb-6 flex justify-between items-center lg:hidden">
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Link>
              <div className="text-xl font-bold text-indigo-600">FinWise</div>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icons
const BrainIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 0 19.5v-15A2.5 2.5 0 0 1 2.5 2h7z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5h7a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 21.5 2h-7z"></path>
    <path d="M6 12h4"></path>
    <path d="M14 12h4"></path>
    <path d="M6 8h4"></path>
    <path d="M14 8h4"></path>
    <path d="M6 16h4"></path>
    <path d="M14 16h4"></path>
  </svg>
);

export default AuthLayout;
