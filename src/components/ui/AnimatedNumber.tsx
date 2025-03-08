
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1000,
  className,
  formatter = (num) => num.toFixed(2),
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const change = endValue - startValue;
    
    const animateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        const nextValue = easeOutQuart(elapsed, startValue, change, duration);
        setDisplayValue(nextValue);
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    requestAnimationFrame(animateValue);
    
    // Ease out quartic function for smooth animation
    function easeOutQuart(t: number, b: number, c: number, d: number) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    }
  }, [value, duration]);

  return (
    <span className={cn("transition-colors", className)}>
      {prefix}{formatter(displayValue)}{suffix}
    </span>
  );
};

export default AnimatedNumber;
