import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Copy, Check, Languages, Keyboard, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from "../Toast/ToastContext";
import clsx from 'clsx';

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TranslateModal: React.FC<TranslateModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const handleTranslate = async (text?: string) => {
    const textToTranslate = text || inputText;
    
    if (!textToTranslate.trim()) {
      showToast(t('translate.pleaseEnterText'), 'warning');
      return;
    }

    setIsTranslating(true);
    
    try {
      // 使用免费的 Google Translate API (非官方)
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=en&dt=t&q=${encodeURIComponent(
          textToTranslate
        )}`
      );
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      const translated = data[0].map((item: any[]) => item[0]).join('');
      setTranslatedText(translated);
      showToast(t('translate.success'), 'success');
    } catch (error) {
      console.error('Translation error:', error);
      showToast(t('translate.error'), 'error');
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAutoTranslate = () => {
    if (isAutoTranslating) {
      setIsAutoTranslating(false);
      showToast(t('translate.autoTranslateOff'), 'info');
    } else {
      setIsAutoTranslating(true);
      showToast(t('translate.autoTranslateOn'), 'info');
      if (inputText.trim()) {
        handleTranslate(inputText);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    
    if (isAutoTranslating && newText.trim()) {
      const debounceTimeout = setTimeout(() => {
        handleTranslate(newText);
      }, 1000);
      return () => clearTimeout(debounceTimeout);
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      showToast(t('translate.copied'), 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast(t('translate.copyError'), 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleTranslate();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden border border-slate-200 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Languages size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {t('translate.title')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('translate.subtitle')}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
              aria-label={t('common.close')}
            >
              <X size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Features Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                  <Sparkles size={12} />
                  {t('translate.chineseToEnglish')}
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs">
                  <Keyboard size={12} />
                  {t('translate.shortcut')}
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {charCount} {t('translate.characters')}
              </div>
            </div>

            {/* Translation Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Input Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {t('translate.inputLabel')}
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAutoTranslate}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                      isAutoTranslating 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                  >
                    {isAutoTranslating ? '✨ ' + t('translate.autoOn') : t('translate.autoOff')}
                  </motion.button>
                </div>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={t('translate.inputPlaceholder')}
                    className="w-full h-40 px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
                    disabled={isTranslating}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {inputText && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setInputText('')}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <X size={14} className="text-slate-400" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {t('translate.outputLabel')}
                  </label>
                  <AnimatePresence mode="wait">
                    {translatedText && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={handleCopy}
                        className={clsx(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                          copied
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        )}
                      >
                        {copied ? (
                          <>
                            <Check size={12} />
                            {t('translate.copied')}
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            {t('translate.copy')}
                          </>
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative">
                  <div className={clsx(
                    "w-full h-40 px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl transition-all duration-200 overflow-y-auto",
                    translatedText 
                      ? "border-green-200 dark:border-green-500/20 bg-green-50/30 dark:bg-green-900/10" 
                      : "border-slate-200 dark:border-white/10"
                  )}>
                    <AnimatePresence mode="wait">
                      {translatedText ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed"
                        >
                          {translatedText}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm"
                        >
                          {t('translate.outputPlaceholder')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Translate Button */}
            <div className="flex justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTranslate()}
                disabled={isTranslating || !inputText.trim()}
                className={clsx(
                  "px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg",
                  isTranslating || !inputText.trim()
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:shadow-xl"
                )}
              >
                {isTranslating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {t('translate.translating')}
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    {t('translate.translate')}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TranslateModal;