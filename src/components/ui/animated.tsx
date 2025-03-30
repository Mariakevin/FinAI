
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

// Create a reusable motion component factory for different element types
const createMotionComponent = (ElementType: keyof JSX.IntrinsicElements) => {
  return ({ 
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
      
      // Only apply initial styles if they're explicitly passed
      if (initial) {
        if (initial.opacity !== undefined) {
          styles.opacity = animate?.opacity !== undefined ? animate.opacity : 1;
        }
        
        if (initial.y !== undefined) {
          styles.transform = animate?.y !== undefined 
            ? `translateY(${animate.y}px)` 
            : 'translateY(0)';
        }
        
        if (initial.x !== undefined) {
          styles.transform = animate?.x !== undefined 
            ? `translateX(${animate.x}px)` 
            : 'translateX(0)';
        }
        
        if (initial.scale !== undefined) {
          styles.transform = animate?.scale !== undefined 
            ? `scale(${animate.scale})` 
            : 'scale(1)';
        }
      }
      
      if (transition) {
        styles.transition = `all ${transition.duration || 0.3}s ${transition.delay ? `${transition.delay}s` : ''} ${transition.type === 'spring' ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-out'}`;
      }
      
      return styles;
    };
    
    const Element = ElementType as any;
    
    return (
      <Element 
        className={cn(
          "transition-all",
          animate?.opacity !== undefined && initial?.opacity !== undefined && "animate-fade-in",
          animate?.y !== undefined && initial?.y !== undefined && "animate-slide-up",
          animate?.scale !== undefined && initial?.scale !== undefined && "animate-scale-in",
          className
        )}
        style={getAnimationStyles()}
        {...props}
      >
        {children}
      </Element>
    );
  };
};

// Simple animation components that apply CSS animations based on props
export const motion = {
  div: createMotionComponent('div'),
  p: createMotionComponent('p'),
  span: createMotionComponent('span'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  button: createMotionComponent('button'),
  a: createMotionComponent('a'),
  li: createMotionComponent('li'),
  ul: createMotionComponent('ul'),
  ol: createMotionComponent('ol')
};
