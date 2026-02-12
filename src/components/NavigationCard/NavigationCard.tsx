import React, { useState } from 'react';
import { NavigationLink } from '../../types/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface NavigationCardProps {
  link: NavigationLink;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ link }) => {
  const [iconError, setIconError] = useState(false);
  const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${link.url}`;
  const { i18n } = useTranslation();
  
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
      <div className="bg-[#F1F4F9] dark:bg-[#1E1E1E] rounded-2xl p-4 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 h-full flex flex-col border border-transparent dark:border-white/5 hover:-translate-y-0.5">
        {/* Info Row (Bottom) */}
        <div className="flex gap-3 h-full items-center">
           {/* Small Logo */}
          <div 
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-white dark:bg-[#252525] shadow-sm overflow-hidden"
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
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {link.name}
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed mt-0.5">
              {getDescription()}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NavigationCard;