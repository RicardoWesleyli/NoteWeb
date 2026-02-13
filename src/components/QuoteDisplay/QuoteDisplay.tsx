import React from 'react';
import { useQuotes } from '../../hooks/useQuotes';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeProvider';
import clsx from 'clsx';

const QuoteDisplay: React.FC = () => {
  const { currentQuote, refreshQuote } = useQuotes();
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const { backgroundImage } = useTheme();

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 px-4 min-h-[120px] flex items-center justify-center">
      <div className="flex flex-col items-center text-center group w-full">
        <AnimatePresence mode="wait">
          {currentQuote ? (
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="cursor-pointer w-full flex flex-col items-center gap-2"
              onClick={refreshQuote}
            >
              {/* Primary Language Quote */}
              <p className={clsx(
                "text-base font-medium transition-colors leading-relaxed",
                backgroundImage 
                  ? "text-slate-900 dark:text-white drop-shadow-sm hover:text-blue-600 dark:hover:text-blue-300" 
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              )}>
                {isZh ? currentQuote.zh : currentQuote.en}
              </p>
              
              {/* Secondary Language Quote */}
              <p className={clsx(
                "text-sm font-normal transition-colors leading-snug",
                backgroundImage 
                  ? "text-slate-700 dark:text-slate-200 drop-shadow-sm hover:text-blue-500 dark:hover:text-blue-300" 
                  : "text-slate-400 dark:text-slate-500 hover:text-blue-400 dark:hover:text-blue-300"
              )}>
                {isZh ? currentQuote.en : currentQuote.zh}
              </p>
            </motion.div>
          ) : (
             <div className="h-[4rem] w-full" /> // Placeholder to prevent collapse
          )}
        </AnimatePresence>
        
        <button 
          onClick={refreshQuote}
          className={clsx(
            "mt-3 p-1 rounded-full transition-all opacity-0 group-hover:opacity-100",
            backgroundImage 
              ? "text-slate-500 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-300" 
              : "text-slate-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
          )}
          title={isZh ? "换一句" : "Change Quote"}
        >
          <RefreshCw size={12} />
        </button>
      </div>
    </div>
  );
};

export default QuoteDisplay;
