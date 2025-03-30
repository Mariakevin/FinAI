
import React from 'react';
import { cn } from '@/lib/utils';

interface MotionProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Simple animation component that applies CSS animations based on props
export const motion = {
  div: ({ 
    initial, 
    animate, 
    exit, 
    transition,
    children, 
    className, 
    ...props 
  }: MotionProps) => {
    // Convert motion props to CSS
    const getAnimationStyles = () => {
      const styles: React.CSSProperties = {};
      
      if (initial?.opacity !== undefined) {
        styles.opacity = initial.opacity;
      }
      
      if (initial?.y !== undefined) {
        styles.transform = `translateY(${initial.y}px)`;
      }
      
      if (initial?.x !== undefined) {
        styles.transform = `translateX(${initial.x}px)`;
      }
      
      if (initial?.scale !== undefined) {
        styles.transform = `scale(${initial.scale})`;
      }
      
      if (transition) {
        styles.transition = `all ${transition.duration || 0.3}s ${transition.delay ? `${transition.delay}s` : ''} ${transition.type === 'spring' ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-out'}`;
      }
      
      return styles;
    };
    
    return (
      <div 
        className={cn(
          "transition-all",
          animate?.opacity !== undefined && "animate-fade-in",
          animate?.y !== undefined && initial?.y !== undefined && "animate-slide-up",
          animate?.scale !== undefined && initial?.scale !== undefined && "animate-scale-in",
          className
        )}
        style={getAnimationStyles()}
        {...props}
      >
        {children}
      </div>
    );
  }
};
