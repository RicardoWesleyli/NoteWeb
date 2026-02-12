import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'bottom',
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Position of the tooltip relative to the trigger
  // Note: We remove translate-x/y from here and handle it in motion.div style
  // to avoid conflicts between Tailwind classes and Framer Motion transforms
  const positions = {
    top: "bottom-full left-1/2 mb-2",
    bottom: "top-full left-1/2 mt-2",
    left: "right-full top-1/2 mr-2",
    right: "left-full top-1/2 ml-2"
  };

  // Transform values for centering
  const transforms = {
    top: { x: "-50%", y: 0 },
    bottom: { x: "-50%", y: 0 },
    left: { x: 0, y: "-50%" },
    right: { x: 0, y: "-50%" }
  };

  // Position of the arrow relative to the tooltip
  const arrowPositions = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1",     
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1", 
    left: "left-full top-1/2 -translate-y-1/2 -ml-1",     
    right: "right-full top-1/2 -translate-y-1/2 -mr-1"    
  };

  return (
    <div 
      className={clsx("relative inline-flex items-center justify-center", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, ...transforms[position] }}
            animate={{ opacity: 1, scale: 1, ...transforms[position] }}
            exit={{ opacity: 0, scale: 0.95, ...transforms[position] }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={clsx(
              "absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
              positions[position]
            )}
          >
            {content}
            {/* Arrow */}
            <div 
              className={clsx(
                "absolute w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45",
                arrowPositions[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
