
import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Coins, PiggyBank, DollarSign, Landmark } from 'lucide-react';

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
    <Landmark size={24} className="text-blue-500/20" />
  ], []);

  // Generate random decorative elements only once using useMemo
  const decorativeElements = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 3, // Reduced size range 3-11rem
      x: Math.random() * 100,
      y: Math.random() * 100,
      hue: Math.floor(Math.random() * 60) + 200, // Blue to purple hues
      delay: i * 0.3,
      duration: Math.random() * 15 + 15, // Animation duration 15-30s
    })),
  []);

  // Generate financial floating elements
  const floatingElements = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      icon: financialIcons[i % financialIcons.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.8, // Scale factor
      speed: Math.random() * 30 + 40, // Animation duration 40-70s
      delay: i * 0.7,
      opacity: Math.random() * 0.2 + 0.1, // Low opacity for subtle effect
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
      {/* Reduced number of animated background elements */}
      <div className="fixed inset-0 z-0 will-change-transform">
        {decorativeElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full opacity-10 animate-pulse-light will-change-transform hardware-accelerated"
            style={{
              width: `${el.size}rem`,
              height: `${el.size}rem`,
              left: `${el.x}%`,
              top: `${el.y}%`,
              background: `radial-gradient(circle, hsl(${el.hue}, 80%, 80%), transparent 70%)`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${el.duration}s`,
              transform: calculateTransform(el.id + 2),
              transition: 'transform 0.3s ease-out',
            }}
          />
        ))}
        
        {/* Financial floating icons */}
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
      
      {/* Digital graph patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Stock chart line patterns */}
          <polyline 
            points="0,50 10,48 20,52 30,45 40,55 50,40 60,60 70,35 80,55 90,30 100,40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-blue-600"
            strokeDasharray="0.5,0.5"
          />
          <polyline 
            points="0,60 15,65 30,55 45,70 60,50 75,65 90,45 100,55" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.2" 
            className="text-indigo-600"
            strokeDasharray="0.5,0.5"
          />
          
          {/* Grid pattern */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line 
              key={`h-${i}`} 
              x1="0" 
              y1={i * 10} 
              x2="100" 
              y2={i * 10} 
              stroke="currentColor" 
              strokeWidth="0.1" 
              className="text-gray-600"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line 
              key={`v-${i}`} 
              x1={i * 10} 
              y1="0" 
              x2={i * 10} 
              y2="100" 
              stroke="currentColor" 
              strokeWidth="0.1" 
              className="text-gray-600"
            />
          ))}
        </svg>
      </div>
      
      {/* Main decorative elements with parallax effect - reduced for better performance */}
      <div 
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-bl-full blur-md will-change-transform hardware-accelerated"
        style={{ 
          transform: calculateTransform(10), // Reduced factor from 20 to 10
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-200/30 to-blue-300/30 rounded-tr-full blur-md will-change-transform hardware-accelerated"
        style={{ 
          transform: calculateTransform(8), // Reduced factor from 15 to 8
          transition: 'transform 0.3s ease-out',
        }}
      />
      
      {/* Currency-like particle effect */}
      <div className="absolute inset-0 z-0 opacity-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={`currency-${i}`}
            className="absolute w-8 h-8 rounded-full bg-blue-400/30 animate-float hardware-accelerated"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-blue-600/50 font-bold text-xs">
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
        {children}
      </main>
      
      <footer className={`relative z-10 py-4 text-center text-sm text-gray-500 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p>© {new Date().getFullYear()} Finwise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
