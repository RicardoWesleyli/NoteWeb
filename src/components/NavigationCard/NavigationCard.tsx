import React, { useState } from 'react';
import { NavigationLink } from '../../types/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../ThemeProvider';
import clsx from 'clsx';

interface NavigationCardProps {
  link: NavigationLink;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ link }) => {
  const [iconError, setIconError] = useState(false);
  const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${link.url}`;
  const { i18n } = useTranslation();
  const { backgroundImage } = useTheme();
  
  const getDescription = () => {
    if (!link.description) return '使用用户脚本自由地改变网络';
    
    if (typeof link.description === 'string') {
      return link.description;
    }
    
    return i18n.language.startsWith('zh') ? link.description.zh : link.description.en;
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
    >
      <div className={clsx(
        "rounded-2xl p-4 transition-all duration-300 h-full flex flex-col border hover:-translate-y-0.5",
        backgroundImage 
          ? "bg-white/60 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/60 shadow-sm hover:shadow-md" 
          : "bg-[#F1F4F9] dark:bg-[#1E1E1E] border-transparent dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
      )}>
        {/* Info Row (Bottom) */}
        <div className="flex gap-3 h-full items-center">
           {/* Small Logo */}
          <div 
            className={clsx(
              "w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden",
              backgroundImage 
                ? "bg-white/80 dark:bg-white/10 backdrop-blur-sm" 
                : "bg-white dark:bg-[#252525]"
            )}
          >
             {!iconError ? (
               <img 
                 src={faviconUrl} 
                 alt={link.name} 
                 className="w-8 h-8 object-contain rounded-full" 
                 onError={() => setIconError(true)}
               />
             ) : (
               <div className="text-base font-bold text-slate-400 dark:text-slate-500">
                 {link.name.substring(0, 1).toUpperCase()}
               </div>
             )}
          </div>
          
          {/* Text Info */}
          <div className="min-w-0 flex-1">
            <h3 className={clsx(
              "font-bold text-base truncate transition-colors",
              backgroundImage 
                ? "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400" 
                : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            )}>
              {link.name}
            </h3>
            
            <p className={clsx(
              "text-xs line-clamp-1 leading-relaxed mt-0.5",
              backgroundImage 
                ? "text-slate-600 dark:text-slate-300" 
                : "text-slate-500 dark:text-slate-400"
            )}>
              {getDescription()}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NavigationCard;