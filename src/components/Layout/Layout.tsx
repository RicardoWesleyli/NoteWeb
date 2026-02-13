import React, { ReactNode, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Settings, Github } from 'lucide-react';
import SearchBox from '../SearchBox/SearchBox';
import { useTranslation } from 'react-i18next';
import BackToTop from '../BackToTop/BackToTop';
import SettingsModal from '../Settings/SettingsModal';
import Tooltip from '../Tooltip/Tooltip';
import { useTheme } from '../ThemeProvider';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const { backgroundImage, backgroundBlur } = useTheme();

  return (
    <div className="h-screen bg-white dark:bg-[#0A0A0A] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col overflow-hidden relative">
      {/* Custom Background Wallpaper */}
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 z-0 transition-all duration-300 ease-in-out"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${backgroundBlur}px)`,
              transform: 'scale(1.02)' // Scale slightly to prevent white edges from blur
            }}
          />
          {/* Overlay to improve readability */}
          <div className="absolute inset-0 z-0 bg-white/60 dark:bg-black/40 backdrop-saturate-150 transition-colors duration-300" />
        </>
      )}

      <header className="flex-none z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo and Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white group" onClick={() => mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-lg font-medium tracking-tight">{t('siteName')}</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl">
            <SearchBox />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Tooltip content="GitHub" position="bottom">
              <a 
                href="https://github.com/RicardoWesleyli/NoteWeb"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </Tooltip>
            <Tooltip content={t('settings.title')} position="bottom">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200"
                aria-label={t('settings.title')}
              >
                <Settings size={20} />
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      <div 
        ref={mainScrollRef}
        className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent relative z-10"
      >
        <main className="max-w-[1400px] mx-auto px-4 py-8">
          {children}
        </main>
      </div>
      
      <BackToTop scrollContainerRef={mainScrollRef} />
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Layout;
