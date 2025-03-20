
import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Coins, PiggyBank, DollarSign, CreditCard as CardIcon, LineChart, TrendingUp, Wallet } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Financial icons for floating animation
  const financialIcons = useMemo(() => [
    { icon: <CreditCard size={22} className="text-blue-400/20" />, delay: 0 },
    { icon: <Coins size={22} className="text-indigo-400/20" />, delay: 1.5 },
    { icon: <PiggyBank size={22} className="text-purple-400/20" />, delay: 3 },
    { icon: <DollarSign size={22} className="text-green-400/20" />, delay: 4.5 },
    { icon: <CardIcon size={22} className="text-pink-400/20" />, delay: 2.5 },
    { icon: <LineChart size={22} className="text-cyan-400/20" />, delay: 3.5 },
    { icon: <TrendingUp size={22} className="text-yellow-400/20" />, delay: 0.5 },
    { icon: <Wallet size={22} className="text-orange-400/20" />, delay: 2 }
  ], []);

  // Generate animated gradient orbs
  const gradientOrbs = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 6,
      x: Math.random() * 100,
      y: Math.random() * 100,
      hue: Math.floor(Math.random() * 60) + 200,
      saturation: Math.floor(Math.random() * 20) + 70,
      lightness: Math.floor(Math.random() * 15) + 75,
      delay: i * 0.5,
      duration: Math.random() * 10 + 10, // Random duration between 10-20s
    })),
  []);

  // Set loaded state for initial animations
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col overflow-hidden">
      {/* Enhanced background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Animated gradient orbs */}
        {gradientOrbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full opacity-20 will-change-transform"
            style={{
              width: `${orb.size}rem`,
              height: `${orb.size}rem`,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              background: `radial-gradient(circle, hsl(${orb.hue}, ${orb.saturation}%, ${orb.lightness}%) 30%, transparent 70%)`,
              filter: 'blur(18px)',
              animation: `float ${orb.duration}s ease-in-out infinite`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}
        
        {/* Financial floating icons with improved animation */}
        {financialIcons.map((el, i) => (
          <div
            key={`icon-${i}`}
            className="absolute will-change-transform"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 10}%`,
              opacity: 0.2,
              animation: 'float 15s ease-in-out infinite',
              animationDelay: `${el.delay}s`,
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>
      
      {/* Animated wave background */}
      <div className="absolute bottom-0 left-0 w-full opacity-5 pointer-events-none overflow-hidden" style={{ height: '30%' }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path 
            fill="rgba(96, 165, 250, 0.3)" 
            fillOpacity="1" 
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,144C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            style={{ animation: 'float 25s ease-in-out infinite' }}
          ></path>
          <path 
            fill="rgba(79, 70, 229, 0.3)" 
            fillOpacity="1" 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,144C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            style={{ animation: 'float 20s ease-in-out infinite reverse' }}
          ></path>
        </svg>
      </div>
      
      {/* Digital graph patterns - enhanced */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,50 C20,40 40,60 60,50 S80,60 100,50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-blue-500"
            style={{ animation: 'pulse 15s ease-in-out infinite' }}
          />
          <path 
            d="M0,60 C20,50 40,70 60,60 S80,70 100,60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-indigo-500"
            style={{ animation: 'pulse 20s ease-in-out infinite reverse' }}
          />
          <path 
            d="M0,40 C20,30 40,50 60,40 S80,50 100,40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-purple-500"
            style={{ animation: 'pulse 25s ease-in-out infinite' }}
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
