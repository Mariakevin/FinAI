
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-200/20 to-blue-300/20 rounded-tr-full"></div>
      
      <header className="relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Finwise
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>
      
      <footer className="relative z-10 py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Finwise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
