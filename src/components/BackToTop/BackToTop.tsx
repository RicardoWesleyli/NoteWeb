import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface BackToTopProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const BackToTop: React.FC<BackToTopProps> = ({ scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const toggleVisibility = () => {
      if (container.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    container.addEventListener('scroll', toggleVisibility);
    return () => container.removeEventListener('scroll', toggleVisibility);
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={clsx(
            "fixed bottom-8 right-8 p-3 rounded-full shadow-lg z-40 border",
            "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
            "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700",
            "transition-all duration-200 hover:shadow-xl focus:outline-none"
          )}
          title="Back to Top"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
