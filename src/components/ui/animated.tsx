
import React from 'react';
import type { MotionProps } from 'framer-motion';

// Create a mock of framer-motion
// This allows us to have a uniform interface without requiring framer-motion
export const motion = {
  div: ({ initial, animate, exit, transition, children, className, ...props }: MotionProps) => (
    <div className={className} {...props}>{children}</div>
  ),
  p: ({ initial, animate, exit, transition, children, className, ...props }: MotionProps) => (
    <p className={className} {...props}>{children}</p>
  )
};

// Re-export for consistency
export { motion as default };
