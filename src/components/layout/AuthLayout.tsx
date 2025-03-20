
import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Coins, PiggyBank, DollarSign } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simplified decorative elements for better performance
  const decorativeElements = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 6,
      x: Math.random() * 100,
      y: Math.random() * 100,
      hue: Math.floor(Math.random() * 60) + 200,
      saturation: Math.floor(Math.random() * 20) + 70,
      lightness: Math.floor(Math.random() * 15) + 75,
      delay: i * 0.5,
    })),
  []);

  // Financial icons - simplified for better performance
  const financialIcons = useMemo(() => [
    { icon: <CreditCard size={22} className="text-blue-400/20" />, delay: 0 },
    { icon: <Coins size={22} className="text-indigo-400/20" />, delay: 1.5 },
    { icon: <PiggyBank size={22} className="text-purple-400/20" />, delay: 3 },
    { icon: <DollarSign size={22} className="text-green-400/20" />, delay: 4.5 }
  ], []);

  // Set loaded state for initial animations
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col overflow-hidden">
      {/* Optimized background elements */}
      <div className="fixed inset-0 z-0">
        {/* Colorful gradient orbs - reduced quantity for better performance */}
        {decorativeElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full opacity-20 animate-pulse-light will-change-transform"
            style={{
              width: `${el.size}rem`,
              height: `${el.size}rem`,
              left: `${el.x}%`,
              top: `${el.y}%`,
              background: `radial-gradient(circle, hsl(${el.hue}, ${el.saturation}%, ${el.lightness}%) 30%, transparent 70%)`,
              animationDelay: `${el.delay}s`,
              filter: 'blur(18px)',
            }}
          />
        ))}
        
        {/* Financial floating icons - reduced quantity for better performance */}
        {financialIcons.map((el, i) => (
          <div
            key={`icon-${i}`}
            className="absolute animate-float will-change-transform"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 10}%`,
              opacity: 0.2,
              animationDelay: `${el.delay}s`,
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>
      
      {/* Digital graph patterns - simplified */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Simplified patterns for better performance */}
          <polyline 
            points="0,50 20,48 40,55 60,45 80,50 100,40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-blue-500"
          />
          <polyline 
            points="0,60 20,55 40,60 60,58 80,60 100,55" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-indigo-500"
          />
        </svg>
      </div>
      
      {/* Main content */}
      <header className={`relative z-10 py-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Finwise
            </span>
          </Link>
        </div>
      </header>

      <main className={`flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      <footer className={`relative z-10 py-4 text-center text-sm text-gray-500 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <p>© {new Date().getFullYear()} Finwise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
