import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Laptop, Check, Languages, Palette, Settings, Database, Layout, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeProvider';
import clsx from 'clsx';
import DataEditor from '../DataEditor/DataEditor';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 'preferences' | 'categories' | 'links';

const SettingRow = ({ label, description, children }: { label: string, description: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-6 border-b border-slate-100 dark:border-white/5 last:border-0">
    <div className="flex flex-col gap-1 pr-4">
      <span className="text-base font-medium text-slate-900 dark:text-slate-100">{label}</span>
      <span className="text-sm text-slate-500 dark:text-slate-400">{description}</span>
    </div>
    <div className="flex-none">
      {children}
    </div>
  </div>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('preferences');
  const [openDropdown, setOpenDropdown] = useState<'language' | 'theme' | null>(null);

  const languages = [
    { code: 'en', label: t('language.en') },
    { code: 'zh', label: t('language.zh') },
  ];

  const themes = [
    { code: 'light', label: t('theme.light'), icon: Sun },
    { code: 'dark', label: t('theme.dark'), icon: Moon },
    { code: 'system', label: t('theme.system'), icon: Laptop },
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

  const sidebarItems = [
    { id: 'preferences', label: t('settings.preferences'), icon: Settings },
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
                <div className="p-6 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h2>
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
                <div className="flex-none px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t(`settings.${activeSection}`)}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <X size={20} />
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
