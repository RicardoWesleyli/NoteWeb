import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';

// Icons
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const BingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3v18l7-3.5 6 3V7l-6-3-7-1zm12 14.5l-5-2.5V8l5 2.5v7z" fill="#008373"/>
    <path d="M11 6v10l-4 2V5l4 1z" fill="#008373" fillOpacity="0.6"/>
  </svg>
);

const BaiduIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.92 6.51c.36-.61.76-.79 1.18-.54.43.25.46.96.1 1.57-.36.61-.76.79-1.18.54-.43-.25-.46-.96-.1-1.57zm-5.07 1.88c-.5.39-.46 1.07.1 1.54.55.46 1.34.43 1.83.04.5-.39.46-1.07-.1-1.54-.55-.46-1.34-.43-1.83-.04zm3.03 12.06c-3.1.25-5.96-1.68-6.39-4.28-.43-2.6 1.39-4.96 4.49-5.21 3.1-.25 5.96 1.68 6.39 4.28.43 2.6-1.39 4.96-4.49 5.21zm8.39-7.5c-.32.54-.89.64-1.28.25-.39-.39-.39-1.07-.07-1.61.32-.54.89-.64 1.28-.25.39.39.39 1.07.07 1.61zm-2.07-5.57c-.43-.18-.89.11-1.03.64-.14.54.11 1.07.54 1.25.43.18.89-.11 1.03-.64.14-.54-.11-1.07-.54-1.25z" fill="#2932E1"/>
  </svg>
);

const DuckDuckGoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="#DE5833"/>
    <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#FFFFFF"/>
  </svg>
);

const StackOverflowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8 16.85l1.35 1.35L12 24l-7.15-5.8 1.35-1.35L11 20.6V0h2v20.6l4.8-3.75z" fill="#F48024"/>
    <path d="M18.8 11.2l-1.6-1.2-8.8 6.4 1.6 1.2 8.8-6.4zm-11.6 3.6l9.6-4.8.8 1.8-9.6 4.8-.8-1.8zm11.2-8.4l-.4 2-10.6-2 .4-2 10.6 2zM6.4 17.6h11.2v2H6.4v-2z" fill="#BCBBBB"/>
  </svg>
);

const ENGINES = [
  { id: 'google', url: 'https://www.google.com/search?q=', icon: <GoogleIcon /> },
  { id: 'bing', url: 'https://www.bing.com/search?q=', icon: <BingIcon /> },
  { id: 'baidu', url: 'https://www.baidu.com/s?wd=', icon: <BaiduIcon /> },
  { id: 'duckduckgo', url: 'https://duckduckgo.com/?q=', icon: <DuckDuckGoIcon /> },
  { id: 'github', url: 'https://github.com/search?q=', icon: <Github size={16} /> },
  { id: 'stackoverflow', url: 'https://stackoverflow.com/search?q=', icon: <StackOverflowIcon /> },
];

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(ENGINES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { backgroundImage } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`${selectedEngine.url}${encodeURIComponent(query)}`, '_blank');
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative z-20">
      <div className="relative group flex items-center">
        {/* Search Engine Selector */}
        <div className="absolute inset-y-0 left-0 flex items-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-full pl-3 pr-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-r border-slate-200 dark:border-slate-700 transition-colors z-10"
          >
            <div className="flex items-center justify-center w-5 h-5">
              {selectedEngine.icon}
            </div>
            <ChevronDown size={14} className={clsx("transition-transform text-slate-400", isDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl border border-slate-200/50 dark:border-white/5 overflow-hidden py-1.5 z-50 origin-top-left backdrop-blur-xl"
              >
                {ENGINES.map((engine) => (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => {
                      setSelectedEngine(engine);
                      setIsDropdownOpen(false);
                    }}
                    className={clsx(
                      "w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-3",
                      selectedEngine.id === engine.id 
                        ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-500/10" 
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    )}
                  >
                    <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                      {engine.icon}
                    </div>
                    <span className="truncate">{t(`engines.${engine.id}`)}</span>
                    {selectedEngine.id === engine.id && (
                       <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          type="text"
          className={clsx(
            "block w-full pl-20 pr-10 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
            backgroundImage 
              ? "bg-white/60 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-300 focus:bg-white/80 dark:focus:bg-black/60 focus:border-blue-500/50" 
              : "bg-slate-100 dark:bg-[#1E1E1E] border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:bg-white dark:focus:bg-[#1E1E1E] focus:border-blue-500 dark:focus:border-blue-400"
          )}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBox;
