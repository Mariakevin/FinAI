
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ children, className, hoverEffect = false }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass rounded-2xl border border-white/20 p-6 animate-fade-in", 
        hoverEffect && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
