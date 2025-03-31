
import React from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';

// Export the basic motion components from framer-motion
export const motion = framerMotion;
export { AnimatePresence };

// Common animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const scale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// A component that animates its children when they enter the viewport
export const AnimateOnScroll = ({ 
  children, 
  animation = "fade", 
  delay = 0, 
  duration = 0.5,
  ...props 
}: {
  children: React.ReactNode;
  animation?: "fade" | "slide" | "scale";
  delay?: number;
  duration?: number;
  [key: string]: any;
}) => {
  let variants;
  
  switch (animation) {
    case "slide":
      variants = slideUp;
      break;
    case "scale":
      variants = scale;
      break;
    case "fade":
    default:
      variants = fadeIn;
      break;
  }
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// A staggered list animation
export const StaggeredList = ({ 
  children,
  delayStep = 0.1,
  staggerDelay = 0.2,
  ...props
}: {
  children: React.ReactNode[];
  delayStep?: number;
  staggerDelay?: number;
  [key: string]: any;
}) => {
  return (
    <div {...props}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: staggerDelay + i * delayStep }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// Hover card animation
export const HoverCard = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
