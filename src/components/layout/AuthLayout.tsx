
import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Coins, PiggyBank, DollarSign, Landmark, ChartBar, TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  // Animation states
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Financial icons that will float in the background
  const financialIcons = useMemo(() => [
    <CreditCard size={24} className="text-blue-400/20" />,
    <Coins size={24} className="text-indigo-400/20" />,
    <PiggyBank size={24} className="text-purple-400/20" />,
    <DollarSign size={24} className="text-green-400/20" />,
    <Landmark size={24} className="text-blue-500/20" />,
    <ChartBar size={24} className="text-indigo-500/20" />,
    <TrendingUp size={24} className="text-purple-500/20" />
  ], []);

  // Generate random decorative elements with enhanced colors
  const decorativeElements = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 5, // Increased size range 5-15rem
      x: Math.random() * 100,
      y: Math.random() * 100,
      hue: Math.floor(Math.random() * 60) + 200, // Enhanced blue to purple hues
      saturation: Math.floor(Math.random() * 20) + 70, // Higher saturation
      lightness: Math.floor(Math.random() * 15) + 75, // Brighter colors
      delay: i * 0.5,
      duration: Math.random() * 20 + 20, // Animation duration 20-40s
    })),
  []);

  // Generate financial floating elements
  const floatingElements = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: financialIcons[i % financialIcons.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.7 + 0.9, // Scale factor
      speed: Math.random() * 30 + 40, // Animation duration 40-70s
      delay: i * 0.7,
      opacity: Math.random() * 0.3 + 0.1, // Increased opacity for better visibility
    })),
  [financialIcons]);

  // Update mouse position for parallax effect with throttling
  useEffect(() => {
    let lastUpdateTime = 0;
    const THROTTLE_DELAY = 50; // Throttle to 50ms
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_DELAY) return;
      
      lastUpdateTime = now;
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Set loaded state for initial animations
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  // Use hardware-accelerated properties and optimize the transform calculation
  const calculateTransform = (factor: number) => {
    const x = (mousePosition.x - 0.5) * factor;
    const y = (mousePosition.y - 0.5) * factor;
    return `translate3d(${x}rem, ${y}rem, 0)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 z-0 will-change-transform">
        {/* Colorful gradient orbs */}
        {decorativeElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full opacity-20 animate-pulse-light will-change-transform hardware-accelerated"
            style={{
              width: `${el.size}rem`,
              height: `${el.size}rem`,
              left: `${el.x}%`,
              top: `${el.y}%`,
              background: `radial-gradient(circle, hsl(${el.hue}, ${el.saturation}%, ${el.lightness}%) 30%, transparent 70%)`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${el.duration}s`,
              transform: calculateTransform(el.id + 3),
              transition: 'transform 0.4s ease-out',
              filter: 'blur(20px)',
            }}
          />
        ))}
        
        {/* Enhanced financial floating icons */}
        {floatingElements.map((el) => (
          <div
            key={`icon-${el.id}`}
            className="absolute will-change-transform hardware-accelerated"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `scale(${el.size})`,
              opacity: el.opacity,
              animation: `floatUpDown ${el.speed}s infinite alternate ease-in-out`,
              animationDelay: `${el.delay}s`,
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>
      
      {/* Digital graph patterns - enhanced with more financial elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Stock chart line patterns - more complex patterns */}
          <polyline 
            points="0,50 5,48 10,45 15,52 20,48 25,55 30,45 35,42 40,55 45,40 50,60 55,45 60,60 65,48 70,35 75,55 80,42 85,50 90,30 95,35 100,40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-blue-500"
            strokeDasharray="0.5,0.5"
          />
          <polyline 
            points="0,60 10,65 20,55 30,68 40,60 50,50 60,58 70,45 80,60 90,45 100,55" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-indigo-500"
            strokeDasharray="0.5,0.5"
          />
          <polyline 
            points="0,65 10,60 20,70 30,65 40,72 50,68 60,75 70,65 80,70 90,65 100,70" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-purple-400"
            strokeDasharray="0.5,0.5"
          />
          
          {/* Grid pattern - finer grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line 
              key={`h-${i}`} 
              x1="0" 
              y1={i * 5} 
              x2="100" 
              y2={i * 5} 
              stroke="currentColor" 
              strokeWidth="0.1" 
              className="text-gray-600"
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line 
              key={`v-${i}`} 
              x1={i * 5} 
              y1="0" 
              x2={i * 5} 
              y2="100" 
              stroke="currentColor" 
              strokeWidth="0.1" 
              className="text-gray-600"
            />
          ))}
        </svg>
      </div>
      
      {/* Main decorative elements with enhanced parallax effect */}
      <div 
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-300/30 to-purple-400/30 rounded-bl-full blur-xl will-change-transform hardware-accelerated"
        style={{ 
          transform: calculateTransform(15),
          transition: 'transform 0.5s ease-out',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-300/30 to-blue-400/30 rounded-tr-full blur-xl will-change-transform hardware-accelerated"
        style={{ 
          transform: calculateTransform(12),
          transition: 'transform 0.5s ease-out',
        }}
      />
      
      {/* Enhanced currency-like particle effect */}
      <div className="absolute inset-0 z-0 opacity-15">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`currency-${i}`}
            className="absolute w-8 h-8 rounded-full bg-blue-400/40 animate-float hardware-accelerated"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-blue-600/60 font-bold text-xs">
              $
            </div>
          </div>
        ))}
      </div>
      
      <header className={`relative z-10 py-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
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

      <main className={`flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      <footer className={`relative z-10 py-4 text-center text-sm text-gray-500 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p>© {new Date().getFullYear()} Finwise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
