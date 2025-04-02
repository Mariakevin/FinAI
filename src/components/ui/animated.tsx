
import React, { CSSProperties } from 'react';

// We're creating a simplified version of framer-motion's types
// that only includes what we need for our mock implementation
type SimplifiedMotionProps = {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  style?: CSSProperties;
};

// Create a simplified mock of framer-motion
// This allows us to have a uniform interface without requiring the full framer-motion package
export const motion = {
  div: ({ 
    initial, 
    animate, 
    exit, 
    transition, 
    children, 
    className, 
    ...props 
  }: SimplifiedMotionProps & { 
    className?: string; 
    children?: React.ReactNode;
    [key: string]: any;
  }) => (
    <div className={className} {...props}>{children}</div>
  ),
  
  p: ({ 
    initial, 
    animate, 
    exit, 
    transition, 
    children, 
    className, 
    ...props 
  }: SimplifiedMotionProps & { 
    className?: string; 
    children?: React.ReactNode;
    [key: string]: any;
  }) => (
    <p className={className} {...props}>{children}</p>
  )
};

// Re-export for consistency
export { motion as default };
