import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Laptop, Check, Settings, Database, Layout, ChevronDown, Image as ImageIcon, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeProvider';
import clsx from 'clsx';
import DataEditor from '../DataEditor/DataEditor';
import { useToast } from '../Toast/ToastContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 'preferences' | 'categories' | 'links' | 'wallpaper';

const SettingRow = ({ label, description, children }: { label: string, description: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-5 border-b border-slate-100 dark:border-white/5 last:border-0">
    <div className="flex flex-col gap-0.5 pr-4">
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
    </div>
    <div className="flex-none">
      {children}
    </div>
  </div>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, backgroundImage, setBackgroundImage, backgroundBlur, setBackgroundBlur } = useTheme();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<SettingsSection>('preferences');
  const [openDropdown, setOpenDropdown] = useState<'language' | 'theme' | null>(null);
  const [wallpaperType, setWallpaperType] = useState<'url' | 'local'>('local');
  const [tempUrl, setTempUrl] = useState('');
  
  // Custom mode is on if backgroundImage is set, OR if user explicitly turned it on (even if no image yet)
  // We need a local state to track "enabled" status when no image is selected yet.
  // But actually, the simplest way is to treat "null" as disabled.
  // If user clicks enable, we should probably set a "placeholder" or just use a boolean flag in ThemeProvider?
  // Since ThemeProvider only has backgroundImage string | null, let's use a local state in this modal 
  // to represent "Editing Custom Wallpaper" even if backgroundImage is null.
  // But wait, if they close modal with "enabled but no image", what happens? It should probably revert to disabled.
  // So local state `isCustomMode` initialized from `!!backgroundImage` is correct.
  const [isCustomMode, setIsCustomMode] = useState(!!backgroundImage);
  
  // Sync local state with global state on mount/change
  useEffect(() => {
    setIsCustomMode(!!backgroundImage);
  }, [backgroundImage]);

  const toggleCustomMode = () => {
    if (isCustomMode) {
        // Turning off
        setBackgroundImage(null);
        setIsCustomMode(false);
    } else {
        // Turning on
        setIsCustomMode(true);
        setWallpaperType('local'); // Default to local
        // We don't set backgroundImage yet, so the background remains solid until they pick something.
    }
  };

  const languages = [
    { code: 'en', label: t('language.en') },
    { code: 'zh', label: t('language.zh') },
  ];

  const themes = [
    { code: 'light', label: t('theme.light'), icon: Sun },
    { code: 'dark', label: t('theme.dark'), icon: Moon },
    { code: 'system', label: t('theme.system'), icon: Laptop },
  ];
  
  const wallpaperSources = [
    { code: 'local', label: t('settings.localImage') },
    { code: 'url', label: t('settings.imageUrl') },
  ];

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close dropdowns when clicking outside or switching sections
  useEffect(() => {
    setOpenDropdown(null);
  }, [activeSection, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check size (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast(t('settings.wallpaperSizeError'), 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        setBackgroundImage(result);
        showToast(t('toast.uploadSuccess'), 'success');
    };
    reader.onerror = () => {
        showToast(t('toast.uploadError'), 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (tempUrl) {
        setBackgroundImage(tempUrl);
        setTempUrl('');
        showToast(t('toast.wallpaperUpdated'), 'success');
    }
  };

  const sidebarItems = [
    { id: 'preferences', label: t('settings.preferences'), icon: Settings },
    { id: 'wallpaper', label: t('settings.wallpaper'), icon: ImageIcon },
    { id: 'categories', label: t('settings.categories'), icon: Layout },
    { id: 'links', label: t('settings.links'), icon: Database },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-4xl h-[70vh] bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden pointer-events-auto flex">
              
              {/* Sidebar */}
              <div className="w-64 flex-none bg-slate-50 dark:bg-white/5 border-r border-slate-200 dark:border-white/10 flex flex-col">
                <div className="p-6 pb-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('settings.title')}</h2>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as SettingsSection)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        activeSection === item.id
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex-none px-6 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {t(`settings.${activeSection}`)}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6" onClick={() => setOpenDropdown(null)}>
                  {activeSection === 'preferences' ? (
                    <div className="max-w-3xl">
                      {/* Theme Setting */}
                      <SettingRow 
                        label={t('settings.themeLabel')} 
                        description={t('settings.themeDescription')}
                      >
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenDropdown(openDropdown === 'theme' ? null : 'theme')}
                            className="flex items-center justify-between w-48 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:border-blue-500/50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              {themes.find(t => t.code === theme)?.label}
                            </span>
                            <ChevronDown size={16} className={clsx("text-slate-400 transition-transform", openDropdown === 'theme' && "rotate-180")} />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdown === 'theme' && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 mt-2 w-48 z-50 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden py-1"
                              >
                                {themes.map(tOption => (
                                  <button
                                    key={tOption.code}
                                    onClick={() => {
                                      setTheme(tOption.code as any);
                                      setOpenDropdown(null);
                                      showToast(t('toast.themeChanged', { theme: tOption.label }), 'success');
                                    }}
                                    className={clsx(
                                      "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                                      theme === tOption.code ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-700 dark:text-slate-200"
                                    )}
                                  >
                                    <span className="flex items-center gap-2">
                                      <tOption.icon size={16} className="opacity-70" />
                                      {tOption.label}
                                    </span>
                                    {theme === tOption.code && <Check size={16} />}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </SettingRow>

                      {/* Language Setting */}
                      <SettingRow 
                        label={t('settings.languageLabel')} 
                        description={t('settings.languageDescription')}
                      >
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
                            className="flex items-center justify-between w-48 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:border-blue-500/50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              {languages.find(l => i18n.language.startsWith(l.code))?.label || languages[0].label}
                            </span>
                            <ChevronDown size={16} className={clsx("text-slate-400 transition-transform", openDropdown === 'language' && "rotate-180")} />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdown === 'language' && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 mt-2 w-48 z-50 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden py-1"
                              >
                                {languages.map(lang => (
                                  <button
                                    key={lang.code}
                                    onClick={() => {
                                      i18n.changeLanguage(lang.code);
                                      setOpenDropdown(null);
                                      // Force use of the new language for the toast message
                                      // Using getFixedT or passing lng option
                                      showToast(i18n.t('toast.languageChanged', { lng: lang.code, label: lang.label }), 'success');
                                    }}
                                    className={clsx(
                                      "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                                      i18n.language.startsWith(lang.code) ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-700 dark:text-slate-200"
                                    )}
                                  >
                                    {lang.label}
                                    {i18n.language.startsWith(lang.code) && <Check size={16} />}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </SettingRow>
                    </div>
                  ) : activeSection === 'wallpaper' ? (
                    <div className="max-w-3xl">
                      {/* Background Mode */}
                      <SettingRow 
                        label={t('settings.backgroundType')} 
                        description={t('settings.backgroundTypeDesc')}
                      >
                        <button
                          onClick={toggleCustomMode}
                          className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
                            isCustomMode ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                          )}
                        >
                          <span
                            className={clsx(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                              isCustomMode ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </SettingRow>

                      {isCustomMode && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                          {/* Wallpaper Source */}
                          <SettingRow 
                            label={t('settings.wallpaperSource')} 
                            description={t('settings.wallpaperSourceDesc')}
                          >
                            <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-lg inline-flex">
                              {wallpaperSources.map(source => (
                                <button
                                  key={source.code}
                                  onClick={() => setWallpaperType(source.code as 'url' | 'local')}
                                  className={clsx(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    wallpaperType === source.code 
                                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" 
                                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                  )}
                                >
                                  {source.label}
                                </button>
                              ))}
                            </div>
                          </SettingRow>

                          {/* Wallpaper Content */}
                          <SettingRow 
                            label={t('settings.wallpaperContent')} 
                            description={t('settings.wallpaperContentDesc')}
                          >
                            {wallpaperType === 'url' ? (
                              <div className="flex gap-2 w-64">
                                <input 
                                  type="text" 
                                  value={tempUrl}
                                  onChange={(e) => setTempUrl(e.target.value)}
                                  placeholder="https://..."
                                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:bg-white dark:focus:bg-[#1E1E1E] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                />
                                <button 
                                  onClick={handleUrlSubmit}
                                  disabled={!tempUrl}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
                                >
                                  {t('settings.apply')}
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer pointer-events-none">
                                  <Upload size={16} />
                                  <span>{t('settings.chooseFile')}</span>
                                </button>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </div>
                            )}
                          </SettingRow>

                          {/* Blur Slider */}
                          <SettingRow label={t('settings.blur')} description={t('settings.blurDesc')}>
                            <div className="flex items-center gap-4 w-48">
                              <input 
                                type="range" 
                                min="0" 
                                max="20" 
                                step="1"
                                value={backgroundBlur} 
                                onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-8 text-right">{backgroundBlur}px</span>
                            </div>
                          </SettingRow>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full">
                      <DataEditor viewMode={activeSection === 'categories' ? 'categories' : 'links'} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
