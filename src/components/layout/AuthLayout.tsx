
import React, { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  // Animation states
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Update mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Set loaded state for initial animations
    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate transform values for parallax effect
  const calculateTransform = (factor: number) => {
    const x = (mousePosition.x - 0.5) * factor;
    const y = (mousePosition.y - 0.5) * factor;
    return `translate(${x}rem, ${y}rem)`;
  };

  // Generate random decorative elements
  const decorativeElements = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 3, // Size between 3-13rem
    x: Math.random() * 100,
    y: Math.random() * 100,
    hue: Math.floor(Math.random() * 60) + 200, // Blue to purple hues
    delay: i * 0.3,
    duration: Math.random() * 20 + 15, // Animation duration 15-35s
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        {decorativeElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full opacity-10 animate-pulse-light"
            style={{
              width: `${el.size}rem`,
              height: `${el.size}rem`,
              left: `${el.x}%`,
              top: `${el.y}%`,
              background: `radial-gradient(circle, hsl(${el.hue}, 80%, 80%), transparent 70%)`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${el.duration}s`,
              transform: calculateTransform(el.id + 2),
              transition: 'transform 0.2s ease-out',
            }}
          />
        ))}
      </div>
      
      {/* Main decorative elements with parallax effect */}
      <div 
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-bl-full blur-md"
        style={{ 
          transform: calculateTransform(20),
          transition: 'transform 0.2s ease-out',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-200/30 to-blue-300/30 rounded-tr-full blur-md"
        style={{ 
          transform: calculateTransform(15),
          transition: 'transform 0.2s ease-out',
        }}
      />
      
      {/* Additional animated decorative elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-300/10 animate-pulse-light" 
           style={{ animationDuration: '7s' }} />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-400/10 to-blue-300/10 animate-pulse-light"
           style={{ animationDuration: '9s' }} />
      
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
